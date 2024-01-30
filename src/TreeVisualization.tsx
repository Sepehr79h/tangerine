import React, { useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  MiniMap,
  Controls,
  Background,
} from 'react-flow-renderer';
import { Widget } from '@lumino/widgets';
import ReactDOM from 'react-dom';

export interface TreeNode {
  id: string;
  label: string;
  children: TreeNode[];
  parent: TreeNode | null;
}

export interface TreeVisualizationProps {
  treeData: TreeNode[];
}

class TreeVisualizationWidget extends Widget {
  private treeContainer: HTMLDivElement;

  constructor(treeData: TreeNode[]) {
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

  renderReactComponent(treeData: TreeNode[]) {
    ReactDOM.render(<TreeVisualization treeData={treeData} />, this.treeContainer);
  }

  updateTreeData(treeData: TreeNode[]) {
    this.renderReactComponent(treeData);
  }

  dispose() {
    ReactDOM.unmountComponentAtNode(this.treeContainer);
    super.dispose();
  }
}

const TreeVisualization: React.FC<TreeVisualizationProps> = ({ treeData }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const convertToFlowElements = (treeNodes: TreeNode[], parentId?: string) => {
    let nodes: Node[] = [];
    let edges: Edge[] = [];

    treeNodes.forEach((node, index) => {
      const position = { x: 0, y: index * 100 };

      nodes.push({
        id: node.id,
        type: 'default',
        data: { label: node.label },
        position,
      });

      if (parentId) {
        edges.push({
          id: `e${parentId}-${node.id}`,
          source: parentId,
          target: node.id,
          animated: true,
        });
      }

      if (node.children.length > 0) {
        const childElements = convertToFlowElements(node.children, node.id);
        nodes = [...nodes, ...childElements.nodes];
        edges = [...edges, ...childElements.edges];
      }
    });

    return { nodes, edges };
  };

  useEffect(() => {
    const { nodes, edges } = convertToFlowElements(treeData);
    setNodes(nodes);
    setEdges(edges);
  }, [treeData]);

  return (
    <div style={{ height: 800 }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export { TreeVisualization, TreeVisualizationWidget };
;
