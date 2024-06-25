import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import LinearProgress from '@mui/material/LinearProgress';
import { Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { NotebookPanel } from '@jupyterlab/notebook';

const categoryColorMap = {
  import: 'LightGreen',
  wrangle: 'LightBlue',
  explore: 'LightCoral',
  model: 'LightCyan',
  evaluate: 'LightGoldenRodYellow',
};

const CustomNode = ({
  data, id, onAddNode, getSuggestions, childNodes, executeCell, getCellOutput, notebookPanel
}: {
  data: any, id: any, onAddNode: (id: string, suggestion: any) => any, getSuggestions: (id: string) => any, childNodes: any[], executeCell: (id: string) => any, getCellOutput: (notebookPanel: NotebookPanel, id: string) => any, notebookPanel: NotebookPanel
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showChildLabels, setShowChildLabels] = useState(false);
  const [cellOutput, setCellOutput] = useState<string | null>(null); // State to store cell output
  const [outputType, setOutputType] = useState<string | null>(null); // State to store output type

  const handleAddClick = () => {
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

  const handleSelectSuggestion = (suggestion: any) => {
    setIsLoading(true);
    onAddNode(id, suggestion).then(() => {
      setShowSuggestions(false);
      setIsLoading(false);
    }).catch((error: any) => {
      console.error("Error adding node: ", error);
      setShowSuggestions(false);
      setIsLoading(false);
    });
  };

  const handleCancel = () => {
    setShowSuggestions(false);
  };

  const handleExecute = (id: string) => {
    setIsLoading(true);
    executeCell(id).then(() => {
      setIsLoading(false);
    }).catch((error: any) => {
      console.error("Error executing cell: ", error);
      setIsLoading(false);
    });
  }

  const handleViewOutput = async () => {
    if (cellOutput) {
      setCellOutput(null);
      setOutputType(null);
    } else {
      setIsLoading(true);
      try {
        const output = await getCellOutput(notebookPanel, id);
        setCellOutput(output.data);
        setOutputType(output.output_type);
      } catch (error) {
        console.error("Error fetching cell output: ", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const backgroundColor = categoryColorMap[data.categoryColor as keyof typeof categoryColorMap] || 'white'; // Default to white if not specified
  const nodeStyle = {
    backgroundColor,
  };

  return (
    <div className="custom-node" style={nodeStyle}>
      <Handle type="target" position={Position.Top} />
      <div>[{id}] {data.label}</div>
      <button onClick={handleAddClick} className="add-node-button" title="Click to add a new node">+</button>
      <button onClick={() => handleExecute(id)} className="execute-node-button">
        <PlayArrowIcon fontSize="small"/> 
      </button>
      <button onClick={handleViewOutput} className="view-output-button">
        <VisibilityIcon fontSize="small" /> 
      </button>
      {isLoading ? (
        <Box sx={{ width: '100%' }}>
          <LinearProgress sx={{ height: 5, borderRadius: 5 }} color="primary" />
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
      {cellOutput && outputType === 'image/png' && (
        <div className="cell-output">
          <h2>Cell Output</h2>
          <div>
            <img src={`data:image/png;base64,${cellOutput}`} alt="Cell Output" />
          </div>
        </div>
      )}
      {cellOutput && outputType === 'text/plain' && (
        <div className="cell-output">
          <h2>Cell Output</h2>
          <div>
            <pre>{cellOutput}</pre>
          </div>
        </div>
      )}
      {cellOutput && outputType === 'text/html' && (
        <div className="cell-output">
          <h2>Cell Output</h2>
          <div dangerouslySetInnerHTML={{ __html: cellOutput }} />
        </div>
      )}
      {cellOutput && outputType === 'stream' && (
        <div className="cell-output">
          <h2>Cell Output</h2>
          <div className="output-content">
            <pre>{cellOutput}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomNode;
