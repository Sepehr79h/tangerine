import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
} from 'react-flow-renderer';
import dagre from '@dagrejs/dagre';
import { Widget } from '@lumino/widgets';
import '../style/TreeVisualization.css'; // Adjust the path as needed
// import { toggleCollapse } from './TreeUtils'; // Adjust the path as needed
import { NotebookPanel, NotebookActions } from '@jupyterlab/notebook';
import CustomNode from './CustomNode';
// import custom node css from style folder
import '../style/CustomNode.css';
import axios from 'axios';
import LinearProgress from '@mui/material/LinearProgress';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

var data = {'nodes': [{'id': '1', 'data': {'label': 'Import libraries', 'categoryColor': 'import'}}, {'id': '2', 'data': {'label': 'Load dataset', 'categoryColor': 'wrangle'}, 'parentNode': 'group_2_6'}, {'id': '3', 'data': {'label': 'Check missing values', 'categoryColor': 'wrangle'}, 'parentNode': 'group_2_6'}, {'id': '4', 'data': {'label': 'Dataset shape', 'categoryColor': 'wrangle'}, 'parentNode': 'group_2_6'}, {'id': '5', 'data': {'label': 'Dataset info', 'categoryColor': 'wrangle'}, 'parentNode': 'group_2_6'}, {'id': '6', 'data': {'label': 'Check object types', 'categoryColor': 'wrangle'}, 'parentNode': 'group_2_6'}, {'id': '7', 'data': {'label': 'Attrition value counts', 'categoryColor': 'explore'}}, {'id': '8', 'data': {'label': 'Encode Attrition', 'categoryColor': 'wrangle'}}, {'id': '9', 'data': {'label': 'Attrition pie chart', 'categoryColor': 'explore'}}, {'id': '10', 'data': {'label': 'Check int64 types', 'categoryColor': 'wrangle'}}, {'id': '11', 'data': {'label': 'Age distribution', 'categoryColor': 'explore'}, 'parentNode': 'group_11_15'}, {'id': '12', 'data': {'label': 'Top 10 ages', 'categoryColor': 'explore'}, 'parentNode': 'group_11_15'}, {'id': '13', 'data': {'label': 'Least common ages', 'categoryColor': 'explore'}, 'parentNode': 'group_11_15'}, {'id': '14', 'data': {'label': 'StandardHours counts', 'categoryColor': 'explore'}, 'parentNode': 'group_11_15'}, {'id': '15', 'data': {'label': 'EmployeeCount counts', 'categoryColor': 'explore'}, 'parentNode': 'group_11_15'}, {'id': '16', 'data': {'label': 'Drop columns and heatmap', 'categoryColor': 'wrangle'}}, {'id': '17', 'data': {'label': 'YearsAtCompany boxplot', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '18', 'data': {'label': 'BusinessTravel vs Attrition', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '19', 'data': {'label': 'Department vs Attrition', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '20', 'data': {'label': 'Department counts', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '21', 'data': {'label': 'Gender vs Attrition', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '22', 'data': {'label': 'JobRole vs Attrition', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '23', 'data': {'label': 'JobRole vs MonthlyIncome', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '24', 'data': {'label': 'EducationField vs Attrition', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '25', 'data': {'label': 'OverTime vs Attrition', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '26', 'data': {'label': 'EnvironmentSatisfaction counts', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '27', 'data': {'label': 'Define features and target', 'categoryColor': 'wrangle'}, 'parentNode': 'group_27_31'}, {'id': '28', 'data': {'label': 'Encode categorical features', 'categoryColor': 'wrangle'}, 'parentNode': 'group_27_31'}, {'id': '29', 'data': {'label': 'Scale features', 'categoryColor': 'wrangle'}, 'parentNode': 'group_27_31'}, {'id': '30', 'data': {'label': 'Train-test split', 'categoryColor': 'wrangle'}, 'parentNode': 'group_27_31'}, {'id': '31', 'data': {'label': 'Print dataset shapes', 'categoryColor': 'wrangle'}, 'parentNode': 'group_27_31'}, {'id': '32', 'data': {'label': 'Train and evaluate models', 'categoryColor': 'model'}}, {'id': 'group_2_6', 'data': {'label': 'Initial Dataset Preparation', 'categoryColor': 'wrangle'}}, {'id': 'group_11_15', 'data': {'label': 'Employee Demographics Analysis', 'categoryColor': 'explore'}}, {'id': 'group_17_26', 'data': {'label': 'Attrition Factors Exploration', 'categoryColor': 'explore'}}, {'id': 'group_27_31', 'data': {'label': 'Feature Engineering Steps', 'categoryColor': 'wrangle'}}], 'edges': [{'source': '2', 'target': '3'}, {'source': '2', 'target': '4'}, {'source': '2', 'target': '5'}, {'source': '2', 'target': '6'}, {'source': '2', 'target': '7'}, {'source': '2', 'target': '8'}, {'source': '8', 'target': '9'}, {'source': '8', 'target': '10'}, {'source': '8', 'target': '11'}, {'source': '8', 'target': '12'}, {'source': '8', 'target': '13'}, {'source': '8', 'target': '14'}, {'source': '8', 'target': '15'}, {'source': '8', 'target': '16'}, {'source': '11', 'target': '16'}, {'source': '16', 'target': '17'}, {'source': '16', 'target': '18'}, {'source': '16', 'target': '19'}, {'source': '16', 'target': '21'}, {'source': '16', 'target': '22'}, {'source': '16', 'target': '23'}, {'source': '16', 'target': '24'}, {'source': '16', 'target': '25'}, {'source': '16', 'target': '26'}, {'source': '16', 'target': '27'}, {'source': '17', 'target': '18'}, {'source': '18', 'target': '19'}, {'source': '19', 'target': '20'}, {'source': '19', 'target': '21'}, {'source': '21', 'target': '22'}, {'source': '22', 'target': '23'}, {'source': '23', 'target': '24'}, {'source': '24', 'target': '25'}, {'source': '25', 'target': '26'}, {'source': '26', 'target': '27'}, {'source': '27', 'target': '28'}, {'source': '27', 'target': '29'}, {'source': '27', 'target': '30'}, {'source': '28', 'target': '29'}, {'source': '29', 'target': '30'}, {'source': '30', 'target': '32'}, {'source': '30', 'target': '31'}, {'source': 'group_11_15', 'target': '16'}, {'source': 'group_2_6', 'target': '8'}, {'source': '16', 'target': 'group_27_31'}, {'source': 'group_2_6', 'target': '7'}, {'source': 'group_17_26', 'target': 'group_27_31'}, {'source': '8', 'target': 'group_11_15'}, {'source': 'group_27_31', 'target': '32'}, {'source': '26', 'target': 'group_27_31'}, {'source': '16', 'target': 'group_17_26'}, {'source': 'group_17_26', 'target': '27'}]}

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 172;
const nodeHeight = 36;
const categoryColorMap: { [key: string]: string } = {
  import: 'LightGreen',
  wrangle: 'LightBlue',
  explore: 'LightCoral',
  model: 'LightCyan',
  evaluate: 'LightGoldenRodYellow'
};

const getLayoutedElements = (nodes: any[], edges: any[], direction = 'TB') => {
  console.log("Getting layouted elements");
  dagreGraph.setGraph({ rankdir: direction });

  // Filter out hidden nodes
  const visibleNodes = nodes.filter(node => !node.hidden);

  visibleNodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    if (visibleNodes.find(node => node.id === edge.source) && visibleNodes.find(node => node.id === edge.target)) {
      dagreGraph.setEdge(edge.source, edge.target);
    }
  });

  dagre.layout(dagreGraph);

  visibleNodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = direction === 'LR' ? 'left' : 'top';
    node.sourcePosition = direction === 'LR' ? 'right' : 'bottom';
    node.position = { x: nodeWithPosition.x - nodeWidth / 2, y: nodeWithPosition.y - nodeHeight / 2 };
    // node.data = { label: `${node.label} (${node.id})` };
    node.style = { backgroundColor: categoryColorMap[node.categoryColor] };
  });

  return { nodes: visibleNodes, edges };
};


export interface TreeVisualizationProps {
  treeData: {
    nodes: any[]; // Adjust type to match React Flow's Node type
    edges: any[]; // Adjust type to match React Flow's Edge type
  };
  notebookPanel: NotebookPanel;
}

class TreeVisualizationWidget extends Widget {
  private treeContainer: HTMLDivElement;
  private isLoading: boolean; // New state to track loading

  constructor(treeData: TreeVisualizationProps['treeData'], private notebookPanel: NotebookPanel) {
    super();
    this.addClass('tangerine-tree-visualization-panel');
    this.id = 'tangerine-tree-visualization-panel';
    this.title.label = 'Tree Visualization';
    this.title.closable = true;

    this.treeContainer = document.createElement('div');
    this.treeContainer.id = 'tree-visualization-container';
    this.node.appendChild(this.treeContainer);

    this.isLoading = true; // Initially set to true for loading
    this.renderReactComponent(treeData);
  }

  renderReactComponent(treeData: TreeVisualizationProps['treeData']) {
    ReactDOM.render(<TreeVisualization treeData={treeData} notebookPanel={this.notebookPanel} isLoading={this.isLoading}/>, this.treeContainer);
  }

  updateTreeData(treeData: TreeVisualizationProps['treeData'], isLoading: boolean) {
    this.isLoading = isLoading;
    console.log(treeData);
    this.renderReactComponent(treeData);
  }

  dispose() {
    ReactDOM.unmountComponentAtNode(this.treeContainer);
    super.dispose();
  }
}

const TreeVisualization: React.FC<TreeVisualizationProps & { isLoading: boolean }> = ({ treeData, notebookPanel, isLoading }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const [isAddNodeStarted, setIsAddNodeStarted] = useState(false);
  // Use state hooks for nodes and edges
  const nodeTypes = useMemo(() => ({
    customNode: (nodeData: any) => {
      const childNodes = data.nodes.filter(node => node.parentNode === nodeData.id);
      return <CustomNode {...nodeData} onAddNode={handleAddNode} getSuggestions={getSuggestions} childNodes={childNodes} executeCell={executeCell} />;
    }
  }), []);
  console.log("Starting tree visualization")
  console.log(nodes);
  console.log(edges);
  
  // data = treeData;

  // const [nodes, setNodes, onNodesChange] = useNodesState([]);
  // const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  // // const [visibleNodes, setVisibleNodes] = useState(data.nodes.filter(node => !node.parentNode));
  // // const [visibleEdges, setVisibleEdges] = useState(data.edges.filter(edge => visibleNodes.find(node => node.id === edge.source) && visibleNodes.find(node => node.id === edge.target)));
  
  // const [isRefresh, setIsRefresh] = useState(false);
  // const [isAddNodeStarted, setIsAddNodeStarted] = useState(false);
  
  // useEffect(() => {
  //   console.log("treeData updated", data);
  //   const newVisibleNodes = data.nodes.filter(node => !node.parentNode);
  //   const newVisibleEdges = data.edges.filter(edge => newVisibleNodes.find(node => node.id === edge.source) && newVisibleNodes.find(node => node.id === edge.target));
  //   setVisibleNodes(newVisibleNodes);
  //   setVisibleEdges(newVisibleEdges);
  // }, [data]);

  // useEffect(() => {
  //   console.log("Rendering tree visualization")
  //   // Initialize group visibility to false (collapsed) for each group
  //   console.log(visibleNodes);
  //   console.log(visibleEdges);
  //   // Apply Dagre layout to nodes and edges
  //   if (visibleNodes.length > 0 && visibleEdges.length > 0) {
  //     const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(visibleNodes, visibleEdges);
  //     setNodes(layoutedNodes);
  //     setEdges(layoutedEdges);
  //   }
  // }, [visibleNodes, visibleEdges]);

  const edgesRef = useRef(edges);
  const nodesRef = useRef(nodes);

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    data.nodes.forEach((node: any) => { if (node.parentNode) { node.hidden = true } });
    data.edges.forEach((edge: any) => { edge.type = 'smoothstep'; edge.animated = true });
    data.nodes.forEach((node: any) => { node.type = 'customNode' });
    // const visibleNodes = data.nodes.filter(node => !node.parentNode);
    // const visibleEdges = data.edges.filter(edge => visibleNodes.find(node => node.id === edge.source) && visibleNodes.find(node => node.id === edge.target));
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(data.nodes, data.edges);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, []);
  
  useEffect(() => {
    if (nodes.length > 0 && edges.length > 0) {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodesRef.current, edgesRef.current);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [nodesRef.current.length, edgesRef.current.length]);
  

  const getSuggestions = async (nodeId: string) => {
    setIsAddNodeStarted(true);
    console.log(nodes);
    console.log(edges);
    console.log(edgesRef.current);
    try{
      const notebookPath = notebookPanel.context.path; 
      const response = await axios.post('http://127.0.0.1:5002/get-suggestions', {
        filepath: notebookPath,
        nodeId: nodeId,
        edges: edgesRef.current
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 500000 
      });
      console.log(response.data);
      return response.data;
      
    }
    catch (error) {
      console.error("Failed to fetch suggestions:", error);
      return [];
    }
    // return [
    //   { id: `suggestion1`, label: 'Next Step A', category: 'import'},
    //   { id: `suggestion2`, label: 'Next Step B', category: 'wrangle'},
    //   { id: `suggestion3`, label: 'Next Step C', category: 'explore'},
    // ];
  };

  const handleAddNode = async (parentId: string, suggestion: any) => {
    try{
      const notebookPath = notebookPanel.context.path; 
      const response = await axios.post('http://127.0.0.1:5002/get-suggestions-code', {
        filepath: notebookPath,
        nodeId: parentId,
        edges: edgesRef.current,
        suggestion: suggestion,
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 500000 
      });
      const code = response.data.code;
      suggestion.code = code;
      console.log(code);
    }
    catch (error) {
      console.error("Failed to fetch suggestions:", error);
    }
    // Create new node data
    const newNode = {
      id: `n${Date.now()}`, // Use a timestamp to generate a unique ID
      data: { label: suggestion.label, onAddNode: handleAddNode, getSuggestions: getSuggestions, categoryColor: suggestion.category}, // Add the missing categoryColor property
      position: { x: 250, y: 250 }, // Position should be calculated or defined appropriately
      type: 'customNode',
    };
    // Create new edge data
    const newEdge = {
      id: `e${parentId}-${newNode.id}`,
      source: parentId,
      target: newNode.id,
      type: 'smoothstep',
      animated: true
    };
    //add the new node to the data
    // data.nodes.push(newNode);
    // data.edges.push(newEdge);
    // // Add new node and edge to the state
    console.log(newNode);
    console.log(newEdge);
    console.log(nodes);
    console.log(edges);
    console.log('Before updating state:', nodesRef.current, edgesRef.current);
    setNodes((prevNodes) => {
      const updatedNodes = [...prevNodes, newNode];
      nodesRef.current = updatedNodes; // Update the ref
      console.log('After nodes update:', updatedNodes);
      return updatedNodes;
    });

    setEdges((prevEdges) => {
      const updatedEdges = [...prevEdges, newEdge];
      edgesRef.current = updatedEdges; // Update the ref
      console.log('After edges update:', updatedEdges);
      return updatedEdges;
    });
    
    console.log(nodes)
    console.log(edges);
    // data.nodes.push(newNode);
    // data.edges.push(newEdge);



    // //make backend call to get-add-node-tree
    // try{
    //   const notebookPath = notebookPanel.context.path; 
    //   const response = await axios.post('http://127.0.0.1:5002/get-add-node-tree', {
    //     filepath: notebookPath,
    //     currTree: data,
    //     newNode: newNode,
    //   }, {
    //     headers: { 'Content-Type': 'application/json' },
    //     timeout: 500000 
    //   });
    //   const updatedTree = response.data;
    //   console.log(updatedTree);
    // }
    // catch (error) {
    //   console.error("Failed to fetch suggestions:", error);
    // }

    


    // Logic to add a new JupyterLab cell goes here
    //if parentId starts with group, create variable and set it to the string after the last underscore
    let id = parentId;
    if (parentId.startsWith('group_')) {
      id = parentId.split('_').pop() as string;
    }

    if (notebookPanel) {
      const cellIndex = notebookPanel.content.widgets.findIndex((w) => (w as any).prompt === id);
      if (cellIndex >= 0) {
        notebookPanel.model?.sharedModel.insertCell(cellIndex + 1, {
          cell_type: 'code',
          //add sample code here
          source: suggestion.code.map((line: string) => line + '\n'),
        });
        const cell = notebookPanel.content.widgets[cellIndex + 1];
        console.log(cell);
        if (cell) {
          notebookPanel.content.scrollToCell(cell);
          // await NotebookActions.run(notebookPanel.content, notebookPanel.sessionContext);
        }
      }
    }
    setIsAddNodeStarted(false);
    return true;
  };

  const handleNodeClick = (event: any, node: any) => {
    console.log('Clicked node:', node);
    // Handle the notebook panel logic as before
    if (notebookPanel) {
      console.log(notebookPanel.content.widgets);
      // if node.id starts with 'group_', scroll to the integer after 'group_'
      var cell = notebookPanel.content.widgets.find((w) => (w as any).prompt === node.id);
      if (node.id.startsWith('group_')) {
        const group = node.id.split('_')[1]
        cell = notebookPanel.content.widgets.find((w) => (w as any).prompt === group);
        console.log(group, cell);
      }
      if (cell && isAddNodeStarted===false) {
        notebookPanel.content.scrollToCell(cell);
      }
    }
    // setIsAddNodeStarted(false);
  };

  const executeCell = async (id: string) => {
    console.log("Executing code cell");
    if (notebookPanel) {
        const cell = notebookPanel.content.widgets.find((w) => (w as any).prompt === id) as any;
        await notebookPanel.content.scrollToCell(cell);
        console.log(cell);
        if (cell) {
            await NotebookActions.run(notebookPanel.content, notebookPanel.sessionContext);
            const newId = (cell as any).prompt;

            // Update the node and edges state so that the node id is updated to the new id
            setNodes((prevNodes) => 
                prevNodes.map((node) => 
                    node.id === id 
                        ? { ...node, id: newId}
                        : node
                )
            );

            setEdges((prevEdges) => 
                prevEdges.map((edge) => {
                    if (edge.source === id) {
                        return { ...edge, source: newId, id: `e${newId}-${edge.target}` };
                    } else if (edge.target === id) {
                        return { ...edge, target: newId, id: `e${edge.source}-${newId}` };
                    } else {
                        return edge;
                    }
                })
            );            
        }
    }
};



const Legend = ({ categoryColorMap }: { categoryColorMap: Record<string, string> }) => {
  return (
    <div className="legend">
      <div className="legend-row">
        {Object.keys(categoryColorMap).map((category) => (
          <div key={category} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: categoryColorMap[category] }}></span>
            <span className="legend-text">{category}</span>
          </div>
        ))}
      </div>
      <div className="legend-row">
        <div className="legend-item">
          <ExpandMoreIcon />
          <span className="legend-text">Show Hidden Nodes</span>
        </div>
        <div className="legend-item">
          <PlayArrowIcon />
          <span className="legend-text">Execute Node</span>
        </div>
      </div>
      <button className="button-rerun-update" onClick={handleRerunAndUpdateTree}>
        Rerun and Update Tree
      </button>
      {isRefresh && <LinearProgress />}
    </div>
  );
};


  const handleRerunAndUpdateTree = async () => {
    console.log('Rerun and Update Tree button clicked');
    setIsRefresh(true);
    // Here you will add your logic to rerun calculations and update the tree
    // You might need to fetch new data, recalculate positions, or refresh the state
    try{
      // console.log(NotebookActions);
      await notebookPanel.context.sessionContext.restartKernel();
      await NotebookActions.runAll(notebookPanel.content, notebookPanel.sessionContext);
      const notebookPath = notebookPanel.context.path; 
      const response = await axios.post('http://127.0.0.1:5002/get-tree-structure', {
        filepath: notebookPath
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 500000 
      });
      console.log(response);
      // const treeData = response.data;
      // //const treeData = {'nodes': [{'id': '1', 'data': {'label': 'Library Imports [1]', 'categoryColor': 'import'}, 'parentNode': 'group_1_2'}, {'id': '2', 'data': {'label': 'Load Dataset [2]', 'categoryColor': 'import'}, 'parentNode': 'group_1_2'}, {'id': '3', 'data': {'label': 'Check Null Values [3]', 'categoryColor': 'wrangle'}}, {'id': '4', 'data': {'label': 'Dataset Shape [4]', 'categoryColor': 'explore'}, 'parentNode': 'group_4_7'}, {'id': '5', 'data': {'label': 'Dataset Info [5]', 'categoryColor': 'explore'}, 'parentNode': 'group_4_7'}, {'id': '6', 'data': {'label': 'Object Data Types [6]', 'categoryColor': 'explore'}, 'parentNode': 'group_4_7'}, {'id': '7', 'data': {'label': 'Value Counts of Attrition [7]', 'categoryColor': 'explore'}, 'parentNode': 'group_4_7'}, {'id': '8', 'data': {'label': 'Encode Attrition [8]', 'categoryColor': 'wrangle'}}, {'id': '9', 'data': {'label': 'Attrition Pie Chart [9]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_15'}, {'id': '10', 'data': {'label': 'Integer Data Types [10]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_15'}, {'id': '11', 'data': {'label': 'Age Distribution [11]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_15'}, {'id': '12', 'data': {'label': 'Top Ages [12]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_15'}, {'id': '13', 'data': {'label': 'Least Common Ages [13]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_15'}, {'id': '14', 'data': {'label': 'Standard Hours Value Counts [14]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_15'}, {'id': '15', 'data': {'label': 'Employee Count Value Counts [15]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_15'}, {'id': '16', 'data': {'label': 'Drop Unnecessary Columns [16]', 'categoryColor': 'wrangle'}}, {'id': '17', 'data': {'label': 'Years at Company Boxplot [17]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '18', 'data': {'label': 'Business Travel vs Attrition [18]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '19', 'data': {'label': 'Department vs Attrition [19]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '20', 'data': {'label': 'Department Value Counts [20]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '21', 'data': {'label': 'Gender vs Attrition [21]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '22', 'data': {'label': 'Job Role vs Attrition [22]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '23', 'data': {'label': 'Monthly Income by Job Role [23]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '24', 'data': {'label': 'Education Field vs Attrition [24]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '25', 'data': {'label': 'Overtime vs Attrition [25]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '26', 'data': {'label': 'Environment Satisfaction Count [26]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '27', 'data': {'label': 'Feature and Target Selection [27]', 'categoryColor': 'model'}}, {'id': '28', 'data': {'label': 'Encode Categorical Features [28]', 'categoryColor': 'wrangle'}, 'parentNode': 'group_28_29'}, {'id': '29', 'data': {'label': 'Scale Features [29]', 'categoryColor': 'wrangle'}, 'parentNode': 'group_28_29'}, {'id': '30', 'data': {'label': 'Split Dataset [30]', 'categoryColor': 'model'}, 'parentNode': 'group_30_32'}, {'id': '31', 'data': {'label': 'Dataset Shapes After Split [31]', 'categoryColor': 'model'}, 'parentNode': 'group_30_32'}, {'id': '32', 'data': {'label': 'Model Training and Evaluation [32]', 'categoryColor': 'model'}, 'parentNode': 'group_30_32'}, {'id': 'group_1_2', 'data': {'label': 'Initial Data Setup [1-2]', 'categoryColor': 'import'}}, {'id': 'group_4_7', 'data': {'label': 'Dataset Structure Overview [4-7]', 'categoryColor': 'explore'}}, {'id': 'group_9_15', 'data': {'label': 'Data Distribution Analysis [9-15]', 'categoryColor': 'explore'}}, {'id': 'group_17_26', 'data': {'label': 'Attrition Analysis Factors [17-26]', 'categoryColor': 'explore'}}, {'id': 'group_28_29', 'data': {'label': 'Feature Engineering Steps [28-29]', 'categoryColor': 'wrangle'}}, {'id': 'group_30_32', 'data': {'label': 'Model Preparation Process [30-32]', 'categoryColor': 'model'}}], 'edges': [{'source': '2', 'target': '3'}, {'source': '2', 'target': '4'}, {'source': '2', 'target': '5'}, {'source': '2', 'target': '6'}, {'source': '2', 'target': '7'}, {'source': '2', 'target': '8'}, {'source': '8', 'target': '9'}, {'source': '8', 'target': '10'}, {'source': '8', 'target': '11'}, {'source': '8', 'target': '12'}, {'source': '8', 'target': '13'}, {'source': '8', 'target': '14'}, {'source': '8', 'target': '15'}, {'source': '8', 'target': '16'}, {'source': '11', 'target': '16'}, {'source': '16', 'target': '17'}, {'source': '16', 'target': '18'}, {'source': '16', 'target': '19'}, {'source': '16', 'target': '21'}, {'source': '16', 'target': '22'}, {'source': '16', 'target': '23'}, {'source': '16', 'target': '24'}, {'source': '16', 'target': '25'}, {'source': '16', 'target': '26'}, {'source': '16', 'target': '27'}, {'source': '17', 'target': '18'}, {'source': '18', 'target': '19'}, {'source': '19', 'target': '20'}, {'source': '19', 'target': '21'}, {'source': '21', 'target': '22'}, {'source': '22', 'target': '23'}, {'source': '23', 'target': '24'}, {'source': '24', 'target': '25'}, {'source': '25', 'target': '26'}, {'source': '26', 'target': '27'}, {'source': '27', 'target': '28'}, {'source': '27', 'target': '29'}, {'source': '27', 'target': '30'}, {'source': '28', 'target': '29'}, {'source': '29', 'target': '30'}, {'source': '30', 'target': '32'}, {'source': '30', 'target': '31'}, {'source': '2', 'target': 'group_4_7'}, {'source': 'group_9_15', 'target': '16'}, {'source': 'group_28_29', 'target': '30'}, {'source': 'group_1_2', 'target': '4'}, {'source': 'group_1_2', 'target': '6'}, {'source': '16', 'target': 'group_17_26'}, {'source': '27', 'target': 'group_28_29'}, {'source': 'group_1_2', 'target': '3'}, {'source': '29', 'target': 'group_30_32'}, {'source': 'group_1_2', 'target': 'group_4_7'}, {'source': '27', 'target': 'group_30_32'}, {'source': 'group_1_2', 'target': '8'}, {'source': 'group_17_26', 'target': '27'}, {'source': 'group_1_2', 'target': '7'}, {'source': 'group_1_2', 'target': '5'}, {'source': 'group_28_29', 'target': 'group_30_32'}, {'source': '8', 'target': 'group_9_15'}]};
      // console.log(treeData);
      // data = treeData;
      // setVisibleNodes(data.nodes.filter(node => !node.parentNode));
      // setVisibleEdges(data.edges.filter(edge => visibleNodes.find(node => node.id === edge.source) && visibleNodes.find(node => node.id === edge.target)));
      // data.edges.forEach((edge: any) => {edge.type = 'smoothstep', edge.animated = true});
      // data.nodes.forEach((node: any) => {node.type = 'customNode'});
    }
    catch (error) {
      console.error("Failed to fetch tree", error);
    }
    setIsRefresh(false);
  };


  return (
    <div style={{ height: 800 }}>
      {isLoading && <LinearProgress />}
      <Legend categoryColorMap={categoryColorMap} />
      <ReactFlow
        nodes={nodesRef.current}
        edges={edgesRef.current}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
        
      </ReactFlow>
    </div>
  );
};


export { TreeVisualization, TreeVisualizationWidget };
