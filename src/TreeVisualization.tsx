import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';
import dagre from '@dagrejs/dagre';
import { Widget } from '@lumino/widgets';
// import { toggleCollapse } from './TreeUtils'; // Adjust the path as needed

// Initialize the dagre graph for layout calculations
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

// Function to apply Dagre layout to nodes and edges
const getLayoutedElements = (nodes: any[], edges: any[], direction = 'TB') => {
  dagreGraph.setGraph({ rankdir: direction });
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });
  dagre.layout(dagreGraph);
  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = direction === 'LR' ? 'left' : 'top';
    node.sourcePosition = direction === 'LR' ? 'right' : 'bottom';
    node.position = { x: nodeWithPosition.x - nodeWidth / 2, y: nodeWithPosition.y - nodeHeight / 2 };
    node.data = { label: `${node.header} (${node.id})` };
  });
  return { nodes, edges };
};

export interface TreeVisualizationProps {
  treeData: {
    nodes: any[]; // Adjust type to match React Flow's Node type
    edges: any[]; // Adjust type to match React Flow's Edge type
  };
}

class TreeVisualizationWidget extends Widget {
  private treeContainer: HTMLDivElement;

  constructor(treeData: TreeVisualizationProps['treeData']) {
    super();
    this.addClass('tangerine-tree-visualization-panel');
    this.id = 'tangerine-tree-visualization-panel';
    this.title.label = 'Tree Visualization';
    this.title.closable = true;

    this.treeContainer = document.createElement('div');
    this.treeContainer.id = 'tree-visualization-container';
    this.node.appendChild(this.treeContainer);

    this.renderReactComponent(treeData);
  }

  renderReactComponent(treeData: TreeVisualizationProps['treeData']) {
    ReactDOM.render(<TreeVisualization treeData={treeData} />, this.treeContainer);
  }

  updateTreeData(treeData: TreeVisualizationProps['treeData']) {
    this.renderReactComponent(treeData);
  }

  dispose() {
    ReactDOM.unmountComponentAtNode(this.treeContainer);
    super.dispose();
  }
}

const TreeVisualization: React.FC<TreeVisualizationProps> = ({ treeData }) => {
  // Use state hooks for nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    // Apply Dagre layout when treeData updates
    var { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(treeData.nodes, treeData.edges);
    // Add categories and styles here before setting nodes and edges
    console.log(layoutedNodes);
    layoutedNodes = layoutedNodes.map(node => {
      // Assume your backend adds a `category` field to each node
      // node.data.category = 'import'; 
      const color = categoryColorMap[node.category];
      return {
        ...node,
        data: { ...node.data, label: `${node.header} (${node.id})`},
        style: { backgroundColor: color }
      };
    });
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [treeData, setNodes, setEdges]);

  // Define the handleNodeClick function
  const handleNodeClick = (event: any, node: any) => {
    // Perform any action here. For demonstration, we'll just log the node's data
    console.log('Clicked node:', node);
    // const { updatedNodes, updatedEdges } = toggleCollapse(nodes, edges, node);
    // setNodes(updatedNodes);
    // setEdges(updatedEdges);
  };

  return (
    <div style={{ height: 800 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
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
