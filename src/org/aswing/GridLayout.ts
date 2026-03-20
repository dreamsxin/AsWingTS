import type { Container } from './Container.js';
import type { Component } from './Component.js';
import type { LayoutManager } from './LayoutManager.js';
import { IntDimension } from './geom/IntDimension.js';

/**
 * GridLayout arranges components in a grid of equal-sized cells.
 */
export class GridLayout implements LayoutManager {
  private _rows: number;
  private _cols: number;
  private _hgap: number;
  private _vgap: number;

  /**
   * Creates a GridLayout.
   * @param rows Number of rows (0 means calculated from columns)
   * @param cols Number of columns (0 means calculated from rows)
   * @param hgap Horizontal gap between cells
   * @param vgap Vertical gap between cells
   */
  constructor(rows: number = 1, cols: number = 0, hgap: number = 0, vgap: number = 0) {
    this._rows = rows;
    this._cols = cols;
    this._hgap = hgap;
    this._vgap = vgap;
  }

  addLayoutComponent(_component: Component, _constraints: unknown): void {
    // GridLayout doesn't use constraints
  }

  removeLayoutComponent(_component: Component): void {
    // Nothing to do
  }

  layoutContainer(container: Container): void {
    const components = container.getComponents();
    if (components.length === 0) return;

    const containerWidth = container.getWidth();
    const containerHeight = container.getHeight();

    // Calculate actual rows and columns
    let rows = this._rows;
    let cols = this._cols;

    if (cols === 0) {
      cols = Math.ceil(components.length / rows);
    }
    if (rows === 0) {
      rows = Math.ceil(components.length / cols);
    }

    // Calculate cell size
    const availableWidth = containerWidth - this._hgap * (cols + 1);
    const availableHeight = containerHeight - this._vgap * (rows + 1);
    
    const cellWidth = Math.floor(availableWidth / cols);
    const cellHeight = Math.floor(availableHeight / rows);

    // Position components
    let index = 0;
    for (let row = 0; row < rows && index < components.length; row++) {
      for (let col = 0; col < cols && index < components.length; col++) {
        const comp = components[index];
        
        const x = this._hgap + col * (cellWidth + this._hgap);
        const y = this._vgap + row * (cellHeight + this._vgap);

        comp.getElement(); // Force element creation
        comp.setLocationXY(x, y);
        comp.setSizeWH(cellWidth, cellHeight);
        
        index++;
      }
    }
  }

  preferredLayoutSize(container: Container): IntDimension {
    const components = container.getComponents();
    if (components.length === 0) {
      return new IntDimension(this._hgap * 2, this._vgap * 2);
    }

    // Calculate actual rows and columns
    let rows = this._rows;
    let cols = this._cols;

    if (cols === 0) {
      cols = Math.ceil(components.length / rows);
    }
    if (rows === 0) {
      rows = Math.ceil(components.length / cols);
    }

    // Find maximum component size
    let maxCompWidth = 0;
    let maxCompHeight = 0;

    for (const comp of components) {
      const prefSize = comp.getPreferredSize();
      maxCompWidth = Math.max(maxCompWidth, prefSize.width);
      maxCompHeight = Math.max(maxCompHeight, prefSize.height);
    }

    // Calculate total size
    const totalWidth = cols * maxCompWidth + this._hgap * (cols + 1);
    const totalHeight = rows * maxCompHeight + this._vgap * (rows + 1);

    return new IntDimension(totalWidth, totalHeight);
  }

  minimumLayoutSize(container: Container): IntDimension {
    return this.preferredLayoutSize(container);
  }

  /**
   * Gets the number of rows.
   */
  getRows(): number {
    return this._rows;
  }

  /**
   * Sets the number of rows.
   */
  setRows(rows: number): void {
    this._rows = rows;
  }

  /**
   * Gets the number of columns.
   */
  getColumns(): number {
    return this._cols;
  }

  /**
   * Sets the number of columns.
   */
  setColumns(cols: number): void {
    this._cols = cols;
  }

  /**
   * Gets the horizontal gap.
   */
  getHgap(): number {
    return this._hgap;
  }

  /**
   * Sets the horizontal gap.
   */
  setHgap(hgap: number): void {
    this._hgap = hgap;
  }

  /**
   * Gets the vertical gap.
   */
  getVgap(): number {
    return this._vgap;
  }

  /**
   * Sets the vertical gap.
   */
  setVgap(vgap: number): void {
    this._vgap = vgap;
  }

  toString(): string {
    return `GridLayout[rows=${this._rows},cols=${this._cols},hgap=${this._hgap},vgap=${this._vgap}]`;
  }
}
