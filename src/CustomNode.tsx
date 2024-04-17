import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';

const categoryColorMap = {
  import: 'LightGreen',
  wrangle: 'LightBlue',
  explore: 'LightCoral',
  model: 'LightCyan',
  evaluate: 'LightGoldenRodYellow',
};

const CustomNode = ({ data, id, onAddNode, getSuggestions }: { data: any, id: any, onAddNode: (id: string, suggestion: any) => void, getSuggestions: (id: string) => any }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  const handleAddClick = () => {
    // Fetch suggestions and display them
    const nodeSuggestions = getSuggestions(id);
    setSuggestions(nodeSuggestions);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (suggestion : any) => {
    onAddNode(id, suggestion);
    setShowSuggestions(false);  // Close suggestions modal/dropdown
  };

  const handleCancel = () => {
    setShowSuggestions(false);
  };
  
  console.log(data);
  console.log(id);
  const backgroundColor = categoryColorMap[data.categoryColor as keyof typeof categoryColorMap] || 'white'; // Default to white if not specified
  const nodeStyle = {
    backgroundColor,
  };

  return (
    <div className="custom-node" style={nodeStyle}>
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <button onClick={handleAddClick} className="add-node-button">+</button>
      {showSuggestions && (
        <div className="suggestions-dropdown">
          {suggestions.map((suggestion: any, index: any) => (
            <div key={index} onClick={() => handleSelectSuggestion(suggestion)} className="suggestion-item">
              {suggestion.label}
            </div>
          ))}
          <div onClick={handleCancel} className="suggestion-item" style={{textAlign: 'center', color: 'red'}}>
            Cancel
          </div>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomNode;
