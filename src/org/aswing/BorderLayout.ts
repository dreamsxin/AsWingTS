import type { Container } from './Container.js';
import type { Component } from './Component.js';
import type { LayoutManager } from './LayoutManager.js';
import { IntDimension } from './geom/IntDimension.js';
import { AsWingConstants } from './AsWingConstants.js';
import { Debug } from './Debug.js';

/**
 * BorderLayout positions components in five areas: north, south, east, west, and center.
 */
export class BorderLayout implements LayoutManager {
  private _north: Component | null = null;
  private _south: Component | null = null;
  private _east: Component | null = null;
  private _west: Component | null = null;
  private _center: Component | null = null;

  private _hgap: number;
  private _vgap: number;

  constructor(hgap: number = 0, vgap: number = 0) {
    this._hgap = hgap;
    this._vgap = vgap;
  }

  addLayoutComponent(component: Component, constraints: unknown): void {
    Debug.log('layout', 'addLayoutComponent called, constraints:', constraints, 'type:', typeof constraints);
    Debug.log('layout', 'AsWingConstants.SOUTH:', AsWingConstants.SOUTH);
    if (typeof constraints === 'string') {
      switch (constraints) {
        case AsWingConstants.NORTH:
          this._north = component;
          Debug.log('layout', 'Set _north');
          break;
        case AsWingConstants.SOUTH:
          this._south = component;
          Debug.log('layout', 'Set _south');
          break;
        case AsWingConstants.EAST:
          this._east = component;
          Debug.log('layout', 'Set _east');
          break;
        case AsWingConstants.WEST:
          this._west = component;
          Debug.log('layout', 'Set _west');
          break;
        case AsWingConstants.CENTER:
          this._center = component;
          break;
      }
    }
  }

  removeLayoutComponent(component: Component): void {
    if (this._north === component) this._north = null;
    if (this._south === component) this._south = null;
    if (this._east === component) this._east = null;
    if (this._west === component) this._west = null;
    if (this._center === component) this._center = null;
  }

  layoutContainer(container: Container): void {
    // Use container's width/height directly (local coordinates)
    const width = container.getWidth();
    const height = container.getHeight();
    
    Debug.log('layout', 'layoutContainer called, container size:', width, 'x', height);
    
    // If container has no size yet, use preferred size
    let layoutWidth = width;
    let layoutHeight = height;
    if (layoutWidth <= 0 || layoutHeight <= 0) {
      const pref = this.preferredLayoutSize(container);
      layoutWidth = pref.width;
      layoutHeight = pref.height;
      Debug.log('layout', 'Using preferred size:', layoutWidth, 'x', layoutHeight);
    }
    
    const left = 0;
    const top = 0;
    const right = left + layoutWidth;
    const bottom = top + layoutHeight;

    // Layout north
    if (this._north) {
      const prefHeight = this._north.getPreferredSize().height;
      // Force element creation before setting position/size
      this._north.getElement();
      this._north.setLocationXY(this._hgap, this._vgap);
      this._north.setSizeWH(layoutWidth - this._hgap * 2, prefHeight);
    }

    // Layout south
    if (this._south) {
      const prefHeight = this._south.getPreferredSize().height;
      // Use a minimum height for south panel if preferred is too small
      const southHeight = Math.max(prefHeight, 50);
      const southY = layoutHeight - southHeight - this._vgap;
      // Force element creation before setting position/size
      this._south.getElement();
      this._south.setLocationXY(this._hgap, southY);
      this._south.setSizeWH(layoutWidth - this._hgap * 2, southHeight);
    }

    // Layout west - use explicit width if set, otherwise preferred
    if (this._west) {
      const westWidth = this._west.getWidth() > 0 ? this._west.getWidth() : this._west.getPreferredSize().width;
      const westTop = this._north ? this._north.getHeight() + this._vgap : this._vgap;
      const westHeight = layoutHeight - this._vgap * 2 - (this._north ? this._north.getHeight() : 0) - (this._south ? this._south.getHeight() : 0);
      // Force element creation before setting position/size
      this._west.getElement();
      this._west.setLocationXY(this._hgap, westTop);
      this._west.setSizeWH(westWidth, westHeight);
    }

    // Layout east - use explicit width if set, otherwise preferred
    if (this._east) {
      const eastWidth = this._east.getWidth() > 0 ? this._east.getWidth() : this._east.getPreferredSize().width;
      const eastTop = this._north ? this._north.getHeight() + this._vgap : this._vgap;
      const eastHeight = layoutHeight - this._vgap * 2 - (this._north ? this._north.getHeight() : 0) - (this._south ? this._south.getHeight() : 0);
      // Force element creation before setting position/size
      this._east.getElement();
      this._east.setLocationXY(layoutWidth - eastWidth - this._hgap, eastTop);
      this._east.setSizeWH(eastWidth, eastHeight);
    }

    // Layout center - must be done AFTER north/south/east/west
    if (this._center) {
      const centerLeft = this._west ? this._west.getWidth() + this._hgap : this._hgap;
      const centerWidth = layoutWidth - this._hgap * 2 - (this._west ? this._west.getWidth() : 0) - (this._east ? this._east.getWidth() : 0);
      const centerTop = this._north ? this._north.getHeight() + this._vgap : this._vgap;
      // Calculate center height based on actual south position, not preferred size
      const southTop = this._south ? this._south.getY() : layoutHeight;
      const centerHeight = southTop - centerTop - this._vgap;
      // Force element creation before setting position/size
      this._center.getElement();
      this._center.setLocationXY(centerLeft, centerTop);
      this._center.setSizeWH(centerWidth, centerHeight > 0 ? centerHeight : 0);
    }
  }

  preferredLayoutSize(container: Container): IntDimension {
    const components = container.getComponents();
    let maxWidth = 0;
    let maxHeight = 0;

    for (const comp of components) {
      const prefSize = comp.getPreferredSize();
      maxWidth = Math.max(maxWidth, prefSize.width);
      maxHeight = Math.max(maxHeight, prefSize.height);
    }

    return new IntDimension(
      maxWidth + this._hgap * 2,
      maxHeight + this._vgap * 2
    );
  }

  minimumLayoutSize(container: Container): IntDimension {
    return this.preferredLayoutSize(container);
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
    return `BorderLayout[hgap=${this._hgap},vgap=${this._vgap}]`;
  }
}
