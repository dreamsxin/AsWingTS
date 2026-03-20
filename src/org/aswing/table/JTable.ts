import { Component } from '../Component.js';
import { JScrollPane } from '../JScrollPane.js';
import { IntDimension } from '../geom/IntDimension.js';
import { TableModel, DefaultTableModel, TableModelListener, TableModelEvent } from './TableModel.js';
import { TableCellRenderer, DefaultTableCellRenderer } from './TableCellRenderer.js';

/**
 * Table column configuration.
 */
export interface TableColumn {
  modelIndex: number;
  headerRenderer?: TableCellRenderer;
  cellRenderer?: TableCellRenderer;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  resizable?: boolean;
  editable?: boolean;
}

/**
 * A table component for displaying and editing tabular data.
 */
export class JTable extends Component {
  private _model: TableModel;
  private _columnModel: TableColumn[];
  private _cellRenderers: Map<number, TableCellRenderer>;
  private _defaultRenderer: TableCellRenderer;
  private _rowHeight: number;
  private _gridColor: string;
  private _showGrid: boolean;
  private _tableElement: HTMLElement | null;
  private _headerElement: HTMLElement | null;
  private _bodyElement: HTMLElement | null;
  private _selectedRow: number;
  private _selectedColumn: number;

  constructor(model?: TableModel) {
    super();
    this._name = 'JTable';
    this._model = model || new DefaultTableModel();
    this._columnModel = [];
    this._cellRenderers = new Map();
    this._defaultRenderer = new DefaultTableCellRenderer();
    this._rowHeight = 24;
    this._gridColor = '#e0e0e0';
    this._showGrid = true;
    this._tableElement = null;
    this._headerElement = null;
    this._bodyElement = null;
    this._selectedRow = -1;
    this._selectedColumn = -1;
    
    this.initColumnModel();
  }

  private initColumnModel(): void {
    const columnCount = this._model.getColumnCount();
    for (let i = 0; i < columnCount; i++) {
      this._columnModel.push({
        modelIndex: i,
        width: 100,
        minWidth: 20,
        maxWidth: 10000,
        resizable: true,
        editable: true
      });
    }
  }

  override createRootElement(): HTMLElement {
    this._tableElement = document.createElement('div');
    this._tableElement.className = 'aswing-table';
    this._tableElement.style.position = 'absolute';
    this._tableElement.style.background = '#fff';
    this._tableElement.style.border = '1px solid #ccc';
    this._tableElement.style.overflow = 'auto';

    // Header
    this._headerElement = document.createElement('div');
    this._headerElement.className = 'aswing-table-header';
    this._headerElement.style.display = 'flex';
    this._headerElement.style.background = '#f5f5f5';
    this._headerElement.style.borderBottom = '1px solid #ccc';
    this._headerElement.style.position = 'sticky';
    this._headerElement.style.top = '0';
    this._headerElement.style.zIndex = '1';

    // Body
    this._bodyElement = document.createElement('div');
    this._bodyElement.className = 'aswing-table-body';
    this._bodyElement.style.position = 'relative';

    this._tableElement.appendChild(this._headerElement);
    this._tableElement.appendChild(this._bodyElement);

    this.updateUI();

    // Model listener
    const listener: TableModelListener = {
      tableChanged: (e: TableModelEvent) => this.updateUI()
    };
    this._model.addTableModelListener(listener);

    return this._tableElement;
  }

  private updateUI(): void {
    if (!this._headerElement || !this._bodyElement) return;

    this._headerElement.innerHTML = '';
    this._bodyElement.innerHTML = '';

    const columnCount = this._model.getColumnCount();
    const rowCount = this._model.getRowCount();

    // Create header
    for (let col = 0; col < columnCount; col++) {
      const headerCell = document.createElement('div');
      headerCell.className = 'aswing-table-header-cell';
      headerCell.textContent = this._model.getColumnName(col);
      headerCell.style.flex = '0 0 auto';
      headerCell.style.width = `${this._columnModel[col].width || 100}px`;
      headerCell.style.padding = '8px';
      headerCell.style.borderRight = '1px solid #e0e0e0';
      headerCell.style.fontWeight = 'bold';
      headerCell.style.background = '#f5f5f5';
      this._headerElement.appendChild(headerCell);
    }

    // Create body
    this._bodyElement.style.width = '100%';
    
    for (let row = 0; row < rowCount; row++) {
      const rowElement = document.createElement('div');
      rowElement.className = 'aswing-table-row';
      rowElement.style.display = 'flex';
      rowElement.style.height = `${this._rowHeight}px`;
      rowElement.style.borderBottom = this._showGrid ? `1px solid ${this._gridColor}` : 'none';
      
      // Selection
      if (row === this._selectedRow) {
        rowElement.style.background = '#e6f2ff';
      }

      for (let col = 0; col < columnCount; col++) {
        const cellElement = document.createElement('div');
        cellElement.className = 'aswing-table-cell';
        cellElement.style.flex = '0 0 auto';
        cellElement.style.width = `${this._columnModel[col].width || 100}px`;
        cellElement.style.padding = '4px 8px';
        cellElement.style.borderRight = this._showGrid ? `1px solid ${this._gridColor}` : 'none';
        cellElement.style.overflow = 'hidden';
        cellElement.style.textOverflow = 'ellipsis';
        cellElement.style.whiteSpace = 'nowrap';
        
        const value = this._model.getValueAt(row, col);
        cellElement.textContent = String(value != null ? value : '');
        
        // Selection
        if (row === this._selectedRow && col === this._selectedColumn) {
          cellElement.style.background = '#007bff';
          cellElement.style.color = '#fff';
        }

        rowElement.appendChild(cellElement);
      }

      this._bodyElement.appendChild(rowElement);
    }
  }

  /**
   * Gets the table model.
   */
  getModel(): TableModel {
    return this._model;
  }

  /**
   * Sets the table model.
   */
  setModel(model: TableModel): this {
    this._model = model;
    this.initColumnModel();
    this.updateUI();
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
   * Sets whether to show grid.
   */
  setShowGrid(show: boolean): this {
    this._showGrid = show;
    this.updateUI();
    return this;
  }

  /**
   * Sets the grid color.
   */
  setGridColor(color: string): this {
    this._gridColor = color;
    this.updateUI();
    return this;
  }

  /**
   * Gets the selected row.
   */
  getSelectedRow(): number {
    return this._selectedRow;
  }

  /**
   * Gets the selected column.
   */
  getSelectedColumn(): number {
    return this._selectedColumn;
  }

  /**
   * Gets the value at the specified cell.
   */
  getValueAt(row: number, column: number): any {
    return this._model.getValueAt(row, column);
  }

  /**
   * Sets the value at the specified cell.
   */
  setValueAt(value: any, row: number, column: number): this {
    this._model.setValueAt(value, row, column);
    return this;
  }

  /**
   * Gets the column count.
   */
  getColumnCount(): number {
    return this._model.getColumnCount();
  }

  /**
   * Gets the row count.
   */
  getRowCount(): number {
    return this._model.getRowCount();
  }

  override getPreferredSize(): IntDimension {
    const columnCount = this._model.getColumnCount();
    const width = columnCount * 100;
    const height = Math.min(this._model.getRowCount(), 10) * this._rowHeight + 30;
    return new IntDimension(width, height);
  }

  override setSizeWH(width: number, height: number): this {
    super.setSizeWH(width, height);
    if (this._tableElement) {
      this._tableElement.style.width = `${width}px`;
      this._tableElement.style.height = `${height}px`;
    }
    return this;
  }

  override toString(): string {
    return `JTable[rows=${this.getRowCount()},columns=${this.getColumnCount()}]`;
  }
}
