/**
 * Tree node interface.
 */
export interface TreeNode {
  /**
   * Gets the parent node.
   */
  getParent(): TreeNode | null;
  
  /**
   * Gets the child at the specified index.
   */
  getChildAt(index: number): TreeNode | null;
  
  /**
   * Gets the number of children.
   */
  getChildCount(): number;
  
  /**
   * Gets all children.
   */
  getChildren(): TreeNode[];
  
  /**
   * Checks if the node allows children.
   */
  getAllowsChildren(): boolean;
  
  /**
   * Checks if the node is a leaf.
   */
  isLeaf(): boolean;
  
  /**
   * Gets the user object.
   */
  getUserObject(): any;
  
  /**
   * Sets the user object.
   */
  setUserObject(userObject: any): void;
  
  /**
   * Gets the node depth (root = 0).
   */
  getDepth(): number;
  
  /**
   * Gets the index of the specified child.
   */
  getIndex(child: TreeNode): number;
}

/**
 * Default tree node implementation.
 */
export class DefaultTreeNode implements TreeNode {
  private _parent: DefaultTreeNode | null;
  private _children: DefaultTreeNode[];
  private _userObject: any;
  private _allowsChildren: boolean;
  
  constructor(userObject?: any, parent?: DefaultTreeNode | null, allowsChildren: boolean = true) {
    this._parent = parent || null;
    this._children = [];
    this._userObject = userObject;
    this._allowsChildren = allowsChildren;
    
    if (parent) {
      parent.add(this);
    }
  }
  
  getParent(): DefaultTreeNode | null {
    return this._parent;
  }
  
  getChildAt(index: number): DefaultTreeNode | null {
    if (index < 0 || index >= this._children.length) return null;
    return this._children[index];
  }
  
  getChildCount(): number {
    return this._children.length;
  }
  
  getChildren(): DefaultTreeNode[] {
    return [...this._children];
  }
  
  getAllowsChildren(): boolean {
    return this._allowsChildren;
  }
  
  isLeaf(): boolean {
    return !this._allowsChildren || this._children.length === 0;
  }
  
  getUserObject(): any {
    return this._userObject;
  }
  
  setUserObject(userObject: any): void {
    this._userObject = userObject;
  }
  
  getDepth(): number {
    let depth = 0;
    let node: DefaultTreeNode | null = this;
    while (node && node._parent) {
      depth++;
      node = node._parent;
    }
    return depth;
  }
  
  getIndex(child: TreeNode): number {
    return this._children.indexOf(child as DefaultTreeNode);
  }
  
  /**
   * Adds a child node.
   */
  add(child: DefaultTreeNode): void {
    if (!this._children.includes(child)) {
      this._children.push(child);
      (child as any)._parent = this;
    }
  }
  
  /**
   * Removes a child node.
   */
  remove(child: DefaultTreeNode): void {
    const index = this._children.indexOf(child);
    if (index >= 0) {
      this._children.splice(index, 1);
      (child as any)._parent = null;
    }
  }
  
  /**
   * Removes a child at the specified index.
   */
  removeAt(index: number): DefaultTreeNode | null {
    if (index >= 0 && index < this._children.length) {
      const child = this._children[index];
      this.remove(child);
      return child;
    }
    return null;
  }
  
  /**
   * Removes all children.
   */
  removeAll(): void {
    while (this._children.length > 0) {
      this.remove(this._children[0]);
    }
  }
  
  /**
   * Inserts a child at the specified index.
   */
  insert(child: DefaultTreeNode, index: number): void {
    if (index < 0) index = 0;
    if (index > this._children.length) index = this._children.length;
    
    this._children.splice(index, 0, child);
    (child as any)._parent = this;
  }
  
  /**
   * Gets the root node.
   */
  getRoot(): DefaultTreeNode | null {
    let node: DefaultTreeNode | null = this;
    while (node && node._parent) {
      node = node._parent;
    }
    return node;
  }
  
  /**
   * Checks if this node is a descendant of the specified node.
   */
  isDescendant(node: DefaultTreeNode): boolean {
    let parent = this._parent;
    while (parent) {
      if (parent === node) return true;
      parent = parent._parent;
    }
    return false;
  }
  
  /**
   * Gets the path from root to this node.
   */
  getPath(): DefaultTreeNode[] {
    const path: DefaultTreeNode[] = [];
    let node: DefaultTreeNode | null = this;
    while (node) {
      path.unshift(node);
      node = node._parent;
    }
    return path;
  }
}
