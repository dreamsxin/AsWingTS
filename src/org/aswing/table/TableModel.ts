/**
 * Event fired when table model changes.
 */
export class TableModelEvent {
  static readonly INSERT = 'insert';
  static readonly DELETE = 'delete';
  static readonly UPDATE = 'update';
  
  type: string;
  firstRow: number;
  lastRow: number;
  column: number;
  
  constructor(type: string, firstRow: number, lastRow: number, column: number = -1) {
    this.type = type;
    this.firstRow = firstRow;
    this.lastRow = lastRow;
    this.column = column;
  }
}

/**
 * Listener for table model changes.
 */
export interface TableModelListener {
  tableChanged(e: TableModelEvent): void;
}

/**
 * Table model interface for data access.
 */
export interface TableModel {
  /**
   * Gets the number of rows.
   */
  getRowCount(): number;
  
  /**
   * Gets the number of columns.
   */
  getColumnCount(): number;
  
  /**
   * Gets the column name.
   */
  getColumnName(columnIndex: number): string;
  
  /**
   * Gets the value at the specified cell.
   */
  getValueAt(rowIndex: number, columnIndex: number): any;
  
  /**
   * Sets the value at the specified cell.
   */
  setValueAt(value: any, rowIndex: number, columnIndex: number): void;
  
  /**
   * Returns whether the cell is editable.
   */
  isCellEditable(rowIndex: number, columnIndex: number): boolean;
  
  /**
   * Gets the column class.
   */
  getColumnClass(columnIndex: number): string;
  
  /**
   * Adds a listener.
   */
  addTableModelListener(listener: TableModelListener): void;
  
  /**
   * Removes a listener.
   */
  removeTableModelListener(listener: TableModelListener): void;
}

/**
 * Abstract table model with basic listener support.
 */
export abstract class AbstractTableModel implements TableModel {
  protected listeners: TableModelListener[] = [];
  
  abstract getRowCount(): number;
  abstract getColumnCount(): number;
  abstract getColumnName(columnIndex: number): string;
  abstract getValueAt(rowIndex: number, columnIndex: number): any;
  abstract setValueAt(value: any, rowIndex: number, columnIndex: number): void;
  abstract isCellEditable(rowIndex: number, columnIndex: number): boolean;
  
  getColumnClass(columnIndex: number): string {
    return 'string';
  }
  
  addTableModelListener(listener: TableModelListener): void {
    this.listeners.push(listener);
  }
  
  removeTableModelListener(listener: TableModelListener): void {
    const index = this.listeners.indexOf(listener);
    if (index >= 0) {
      this.listeners.splice(index, 1);
    }
  }
  
  protected fireTableChanged(e: TableModelEvent): void {
    this.listeners.forEach(listener => listener.tableChanged(e));
  }
  
  protected fireTableRowsInserted(firstRow: number, lastRow: number): void {
    this.fireTableChanged(new TableModelEvent(TableModelEvent.INSERT, firstRow, lastRow));
  }
  
  protected fireTableRowsDeleted(firstRow: number, lastRow: number): void {
    this.fireTableChanged(new TableModelEvent(TableModelEvent.DELETE, firstRow, lastRow));
  }
  
  protected fireTableCellUpdated(row: number, column: number): void {
    this.fireTableChanged(new TableModelEvent(TableModelEvent.UPDATE, row, row, column));
  }
  
  protected fireTableDataChanged(): void {
    this.fireTableChanged(new TableModelEvent(TableModelEvent.UPDATE, 0, this.getRowCount() - 1));
  }
}

/**
 * Default table model with array-based data storage.
 */
export class DefaultTableModel extends AbstractTableModel {
  protected data: any[][];
  protected columnNames: string[];
  protected columnClasses: string[];
  
  constructor(columnNames: string[] = [], rowCount: number = 0) {
    super();
    this.columnNames = columnNames;
    this.columnClasses = new Array(columnNames.length).fill('string');
    this.data = [];
    
    for (let i = 0; i < rowCount; i++) {
      this.data.push(new Array(columnNames.length).fill(null));
    }
  }
  
  override getRowCount(): number {
    return this.data.length;
  }
  
  override getColumnCount(): number {
    return this.columnNames.length;
  }
  
  override getColumnName(columnIndex: number): string {
    if (columnIndex < 0 || columnIndex >= this.columnNames.length) return '';
    return this.columnNames[columnIndex];
  }
  
  override getValueAt(rowIndex: number, columnIndex: number): any {
    if (rowIndex < 0 || rowIndex >= this.data.length) return null;
    if (columnIndex < 0 || columnIndex >= this.columnNames.length) return null;
    return this.data[rowIndex][columnIndex];
  }
  
  override setValueAt(value: any, rowIndex: number, columnIndex: number): void {
    if (rowIndex >= 0 && rowIndex < this.data.length && 
        columnIndex >= 0 && columnIndex < this.columnNames.length) {
      this.data[rowIndex][columnIndex] = value;
      this.fireTableCellUpdated(rowIndex, columnIndex);
    }
  }
  
  override isCellEditable(rowIndex: number, columnIndex: number): boolean {
    return true;
  }
  
  override getColumnClass(columnIndex: number): string {
    if (columnIndex < 0 || columnIndex >= this.columnClasses.length) return 'string';
    return this.columnClasses[columnIndex];
  }
  
  /**
   * Sets the column names.
   */
  setColumnNames(names: string[]): void {
    this.columnNames = names;
    this.columnClasses = new Array(names.length).fill('string');
    this.fireTableDataChanged();
  }
  
  /**
   * Sets the column class.
   */
  setColumnClass(columnIndex: number, className: string): void {
    if (columnIndex >= 0 && columnIndex < this.columnClasses.length) {
      this.columnClasses[columnIndex] = className;
    }
  }
  
  /**
   * Adds a row.
   */
  addRow(rowData: any[]): void {
    this.data.push([...rowData]);
    const rowIndex = this.data.length - 1;
    this.fireTableRowsInserted(rowIndex, rowIndex);
  }
  
  /**
   * Removes a row.
   */
  removeRow(rowIndex: number): void {
    if (rowIndex >= 0 && rowIndex < this.data.length) {
      this.data.splice(rowIndex, 1);
      this.fireTableRowsDeleted(rowIndex, rowIndex);
    }
  }
  
  /**
   * Gets all data.
   */
  getData(): any[][] {
    return this.data.map(row => [...row]);
  }
  
  /**
   * Sets all data.
   */
  setData(data: any[][]): void {
    this.data = data.map(row => [...row]);
    this.fireTableDataChanged();
  }
}
