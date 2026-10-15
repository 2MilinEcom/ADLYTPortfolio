import React from 'react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: 'home' | 'library' | 'metrics' | 'stars' | 'upload') => void;
}

const Navigation = ({ currentPage, onPageChange }: NavigationProps) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 12l9-8 9 8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 21V9h6v12" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )},
    { id: 'library', label: 'Library', icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="2"/>
        <path d="M8 4v16"/>
        <path d="M16 4v16"/>
      </svg>
    )},
    { id: 'metrics', label: 'Metrics', icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="12" width="4" height="8" rx="1"/>
        <rect x="9" y="8" width="4" height="12" rx="1"/>
        <rect x="15" y="4" width="4" height="16" rx="1"/>
      </svg>
    )},
    { id: 'stars', label: 'Stars', icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" strokeLinejoin="round" strokeLinecap="round"/>
      </svg>
    )},
  ];

  return (
    <nav 
      className="sticky top-0 z-50 w-full h-16 flex items-center px-8" 
      style={{
        background: '#181818', 
        boxShadow: '0 2px 8px #333333', 
        height: '64px', 
        padding: '0 32px'
      }}
    >
      {/* Navigation Icons on the left */}
      <div className="flex gap-6 items-center">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id as any)}
            style={{transition: 'transform 0.2s ease'}} 
            aria-label={item.label}
            className={`p-2 rounded-lg transition-all duration-200 ${
              currentPage === item.id
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            {item.icon}
          </button>
        ))}
      </div>

      {/* Upload Button on the right */}
      <div className="flex-1 flex justify-end">
        <button
          onClick={() => onPageChange('upload')}
          style={{transition: 'transform 0.2s ease'}} 
          aria-label="Upload Information"
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            currentPage === 'upload'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white hover:scale-105'
          }`}
        >
          <svg 
            width="20" 
            height="20" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            viewBox="0 0 24 24"
            className="transition-transform duration-200 hover:scale-110"
          >
            <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-medium">Upload</span>
        </button>
      </div>

      <style>{`
        nav button:hover svg { transform: scale(1.1); }
        nav button svg { transition: transform 0.2s ease; }
      `}</style>
    </nav>
  );
};

export default Navigation;
