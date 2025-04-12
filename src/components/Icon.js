import React from 'react';

export default function Icon({ name, size = 20, className = "" }) {
  const iconMap = {
    'arrow-right': '→',
    'undo': '↩',
    'redo': '↪',
    'plus': '+',
    'play': '▶',
    'chat': '💬',
    'light-bulb': '💡',
    'refresh': '🔄',
    'location-marker': '📍'
  };

  return (
    <span 
      className={`inline-block ${className}`}
      style={{ fontSize: size }}
      role="img"
      aria-label={name}
    >
      {iconMap[name] || '○'}
    </span>
  );
}