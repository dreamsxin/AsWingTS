import { Component } from '../Component.js';
import { IntDimension } from '../geom/IntDimension.js';
import { TreeModel, DefaultTreeModel, TreeModelListener, TreeModelEvent } from './TreeModel.js';
import { TreeCellRenderer, DefaultTreeCellRenderer } from './TreeCellRenderer.js';
import { DefaultTreeNode } from './TreeNode.js';

/**
 * Tree path for node selection.
 */
export class TreePath {
  private path: any[];
  
  constructor(path: any[]) {
    this.path = path;
  }
  
  getPath(): any[] {
    return [...this.path];
  }
  
  getLastPathComponent(): any {
    return this.path[this.path.length - 1];
  }
  
  getParentPath(): TreePath | null {
    if (this.path.length <= 1) return null;
    return new TreePath(this.path.slice(0, -1));
  }
  
  pathByAddingChild(child: any): TreePath {
    return new TreePath([...this.path, child]);
  }
}

/**
 * A tree component for displaying hierarchical data.
 */
export class JTree extends Component {
  private _model: TreeModel;
  private _cellRenderer: TreeCellRenderer;
  private _rootVisible: boolean;
  private _showsRootHandles: boolean;
  private _editable: boolean;
  private _rowHeight: number;
  private _indent: number;
  private _expandedPaths: Set<string>;
  private _selectedPath: TreePath | null;
  private _treeElement: HTMLElement | null;
  private _clickOffsetX: number;

  constructor(model?: TreeModel) {
    super();
    this._name = 'JTree';
    this._model = model || new DefaultTreeModel();
    this._cellRenderer = new DefaultTreeCellRenderer();
    this._rootVisible = true;
    this._showsRootHandles = true;
    this._editable = false;
    this._rowHeight = 24;
    this._indent = 16;
    this._expandedPaths = new Set();
    this._selectedPath = null;
    this._treeElement = null;
    this._clickOffsetX = 0;
  }

  override createRootElement(): HTMLElement {
    this._treeElement = document.createElement('div');
    this._treeElement.className = 'aswing-tree';
    this._treeElement.style.position = 'absolute';
    this._treeElement.style.background = '#fff';
    this._treeElement.style.border = '1px solid #ccc';
    this._treeElement.style.overflow = 'auto';

    this.updateUI();

    // Model listener
    const listener: TreeModelListener = {
      treeNodesChanged: () => this.updateUI(),
      treeNodesInserted: () => this.updateUI(),
      treeNodesRemoved: () => this.updateUI(),
      treeStructureChanged: () => this.updateUI()
    };
    this._model.addTreeModelListener(listener);

    return this._treeElement;
  }

  private updateUI(): void {
    if (!this._treeElement) return;

    this._treeElement.innerHTML = '';
    
    const root = this._model.getRoot();
    if (!root || !this._rootVisible) return;

    this.renderNode(root, 0, true);
  }

  private renderNode(node: any, depth: number, isRoot: boolean): void {
    if (!node) return;

    const nodeElement = document.createElement('div');
    nodeElement.className = 'aswing-tree-node';
    nodeElement.style.display = 'flex';
    nodeElement.style.alignItems = 'center';
    nodeElement.style.height = `${this._rowHeight}px`;
    nodeElement.style.padding = '2px 4px';
    nodeElement.style.cursor = 'pointer';
    nodeElement.style.userSelect = 'none';
    
    // Indent
    const indent = isRoot ? 0 : (depth * this._indent);
    nodeElement.style.paddingLeft = `${indent + 4}px`;

    // Expand/collapse icon
    const isLeaf = this._model.isLeaf(node);
    const isExpanded = isRoot || this.isExpanded(node);
    
    if (!isLeaf) {
      const toggleElement = document.createElement('span');
      toggleElement.textContent = isExpanded ? '▼' : '▶';
      toggleElement.style.display = 'inline-block';
      toggleElement.style.width = '16px';
      toggleElement.style.textAlign = 'center';
      toggleElement.style.fontSize = '10px';
      toggleElement.style.color = '#666';
      toggleElement.style.marginRight = '4px';
      
      toggleElement.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleNode(node);
      });
      
      nodeElement.appendChild(toggleElement);
    } else {
      const spacer = document.createElement('span');
      spacer.style.width = '20px';
      nodeElement.appendChild(spacer);
    }

    // Cell renderer
    const value = this._model.getValue(node);
    const rendererComponent = this._cellRenderer.getTreeCellRendererComponent(
      this, value, this.isSelected(node), isExpanded, isLeaf, depth, false
    );
    
    const rendererElement = rendererComponent.getElement();
    if (rendererElement) {
      rendererElement.style.position = 'relative';
      rendererElement.style.flex = '1';
      nodeElement.appendChild(rendererElement);
    }

    // Selection
    if (this.isSelected(node)) {
      nodeElement.style.background = '#007bff';
    } else {
      nodeElement.style.background = 'transparent';
    }

    // Hover effect
    nodeElement.addEventListener('mouseenter', () => {
      if (!this.isSelected(node)) {
        nodeElement.style.background = '#f0f0f0';
      }
    });
    
    nodeElement.addEventListener('mouseleave', () => {
      if (!this.isSelected(node)) {
        nodeElement.style.background = 'transparent';
      }
    });

    // Click to select
    nodeElement.addEventListener('click', () => {
      this.setSelectionPath(new TreePath(node.getPath()));
    });

    this._treeElement!.appendChild(nodeElement);

    // Render children if expanded
    if (!isLeaf && isExpanded) {
      const childCount = this._model.getChildCount(node);
      for (let i = 0; i < childCount; i++) {
        const child = this._model.getChild(node, i);
        if (child) {
          this.renderNode(child, depth + 1, false);
        }
      }
    }
  }

  private getPathKey(node: any): string {
    const path = node.getPath();
    return path.map((n: any) => this._model.getValue(n)).join('/');
  }

  private isExpanded(node: any): boolean {
    const key = this.getPathKey(node);
    return this._expandedPaths.has(key);
  }

  private setExpanded(node: any, expanded: boolean): void {
    const key = this.getPathKey(node);
    if (expanded) {
      this._expandedPaths.add(key);
    } else {
      this._expandedPaths.delete(key);
    }
    this.updateUI();
  }

  private toggleNode(node: any): void {
    this.setExpanded(node, !this.isExpanded(node));
  }

  private isSelected(node: any): boolean {
    if (!this._selectedPath) return false;
    const selectedNode = this._selectedPath.getLastPathComponent();
    return selectedNode === node;
  }

  /**
   * Gets the tree model.
   */
  getModel(): TreeModel {
    return this._model;
  }

  /**
   * Sets the tree model.
   */
  setModel(model: TreeModel): this {
    this._model = model;
    this._expandedPaths.clear();
    this._selectedPath = null;
    this.updateUI();
    return this;
  }

  /**
   * Gets the cell renderer.
   */
  getCellRenderer(): TreeCellRenderer {
    return this._cellRenderer;
  }

  /**
   * Sets the cell renderer.
   */
  setCellRenderer(renderer: TreeCellRenderer): this {
    this._cellRenderer = renderer;
    this.updateUI();
    return this;
  }

  /**
   * Sets whether the root is visible.
   */
  setRootVisible(visible: boolean): this {
    this._rootVisible = visible;
    this.updateUI();
    return this;
  }

  /**
   * Sets whether to show root handles.
   */
  setShowsRootHandles(shows: boolean): this {
    this._showsRootHandles = shows;
    return this;
  }

  /**
   * Sets whether the tree is editable.
   */
  setEditable(editable: boolean): this {
    this._editable = editable;
    return this;
  }

  /**
   * Gets the row height.
   */
  getRowHeight(): number {
    return this._rowHeight;
  }

  /**
   * Sets the row height.
   */
  setRowHeight(height: number): this {
    this._rowHeight = height;
    this.updateUI();
    return this;
  }

  /**
   * Gets the selection path.
   */
  getSelectionPath(): TreePath | null {
    return this._selectedPath;
  }

  /**
   * Sets the selection path.
   */
  setSelectionPath(path: TreePath | null): this {
    this._selectedPath = path;
    this.updateUI();
    return this;
  }

  /**
   * Expands the path.
   */
  expandPath(path: TreePath): this {
    const node = path.getLastPathComponent();
    if (node) {
      this.setExpanded(node, true);
    }
    return this;
  }

  /**
   * Collapses the path.
   */
  collapsePath(path: TreePath): this {
    const node = path.getLastPathComponent();
    if (node) {
      this.setExpanded(node, false);
    }
    return this;
  }

  /**
   * Expands all nodes.
   */
  expandAll(): this {
    const root = this._model.getRoot();
    if (root) {
      this.expandAllNodes(root);
    }
    return this;
  }

  private expandAllNodes(node: any): void {
    this.setExpanded(node, true);
    const childCount = this._model.getChildCount(node);
    for (let i = 0; i < childCount; i++) {
      const child = this._model.getChild(node, i);
      if (child && !this._model.isLeaf(child)) {
        this.expandAllNodes(child);
      }
    }
  }

  /**
   * Collapses all nodes.
   */
  collapseAll(): this {
    this._expandedPaths.clear();
    this.updateUI();
    return this;
  }

  override getPreferredSize(): IntDimension {
    return new IntDimension(200, 300);
  }

  override setSizeWH(width: number, height: number): this {
    super.setSizeWH(width, height);
    if (this._treeElement) {
      this._treeElement.style.width = `${width}px`;
      this._treeElement.style.height = `${height}px`;
    }
    return this;
  }

  override toString(): string {
    const root = this._model.getRoot();
    return `JTree[root=${root ? this._model.getValue(root) : 'null'}]`;
  }
}
