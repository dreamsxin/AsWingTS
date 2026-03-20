import { Component } from '../Component.js';

/**
 * Table cell renderer interface.
 */
export interface TableCellRenderer {
  /**
   * Gets the component to render the cell.
   */
  getTableCellRendererComponent(
    table: any,
    value: any,
    isSelected: boolean,
    hasFocus: boolean,
    row: number,
    column: number
  ): Component;
}

/**
 * Default table cell renderer using JLabel.
 */
export class DefaultTableCellRenderer implements TableCellRenderer {
  protected component: Component;
  
  constructor() {
    // Will be created dynamically based on value type
    this.component = null as any;
  }
  
  getTableCellRendererComponent(
    table: any,
    value: any,
    isSelected: boolean,
    hasFocus: boolean,
    row: number,
    column: number
  ): Component {
    const JLabel = (table as any).constructor === Function 
      ? (table as any).JLabel || (globalThis as any).JLabel
      : null;
    
    if (!JLabel) {
      // Fallback if JLabel not available
      this.component = this.createDefaultComponent(String(value));
    } else {
      this.component = new JLabel(String(value != null ? value : ''));
    }
    
    // Apply selection styling
    const el = this.component.getElement();
    if (el) {
      if (isSelected) {
        el.style.background = '#007bff';
        el.style.color = '#fff';
      } else {
        el.style.background = '#fff';
        el.style.color = '#333';
      }
      
      if (hasFocus) {
        el.style.border = '2px solid #007bff';
      } else {
        el.style.border = 'none';
      }
      
      el.style.padding = '4px 8px';
    }
    
    return this.component;
  }
  
  protected createDefaultComponent(text: string): Component {
    // Simple div component as fallback
    const div = document.createElement('div');
    div.textContent = text;
    div.style.padding = '4px 8px';
    
    return {
      getElement: () => div,
      setLocation: () => this,
      setSize: () => this,
      getPreferredSize: () => ({ width: 100, height: 20 })
    } as any;
  }
}

/**
 * Boolean cell renderer for checkboxes.
 */
export class BooleanCellRenderer implements TableCellRenderer {
  getTableCellRendererComponent(
    table: any,
    value: any,
    isSelected: boolean,
    hasFocus: boolean,
    row: number,
    column: number
  ): Component {
    const JCheckBox = (globalThis as any).JCheckBox;
    
    if (JCheckBox) {
      const checkBox = new JCheckBox('', Boolean(value));
      checkBox.setEnabled(false); // Read-only
      
      if (checkBox.getElement()) {
        checkBox.getElement().style.background = isSelected ? '#007bff' : '#fff';
        checkBox.getElement().style.border = 'none';
        checkBox.getElement().style.padding = '4px 8px';
      }
      
      return checkBox as any;
    }
    
    // Fallback
    return {
      getElement: () => {
        const div = document.createElement('div');
        div.textContent = Boolean(value) ? '☑' : '☐';
        div.style.textAlign = 'center';
        return div;
      },
      setLocation: () => this,
      setSize: () => this,
      getPreferredSize: () => ({ width: 30, height: 20 })
    } as any;
  }
}
