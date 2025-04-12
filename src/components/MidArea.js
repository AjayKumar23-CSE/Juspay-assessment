import React from 'react';
import Icon from './Icon';

export default function MidArea({ 
  sprites, 
  activeSprite, 
  setActiveSprite, 
  addBlockToSprite,
  removeBlockFromSprite
}) {
  const activeSpriteData = sprites.find(s => s.id === activeSprite);

  const handleDrop = (e) => {
    e.preventDefault();
    const block = JSON.parse(e.dataTransfer.getData('block'));
    
    if (block.type === 'repeat') {
      const repeatBlock = {
        ...block,
        type: 'repeat',
        blocks: [] 
      };
      
      addBlockToSprite(activeSprite, repeatBlock);
    } else {
      // Regular block
      addBlockToSprite(activeSprite, block);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div 
      className="flex-1 h-full overflow-auto p-4"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          {activeSpriteData?.name || 'No sprite selected'}
        </h2>
      </div>

      <div className="min-h-32 bg-gray-50 rounded-lg p-4 border border-dashed border-gray-300">
        {activeSpriteData?.blocks?.length > 0 ? (
          <div className="space-y-2">
            {activeSpriteData.blocks.map((block, index) => (
              <div 
                key={index}
                className={`flex items-center px-3 py-2 rounded text-white ${
                  block.category === 'motion' ? 'bg-blue-500' : 
                  block.category === 'looks' ? 'bg-purple-500' : 
                  block.type === 'endRepeat' ? 'bg-red-500' : 'bg-yellow-500'
                }`}
              >
                <Icon name={block.icon} size={15} className="mr-2" />
                {block.type === 'repeat' ? `repeat ${block.values?.count || blockValues.repeatCount}` : block.text}
                <button 
                  onClick={() => removeBlockFromSprite(activeSprite, index)}
                  className="ml-auto text-xs bg-white bg-opacity-20 rounded-full w-5 h-5"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">
            Drag blocks here to build your script
          </p>
        )}
      </div>
    </div>
  );
}