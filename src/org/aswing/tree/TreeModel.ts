import { TreeNode, DefaultTreeNode } from './TreeNode.js';

// Extend TreeNode with getPath for DefaultTreeNode
interface TreeNodeWithPath extends TreeNode {
  getPath(): any[];
}

/**
 * Event fired when tree model changes.
 */
export class TreeModelEvent {
  static readonly NODE_INSERTED = 'nodeInserted';
  static readonly NODE_REMOVED = 'nodeRemoved';
  static readonly NODE_CHANGED = 'nodeChanged';
  static readonly NODE_STRUCTURE_CHANGED = 'nodeStructureChanged';
  
  type: string;
  path: TreeNode[];
  childIndex: number;
  children: TreeNode[];
  
  constructor(type: string, path: TreeNode[], childIndex: number = -1, children: TreeNode[] = []) {
    this.type = type;
    this.path = path;
    this.childIndex = childIndex;
    this.children = children;
  }
}

/**
 * Listener for tree model changes.
 */
export interface TreeModelListener {
  treeNodesChanged(e: TreeModelEvent): void;
  treeNodesInserted(e: TreeModelEvent): void;
  treeNodesRemoved(e: TreeModelEvent): void;
  treeStructureChanged(e: TreeModelEvent): void;
}

/**
 * Tree model interface.
 */
export interface TreeModel {
  /**
   * Gets the root node.
   */
  getRoot(): TreeNode | null;
  
  /**
   * Gets the child at the specified index.
   */
  getChild(parent: TreeNode, index: number): TreeNode | null;
  
  /**
   * Gets the number of children.
   */
  getChildCount(parent: TreeNode): number;
  
  /**
   * Checks if the node is a leaf.
   */
  isLeaf(node: TreeNode): boolean;
  
  /**
   * Gets the value to display for the node.
   */
  getValue(node: TreeNode): any;
  
  /**
   * Sets the value for the node.
   */
  setValue(node: TreeNode, value: any): void;
  
  /**
   * Checks if the node value can be changed.
   */
  isNodeEditable(node: TreeNode): boolean;
  
  /**
   * Adds a listener.
   */
  addTreeModelListener(listener: TreeModelListener): void;
  
  /**
   * Removes a listener.
   */
  removeTreeModelListener(listener: TreeModelListener): void;
}

/**
 * Default tree model implementation.
 */
export class DefaultTreeModel implements TreeModel {
  protected root: DefaultTreeNode | null;
  protected listeners: TreeModelListener[] = [];
  protected asksAllowsChildren: boolean;
  
  constructor(root: DefaultTreeNode | null = null, asksAllowsChildren: boolean = false) {
    this.root = root;
    this.asksAllowsChildren = asksAllowsChildren;
  }
  
  getRoot(): DefaultTreeNode | null {
    return this.root;
  }
  
  setRoot(root: DefaultTreeNode | null): void {
    this.root = root;
    this.fireTreeStructureChanged(root ? [root] : [], -1, []);
  }
  
  getChild(parent: TreeNode, index: number): TreeNode | null {
    return parent.getChildAt(index);
  }
  
  getChildCount(parent: TreeNode): number {
    return parent.getChildCount();
  }
  
  isLeaf(node: TreeNode): boolean {
    if (this.asksAllowsChildren) {
      return !node.getAllowsChildren();
    }
    return node.isLeaf();
  }
  
  getValue(node: TreeNode): any {
    return node.getUserObject();
  }
  
  setValue(node: TreeNode, value: any): void {
    node.setUserObject(value);
    this.nodeChanged(node);
  }
  
  isNodeEditable(node: TreeNode): boolean {
    return true;
  }
  
  addTreeModelListener(listener: TreeModelListener): void {
    this.listeners.push(listener);
  }
  
  removeTreeModelListener(listener: TreeModelListener): void {
    const index = this.listeners.indexOf(listener);
    if (index >= 0) {
      this.listeners.splice(index, 1);
    }
  }
  
  /**
   * Notifies listeners that a node has changed.
   */
  nodeChanged(node: TreeNode): void {
    const path = (node as DefaultTreeNode).getPath();
    this.fireTreeNodesChanged(path, -1, []);
  }
  
  /**
   * Notifies listeners that nodes have been inserted.
   */
  nodesWereInserted(parent: TreeNode, indices: number[]): void {
    const path = (parent as DefaultTreeNode).getPath();
    const children = indices.map(i => parent.getChildAt(i)).filter(n => n !== null) as TreeNode[];
    this.fireTreeNodesInserted(path, indices[0] || 0, children);
  }
  
  /**
   * Notifies listeners that nodes have been removed.
   */
  nodesWereRemoved(parent: TreeNode, indices: number[], removedNodes: TreeNode[]): void {
    const path = (parent as DefaultTreeNode).getPath();
    this.fireTreeNodesRemoved(path, indices[0] || 0, removedNodes);
  }
  
  /**
   * Notifies listeners that the tree structure has changed.
   */
  nodeStructureChanged(node: TreeNode): void {
    const path = (node as DefaultTreeNode).getPath();
    this.fireTreeStructureChanged(path, -1, []);
  }
  
  protected fireTreeNodesChanged(path: any[], childIndex: number, children: any[]): void {
    const event = new TreeModelEvent(TreeModelEvent.NODE_CHANGED, path as TreeNode[], childIndex, children as TreeNode[]);
    this.listeners.forEach(listener => listener.treeNodesChanged(event));
  }
  
  protected fireTreeNodesInserted(path: any[], childIndex: number, children: any[]): void {
    const event = new TreeModelEvent(TreeModelEvent.NODE_INSERTED, path as TreeNode[], childIndex, children as TreeNode[]);
    this.listeners.forEach(listener => listener.treeNodesInserted(event));
  }
  
  protected fireTreeNodesRemoved(path: any[], childIndex: number, children: any[]): void {
    const event = new TreeModelEvent(TreeModelEvent.NODE_REMOVED, path as TreeNode[], childIndex, children as TreeNode[]);
    this.listeners.forEach(listener => listener.treeNodesRemoved(event));
  }
  
  protected fireTreeStructureChanged(path: any[], childIndex: number, children: any[]): void {
    const event = new TreeModelEvent(TreeModelEvent.NODE_STRUCTURE_CHANGED, path as TreeNode[], childIndex, children as TreeNode[]);
    this.listeners.forEach(listener => listener.treeStructureChanged(event));
  }
}
