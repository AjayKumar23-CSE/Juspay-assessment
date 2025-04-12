
import React, { useState } from 'react';
import Icon from './Icon';

export default function Sidebar({ onAddSprite, onPlay, isPlaying }) {
  const [blockValues, setBlockValues] = useState({
    moveSteps: 10,
    turnDegrees: 15,
    gotoX: 0,
    gotoY: 0,
    sayText: "Hello!",
    saySeconds: 2,
    thinkText: "Hmm...",
    thinkSeconds: 2,
    repeatCount: 10
  });

  const [editingField, setEditingField] = useState(null);

  const handleValueChange = (field, value) => {
    setBlockValues(prev => ({ ...prev, [field]: value }));
    setEditingField(null);
  };

  const motionBlocks = [
    { 
      type: 'move', 
      text: `move ${blockValues.moveSteps} steps`, 
      icon: 'arrow-right', 
      category: 'motion',
      editableField: 'moveSteps'
    },
    { 
      type: 'turn', 
      text: `turn ${blockValues.turnDegrees} degrees`, 
      icon: 'undo', 
      category: 'motion',
      editableField: 'turnDegrees'
    },
    { 
      type: 'goto', 
      text: `go to x: ${blockValues.gotoX} y: ${blockValues.gotoY}`, 
      icon: 'location-marker', 
      category: 'motion',
      editableFields: ['gotoX', 'gotoY']
    }
  ];

  const looksBlocks = [
    { 
      type: 'say', 
      text: `say ${blockValues.sayText} for ${blockValues.saySeconds} seconds`, 
      icon: 'chat', 
      category: 'looks',
      editableFields: ['sayText', 'saySeconds']
    },
    { 
      type: 'think', 
      text: `think ${blockValues.thinkText} for ${blockValues.thinkSeconds} seconds`, 
      icon: 'light-bulb', 
      category: 'looks',
      editableFields: ['thinkText', 'thinkSeconds']
    }
  ];

  const controlBlocks = [
    { 
      type: 'repeat', 
      text: `repeat ${blockValues.repeatCount}`, 
      icon: 'refresh', 
      category: 'control',
      editableField: 'repeatCount'
    },
    { 
      type: 'endRepeat', 
      text: 'end repeat', 
      icon: 'ban', 
      category: 'control'
    }
  ];
  const renderEditableValue = (value, field) => {
    if (editingField === field) {
      return (
        <input
          type={field.includes('Text') ? 'text' : 'number'}
          value={value}
          onChange={(e) => setBlockValues(prev => ({
            ...prev,
            [field]: field.includes('Text') ? e.target.value : parseInt(e.target.value) || 0
          }))}
          onBlur={() => setEditingField(null)}
          onKeyPress={(e) => e.key === 'Enter' && setEditingField(null)}
          autoFocus
          className="w-16 bg-white text-black rounded px-1 inline-block mx-1"
        />
      );
    }
    return (
      <span 
        onClick={() => setEditingField(field)}
        className="underline cursor-pointer mx-1"
      >
        {value}
      </span>
    );
  };

  const renderBlockText = (block) => {
    if (block.editableField) {
      const parts = block.text.split(String(blockValues[block.editableField]));
      return (
        <>
          {parts[0]}
          {renderEditableValue(blockValues[block.editableField], block.editableField)}
          {parts[1]}
        </>
      );
    }

    if (block.editableFields) {
      if (block.type === 'goto') {
        return (
          <>
            go to x: {renderEditableValue(blockValues.gotoX, 'gotoX')} y: {renderEditableValue(blockValues.gotoY, 'gotoY')}
          </>
        );
      }
      if (block.type === 'say') {
        return (
          <>
            say {renderEditableValue(blockValues.sayText, 'sayText')} for {renderEditableValue(blockValues.saySeconds, 'saySeconds')} seconds
          </>
        );
      }
      if (block.type === 'think') {
        return (
          <>
            think {renderEditableValue(blockValues.thinkText, 'thinkText')} for {renderEditableValue(blockValues.thinkSeconds, 'thinkSeconds')} seconds
          </>
        );
      }
    }

    return block.text;
  };

  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
      <button 
        onClick={onAddSprite}
        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mb-4 flex items-center"
      >
        <Icon name="plus" size={15} className="mr-2" />
        Add Sprite
      </button>

      <button 
        onClick={onPlay}
        disabled={isPlaying}
        className={`${isPlaying ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white px-3 py-1 rounded mb-4 flex items-center`}
      >
        <Icon name="play" size={15} className="mr-2" />
        {isPlaying ? 'Playing...' : 'Play'}
      </button>

      <div className="font-bold text-gray-700 mb-2">Motion</div>
      {motionBlocks.map((block, index) => (
        <div 
          key={`motion-${index}`}
          draggable
          onDragStart={(e) => {
            const blockData = {
              ...block,
              values: {
                steps: blockValues.moveSteps,
                degrees: blockValues.turnDegrees,
                x: blockValues.gotoX,
                y: blockValues.gotoY
              }
            };
            e.dataTransfer.setData('block', JSON.stringify(blockData));
          }}
          className="flex items-center bg-blue-500 text-white px-2 py-1 my-1 text-sm cursor-pointer rounded hover:bg-blue-600"
        >
          <Icon name={block.icon} size={15} className="mr-2" />
          {renderBlockText(block)}
        </div>
      ))}

      <div className="font-bold text-gray-700 mt-4 mb-2">Looks</div>
      {looksBlocks.map((block, index) => (
        <div 
          key={`looks-${index}`}
          draggable
          onDragStart={(e) => {
            const blockData = {
              ...block,
              values: {
                text: block.type === 'say' ? blockValues.sayText : blockValues.thinkText,
                seconds: block.type === 'say' ? blockValues.saySeconds : blockValues.thinkSeconds
              }
            };
            e.dataTransfer.setData('block', JSON.stringify(blockData));
          }}
          className="flex items-center bg-purple-500 text-white px-2 py-1 my-1 text-sm cursor-pointer rounded hover:bg-purple-600"
        >
          <Icon name={block.icon} size={15} className="mr-2" />
          {renderBlockText(block)}
        </div>
      ))}

      <div className="font-bold text-gray-700 mt-4 mb-2">Control</div>
      {controlBlocks.map((block, index) => (
        <div 
          key={`control-${index}`}
          draggable
          onDragStart={(e) => {
            const blockData = {
              ...block,
              values: block.type === 'repeat' ? { count: blockValues.repeatCount } : {}
            };
            e.dataTransfer.setData('block', JSON.stringify(blockData));
          }}
          className="flex items-center bg-yellow-500 text-white px-2 py-1 my-1 text-sm cursor-pointer rounded hover:bg-yellow-600"
        >
          <Icon name={block.icon} size={15} className="mr-2" />
          {renderBlockText(block)}
        </div>
      ))}
    </div>
  );
}
