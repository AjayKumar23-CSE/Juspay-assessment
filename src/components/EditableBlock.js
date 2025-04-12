import React,{ useState } from 'react';

export default function EditableBlock({ type, defaultValues, onValueChange }) {
  const [values, setValues] = useState(defaultValues);
  const [editingField, setEditingField] = useState(null);

  const handleClick = (field) => {
    setEditingField(field);
  };

  const handleChange = (e, field) => {
    setValues({ ...values, [field]: parseInt(e.target.value) || 0 });
  };

  const handleBlur = () => {
    setEditingField(null);
    onValueChange(values); // Send updated values to parent
  };

  return (
    <div className="bg-blue-500 text-white p-2 rounded mb-2">
      {type === 'move' && (
        <>
          move 
          {editingField === 'steps' ? (
            <input
              type="number"
              value={values.steps}
              onChange={(e) => handleChange(e, 'steps')}
              onBlur={handleBlur}
              autoFocus
              className="w-12 text-black px-1 rounded"
            />
          ) : (
            <span 
              onClick={() => handleClick('steps')} 
              className="cursor-pointer underline"
            >
              {values.steps}
            </span>
          )}
          steps
        </>
      )}

      {type === 'goto' && (
        <>
          go to x:
          {editingField === 'x' ? (
            <input
              type="number"
              value={values.x}
              onChange={(e) => handleChange(e, 'x')}
              onBlur={handleBlur}
              autoFocus
              className="w-12 text-black px-1 rounded mx-1"
            />
          ) : (
            <span 
              onClick={() => handleClick('x')} 
              className="cursor-pointer underline mx-1"
            >
              {values.x}
            </span>
          )}
          y:
          {editingField === 'y' ? (
            <input
              type="number"
              value={values.y}
              onChange={(e) => handleChange(e, 'y')}
              onBlur={handleBlur}
              autoFocus
              className="w-12 text-black px-1 rounded ml-1"
            />
          ) : (
            <span 
              onClick={() => handleClick('y')} 
              className="cursor-pointer underline ml-1"
            >
              {values.y}
            </span>
          )}
        </>
      )}
    </div>
  );
}