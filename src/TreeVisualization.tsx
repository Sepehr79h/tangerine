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
import '../style/TreeVisualization.css'; // Adjust the path as needed
// import { toggleCollapse } from './TreeUtils'; // Adjust the path as needed
import { NotebookPanel } from '@jupyterlab/notebook';

// Initialize the dagre graph for layout calculations
// var data = {
//   "nodes": [
//     {"id": "group1", "data": {"label": "Data Import"}},
//     {"id": "group2", "data": {"label": "Data Wrangling"}},
//     {"id": "group3", "data": {"label": "Model Building"}},
//     {"id": "group4", "data": {"label": "Model Evaluation"}},
//     {"id": "1", "data": {"label": "Import Libraries"}, "category": "import", "parentNode": "group1"},
//     {"id": "2", "data": {"label": "Load Data"}, "category": "import", "parentNode": "group1"},
//     {"id": "3", "data": {"label": "Preview Data"}, "category": "explore", "parentNode": "group1"},
//     {"id": "4", "data": {"label": "Plot Data"}, "category": "explore", "parentNode": "group1"},
//     {"id": "5", "data": {"label": "Reshape Data"}, "category": "wrangle", "parentNode": "group2"},
//     {"id": "6", "data": {"label": "Check Data Shape"}, "category": "explore", "parentNode": "group2"},
//     {"id": "7", "data": {"label": "Define Target"}, "category": "wrangle", "parentNode": "group2"},
//     {"id": "8", "data": {"label": "Create Model"}, "category": "model", "parentNode": "group3"},
//     {"id": "9", "data": {"label": "Fit Model"}, "category": "model", "parentNode": "group3"},
//     {"id": "10", "data": {"label": "Get Model Coefficient"}, "category": "model", "parentNode": "group3"},
//     {"id": "11", "data": {"label": "Get Model Intercept"}, "category": "model", "parentNode": "group3"},
//     {"id": "12", "data": {"label": "Predict Values"}, "category": "model", "parentNode": "group3"},
//     {"id": "13", "data": {"label": "Plot Predictions"}, "category": "explore", "parentNode": "group3"},
//     {"id": "14", "data": {"label": "Calculate Metrics"}, "category": "evaluate", "parentNode": "group4"},
//     {"id": "15", "data": {"label": "Print Metrics"}, "category": "evaluate", "parentNode": "group4"}
//   ],
//   "edges": [
//     {"source": "2", "target": "3"},
//     {"source": "2", "target": "4"},
//     {"source": "2", "target": "5"},
//     {"source": "2", "target": "7"},
//     {"source": "5", "target": "6"},
//     {"source": "5", "target": "9"},
//     {"source": "5", "target": "12"},
//     {"source": "5", "target": "14"},
//     {"source": "7", "target": "9"},
//     {"source": "7", "target": "14"},
//     {"source": "8", "target": "9"},
//     {"source": "8", "target": "12"},
//     {"source": "8", "target": "14"},
//     {"source": "9", "target": "10"},
//     {"source": "9", "target": "11"},
//     {"source": "9", "target": "12"},
//     {"source": "9", "target": "13"},
//     {"source": "9", "target": "14"},
//     {"source": "12", "target": "13"},
//     {"source": "12", "target": "14"}
//   ]
// }
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
    // node.data = { label: `${node.label} (${node.id})` };
    node.style = { backgroundColor: categoryColorMap[node.parentNode] };
  });
  return { nodes, edges };
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

  constructor(treeData: TreeVisualizationProps['treeData'], private notebookPanel: NotebookPanel) {
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
    ReactDOM.render(<TreeVisualization treeData={treeData} notebookPanel={this.notebookPanel}/>, this.treeContainer);
  }

  updateTreeData(treeData: TreeVisualizationProps['treeData']) {
    this.renderReactComponent(treeData);
  }

  dispose() {
    ReactDOM.unmountComponentAtNode(this.treeContainer);
    super.dispose();
  }
}

const TreeVisualization: React.FC<TreeVisualizationProps> = ({ treeData, notebookPanel }) => {
  // Use state hooks for nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Initialize the visibility state for group nodes
  const [groupVisibility, setGroupVisibility] = React.useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Initialize group visibility to false (collapsed) for each group
    const initialVisibility: { [key: string]: boolean } = {};
    treeData.nodes.forEach(node => {
      if (!node.parentNode) {
        initialVisibility[node.id] = false;
      }
    });
    setGroupVisibility(initialVisibility);

    // Apply Dagre layout to nodes and edges
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(treeData.nodes, treeData.edges);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [treeData]);

  const handleNodeClick = (event: any, node: any) => {
    console.log('Clicked node:', node);
    
    // Toggle the visibility of the child nodes if a group node is clicked
    if (!node.parentNode) {
      setGroupVisibility(prev => ({
        ...prev,
        [node.id]: !prev[node.id],
      }));
    }

    // Handle the notebook panel logic as before
    if (notebookPanel) {
      console.log(notebookPanel.content.widgets);
      const cell = notebookPanel.content.widgets.find((w) => (w as any).prompt === node.id);
      if (cell) {
        notebookPanel.content.scrollToCell(cell);
      }
    }
  };

  // Filter nodes based on the visibility state
  const visibleNodes = nodes.filter(node => {
    return !node.parentNode || groupVisibility[node.parentNode];
  });

  const Legend = ({ categoryColorMap }: { categoryColorMap: Record<string, string> }) => {
    return (
      <div className="legend">
        {Object.keys(categoryColorMap).map((category) => (
          <div key={category} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: categoryColorMap[category] }}></span>
            <span className="legend-text">{category}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ height: 800 }}>
      <Legend categoryColorMap={categoryColorMap} />
      <ReactFlow
        nodes={visibleNodes}
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
