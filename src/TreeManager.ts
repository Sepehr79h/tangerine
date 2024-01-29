// TreeManager.ts

export interface TreeNode {
  id: string; // Unique identifier for the cell
  label: string; // Corresponds to the header text of the cell
  children: TreeNode[];
  parent: TreeNode | null; // Parent node, if any
}

export class TreeManager {
  private nodes: Map<string, TreeNode>;
  public indexIdMap: Map<number, string>;

  constructor() {
    this.nodes = new Map();
    this.indexIdMap = new Map();
  }

  addNode(index: number, id: string, label: string, parentId: string | null): TreeNode {
    const node: TreeNode = { id, label, children: [], parent: null };

    if (parentId) {
      const parentNode = this.nodes.get(parentId);
      if (parentNode) {
        node.parent = parentNode;
        parentNode.children.push(node);
      } else {
        console.warn(`Parent node with id ${parentId} not found.`);
      }
    }
    this.indexIdMap.set(index, id);
    this.nodes.set(id, node);
    return node;
  }

  removeNode(index: number): void {
    const nodeId = this.indexIdMap.get(index) || '';
    const nodeToRemove = this.nodes.get(nodeId);
    if (nodeToRemove) {
      if (nodeToRemove.parent) {
        // Remove node from its parent's children array
        const parentChildren = nodeToRemove.parent.children;
        const index = parentChildren.findIndex(child => child.id === nodeId);
        if (index !== -1) {
          parentChildren.splice(index, 1);
        }
      }
      // Remove node from the map
      this.indexIdMap.delete(index);
      this.nodes.delete(nodeId);
      this.adjustIndicesAfterRemoval(index);
    } else {
      console.warn(`Node with id ${nodeId} not found and cannot be removed.`);
    }
  }

  private adjustIndicesAfterRemoval(removedIndex: number): void {
    this.indexIdMap.forEach((id, index) => {
      if (index > removedIndex) {
        this.indexIdMap.set(index - 1, id);
      }
    });
    // Remove the last index as it's now shifted
    this.indexIdMap.delete(this.indexIdMap.size);
  }

  findNode(id: string): TreeNode | null {
    return this.nodes.get(id) || null;
  }

  // This method will provide a snapshot of the tree, can be used to render the visualization
  getTreeSnapshot(): TreeNode[] {
    // Returns only the top-level nodes, those without parents
    return Array.from(this.nodes.values()).filter(node => node.parent === null);
  }

  // Additional methods to handle the graph structure could be added here...
}
