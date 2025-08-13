require('dotenv').config();

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const { Pool } = require('pg');
const fetch = require('node-fetch');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

const app = express();
const port = process.env.PORT || 4000;

// Enhanced compression with optimized settings
app.use(compression({
  level: 6, // Good balance between compression and speed
  threshold: 1024, // Only compress files larger than 1KB
  filter: (req, res) => {
    // Don't compress if cache header says no-transform
    if (req.headers['cache-control'] && req.headers['cache-control'].includes('no-transform')) {
      return false;
    }
    // Use compression filter
    return compression.filter(req, res);
  }
}));

app.use(cors({
  origin: [
    'http://localhost:3000',  // Local development
    'https://frontend-service-623946599151.europe-west2.run.app'  // Production frontend
  ],
  credentials: true
}));
app.use(express.json());

// Optimized connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  // Performance optimizations
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  statement_timeout: 10000, // 10 second query timeout
});

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = {
  HIKES_LIST: 5 * 60 * 1000, // 5 minutes
  FEATURED_HIKE: 10 * 60 * 1000, // 10 minutes
  HIKE_DETAIL: 15 * 60 * 1000, // 15 minutes
};

function getCachedData(key) {
  const cached = cache.get(key);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > cached.ttl) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
}

function setCachedData(key, data, ttl) {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
}

// Performance monitoring for slow queries
const originalQuery = pool.query.bind(pool);
pool.query = function(...args) {
  const start = Date.now();
  const query = args[0];
  
  return originalQuery(...args).then(result => {
    const duration = Date.now() - start;
    
    if (duration > 1000) { // Log queries slower than 1 second
      console.warn(`🐌 SLOW QUERY (${duration}ms):`, typeof query === 'string' ? query.substring(0, 100) : 'Complex query');
    } else if (duration > 100) {
      console.log(`⚠️  Query (${duration}ms):`, typeof query === 'string' ? query.substring(0, 50) : 'Query');
    }
    
    return result;
  }).catch(error => {
    const duration = Date.now() - start;
    console.error(`❌ FAILED QUERY (${duration}ms):`, typeof query === 'string' ? query.substring(0, 100) : 'Complex query', error.message);
    throw error;
  });
};

// Request logging middleware for performance monitoring
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 1000) { // Log slow requests
      console.warn(`⚠️  SLOW REQUEST: ${req.method} ${req.path} - ${duration}ms`);
    } else {
      console.log(`✅ ${req.method} ${req.path} - ${duration}ms`);
    }
  });
  next();
});

// Cache headers middleware
app.use((req, res, next) => {
  // Set different cache headers based on route
  if (req.path.startsWith('/api/hikes/')) {
    if (req.path.includes('/featured')) {
      // Featured hike - cache for 10 minutes
      res.set({
        'Cache-Control': 'public, max-age=600, s-maxage=600',
        'ETag': `"featured-${Date.now()}"`,
        'Vary': 'Accept-Encoding'
      });
    } else if (req.path.includes('/slug/')) {
      // Individual hike details - cache for 15 minutes
      res.set({
        'Cache-Control': 'public, max-age=900, s-maxage=900',
        'ETag': `"hike-${req.params.slug || req.params.id}-${Date.now()}"`,
        'Vary': 'Accept-Encoding'
      });
    } else {
      // Hikes list - cache for 5 minutes
      res.set({
        'Cache-Control': 'public, max-age=300, s-maxage=300',
        'ETag': `"hikes-list-${Date.now()}"`,
        'Vary': 'Accept-Encoding'
      });
    }
  } else if (req.path === '/health') {
    // Health check - no cache
    res.set('Cache-Control', 'no-cache');
  }
  
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Utility function to create URL-friendly slugs
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single
    .trim('-');                   // Remove leading/trailing hyphens
}

// Optimized fetch with timeout and retry
async function fetchWithTimeout(url, options = {}) {
  const { timeout = 5000, retries = 1, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Accept-Encoding': 'gzip, deflate, br',
        ...fetchOptions.headers
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok && retries > 0) {
      console.warn(`Strapi request failed, retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithTimeout(url, { ...options, retries: retries - 1 });
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (retries > 0 && error.name === 'AbortError') {
      console.warn(`Strapi request timed out, retrying... (${retries} attempts left)`);
      return fetchWithTimeout(url, { ...options, retries: retries - 1 });
    }
    
    throw error;
  }
}

// Optimized endpoint to get all hikes with caching
app.get('/api/hikes', async (req, res) => {
  try {
    const cacheKey = 'hikes-list';
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      console.log('✅ Serving hikes list from cache');
      res.set('ETag', `"hikes-cached-${cached.timestamp}"`);
      return res.json(cached.data);
    }

    console.log('🔄 Fetching fresh hikes list from database');
    
    // Optimized query - only get essential fields for list view
    const query = `
      SELECT 
        id, 
        name,
        created_at
      FROM Hikes 
      ORDER BY created_at DESC
      LIMIT 100
    `;
    
    const { rows } = await pool.query(query);
    
    // Create timestamp for ETag
    const timestamp = Date.now();
    const dataWithTimestamp = { data: rows, timestamp };
    
    // Cache the result
    setCachedData(cacheKey, dataWithTimestamp, CACHE_TTL.HIKES_LIST);
    
    // Set ETag
    res.set('ETag', `"hikes-fresh-${timestamp}"`);
    
    res.json(rows);
  } catch (error) {
    console.error('❌ Error in /api/hikes:', error);
    res.status(500).json({ error: 'Error fetching hikes' });
  }
});

// Endpoint to get featured hike
app.get('/api/hikes/featured', async (req, res) => {
  try {
    const cacheKey = 'featured-hike';
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      console.log('✅ Serving featured hike from cache');
      res.set('ETag', `"featured-cached-${cached.timestamp}"`);
      return res.json(cached.data);
    }

    console.log('🔄 Fetching fresh featured hike from Strapi');
    
    const populateParams = [
      'populate[mainImage]=true',
      'populate[countries]=true',
      'populate[sceneries]=true',
      'populate[months]=true',
      'populate[accommodations]=true',
      'filters[featured][$eq]=true'
    ].join('&');
    
    const strapiResponse = await fetchWithTimeout(
      `${STRAPI_URL}/api/hikes?${populateParams}`,
      { timeout: 8000, retries: 2 }
    );
    
    const strapiData = await strapiResponse.json();
    
    let featuredHike = null;
    if (strapiData.data && strapiData.data.length > 0) {
      featuredHike = strapiData.data[0];
      console.log('✅ Featured hike found:', featuredHike.title);
    }
    
    const timestamp = Date.now();
    const dataWithTimestamp = { data: featuredHike, timestamp };
    
    // Cache even if null (to avoid repeated failed requests)
    setCachedData(cacheKey, dataWithTimestamp, CACHE_TTL.FEATURED_HIKE);
    
    res.set('ETag', `"featured-fresh-${timestamp}"`);
    res.json(featuredHike);
  } catch (error) {
    console.error('❌ Error fetching featured hike:', error);
    res.status(500).json({ error: 'Error fetching featured hike' });
  }
});

// Optimized endpoint to get hike by slug
app.get('/api/hikes/slug/:slug', async (req, res) => {
  const { slug } = req.params;
  console.log('🔍 Looking for hike with slug:', slug);
  
  try {
    const cacheKey = `hike-slug-${slug}`;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      console.log('✅ Serving hike detail from cache');
      res.set('ETag', `"hike-cached-${cached.timestamp}"`);
      return res.json(cached.data);
    }

    console.log('🔄 Fetching fresh hike detail');
    
    // Optimize populate params - only get what you need
    const populateParams = [
      'populate[mainImage]=true',
      'populate[countries]=true',
      'populate[sceneries]=true',
      'populate[months]=true',
      'populate[accommodations]=true',
      'populate[Videos]=true',
      'populate[Blogs]=true',
      'populate[landmarks]=true',
      'populate[Books][populate][0]=cover_image'
    ].join('&');
    
    const strapiRes = await fetchWithTimeout(
      `${STRAPI_URL}/api/hikes?${populateParams}`,
      { timeout: 10000, retries: 2 }
    );
    
    const strapiCollection = await strapiRes.json();
    
    if (!strapiCollection.data || strapiCollection.data.length === 0) {
      console.error('Strapi returned no data:', strapiCollection);
      return res.status(404).json({ error: 'No hikes found' });
    }
    
    // Find hike by matching slug
    const matchingHike = strapiCollection.data.find(hike => {
      const hikeSlug = createSlug(hike.title);
      return hikeSlug === slug;
    });
    
    if (!matchingHike) {
      console.log('❌ No hike found with slug:', slug);
      return res.status(404).json({ error: 'Hike not found' });
    }
    
    console.log('✅ Found matching hike:', matchingHike.title, 'with hike_id:', matchingHike.hike_id);
    
    // Get geodata in parallel (don't wait for Strapi to complete first)
    let geoData = null;
    if (matchingHike.hike_id) {
      try {
        const geoQuery = 'SELECT id, name, simplified_profile, ST_AsGeoJSON(track) as track FROM Hikes WHERE id = $1';
        const geoResult = await pool.query(geoQuery, [matchingHike.hike_id]);

        if (geoResult.rows.length > 0) {
          const cleanTrackString = (geoResult.rows[0].track || '{}').replace(/NaN/g, 'null');
          geoData = { ...geoResult.rows[0], track: JSON.parse(cleanTrackString) };
        }
      } catch (geoError) {
        console.warn('⚠️  Could not fetch geodata:', geoError.message);
      }
    }
    
    // Combine data
    const fullHikeData = geoData ? 
      { ...geoData, content: matchingHike } : 
      { 
        id: matchingHike.hike_id || matchingHike.id, 
        name: matchingHike.title, 
        track: null, 
        simplified_profile: null,
        content: matchingHike 
      };
    
    const timestamp = Date.now();
    const dataWithTimestamp = { data: fullHikeData, timestamp };
    
    // Cache the result
    setCachedData(cacheKey, dataWithTimestamp, CACHE_TTL.HIKE_DETAIL);
    
    res.set('ETag', `"hike-fresh-${timestamp}"`);
    
    console.log('🎉 Successfully found and combined hike data for:', matchingHike.title);
    res.json(fullHikeData);

  } catch (error) {
    console.error(`❌ Error in /api/hikes/slug/${slug}:`, error);
    res.status(500).json({ error: 'Error fetching hike data' });
  }
});

// Original endpoint to get a single hike by its ID (keep for backwards compatibility)
app.get('/api/hikes/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const cacheKey = `hike-id-${id}`;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      console.log('✅ Serving hike by ID from cache');
      res.set('ETag', `"hike-id-cached-${cached.timestamp}"`);
      return res.json(cached.data);
    }

    // Start both requests in parallel
    const [geoResult, strapiResponse] = await Promise.allSettled([
      pool.query('SELECT id, name, simplified_profile, ST_AsGeoJSON(track) as track FROM Hikes WHERE id = $1', [id]),
      fetchWithTimeout(`${STRAPI_URL}/api/hikes?populate[mainImage]=true&populate[countries]=true&populate[sceneries]=true&populate[months]=true&populate[accommodations]=true&populate[Videos]=true&populate[Blogs]=true&populate[landmarks]=true&populate[Books][populate][0]=cover_image&filters[hike_id][$eq]=${id}`, { timeout: 8000, retries: 2 })
    ]);

    // Handle geodata
    let hikeData = null;
    if (geoResult.status === 'fulfilled' && geoResult.value.rows.length > 0) {
      const cleanTrackString = (geoResult.value.rows[0].track || '{}').replace(/NaN/g, 'null');
      hikeData = { ...geoResult.value.rows[0], track: JSON.parse(cleanTrackString) };
    } else {
      return res.status(404).json({ error: 'Hike not found in geodatabase' });
    }

    // Handle Strapi data
    let strapiEntry = null;
    if (strapiResponse.status === 'fulfilled') {
      const strapiCollection = await strapiResponse.value.json();
      if (strapiCollection.data && strapiCollection.data.length > 0) {
        strapiEntry = strapiCollection.data.find(entry => entry.hike_id == id);
      }
    } else {
      console.warn('⚠️  Strapi request failed:', strapiResponse.reason);
    }
    
    const fullHikeData = { ...hikeData, content: strapiEntry || null };
    
    const timestamp = Date.now();
    const dataWithTimestamp = { data: fullHikeData, timestamp };
    
    // Cache the result
    setCachedData(cacheKey, dataWithTimestamp, CACHE_TTL.HIKE_DETAIL);
    
    res.set('ETag', `"hike-id-fresh-${timestamp}"`);
    res.json(fullHikeData);

  } catch (error) {
    console.error(`❌ Error in /api/hikes/${id}:`, error);
    res.status(500).json({ error: 'Error fetching hike data' });
  }
});

// Newsletter subscription endpoint
app.post('/api/newsletter/subscribe', async (req, res) => {
  const { email } = req.body;
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide a valid email address' 
    });
  }
  
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT true
      )
    `);
    
    const query = `
      INSERT INTO newsletter_subscribers (email) 
      VALUES ($1) 
      ON CONFLICT (email) DO UPDATE SET 
        subscribed_at = CURRENT_TIMESTAMP,
        is_active = true
      RETURNING *
    `;
    
    await pool.query(query, [email.toLowerCase().trim()]);
    
    console.log('Newsletter subscription:', email);
    res.json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter!' 
    });
    
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Subscription failed. Please try again.' 
    });
  }
});

// Clear cache endpoint for development/debugging
if (process.env.NODE_ENV !== 'production') {
  app.post('/api/cache/clear', (req, res) => {
    cache.clear();
    res.json({ message: 'Cache cleared' });
  });
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  pool.end(() => {
    console.log('Database pool closed');
  });
});

app.listen(port, () => {
  console.log(`🚀 Backend server listening at http://localhost:${port}`);
  console.log(`📊 Cache TTL: Hikes=${CACHE_TTL.HIKES_LIST/1000}s, Featured=${CACHE_TTL.FEATURED_HIKE/1000}s, Detail=${CACHE_TTL.HIKE_DETAIL/1000}s`);
});

// Add these endpoints to your existing index.js file

// Quiz completion tracking endpoint
app.post('/api/quiz/complete', async (req, res) => {
  const { answers, result, email, startTime } = req.body;
  
  try {
    // Create quiz_completions table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quiz_completions (
        id SERIAL PRIMARY KEY,
        answers JSONB NOT NULL,
        result_hike VARCHAR(255) NOT NULL,
        result_persona VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        completion_time_ms INTEGER,
        user_agent TEXT,
        ip_address INET,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Calculate completion time
    const completionTime = startTime ? Date.now() - startTime : null;
    
    // Get user agent and IP
    const userAgent = req.headers['user-agent'] || null;
    const ipAddress = req.ip || req.connection.remoteAddress || null;
    
    // Insert quiz completion
    const query = `
      INSERT INTO quiz_completions 
      (answers, result_hike, result_persona, email, completion_time_ms, user_agent, ip_address) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING id
    `;
    
    const values = [
      JSON.stringify(answers),
      result.name,
      result.persona,
      email || null,
      completionTime,
      userAgent,
      ipAddress
    ];
    
    const { rows } = await pool.query(query, values);
    
    console.log(`✅ Quiz completion tracked: ${result.persona} -> ${result.name} (ID: ${rows[0].id})`);
    
    res.json({ 
      success: true, 
      completionId: rows[0].id,
      message: 'Quiz completion tracked successfully' 
    });
    
  } catch (error) {
    console.error('❌ Quiz completion tracking error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to track quiz completion' 
    });
  }
});

// Quiz analytics endpoint
app.get('/api/quiz/analytics', async (req, res) => {
  try {
    // Get basic completion stats
    const completionStats = await pool.query(`
      SELECT 
        COUNT(*) as total_completions,
        COUNT(DISTINCT email) FILTER (WHERE email IS NOT NULL) as unique_email_completions,
        AVG(completion_time_ms) as avg_completion_time_ms
      FROM quiz_completions 
      WHERE completed_at > NOW() - INTERVAL '30 days'
    `);
    
    // Get hike recommendations breakdown
    const hikeStats = await pool.query(`
      SELECT 
        result_hike,
        result_persona,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
      FROM quiz_completions 
      WHERE completed_at > NOW() - INTERVAL '30 days'
      GROUP BY result_hike, result_persona
      ORDER BY count DESC
    `);
    
    // Get daily completion trends
    const dailyTrends = await pool.query(`
      SELECT 
        DATE(completed_at) as date,
        COUNT(*) as completions,
        COUNT(DISTINCT email) FILTER (WHERE email IS NOT NULL) as email_signups
      FROM quiz_completions 
      WHERE completed_at > NOW() - INTERVAL '30 days'
      GROUP BY DATE(completed_at)
      ORDER BY date DESC
    `);
    
    // Get most popular hiking personas
    const personaStats = await pool.query(`
      SELECT 
        result_persona,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
      FROM quiz_completions 
      WHERE completed_at > NOW() - INTERVAL '30 days'
      GROUP BY result_persona
      ORDER BY count DESC
    `);
    
    res.json({
      success: true,
      data: {
        completionStats: completionStats.rows[0] || {},
        hikeStats: hikeStats.rows,
        dailyTrends: dailyTrends.rows,
        personaStats: personaStats.rows,
        generatedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Quiz analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve quiz analytics' 
    });
  }
});

// Enhanced newsletter subscription with quiz source tracking
app.post('/api/newsletter/subscribe', async (req, res) => {
  const { email, source = 'general', quizResult = null } = req.body;
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide a valid email address' 
    });
  }
  
  try {
    // Update newsletter table structure to match your schema
    await pool.query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        source VARCHAR(100) DEFAULT 'general',
        quiz_result VARCHAR(255),
        user_agent TEXT,
        ip_address INET
      )
    `);
    
    const userAgent = req.headers['user-agent'] || null;
    const ipAddress = req.ip || req.connection.remoteAddress || null;
    
    const query = `
      INSERT INTO newsletter_subscribers (email, source, quiz_result, user_agent, ip_address) 
      VALUES ($1, $2, $3, $4, $5) 
      ON CONFLICT (email) DO UPDATE SET 
        subscribed_at = CURRENT_TIMESTAMP,
        is_active = true,
        source = EXCLUDED.source,
        quiz_result = COALESCE(EXCLUDED.quiz_result, newsletter_subscribers.quiz_result)
      RETURNING *
    `;
    
    const values = [
      email.toLowerCase().trim(),
      source,
      quizResult,
      userAgent,
      ipAddress
    ];
    
    await pool.query(query, values);
    
    console.log(`📧 Newsletter subscription: ${email} (source: ${source}${quizResult ? `, quiz: ${quizResult}` : ''})`);
    
    res.json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter!' 
    });
    
  } catch (error) {
    console.error('❌ Newsletter subscription error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Subscription failed. Please try again.' 
    });
  }
});

// Quiz conversion funnel endpoint
app.get('/api/quiz/funnel', async (req, res) => {
  try {
    const funnelData = await pool.query(`
      WITH quiz_metrics AS (
        SELECT 
          COUNT(*) as total_completions,
          COUNT(email) FILTER (WHERE email IS NOT NULL) as email_captures,
          AVG(completion_time_ms) as avg_completion_time
        FROM quiz_completions 
        WHERE completed_at > NOW() - INTERVAL '30 days'
      ),
      newsletter_metrics AS (
        SELECT 
          COUNT(*) as quiz_newsletters
        FROM newsletter_subscribers 
        WHERE source = 'quiz' 
        AND subscribed_at > NOW() - INTERVAL '30 days'
      )
      SELECT 
        q.total_completions,
        q.email_captures,
        q.avg_completion_time,
        n.quiz_newsletters,
        ROUND(
          CASE 
            WHEN q.total_completions > 0 
            THEN (q.email_captures * 100.0 / q.total_completions) 
            ELSE 0 
          END, 2
        ) as email_conversion_rate,
        ROUND(
          CASE 
            WHEN q.email_captures > 0 
            THEN (n.quiz_newsletters * 100.0 / q.email_captures) 
            ELSE 0 
          END, 2
        ) as newsletter_conversion_rate
      FROM quiz_metrics q
      CROSS JOIN newsletter_metrics n
    `);
    
    res.json({
      success: true,
      data: funnelData.rows[0] || {},
      generatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Quiz funnel analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve funnel data' 
    });
  }
});

// Quiz results breakdown endpoint
app.get('/api/quiz/results', async (req, res) => {
  try {
    const { period = '30' } = req.query; // Default to 30 days
    
    const resultsBreakdown = await pool.query(`
      SELECT 
        result_hike,
        result_persona,
        COUNT(*) as completions,
        COUNT(email) FILTER (WHERE email IS NOT NULL) as email_captures,
        ROUND(AVG(completion_time_ms) / 1000.0, 1) as avg_completion_seconds,
        ROUND(
          COUNT(email) FILTER (WHERE email IS NOT NULL) * 100.0 / COUNT(*), 
          2
        ) as email_capture_rate,
        MAX(completed_at) as last_completion
      FROM quiz_completions 
      WHERE completed_at > NOW() - INTERVAL '${parseInt(period)} days'
      GROUP BY result_hike, result_persona
      ORDER BY completions DESC
    `);
    
    // Get newsletter signups by quiz result
    const newsletterByQuiz = await pool.query(`
      SELECT 
        quiz_result,
        COUNT(*) as newsletter_signups
      FROM newsletter_subscribers 
      WHERE source = 'quiz' 
      AND quiz_result IS NOT NULL
      AND subscribed_at > NOW() - INTERVAL '${parseInt(period)} days'
      GROUP BY quiz_result
      ORDER BY newsletter_signups DESC
    `);
    
    res.json({
      success: true,
      data: {
        resultsBreakdown: resultsBreakdown.rows,
        newsletterByQuiz: newsletterByQuiz.rows,
        period: `${period} days`,
        generatedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Quiz results breakdown error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve quiz results breakdown' 
    });
  }
});

// Get quiz insights (most/least popular answers)
app.get('/api/quiz/insights', async (req, res) => {
  try {
    // Analyze quiz answers to see patterns
    const answerInsights = await pool.query(`
      WITH answer_analysis AS (
        SELECT 
          result_persona,
          result_hike,
          answers,
          jsonb_array_elements(answers) as individual_answer
        FROM quiz_completions 
        WHERE completed_at > NOW() - INTERVAL '30 days'
      ),
      answer_counts AS (
        SELECT 
          individual_answer->>'text' as answer_text,
          COUNT(*) as selection_count,
          COUNT(DISTINCT result_persona) as personas_that_selected,
          array_agg(DISTINCT result_persona) as selecting_personas
        FROM answer_analysis
        GROUP BY individual_answer->>'text'
      )
      SELECT 
        answer_text,
        selection_count,
        personas_that_selected,
        selecting_personas,
        ROUND(selection_count * 100.0 / SUM(selection_count) OVER (), 2) as percentage
      FROM answer_counts
      ORDER BY selection_count DESC
    `);
    
    // Get completion time insights
    const timeInsights = await pool.query(`
      SELECT 
        result_persona,
        COUNT(*) as completions,
        ROUND(AVG(completion_time_ms) / 1000.0, 1) as avg_seconds,
        ROUND(MIN(completion_time_ms) / 1000.0, 1) as fastest_seconds,
        ROUND(MAX(completion_time_ms) / 1000.0, 1) as slowest_seconds,
        ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY completion_time_ms) / 1000.0, 1) as median_seconds
      FROM quiz_completions 
      WHERE completed_at > NOW() - INTERVAL '30 days'
      AND completion_time_ms IS NOT NULL
      GROUP BY result_persona
      ORDER BY avg_seconds DESC
    `);
    
    res.json({
      success: true,
      data: {
        answerInsights: answerInsights.rows,
        timeInsights: timeInsights.rows,
        generatedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Quiz insights error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve quiz insights' 
    });
  }
});