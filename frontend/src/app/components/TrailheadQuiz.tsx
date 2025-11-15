'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, MapPin, Clock, TrendingUp, Download, Mail, Star, Mountain, ArrowLeft, Route, Calendar } from 'lucide-react';
import { createSlug, getHikes } from '../services/api';
import Image from 'next/image';
import type { HikeSummary } from '../../types';
import { resolveMediaUrl } from '../utils/media';

// Quiz answer interface
interface QuizAnswer {
  text: string;
  tags: string[];
}

// Quiz question interface
interface QuizQuestion {
  id: number;
  question: string;
  answers: QuizAnswer[];
}

// Hike result interface
interface HikeResult {
  name: string;
  tags: string[];
  persona: string;
  description: string;
  distance: string;
  duration: string;
  difficulty: string;
  country: string;
  highlights: string;
  slug: string;
}

const TrailheadQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(-1); // -1 for start screen
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [allHikes, setAllHikes] = useState<HikeSummary[]>([]);
  const [loading, setLoading] = useState(true);

// Mobile detection hook
const [isMobile, setIsMobile] = useState(false);

// Mobile detection hook
useEffect(() => {
  const checkScreenSize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
  return () => window.removeEventListener('resize', checkScreenSize);
}, []);

// Load hikes data from your API
useEffect(() => {
  const loadHikes = async () => {
    try {
      const hikesData = await getHikes();
      if (hikesData) {
        setAllHikes(hikesData);
      }
    } catch (error) {
      console.error('Error loading hikes:', error);
    } finally {
      setLoading(false);
    }
  };

  loadHikes();
}, []);

// Scroll to top when question changes (mobile UX fix)
useEffect(() => {
  // Only scroll to top when moving between questions (not on initial load or results)
  if (currentQuestion >= 0 && !showResults) {
    // Use setTimeout to ensure the DOM has updated
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth' // Smooth scroll for better UX
      });
    }, 100);
  }
}, [currentQuestion, showResults]);

  // Background images for each question
  const backgroundImages = [
    '/IMG_1676.jpg',  // Start screen
    '/IMG_6939.jpg',  // Question 1
    '/IMG_6991.jpg',  // Question 2
    '/IMG_6969.jpg',  // Question 3
    '/IMG_6920.jpg',  // Question 4
    '/IMG_1682.jpg', // Question 5
  ];

  // Quiz questions with exact content from your brief
  const questions: QuizQuestion[] = [
    {
      id: 1,
      question: "Let's talk about the end of a perfect hiking day. You've just taken your boots off. Where are you?",
      answers: [
        {
          text: "In a bustling village square, raising a glass of local wine with fellow walkers.",
          tags: ['Social', 'Comfort', 'Cultural']
        },
        {
          text: "On the deck of a cozy mountain hut, watching the sunset over jagged peaks.",
          tags: ['HighAlpine', 'HutLife', 'Dramatic']
        },
        {
          text: "Enjoying the sea breeze from a cliffside B&B with a fantastic seafood dinner on the way.",
          tags: ['Coastal', 'Foodie', 'Comfort']
        },
        {
          text: "Somewhere beautifully quiet and remote. The only sounds are the wind and my own thoughts.",
          tags: ['Remote', 'Wilderness']
        }
      ]
    },
    {
      id: 2,
      question: "What's your relationship with your backpack?",
      answers: [
        {
          text: "Frankly, I'd rather it meet me at my destination. I just want to carry a light daypack.",
          tags: ['LuggageTransfer', 'Comfort']
        },
        {
          text: "I'm happy carrying my clothes and essentials from hut to hut. It's part of the journey.",
          tags: ['HutLife']
        },
        {
          text: "I am one with my pack. It has my tent, food, and everything I need to be self-reliant.",
          tags: ['SelfSufficient', 'Wilderness']
        }
      ]
    },
    {
      id: 3,
      question: "A 'challenging day' on the trail sounds like...",
      answers: [
        {
          text: "A lovely long walk with some gentle hills to remind me I'm exercising.",
          tags: ['Easy']
        },
        {
          text: "A proper, leg-testing climb up to a spectacular viewpoint, but on a well-defined path.",
          tags: ['Moderate', 'HighAlpine']
        },
        {
          text: "A long, tough day with multiple steep ascents and descents. I'm tired but exhilarated.",
          tags: ['Hard', 'Challenging']
        },
        {
          text: "Pushing my limits. Steep, rocky scrambles and exposed sections are what I'm looking for.",
          tags: ['VeryHard', 'Technical']
        }
      ]
    },
    {
      id: 4,
      question: "What kind of scenery truly takes your breath away?",
      answers: [
        {
          text: "An endless horizon of crashing waves, dramatic sea stacks, and rugged coastline.",
          tags: ['Coastal', 'Rugged']
        },
        {
          text: "Epic 360-degree panoramas of snow-dusted mountains, glaciers, and deep green valleys.",
          tags: ['HighAlpine', 'Glaciers']
        },
        {
          text: "The immense, awe-inspiring scale of the highest mountain ranges on Earth.",
          tags: ['HighAltitude', 'BucketList']
        },
        {
          text: "Historic trails weaving through rolling countryside, ancient villages, and magical forests.",
          tags: ['Cultural', 'Pastoral', 'Forest']
        }
      ]
    },
    {
      id: 5,
      question: "Imagine the perfect post-hike meal. What are you eating?",
      answers: [
        {
          text: "A delicious, multi-course dinner served to me in a charming mountain rifugio or inn.",
          tags: ['HutLife', 'Comfort']
        },
        {
          text: "A hearty pub classic, like a pie and a pint, shared with new friends in a lively atmosphere.",
          tags: ['PubCulture', 'Social']
        },
        {
          text: "The freshest seafood imaginable, grilled simply with lemon and olive oil in a seaside village.",
          tags: ['Foodie', 'Coastal']
        },
        {
          text: "A satisfying, high-energy meal that I've cooked myself on my own stove under the stars.",
          tags: ['SelfSufficient', 'Remote']
        }
      ]
    }
  ];

  // Exact hike database from your brief with persona content
  const hikes: Record<string, Omit<HikeResult, 'name'>> = {
    'West Highland Way': {
      tags: ['Easy', 'RollingHills', 'Social', 'Comfort', 'LuggageTransfer', 'PubCulture'],
      persona: 'The Comfort Connoisseur',
      description: 'Because you value comfort and great company, with a preference for well-supported trails and social experiences, we think your perfect match is the West Highland Way.',
      distance: '154km',
      duration: '8 days',
      difficulty: 'Easy',
      country: 'Scotland',
      highlights: 'Loch Lomond, Highland villages, whisky distilleries',
      slug: 'west-highland-way'
    },
    'Camino de Santiago - Camino Francés': {
      tags: ['Easy', 'Pastoral', 'Cultural', 'Social', 'Comfort', 'LuggageTransfer'],
      persona: 'The Cultural Explorer',
      description: 'Because you seek meaningful connections and cultural immersion, preferring well-established trails with rich history, we think your perfect match is the Camino Francés.',
      distance: '800km',
      duration: '35 days',
      difficulty: 'Easy',
      country: 'Spain',
      highlights: 'Medieval towns, cathedrals, pilgrimage history',
      slug: 'camino-frances'
    },
    'Fishermans Trail': {
      tags: ['Easy-Moderate', 'Coastal', 'Foodie', 'Comfort', 'LuggageTransfer'],
      persona: 'The Coastal Epicurean',
      description: 'Because you value comfort and great food but still love a dramatic coastal view, we think your perfect match is the Fisherman\'s Trail.',
      distance: '230km',
      duration: '12 days',
      difficulty: 'Easy-Moderate',
      country: 'Portugal',
      highlights: 'Atlantic cliffs, fishing villages, seafood cuisine',
      slug: 'fishermans-trail'
    },
    'Tour du Mont Blanc': {
      tags: ['Moderate-Hard', 'HighAlpine', 'HutLife', 'Social', 'LuggageTransfer'],
      persona: 'The Aspiring Alpinist',
      description: 'Because you\'re ready for alpine challenges with the comfort of mountain huts and established infrastructure, we think your perfect match is the Tour du Mont Blanc.',
      distance: '170km',
      duration: '11 days',
      difficulty: 'Moderate-Hard',
      country: 'France/Italy/Switzerland',
      highlights: 'Mont Blanc massif, alpine meadows, glacier views',
      slug: 'tour-du-mont-blanc'
    },
    'Everest Base Camp': {
      tags: ['Hard', 'HighAltitude', 'BucketList', 'Expedition'],
      persona: 'The Himalayan Dreamer',
      description: 'Because you\'re drawn to iconic, challenging adventures and the world\'s most spectacular mountain scenery, we think your perfect match is Everest Base Camp.',
      distance: '130km',
      duration: '16 days',
      difficulty: 'Hard',
      country: 'Nepal',
      highlights: 'Everest views, Sherpa culture, high altitude lakes',
      slug: 'everest-base-camp'
    },
    'GR20': {
      tags: ['VeryHard', 'Technical', 'Rugged', 'Challenging', 'SelfSufficient'],
      persona: 'The Fearless Challenger',
      description: 'Because you thrive on technical challenges and remote wilderness experiences that test your limits, we think your perfect match is the GR20.',
      distance: '180km',
      duration: '16 days',
      difficulty: 'Very Hard',
      country: 'Corsica',
      highlights: 'Technical ridges, granite peaks, wild swimming',
      slug: 'gr20'
    }
  };

  // Secondary recommendations mapping - Updated to match your actual hike database
  const secondaryRecommendations: Record<string, string[]> = {
    'West Highland Way': ['South West Coast Path', 'Malerweg'],
    'Camino de Santiago - Camino Francés': ['West Highland Way', 'Malerweg'], 
    'Fishermans Trail': ['South West Coast Path', 'Camiño dos Faros'],
    'Tour du Mont Blanc': ['Alta Via 1', 'Tour of Monte Rosa'],
    'Everest Base Camp': ['Salkantay Trek', 'Kungsleden'],
    'GR20': ['Alta Via 2', 'HRP']
  };

  const calculateResult = (): HikeResult => {
    const tagCounts: Record<string, number> = {};
    
    answers.forEach(answer => {
      answer.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    let bestMatch: HikeResult | null = null;
    let highestScore = 0;

    Object.entries(hikes).forEach(([hikeName, hikeData]) => {
      let score = 0;
      hikeData.tags.forEach(tag => {
        if (tagCounts[tag]) {
          score += tagCounts[tag];
        }
      });

      if (score > highestScore) {
        highestScore = score;
        bestMatch = { name: hikeName, ...hikeData };
      }
    });

    return bestMatch || { name: 'West Highland Way', ...hikes['West Highland Way'] };
  };

  const handleAnswer = (answer: QuizAnswer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    setSelectedAnswer(null);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      
      // Track quiz completion with Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'quiz_complete', {
          event_category: 'engagement',
          event_label: 'hike_quiz_completed',
        });
      }
    }
  };

  const handleEmailSubmit = async () => {
    if (!email || !email.includes('@') || emailSubmitting) return;
    
    setEmailSubmitting(true);
    
    try {
      // Get the current quiz result
      const currentResult = calculateResult();
      
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.toLowerCase().trim(),
          source: 'quiz',
          quizResult: currentResult.persona
        })
      });
      
      if (response.ok) {
        setEmailSubmitted(true);
        
        // Track newsletter signup
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'newsletter_signup', {
            event_category: 'engagement',
            event_label: 'quiz_page',
            quiz_result: currentResult.persona
          });
        }
      } else {
        console.error('Newsletter subscription failed');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
    } finally {
      setEmailSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(-1);
    setAnswers([]);
    setShowResults(false);
    setEmail('');
    setEmailSubmitted(false);
    setEmailSubmitting(false);
    setSelectedAnswer(null);
  };

  const getDifficultyBadgeColor = (difficulty: string): string => {
    const colors: Record<string, string> = {
      'Easy': 'bg-green-100 text-green-800',
      'Easy-Moderate': 'bg-blue-100 text-blue-800',
      'Moderate': 'bg-yellow-100 text-yellow-800',
      'Moderate-Hard': 'bg-orange-100 text-orange-800',
      'Hard': 'bg-red-100 text-red-800',
      'Very Hard': 'bg-purple-100 text-purple-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  // Function to find hike in your database by name - Enhanced matching
  const findHikeByName = (hikeName: string): HikeSummary | null => {
    // Direct title match first
    let match = allHikes.find(hike => 
      hike.title.toLowerCase() === hikeName.toLowerCase()
    );
    
    if (match) return match;
    
    // Partial matches for common variations
    const nameVariations: Record<string, string[]> = {
      'West Highland Way': ['west highland way', 'highland way'],
      'Camino Francés': ['camino frances', 'camino french', 'french way'],
      'Fishermans Trail': ['fisherman trail', 'fishermans trail', 'rota vicentina'],
      'Tour du Mont Blanc': ['tour mont blanc', 'tmb', 'mont blanc tour'],
      'Everest Base Camp': ['everest base camp', 'ebc', 'everest trek'],
      'GR20': ['gr20', 'gr 20', 'corsica gr20'],
      'South West Coast Path': ['southwest coast path', 'swcp', 'cornwall coast'],
      'Malerweg': ['malerweg', 'saxon switzerland'],
      'Camiño dos Faros': ['camino dos faros', 'lighthouse way'],
      'Alta Via 1': ['alta via 1', 'av1', 'dolomites alta via'],
      'Tour of Monte Rosa': ['monte rosa tour', 'tmr'],
      'Salkantay Trek': ['salkantay', 'salkantay trail'],
      'Kungsleden': ['kungsleden', 'kings trail'],
      'Alta Via 2': ['alta via 2', 'av2'],
      'HRP': ['hrp', 'haute route pyrenees']
    };
    
    // Check variations
    for (const [canonical, variations] of Object.entries(nameVariations)) {
      if (variations.some(variation => 
        hikeName.toLowerCase().includes(variation) || 
        variation.includes(hikeName.toLowerCase())
      )) {
        match = allHikes.find(hike => 
          variations.some(v => hike.title.toLowerCase().includes(v))
        );
        if (match) return match;
      }
    }
    
    // Fallback to partial string matching
    return allHikes.find(hike => 
      hike.title.toLowerCase().includes(hikeName.toLowerCase()) ||
      hikeName.toLowerCase().includes(hike.title.toLowerCase())
    ) || null;
  };

  // Function to get image URL from Strapi
  const getHikeImageUrl = (hike: HikeSummary | null): string => {
    return (
      resolveMediaUrl(hike?.mainImage, {
        preferFormats: ['medium', 'small', 'large', 'thumbnail'],
      }) || '/IMG_1633.jpg'
    );
  };

  // Function to get description preview from Strapi data
const getDescriptionPreview = (description: any[] | undefined): string => {
    if (!description || !Array.isArray(description)) return '';
    
    let text = '';
    for (const block of description) {
      if (block.type === 'paragraph' && block.children) {
        for (const child of block.children) {
          if (child.text) {
            text += child.text;
          }
        }
        text += ' ';
        if (text.length > 150) break;
      }
    }
    
    const sentences = text.split('. ');
    return sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '.' : '');
  };

  const navigateToHike = (hikeName: string) => {
    // Use your existing createSlug function
    const slug = createSlug(hikeName);
    window.open(`/hike/${slug}`, '_blank');
    
    // Track hike guide click
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'quiz_result_click', {
        event_category: 'engagement',
        event_label: hikeName,
      });
    }
  };

  const getCurrentBackground = () => {
    if (showResults) return backgroundImages[0]; // Use hero image for results
    if (currentQuestion === -1) return backgroundImages[0]; // Start screen
    return backgroundImages[currentQuestion + 1] || backgroundImages[0];
  };

const progress = currentQuestion >= 0 ? (answers.length / questions.length) * 100 : 0;

  if (showResults) {
    const result = calculateResult();
    const secondaries = secondaryRecommendations[result.name] || [];
    
    return (
      <div className="min-h-screen relative">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
          style={{ backgroundImage: `url(${getCurrentBackground()})` }}
        >
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 min-h-screen px-4 py-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Results Header */}
            <div className="text-center mb-12">
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                background: 'var(--gradient-hero)',
                borderRadius: '50%',
                marginBottom: 'var(--space-xl)',
                boxShadow: 'var(--shadow-float)'
              }}>
                <Star style={{ width: '40px', height: '40px', color: 'var(--ds-primary-foreground)' }} />
              </div>
              
              <h1 style={{
                fontSize: isMobile ? 'clamp(1.75rem, 8vw, 2.5rem)' : 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 700,
                color: 'var(--ds-foreground)',
                marginBottom: 'var(--space-lg)'
              }}>
                You're{' '}
                <span style={{
                  background: 'var(--gradient-hero)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {result.persona}
                </span>
              </h1>
              
              <p style={{
                fontSize: isMobile ? 'var(--text-base)' : 'var(--text-xl)',
                color: '#2d3748',
                maxWidth: '800px',
                margin: '0 auto',
                lineHeight: 1.6
              }}>
                {result.description}
              </p>
            </div>

            {/* Primary Recommendation Card */}
            <div 
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                boxShadow: 'var(--shadow-float)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                overflow: 'hidden',
                marginBottom: 'var(--space-3xl)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => navigateToHike(result.name)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 15px 50px rgba(0, 0, 0, 0.3)';
                // Scale the image
                const img = e.currentTarget.querySelector('img');
                if (img) {
                  img.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-float)';
                // Reset image scale
                const img = e.currentTarget.querySelector('img');
                if (img) {
                  img.style.transform = 'scale(1)';
                }
              }}
            >
                {/* Image Section - Left Side */}
                
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: isMobile ? 'auto' : '400px' }}>
                  {isMobile ? (
                    // MOBILE LAYOUT: Country → Title → Image → Description → Details → Button
                    <div style={{ 
                      padding: 'var(--space-lg)',
                      display: 'flex',
                      flexDirection: 'column',
                      textAlign: 'center'
                    }}>
                      {/* Country */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 'var(--space-xs)',
                        justifyContent: 'center',
                        marginBottom: 'var(--space-sm)',
                        color: 'var(--ds-muted-foreground)',
                        fontSize: '0.8rem'
                      }}>
                        <MapPin style={{ width: '12px', height: '12px' }} />
                        <span>
                          {(() => {
                            const primaryHike = findHikeByName(result.name);
                            if (primaryHike?.countries?.length) {
                              return primaryHike.countries.map(c => c.name).join(', ');
                            }
                            return result.country;
                          })()}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 style={{
                        fontSize: 'var(--text-xl)',
                        fontWeight: 600,
                        color: 'var(--ds-foreground)',
                        marginBottom: 'var(--space-md)',
                        lineHeight: 1.3
                      }}>
                        {result.name}
                      </h2>

                      {/* Image */}
                      <div style={{ 
                        position: 'relative', 
                        width: '100%', 
                        height: '280px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        marginBottom: 'var(--space-lg)'
                      }}>
                        {(() => {
                          const primaryHike = findHikeByName(result.name);
                          return (
                            <Image 
                              src={getHikeImageUrl(primaryHike)}
                              alt={result.name}
                              fill
                              style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
                            />
                          );
                        })()}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(255, 255, 255, 0.2)',
                        }} />
                        <div style={{
                          position: 'absolute',
                          top: 'var(--space-md)',
                          left: 'var(--space-md)',
                          background: 'var(--ds-accent)',
                          color: 'var(--ds-accent-foreground)',
                          padding: 'var(--space-xs) var(--space-sm)',
                          borderRadius: '20px',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Perfect Match
                        </div>
                      </div>

                      {/* Description */}
                      <p style={{
                        color: 'var(--ds-muted-foreground)',
                        marginBottom: 'var(--space-lg)',
                        lineHeight: 1.6,
                        fontSize: 'var(--text-sm)'
                      }}>
                        {(() => {
                          const primaryHike = findHikeByName(result.name);
                          return primaryHike ? getDescriptionPreview(primaryHike.Description) : result.highlights;
                        })()}
                      </p>
                      
                      {/* Info Grid - Single Column for Mobile */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gap: 'var(--space-sm)',
                        marginBottom: 'var(--space-xl)'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 'var(--space-xs)',
                          justifyContent: 'center'
                        }}>
                          <Route style={{ width: '14px', height: '14px', color: 'var(--ds-muted-foreground)' }} />
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ds-muted-foreground)' }}>
                            {(() => {
                              const primaryHike = findHikeByName(result.name);
                              return primaryHike?.Length ? `${primaryHike.Length} km` : result.distance;
                            })()}
                          </span>
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 'var(--space-xs)',
                          justifyContent: 'center'
                        }}>
                          <TrendingUp style={{ width: '14px', height: '14px', color: 'var(--ds-muted-foreground)' }} />
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ds-muted-foreground)' }}>
                            {(() => {
                              const primaryHike = findHikeByName(result.name);
                              return primaryHike?.Difficulty || result.difficulty;
                            })()}
                          </span>
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 'var(--space-xs)',
                          justifyContent: 'center'
                        }}>
                          <Calendar style={{ width: '14px', height: '14px', color: 'var(--ds-muted-foreground)' }} />
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ds-muted-foreground)' }}>
                            {(() => {
                              const primaryHike = findHikeByName(result.name);
                              return primaryHike?.Best_time || result.duration;
                            })()}
                          </span>
                        </div>
                      </div>
                      
                      {/* Button */}
                      <button 
                        className="btn-primary"
                        style={{ 
                          alignSelf: 'center',
                          fontSize: 'var(--text-sm)',
                          padding: 'var(--space-sm) var(--space-lg)'
                        }}
                        onClick={() => navigateToHike(result.name)}
                      >
                        <span>View Complete Guide</span>
                        <ChevronRight style={{ height: '16px', width: '16px' }} />
                      </button>
                    </div>
                  ) : (
                    // DESKTOP LAYOUT: Keep your existing layout
                    <>
                      {/* Image Section - Left Side */}
                      <div style={{ 
                        position: 'relative', 
                        width: '50%', 
                        flexShrink: 0,
                        overflow: 'hidden'
                      }}>
                        {(() => {
                          const primaryHike = findHikeByName(result.name);
                          return (
                            <Image 
                              src={getHikeImageUrl(primaryHike)}
                              alt={result.name}
                              fill
                              style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
                            />
                          );
                        })()}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(255, 255, 255, 0.2)',
                        }} />
                        <div style={{
                          position: 'absolute',
                          top: 'var(--space-lg)',
                          left: 'var(--space-lg)',
                          background: 'var(--ds-accent)',
                          color: 'var(--ds-accent-foreground)',
                          padding: 'var(--space-xs) var(--space-md)',
                          borderRadius: '20px',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Perfect Match
                        </div>
                      </div>
                      
                      {/* Content Section - Right Side */}
                      <div style={{ 
                        padding: 'var(--space-3xl)', 
                        width: '50%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <div>
                          <h2 style={{
                            fontSize: 'var(--text-3xl)',
                            fontWeight: 600,
                            color: 'var(--ds-foreground)',
                            marginBottom: 'var(--space-lg)'
                          }}>
                            {result.name}
                          </h2>
                          
                          <p style={{
                            color: 'var(--ds-muted-foreground)',
                            marginBottom: 'var(--space-xl)',
                            lineHeight: 1.6,
                            fontSize: 'var(--text-base)'
                          }}>
                            {(() => {
                              const primaryHike = findHikeByName(result.name);
                              return primaryHike ? getDescriptionPreview(primaryHike.Description) : result.highlights;
                            })()}
                          </p>
                          
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 'var(--space-lg)',
                            marginBottom: 'var(--space-xl)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                              <MapPin style={{ width: '16px', height: '16px', color: 'var(--ds-primary)' }} />
                              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ds-muted-foreground)' }}>
                                {(() => {
                                  const primaryHike = findHikeByName(result.name);
                                  if (primaryHike?.countries?.length) {
                                    return primaryHike.countries.map(c => c.name).join(', ');
                                  }
                                  return result.country;
                                })()}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                              <Route style={{ width: '16px', height: '16px', color: 'var(--ds-primary)' }} />
                              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ds-muted-foreground)' }}>
                                {(() => {
                                  const primaryHike = findHikeByName(result.name);
                                  return primaryHike?.Length ? `${primaryHike.Length} km` : result.distance;
                                })()}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                              <TrendingUp style={{ width: '16px', height: '16px', color: 'var(--ds-primary)' }} />
                              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ds-muted-foreground)' }}>
                                {(() => {
                                  const primaryHike = findHikeByName(result.name);
                                  return primaryHike?.Difficulty || result.difficulty;
                                })()}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                              <Calendar style={{ width: '16px', height: '16px', color: 'var(--ds-primary)' }} />
                              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ds-muted-foreground)' }}>
                                {(() => {
                                  const primaryHike = findHikeByName(result.name);
                                  return primaryHike?.Best_time || result.duration;
                                })()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          className="btn-primary"
                          style={{ alignSelf: 'flex-start' }}
                          onClick={() => navigateToHike(result.name)}
                        >
                          <span>View Complete Guide</span>
                          <ChevronRight style={{ height: '20px', width: '20px' }} />
                        </button>
                      </div>
                    </>
                  )}
              </div>
            </div>

            {/* Secondary Recommendations */}
            {secondaries.length > 0 && !loading && (
              <div style={{ marginBottom: 'var(--space-3xl)' }}>
                <h3 style={{
                  fontSize: isMobile ? 'var(--text-xl)' : 'var(--text-2xl)',
                  fontWeight: 600,
                  color: 'var(--ds-foreground)',
                  textAlign: 'center',
                  marginBottom: 'var(--space-2xl)'
                }}>
                  You Might Also Love
                </h3>
                
                <div style={{ display: 'grid', gap: 'var(--space-xl)' }}>
                  {secondaries.map((hikeName, index) => {
                    // Find the actual hike data from your Strapi
                    const hikeData = findHikeByName(hikeName);
                    if (!hikeData) return null;

                    const countryNames = hikeData.countries?.map(country => country.name) || [];
                    const countryDisplay = countryNames.length > 0 
                      ? countryNames.length === 1 
                        ? countryNames[0]
                        : countryNames.length === 2
                          ? countryNames.join(' & ')
                          : `${countryNames.slice(0, -1).join(', ')} & ${countryNames[countryNames.length - 1]}`
                      : '';

                    return (
                      <div 
                        key={index}
                        style={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          overflow: 'hidden',
                          boxShadow: 'var(--shadow-card)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => navigateToHike(hikeData.title)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px)';
                          e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)';
                          // Change title color
                          const title = e.currentTarget.querySelector('h4');
                          if (title) {
                            title.style.color = 'var(--ds-primary)';
                          }
                          // Scale the image but keep it contained
                          const img = e.currentTarget.querySelector('img');
                          if (img) {
                            img.style.transform = 'scale(1.05)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                          // Reset title color
                          const title = e.currentTarget.querySelector('h4');
                          if (title) {
                            title.style.color = 'var(--ds-foreground)';
                          }
                          // Reset image scale
                          const img = e.currentTarget.querySelector('img');
                          if (img) {
                            img.style.transform = 'scale(1)';
                          }
                        }}
                      >
                        <div style={{ 
                          display: 'flex', 
                          flexDirection: isMobile ? 'column' : 'row',
                          minHeight: isMobile ? 'auto' : '240px' 
                        }}>
                          {isMobile ? (
                            // MOBILE LAYOUT: Country → Title → Image → Description → Details → Button
                            <div style={{ 
                              padding: 'var(--space-lg)', 
                              display: 'flex',
                              flexDirection: 'column',
                              textAlign: 'center'
                            }}>
                              {/* Country */}
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-xs)',
                                justifyContent: 'center',
                                marginBottom: 'var(--space-sm)',
                                color: 'var(--ds-muted-foreground)',
                                fontSize: '0.8rem'
                              }}>
                                <MapPin size={12} />
                                <span>{countryDisplay}</span>
                              </div>
                              
                              {/* Title */}
                              <h4 style={{
                                fontSize: 'var(--text-lg)',
                                fontWeight: 600,
                                color: 'var(--ds-foreground)',
                                marginBottom: 'var(--space-md)',
                                lineHeight: 1.3,
                                transition: 'color 0.3s ease'
                              }}>
                                {hikeData.title}
                              </h4>

                              {/* Image */}
                              <div style={{ 
                                position: 'relative', 
                                width: '100%', 
                                height: '200px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                marginBottom: 'var(--space-md)'
                              }}>
                                <Image 
                                  src={getHikeImageUrl(hikeData)}
                                  alt={hikeData.title}
                                  fill
                                  style={{ 
                                    objectFit: 'cover', 
                                    transition: 'transform 0.5s ease'
                                  }}
                                />
                                <div style={{
                                  position: 'absolute',
                                  inset: 0,
                                  background: 'rgba(0, 0, 0, 0.1)',
                                }} />
                              </div>
                              
                              {/* Description */}
                              <p style={{
                                color: 'var(--ds-muted-foreground)',
                                fontSize: 'var(--text-sm)',
                                marginBottom: 'var(--space-md)',
                                lineHeight: 1.5
                              }}>
                                {getDescriptionPreview(hikeData.Description) || "Experience this incredible multi-day journey through stunning landscapes."}
                              </p>
                              
                              {/* Details - Single Column */}
                              <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: '1fr',
                                gap: 'var(--space-sm)',
                                marginBottom: 'var(--space-lg)'
                              }}>
                                {hikeData.Length && (
                                  <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 'var(--space-xs)',
                                    justifyContent: 'center'
                                  }}>
                                    <Route style={{ width: '14px', height: '14px', color: 'var(--ds-muted-foreground)' }} />
                                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ds-muted-foreground)' }}>
                                      {hikeData.Length} km
                                    </span>
                                  </div>
                                )}
                                {hikeData.Difficulty && (
                                  <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 'var(--space-xs)',
                                    justifyContent: 'center'
                                  }}>
                                    <TrendingUp style={{ width: '14px', height: '14px', color: 'var(--ds-muted-foreground)' }} />
                                    <span style={{ 
                                      fontSize: 'var(--text-sm)', 
                                      fontWeight: 500,
                                      color: 'var(--ds-muted-foreground)'
                                    }}>
                                      {hikeData.Difficulty}
                                    </span>
                                  </div>
                                )}
                                {hikeData.Best_time && (
                                  <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 'var(--space-xs)',
                                    justifyContent: 'center'
                                  }}>
                                    <Calendar style={{ width: '14px', height: '14px', color: 'var(--ds-muted-foreground)' }} />
                                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ds-muted-foreground)' }}>
                                      {hikeData.Best_time}
                                    </span>
                                  </div>
                                )}
                              </div>                              
                              {/* Learn More Button */}
                              <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <span style={{
                                  fontSize: 'var(--text-sm)',
                                  color: 'var(--ds-primary)',
                                  fontWeight: 600,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 'var(--space-xs)',
                                  padding: 'var(--space-xs) var(--space-md)',
                                  borderRadius: '6px',
                                  border: '1px solid var(--ds-primary)',
                                  transition: 'all 0.2s ease'
                                }}>
                                  Learn More
                                  <ChevronRight style={{ width: '14px', height: '14px' }} />
                                </span>
                              </div>
                            </div>
                          ) : (
                            // DESKTOP LAYOUT: Keep existing side-by-side layout
                            <>
                              {/* Image Section - Left Side (40%) */}
                              <div style={{ 
                                position: 'relative', 
                                width: '40%', 
                                flexShrink: 0,
                                overflow: 'hidden'
                              }}>
                                <Image 
                                  src={getHikeImageUrl(hikeData)}
                                  alt={hikeData.title}
                                  fill
                                  style={{ 
                                    objectFit: 'cover', 
                                    transition: 'transform 0.5s ease'
                                  }}
                                />
                                <div style={{
                                  position: 'absolute',
                                  inset: 0,
                                  background: 'rgba(0, 0, 0, 0.1)',
                                }} />
                              </div>
                              
                              {/* Content Section - Right Side (60%) */}
                              <div style={{ 
                                padding: 'var(--space-xl)', 
                                display: 'flex', 
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                flex: 1
                              }}>
                                {/* Header */}
                                <div>
                                  {/* Country */}
                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-xs)',
                                    marginBottom: 'var(--space-sm)',
                                    color: 'var(--ds-muted-foreground)',
                                    fontSize: 'var(--text-sm)'
                                  }}>
                                    <MapPin size={14} />
                                    <span>{countryDisplay}</span>
                                  </div>
                                  
                                  <h4 style={{
                                    fontSize: 'var(--text-xl)',
                                    fontWeight: 600,
                                    color: 'var(--ds-foreground)',
                                    marginBottom: 'var(--space-sm)',
                                    lineHeight: 1.3,
                                    transition: 'color 0.3s ease'
                                  }}>
                                    {hikeData.title}
                                  </h4>
                                  
                                  <p style={{
                                    color: 'var(--ds-muted-foreground)',
                                    fontSize: 'var(--text-sm)',
                                    marginBottom: 'var(--space-lg)',
                                    lineHeight: 1.5
                                  }}>
                                    {getDescriptionPreview(hikeData.Description) || "Experience this incredible multi-day journey through stunning landscapes."}
                                  </p>
                                </div>
                                
                                {/* Info Grid */}
                                <div style={{ 
                                  display: 'grid', 
                                  gridTemplateColumns: '1fr 1fr', 
                                  gap: 'var(--space-md)',
                                  marginBottom: 'var(--space-lg)'
                                }}>
                                  {hikeData.Length && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                                      <Route style={{ width: '14px', height: '14px', color: 'var(--ds-muted-foreground)' }} />
                                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ds-muted-foreground)' }}>
                                        {hikeData.Length} km
                                      </span>
                                    </div>
                                  )}
                                  {hikeData.Difficulty && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                                      <TrendingUp style={{ width: '14px', height: '14px', color: 'var(--ds-muted-foreground)' }} />
                                      <span style={{ 
                                        fontSize: 'var(--text-sm)', 
                                        fontWeight: 500,
                                        color: 'var(--ds-muted-foreground)'
                                      }}>
                                        {hikeData.Difficulty}
                                      </span>
                                    </div>
                                  )}
                                  {hikeData.Best_time && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                                      <Calendar style={{ width: '14px', height: '14px', color: 'var(--ds-muted-foreground)' }} />
                                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ds-muted-foreground)' }}>
                                        {hikeData.Best_time}
                                      </span>
                                    </div>
                                  )}
                                </div>                                
                                {/* Learn More Button */}
                                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                  <span style={{
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--ds-primary)',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-xs)',
                                    padding: 'var(--space-xs) var(--space-md)',
                                    borderRadius: '6px',
                                    border: '1px solid var(--ds-primary)',
                                    transition: 'all 0.2s ease'
                                  }}>
                                    Learn More
                                    <ChevronRight style={{ width: '14px', height: '14px' }} />
                                  </span>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Email Capture */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: 'var(--space-3xl)',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: 'var(--shadow-card)',
              marginBottom: 'var(--space-3xl)'
            }}>
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '64px',
                  height: '64px',
                  background: 'var(--ds-primary)',
                  borderRadius: '50%',
                  marginBottom: 'var(--space-xl)'
                }}>
                  <Download style={{ width: '32px', height: '32px', color: 'var(--ds-primary-foreground)' }} />
                </div>
                
                <h3 style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                  fontWeight: 700,
                  color: 'var(--ds-foreground)',
                  marginBottom: 'var(--space-lg)',
                  whiteSpace: 'nowrap'
                }}>
                  Download Guide
                </h3>
                
                <p style={{
                  color: 'var(--ds-muted-foreground)',
                  marginBottom: 'var(--space-2xl)',
                  lineHeight: 1.6
                }}>
                  Download our comprehensive PDF guide for {result.name}, including day-by-day itinerary, packing checklist, and insider tips.
                </p>
                
                {!emailSubmitted ? (
                  <div style={{ display: 'flex', gap: 'var(--space-md)', maxWidth: '400px', margin: '0 auto' }} className="flex-col sm:flex-row">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      disabled={emailSubmitting}
                      style={{
                        flex: '1',
                        padding: 'var(--space-sm) var(--space-lg)',
                        borderRadius: '8px',
                        border: '1px solid var(--ds-border)',
                        background: 'var(--ds-background)',
                        color: 'var(--ds-foreground)',
                        fontSize: 'var(--text-base)',
                        height: '44px'
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleEmailSubmit();
                        }
                      }}
                    />
                    <button
                      onClick={handleEmailSubmit}
                      disabled={emailSubmitting || !email.includes('@')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-sm)',
                        background: 'var(--ds-primary)',
                        color: 'var(--ds-primary-foreground)',
                        padding: 'var(--space-sm) var(--space-lg)',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: 'var(--text-base)',
                        fontWeight: 600,
                        cursor: emailSubmitting ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        opacity: (emailSubmitting || !email.includes('@')) ? 0.6 : 1,
                        height: '44px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {emailSubmitting ? (
                        <div className="loading-spinner" style={{ height: '20px', width: '20px' }}></div>
                      ) : (
                        <Mail style={{ height: '20px', width: '20px' }} />
                      )}
                      <span>{emailSubmitting ? 'Sending...' : 'Download Guide'}</span>
                    </button>
                  </div>
                ) : (
                  <div style={{
                    background: 'var(--ds-muted)',
                    border: '1px solid var(--ds-border)',
                    borderRadius: '12px',
                    padding: 'var(--space-lg)',
                    color: 'var(--ds-primary)'
                  }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>
                      ✓ Success! Check your email for your planning guide.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Retake Quiz */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={resetQuiz}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: 'var(--ds-foreground)',
                  padding: 'var(--space-md) var(--space-2xl)',
                  borderRadius: '8px',
                  border: '1px solid var(--ds-border)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--ds-muted)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                }}
              >
                Take Quiz Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background with smooth transitions */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url(${getCurrentBackground()})` }}
      >
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />
      </div>
      
      {/* Content */}
      <div className={`relative z-10 min-h-screen flex flex-col py-8 ${isMobile ? 'px-2' : 'px-4'}`}>
        
        {currentQuestion >= 0 && (
          /* Progress Header - Only show during questions */
          <div className="max-w-4xl mx-auto w-full mb-8">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-sm)'
            }}>
            <span style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--ds-accent)'
            }}>
              {Math.round(progress)}% Complete
            </span>
            </div>
            <div style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              height: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'var(--ds-accent)',
                height: '8px',
                borderRadius: '4px',
                width: `${progress}%`,
                transition: 'width 0.5s ease'
              }}></div>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className={`${isMobile ? 'max-w-full' : 'max-w-4xl'} mx-auto w-full`}>
            
            {currentQuestion === -1 ? (
              /* Start Screen */
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: 'var(--space-3xl)',
                textAlign: 'center',
                boxShadow: 'var(--shadow-float)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ marginBottom: 'var(--space-2xl)' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: isMobile ? '56px' : '64px',
                    height: isMobile ? '56px' : '64px',
                    background: 'var(--gradient-hero)',
                    borderRadius: '50%',
                    marginBottom: 'var(--space-xl)',
                    boxShadow: 'var(--shadow-glow)'
                  }}>
                    <Mountain style={{ width: '32px', height: '32px', color: 'var(--ds-primary-foreground)' }} />
                  </div>
                  
                  <h1 style={{
                    fontSize: isMobile ? 'clamp(1.5rem, 8vw, 2.25rem)' : 'clamp(2rem, 5vw, 3rem)',
                    fontWeight: 700,
                    color: 'var(--ds-foreground)',
                    marginBottom: 'var(--space-lg)'
                  }}>
                    Find Your Perfect
                    <span style={{
                      display: 'block',
                      background: 'var(--gradient-hero)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      Multi-Day Hike
                    </span>
                  </h1>
                  
                  <p style={{
                    fontSize: 'var(--text-lg)',
                    color: 'var(--ds-muted-foreground)',
                    lineHeight: 1.6,
                    marginBottom: 'var(--space-2xl)',
                    maxWidth: '600px',
                    margin: '0 auto var(--space-2xl)'
                  }}>
                    Discover your ideal trail match through our expertly crafted quiz. 
                    Whether you're dreaming of coastal paths, alpine adventures, or 
                    cultural pilgrimages, we'll guide you to your perfect hiking experience.
                  </p>
                </div>
                
                <div style={{ marginBottom: 'var(--space-xl)' }}>
                  <button 
                    className="btn-primary"
                    style={{ fontSize: 'var(--text-lg)', padding: 'var(--space-lg) var(--space-3xl)' }}
                    onClick={() => setCurrentQuestion(0)}
                  >
                    <span>Start Your Adventure</span>
                    <ChevronRight style={{ height: '24px', width: '24px' }} />
                  </button>
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-md)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--ds-muted-foreground)'
                }} className="sm:flex-row">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      background: 'var(--ds-accent)',
                      borderRadius: '50%'
                    }}></span>
                    5 Quick Questions
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      background: 'var(--ds-primary)',
                      borderRadius: '50%'
                    }}></span>
                    Personalized Results
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      background: 'var(--ds-accent)',
                      borderRadius: '50%'
                    }}></span>
                    Expert Recommendations
                  </span>
                </div>
              </div>
            ) : (
              /* Question Screen */
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: isMobile ? 'var(--space-xl)' : 'var(--space-3xl)',  // Reduced mobile padding
                boxShadow: 'var(--shadow-float)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h2 style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                  fontWeight: 700,
                  color: 'var(--ds-foreground)',
                  marginBottom: 'var(--space-2xl)',
                  lineHeight: 1.3
                }}>
                  {questions[currentQuestion].question}
                </h2>
                
<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  {questions[currentQuestion].answers.map((answer, index) => {
                    const isSelected = selectedAnswer === answer.text;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedAnswer(answer.text)}
                        style={{
                          width: '100%',
                          padding: isMobile ? 'var(--space-md)' : 'var(--space-lg)',
                          textAlign: 'left',
                          background: isSelected ? 'var(--ds-muted)' : 'var(--ds-off-white)',
                          border: isSelected ? '2px solid var(--ds-primary)' : '2px solid var(--ds-border)',
                          borderRadius: '12px',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                          fontSize: 'var(--text-base)',
                          lineHeight: 1.5,
                          color: 'var(--ds-foreground)',
                          fontFamily: 'inherit',
                          outline: 'none',
                          boxShadow: isSelected ? 'var(--shadow-soft)' : 'none',
                          transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = 'var(--ds-primary)';
                            e.currentTarget.style.background = 'var(--ds-muted)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = 'var(--ds-border)';
                            e.currentTarget.style.background = 'var(--ds-off-white)';
                          }
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: isMobile ? 'var(--space-sm)' : 'var(--space-lg)', width: '100%' }}>
                          {/* Clean radio button */}
                          <div style={{
                            width: isMobile ? '20px' : '24px',
                            height: isMobile ? '20px' : '24px',
                            borderRadius: '50%',
                            backgroundColor: isSelected ? 'var(--ds-primary)' : 'transparent',
                            border: `2px solid ${isSelected ? 'var(--ds-primary)' : 'var(--ds-muted-foreground)'}`,
                            flexShrink: 0,
                            marginTop: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                          }}>
                            {isSelected && (
                              <div style={{
                                width: isMobile ? '6px' : '8px',
                                height: isMobile ? '6px' : '8px',
                                backgroundColor: 'var(--ds-primary-foreground)',
                                borderRadius: '50%'
                              }} />
                            )}
                          </div>
                          <p style={{ 
                            fontSize: 'var(--text-base)', 
                            lineHeight: 1.6, 
                            color: 'var(--ds-foreground)',
                            margin: 0,
                            flex: 1,
                            minWidth: 0
                          }}>
                            {answer.text}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation - Only show during questions */}
        {currentQuestion >= 0 && (
          <div className="max-w-4xl mx-auto w-full mt-8">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button 
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                disabled={currentQuestion === 0}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-sm)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: currentQuestion === 0 ? 'rgba(255, 255, 255, 0.4)' : 'var(--ds-primary-foreground)',
                  padding: 'var(--space-md) var(--space-xl)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 600,
                  cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <ArrowLeft style={{ height: '16px', width: '16px' }} />
                Back
              </button>
              
              <button 
                onClick={() => {
                  if (selectedAnswer) {
                    const answer = questions[currentQuestion].answers.find(a => a.text === selectedAnswer);
                    if (answer) {
                      handleAnswer(answer);
                    }
                  }
                }}
                disabled={!selectedAnswer}
                className="btn-primary"
                style={{
                  opacity: !selectedAnswer ? 0.6 : 1,
                  cursor: !selectedAnswer ? 'not-allowed' : 'pointer'
                }}
              >
                {currentQuestion === questions.length - 1 ? 'See Results' : 'Next'}
                <ChevronRight style={{ height: '16px', width: '16px' }} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrailheadQuiz;
