import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import LinearProgress from '@mui/material/LinearProgress';
import { Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const categoryColorMap = {
  import: 'LightGreen',
  wrangle: 'LightBlue',
  explore: 'LightCoral',
  model: 'LightCyan',
  evaluate: 'LightGoldenRodYellow',
};

const CustomNode = ({ data, id, onAddNode, getSuggestions, childNodes }: { data: any, id: any, onAddNode: (id: string, suggestion: any) => any, getSuggestions: (id: string) => any, childNodes: any[] }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showChildLabels, setShowChildLabels] = useState(false);
  
  const handleAddClick = () => {
    // Fetch suggestions and display them
    setIsLoading(true);
    getSuggestions(id).then((nodeSuggestions: any) => {
      setSuggestions(nodeSuggestions);
      setShowSuggestions(true);
      setIsLoading(false);
    }).catch((error: any) => {
      console.error("Error fetching suggestions: ", error);
      setSuggestions([]);  // Optionally reset to an empty array on error
      setShowSuggestions(false);
      setIsLoading(false);
    });
  };

  const handleSelectSuggestion = (suggestion : any) => {
    setIsLoading(true);
    onAddNode(id, suggestion).then(() => {
      setShowSuggestions(false);
      setIsLoading(false);
    }
    ).catch((error: any) => {
      console.error("Error adding node: ", error);
      setShowSuggestions(false);
      setIsLoading(false);
    });
  };

  const handleCancel = () => {
    setShowSuggestions(false);
  };
  
  // console.log(data);
  // console.log(id);
  const backgroundColor = categoryColorMap[data.categoryColor as keyof typeof categoryColorMap] || 'white'; // Default to white if not specified
  const nodeStyle = {
    backgroundColor,
  };

  return (
    <div className="custom-node" style={nodeStyle}>
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <button onClick={handleAddClick} className="add-node-button">+</button>
      {isLoading ? (
        <Box sx={{ width: '100%' }}> {/* Ensure LinearProgress is fully visible */}
          <LinearProgress sx={{ height: 5, borderRadius: 5 }} color="primary" /> {/* Increase height and add color */}
        </Box>
      ) : (
        showSuggestions && (
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
        )
      )}
      {id.startsWith('group_') && (
        <div
          className="group-node-button"
          onMouseEnter={() => setShowChildLabels(true)}
          onMouseLeave={() => setShowChildLabels(false)}
        >
          <ExpandMoreIcon fontSize="small" />
          {showChildLabels && (
            <div className="child-labels">
              {childNodes.map((childNode: any, index: any) => (
                <div key={index} className="child-label-item">
                  {childNode.data.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomNode;
