import { Component } from '../Component.js';
import { TreeNode } from './TreeNode.js';

/**
 * Tree cell renderer interface.
 */
export interface TreeCellRenderer {
  /**
   * Gets the component to render the tree cell.
   */
  getTreeCellRendererComponent(
    tree: any,
    value: any,
    isSelected: boolean,
    isExpanded: boolean,
    isLeaf: boolean,
    row: number,
    hasFocus: boolean
  ): Component;
}

/**
 * Default tree cell renderer.
 */
export class DefaultTreeCellRenderer implements TreeCellRenderer {
  protected component: Component;
  
  constructor() {
    this.component = null as any;
  }
  
  getTreeCellRendererComponent(
    tree: any,
    value: any,
    isSelected: boolean,
    isExpanded: boolean,
    isLeaf: boolean,
    row: number,
    hasFocus: boolean
  ): Component {
    const JLabel = (globalThis as any).JLabel;
    
    if (JLabel) {
      const text = value != null ? String(value) : '';
      const icon = isLeaf ? '📄 ' : (isExpanded ? '📂 ' : '📁 ');
      this.component = new JLabel(icon + text);
      
      const el = this.component.getElement();
      if (el) {
        if (isSelected) {
          el.style.background = '#007bff';
          el.style.color = '#fff';
        } else {
          el.style.background = '#fff';
          el.style.color = '#333';
        }
        
        el.style.padding = '2px 4px';
        el.style.borderRadius = '2px';
      }
    } else {
      this.component = this.createDefaultComponent(value, isLeaf, isExpanded);
    }
    
    return this.component;
  }
  
  protected createDefaultComponent(value: any, isLeaf: boolean, isExpanded: boolean): Component {
    const div = document.createElement('div');
    const icon = isLeaf ? '📄 ' : (isExpanded ? '📂 ' : '📁 ');
    div.textContent = icon + (value != null ? String(value) : '');
    div.style.padding = '2px 4px';
    
    return {
      getElement: () => div,
      setLocation: () => this,
      setSize: () => this,
      getPreferredSize: () => ({ width: 150, height: 20 })
    } as any;
  }
}
