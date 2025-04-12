import React from "react";

export const SpriteThumbnails = ({ sprites, activeSprite, setActiveSprite, onAddSprite }) => {
    return (
      <div className="border-t border-gray-200 p-4 overflow-y-auto">
        <h3 className="font-bold text-gray-700 mb-2">Sprites</h3>
        <div className="grid grid-cols-3 gap-2">
          {sprites.map(sprite => (
            <div 
              key={sprite.id}
              onClick={() => setActiveSprite(sprite.id)}
              className={`p-2 rounded cursor-pointer flex flex-col items-center ${
                activeSprite === sprite.id ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
            >
              <div className="w-12 h-12 relative">
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: '#FFAB19',
                  borderRadius: '50%',
                  border: '2px solid #000',
                  position: 'relative'
                }}>
                  {/* Simple cat face for thumbnail */}
                  <div style={{
                    position: 'absolute',
                    width: '8px',
                    height: '8px',
                    background: '#000',
                    borderRadius: '50%',
                    top: '30%',
                    left: '30%'
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    width: '8px',
                    height: '8px',
                    background: '#000',
                    borderRadius: '50%',
                    top: '30%',
                    left: '60%'
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    width: '20px',
                    height: '2px',
                    background: '#000',
                    top: '50%',
                    left: '40%',
                    transform: 'translateX(-50%)'
                  }}></div>
                </div>
              </div>
              <span className="text-xs text-center mt-1">{sprite.name}</span>
              {sprite.isAnimating && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              )}
            </div>
          ))}
          <div 
            className="p-2 rounded cursor-pointer flex flex-col items-center hover:bg-gray-100"
            onClick={onAddSprite}
          >
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-1">
              <span className="text-gray-500">+</span>
            </div>
            <span className="text-xs text-center">New Sprite</span>
          </div>
        </div>
      </div>
    );
  };