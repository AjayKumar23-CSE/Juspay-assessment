import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MidArea from './components/MidArea';
import PreviewArea from './components/PreviewArea';

export default function App() {
  const [hasSwappedOnCollision, setHasSwappedOnCollision] = useState(false);

  const [sprites, setSprites] = useState([
    { 
      id: 1, 
      name: 'Sprite1', 
      x: 100, 
      y: 100, 
      rotation: 0, 
      blocks: [],
      say: null,
      think: null,
      collision: false,
      collidingWith: [],
      isAnimating: false,
    }
  ]);
  const [blockValues, setBlockValues] = useState({
    moveSteps: 10,
    turnDegrees: 15,
    gotoX: 0,
    gotoY: 0,
    repeatCount: 10
  });
  const [activeSprite, setActiveSprite] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationQueue, setAnimationQueue] = useState([]);
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);
  
  const addSprite = () => {
    const newId = sprites.length > 0 ? Math.max(...sprites.map(s => s.id)) + 1 : 1;
    setSprites([
      ...sprites,
      { 
        id: newId, 
        name: `Sprite${newId}`, 
        x: 150, 
        y: 150, 
        rotation: 0, 
        blocks: [],
        say: null,
        think: null,
        collision: false,
        collidingWith: [],
        isAnimating: false
      }
    ]);
    setActiveSprite(newId);
  };

  const checkCollisions = () => {
    if (sprites.length < 2) return false;
    
    let collisionDetected = false;
    const collisionPairs = new Set();
    
    for (let i = 0; i < sprites.length; i++) {
      for (let j = i + 1; j < sprites.length; j++) {
        const sprite1 = sprites[i];
        const sprite2 = sprites[j];
        
        const dx = sprite1.x - sprite2.x;
        const dy = sprite1.y - sprite2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const collisionThreshold = 50;
        
        if (distance < collisionThreshold) {
          const pairKey = `${Math.min(sprite1.id, sprite2.id)}-${Math.max(sprite1.id, sprite2.id)}`;
          
          if (!collisionPairs.has(pairKey)) {
            collisionDetected = true;
            collisionPairs.add(pairKey);
  
            setSprites(prevSprites => {
              return prevSprites.map(sprite => {
                if (sprite.id === sprite1.id) {
                  return {
                    ...sprite,
                    collidingWith: [...new Set([...(sprite.collidingWith || []), sprite2.id])],
                    collision: true
                  };
                }
                if (sprite.id === sprite2.id) {
                  return {
                    ...sprite,
                    collidingWith: [...new Set([...(sprite.collidingWith || []), sprite1.id])],
                    collision: true
                  };
                }
                return sprite;
              });
            });
            
            setSprites(prevSprites => {
              const newSprites = [...prevSprites];
              const sprite1Index = newSprites.findIndex(s => s.id === sprite1.id);
              const sprite2Index = newSprites.findIndex(s => s.id === sprite2.id);
              
              [newSprites[sprite1Index].blocks, newSprites[sprite2Index].blocks] = 
                [newSprites[sprite2Index].blocks, newSprites[sprite1Index].blocks];
              
              return newSprites;
            });
          }
        } else {
          if (sprite1.collidingWith?.includes(sprite2.id) || 
              sprite2.collidingWith?.includes(sprite1.id)) {
            setSprites(prevSprites => {
              return prevSprites.map(sprite => {
                if (sprite.id === sprite1.id) {
                  const newCollidingWith = sprite.collidingWith?.filter(id => id !== sprite2.id);
                  return {
                    ...sprite,
                    collidingWith: newCollidingWith,
                    collision: newCollidingWith?.length > 0
                  };
                }
                if (sprite.id === sprite2.id) {
                  const newCollidingWith = sprite.collidingWith?.filter(id => id !== sprite1.id);
                  return {
                    ...sprite,
                    collidingWith: newCollidingWith,
                    collision: newCollidingWith?.length > 0
                  };
                }
                return sprite;
              });
            });
          }
        }
      }
    }
    
    return collisionDetected;
  };
  
  const prepareAnimationQueue = () => {
    const queue = [];
    
    sprites.forEach(sprite => {
      const spriteQueue = [];
      let i = 0;
      
      while (i < sprite.blocks.length) {
        const block = sprite.blocks[i];
        
        if (block.type === 'repeat') {
          const repeatCount = block.values?.count || blockValues.repeatCount;
          const repeatedBlocks = [];
          
          let j = i + 1;
          let depth = 1;
          while (j < sprite.blocks.length && depth > 0) {
            if (sprite.blocks[j].type === 'repeat') depth++;
            if (sprite.blocks[j].type === 'endRepeat') depth--;
            if (depth > 0) repeatedBlocks.push(sprite.blocks[j]);
            j++;
          }
          
          for (let k = 0; k < repeatCount; k++) {
            spriteQueue.push(...repeatedBlocks);
          }
          
          i = j; 
        } else if (block.type !== 'endRepeat') { // Skip endRepeat blocks
          spriteQueue.push(block);
          i++;
        } else {
          i++;
        }
      }
      
      queue.push(spriteQueue);
    });
    
    // Interleave the sprite queues
    const maxLength = Math.max(...queue.map(q => q.length));
    const interleavedQueue = [];
    
    for (let i = 0; i < maxLength; i++) {
      const step = queue.map(q => q[i] || null);
      interleavedQueue.push(step);
    }
    
    return interleavedQueue;
  };
  const handlePlay = () => {
    if (isPlaying) return;
    const queue = prepareAnimationQueue();
    setAnimationQueue(queue);
    setCurrentAnimationIndex(0);
    setIsPlaying(true);
    setHasSwappedOnCollision(false);
  };

 
  useEffect(() => {
    if (!isPlaying || currentAnimationIndex >= animationQueue.length) {
      if (isPlaying) {
        const hadCollision = checkCollisions();
        setIsPlaying(false);
      }
      return;
    }
  
    const currentStep = animationQueue[currentAnimationIndex];
    const animationDuration = 500;
  
    setSprites(prevSprites => {
      return prevSprites.map((sprite, index) => {
        const block = currentStep[index];
        if (!block) return sprite;
  
        let newX = sprite.x;
        let newY = sprite.y;
        let newRotation = sprite.rotation;
        let sayText = null;
        let thinkText = null;
        let isAnimating = true;
  
        switch(block.type) {
          case 'move':
            const steps = block.values?.steps || blockValues.moveSteps;
            const radians = (sprite.rotation * Math.PI) / 180;
            newX += Math.sin(radians) * steps;
            newY -= Math.cos(radians) * steps;
            break;
          case 'turn':
            const degrees = block.values?.degrees || blockValues.turnDegrees;
            newRotation += degrees;
            break;
          case 'goto':
            newX = block.values?.x || blockValues.gotoX;
            newY = block.values?.y || blockValues.gotoY;
            break;
            case 'say':
              sayText = block.values?.text || "Hello!";
              setTimeout(() => {
                setSprites(prev => prev.map(s => {
                  if (s.id === sprite.id) return {...s, say: null};
                  return s;
                }));
              }, (block.values?.seconds || 2) * 1000);
              break;
              case 'think':
                thinkText = block.values?.text || "Hmm...";
                setTimeout(() => {
                  setSprites(prev => prev.map(s => {
                    if (s.id === sprite.id) return {...s, think: null};
                    return s;
                  }));
                }, (block.values?.seconds || 2) * 1000);
                break;
          default:
            isAnimating = false;
            break;
        }
  
        return {
          ...sprite,
          x: newX,
          y: newY,
          rotation: newRotation,
          say: sayText,
          think: thinkText,
          isAnimating
        };
      });
    });
  
    const timer = setTimeout(() => {
      setCurrentAnimationIndex(prev => prev + 1);
    }, animationDuration);
  
    return () => clearTimeout(timer);
  }, [isPlaying, currentAnimationIndex, animationQueue]);

  const addBlockToSprite = (spriteId, block) => {
    setSprites(prevSprites => {
      return prevSprites.map(sprite => {
        if (sprite.id === spriteId) {
          const newBlock = block.type === 'repeat' ? {
            ...block,
            values: { count: block.values?.count || blockValues.repeatCount }
          } : block;
          
          return {
            ...sprite,
            blocks: [...sprite.blocks, newBlock]
          };
        }
        return sprite;
      });
    });
  };
  const removeBlockFromSprite = (spriteId, blockIndex) => {
    setSprites(prevSprites => {
      return prevSprites.map(sprite => {
        if (sprite.id === spriteId) {
          const newBlocks = [...sprite.blocks];
          newBlocks.splice(blockIndex, 1);
          return {
            ...sprite,
            blocks: newBlocks
          };
        }
        return sprite;
      });
    });
  };

  const handleSpriteDrag = (spriteId, newX, newY) => {
    setSprites(prevSprites => {
      return prevSprites.map(sprite => {
        if (sprite.id === spriteId) {
          return {
            ...sprite,
            x: newX,
            y: newY
          };
        }
        return sprite;
      });
    });
  };

  return (
    <div className="bg-blue-100 pt-6 font-sans">
      <div className="h-screen overflow-hidden flex flex-row">
        <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar 
            onAddSprite={addSprite} 
            onPlay={handlePlay}
            isPlaying={isPlaying}
          />
          <MidArea 
            sprites={sprites} 
            activeSprite={activeSprite}
            setActiveSprite={setActiveSprite}
            addBlockToSprite={addBlockToSprite}
            removeBlockFromSprite={removeBlockFromSprite}
          />
        </div>
        <div className="w-1/3 h-screen overflow-hidden flex flex-col bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
          <PreviewArea 
            sprites={sprites} 
            isPlaying={isPlaying}
            activeSprite={activeSprite}
            onSpriteDrag={handleSpriteDrag}
          />
          <SpriteThumbnails 
            sprites={sprites}
            activeSprite={activeSprite}
            setActiveSprite={setActiveSprite}
            onAddSprite={addSprite}
          />
        </div>
      </div>
    </div>
  );
}

const SpriteThumbnails = ({ sprites, activeSprite, setActiveSprite, onAddSprite }) => {
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
            } relative`}
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
              {sprite.isAnimating && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              )}
              {sprite.collision && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </div>
            <span className="text-xs text-center mt-1">{sprite.name}</span>
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


