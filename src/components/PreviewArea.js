import React, { useState, useEffect } from 'react';
import CatSprite from './CatSprite';

export default function PreviewArea({ sprites, isPlaying, activeSprite, onSpriteDrag }) {
  const [dragging, setDragging] = useState(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e, spriteId) => {
    if (isPlaying) return;
    setDragging(spriteId);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!dragging || isPlaying) return;
    
    const sprite = sprites.find(s => s.id === dragging);
    if (!sprite) return;
    
    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;
    
    onSpriteDrag(dragging, sprite.x + dx, sprite.y + dy);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragging, startPos]);

  return (
    <div className="flex-1 overflow-hidden p-4">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Stage</h2>
      <div 
        className="relative w-full h-full bg-gray-100 rounded-lg border border-gray-300 overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {sprites.map(sprite => (
          <div
            key={sprite.id}
            onMouseDown={(e) => handleMouseDown(e, sprite.id)}
            style={{
              position: 'absolute',
              left: sprite.x,
              top: sprite.y,
              transform: `rotate(${sprite.rotation}deg)`,
              transformOrigin: 'center',
              transition: sprite.isAnimating ? 'all 0.5s ease' : 'none',
              cursor: isPlaying ? 'default' : 'move'
            }}
          >
            <CatSprite 
              isActive={activeSprite === sprite.id}
              say={sprite.say}
              think={sprite.think}
            />
          </div>
        ))}
      </div>
    </div>
  );
}