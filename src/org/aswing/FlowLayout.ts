import type { Container } from './Container.js';
import type { Component } from './Component.js';
import type { LayoutManager } from './LayoutManager.js';
import { IntDimension } from './geom/IntDimension.js';
import { AsWingConstants } from './AsWingConstants.js';

/**
 * FlowLayout arranges components in a left-to-right flow, wrapping to the next line.
 * Similar to HTML inline elements.
 */
export class FlowLayout implements LayoutManager {
  private _alignment: string;
  private _hgap: number;
  private _vgap: number;

  /**
   * Creates a FlowLayout.
   * @param alignment Alignment (LEFT, CENTER, RIGHT)
   * @param hgap Horizontal gap between components
   * @param vgap Vertical gap between components
   */
  constructor(alignment: string = AsWingConstants.CENTER, hgap: number = 5, vgap: number = 5) {
    this._alignment = alignment;
    this._hgap = hgap;
    this._vgap = vgap;
  }

  addLayoutComponent(_component: Component, _constraints: unknown): void {
    // FlowLayout doesn't use constraints
  }

  removeLayoutComponent(_component: Component): void {
    // Nothing to do
  }

  layoutContainer(container: Container): void {
    const components = container.getComponents();
    const containerWidth = container.getWidth();
    const containerHeight = container.getHeight();
    
    if (components.length === 0) return;

    let x = this._hgap;
    let y = this._vgap;
    let rowHeight = 0;
    let currentRowWidth = 0;

    // First pass: calculate row heights and positions
    const rows: Array<{
      components: Component[];
      widths: number[];
      heights: number[];
      xOffsets: number[];
      totalWidth: number;
      maxHeight: number;
    }> = [];

    let currentRow: Component[] = [];
    let currentWidths: number[] = [];
    let currentHeights: number[] = [];
    let currentXOffsets: number[] = [];
    let rowTotalWidth = 0;
    let rowMaxHeight = 0;

    for (const comp of components) {
      const prefSize = comp.getPreferredSize();
      const compWidth = prefSize.width;
      const compHeight = prefSize.height;

      // Check if component fits in current row
      if (currentRow.length > 0 && x + compWidth > containerWidth - this._hgap) {
        // Start new row
        rows.push({
          components: [...currentRow],
          widths: [...currentWidths],
          heights: [...currentHeights],
          xOffsets: [...currentXOffsets],
          totalWidth: rowTotalWidth,
          maxHeight: rowMaxHeight
        });
        
        // Reset row
        currentRow = [];
        currentWidths = [];
        currentHeights = [];
        currentXOffsets = [];
        rowTotalWidth = 0;
        rowMaxHeight = 0;
        x = this._hgap;
      }

      currentRow.push(comp);
      currentWidths.push(compWidth);
      currentHeights.push(compHeight);
      currentXOffsets.push(x);
      rowTotalWidth += compWidth + this._hgap;
      rowMaxHeight = Math.max(rowMaxHeight, compHeight);
      
      x += compWidth + this._hgap;
    }

    // Add last row
    if (currentRow.length > 0) {
      rows.push({
        components: currentRow,
        widths: currentWidths,
        heights: currentHeights,
        xOffsets: currentXOffsets,
        totalWidth: rowTotalWidth,
        maxHeight: rowMaxHeight
      });
    }

    // Second pass: position components
    y = this._vgap;
    for (const row of rows) {
      const rowWidth = row.totalWidth - this._hgap; // Remove last gap
      let startX = this._hgap;

      // Calculate start X based on alignment
      if (this._alignment === AsWingConstants.CENTER) {
        startX = (containerWidth - rowWidth) / 2;
      } else if (this._alignment === AsWingConstants.RIGHT) {
        startX = containerWidth - rowWidth - this._hgap;
      }

      // Position components in row
      for (let i = 0; i < row.components.length; i++) {
        const comp = row.components[i];
        const compWidth = row.widths[i];
        const compHeight = row.heights[i];
        const xOffset = row.xOffsets[i];

        // Calculate final position
        const finalX = this._alignment === AsWingConstants.CENTER 
          ? startX + (xOffset - this._hgap)
          : this._alignment === AsWingConstants.RIGHT
            ? startX + (xOffset - this._hgap)
            : xOffset;

        // Center component vertically in row
        const finalY = y + (row.maxHeight - compHeight) / 2;

        comp.getElement(); // Force element creation
        comp.setLocationXY(finalX, finalY);
        comp.setSizeWH(compWidth, compHeight);
      }

      y += row.maxHeight + this._vgap;
    }
  }

  preferredLayoutSize(container: Container): IntDimension {
    const components = container.getComponents();
    if (components.length === 0) {
      return new IntDimension(this._hgap * 2, this._vgap * 2);
    }

    let maxWidth = 0;
    let totalHeight = 0;
    let currentRowWidth = 0;
    let currentRowHeight = 0;

    for (const comp of components) {
      const prefSize = comp.getPreferredSize();
      
      if (currentRowWidth + prefSize.width > maxWidth && currentRowWidth > 0) {
        // New row
        maxWidth = Math.max(maxWidth, currentRowWidth);
        totalHeight += currentRowHeight + this._vgap;
        currentRowWidth = prefSize.width + this._hgap;
        currentRowHeight = prefSize.height;
      } else {
        currentRowWidth += prefSize.width + this._hgap;
        currentRowHeight = Math.max(currentRowHeight, prefSize.height);
      }
    }

    // Add last row
    maxWidth = Math.max(maxWidth, currentRowWidth);
    totalHeight += currentRowHeight;

    return new IntDimension(
      maxWidth + this._hgap * 2,
      totalHeight + this._vgap * 2
    );
  }

  minimumLayoutSize(container: Container): IntDimension {
    return this.preferredLayoutSize(container);
  }

  /**
   * Gets the alignment.
   */
  getAlignment(): string {
    return this._alignment;
  }

  /**
   * Sets the alignment.
   */
  setAlignment(alignment: string): void {
    this._alignment = alignment;
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
    return `FlowLayout[align=${this._alignment},hgap=${this._hgap},vgap=${this._vgap}]`;
  }
}
