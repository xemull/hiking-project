// src/app/components/BlogList.tsx
'use client';

import { ExternalLink } from 'lucide-react';

interface Blog {
  id: number;
  title: string;
  url: string;
}

interface BlogListProps {
  blogs: Blog[];
}

export default function BlogList({ blogs }: BlogListProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {blogs.map((blog, index) => (
        <div 
          key={blog.id} 
          style={{ 
            borderBottom: index < blogs.length - 1 ? '1px solid #f1f5f9' : 'none', 
            paddingBottom: index < blogs.length - 1 ? '1rem' : '0',
            marginBottom: index < blogs.length - 1 ? '1rem' : '0'
          }}
        >
          <a 
            href={blog.url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: 'var(--ds-foreground)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              lineHeight: 1.4,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--ds-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--ds-foreground)';
            }}
          >
            <ExternalLink size={16} style={{ marginTop: '0.1rem', flexShrink: 0 }} />
            <span>{blog.title}</span>
          </a>
        </div>
      ))}
    </div>
  );
}