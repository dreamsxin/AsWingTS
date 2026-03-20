import type { Container } from './Container.js';
import type { Component } from './Component.js';
import type { LayoutManager } from './LayoutManager.js';
import { IntDimension } from './geom/IntDimension.js';
import { AsWingConstants } from './AsWingConstants.js';

/**
 * BoxLayout arranges components in a single row or column.
 */
export class BoxLayout implements LayoutManager {
  private _axis: string;
  private _gap: number;

  /**
   * Creates a BoxLayout.
   * @param axis Layout axis (X_AXIS, Y_AXIS)
   * @param gap Gap between components
   */
  constructor(axis: string = AsWingConstants.Y_AXIS, gap: number = 0) {
    this._axis = axis;
    this._gap = gap;
  }

  static readonly X_AXIS = 'xAxis';
  static readonly Y_AXIS = 'yAxis';

  addLayoutComponent(_component: Component, _constraints: unknown): void {
    // BoxLayout doesn't use constraints
  }

  removeLayoutComponent(_component: Component): void {
    // Nothing to do
  }

  layoutContainer(container: Container): void {
    const components = container.getComponents();
    if (components.length === 0) return;

    const containerWidth = container.getWidth();
    const containerHeight = container.getHeight();

    if (this._axis === AsWingConstants.X_AXIS) {
      // Horizontal layout
      let x = 0;
      
      // Calculate total preferred width
      let totalPrefWidth = 0;
      for (let i = 0; i < components.length; i++) {
        totalPrefWidth += components[i].getPreferredSize().width;
        if (i > 0) totalPrefWidth += this._gap;
      }

      // Calculate stretch factor for each component
      const availableWidth = containerWidth;
      const extraWidth = availableWidth - totalPrefWidth;
      const stretchPerComp = components.length > 0 ? extraWidth / components.length : 0;

      // Position components
      for (const comp of components) {
        const prefSize = comp.getPreferredSize();
        const compWidth = Math.max(0, prefSize.width + stretchPerComp);
        const compHeight = containerHeight;

        comp.getElement(); // Force element creation
        comp.setLocationXY(x, 0);
        comp.setSizeWH(compWidth, compHeight);

        x += compWidth + this._gap;
      }
    } else {
      // Vertical layout
      let y = 0;
      
      // Calculate total preferred height
      let totalPrefHeight = 0;
      for (let i = 0; i < components.length; i++) {
        totalPrefHeight += components[i].getPreferredSize().height;
        if (i > 0) totalPrefHeight += this._gap;
      }

      // Calculate stretch factor for each component
      const availableHeight = containerHeight;
      const extraHeight = availableHeight - totalPrefHeight;
      const stretchPerComp = components.length > 0 ? extraHeight / components.length : 0;

      // Position components
      for (const comp of components) {
        const prefSize = comp.getPreferredSize();
        const compWidth = containerWidth;
        const compHeight = Math.max(0, prefSize.height + stretchPerComp);

        comp.getElement(); // Force element creation
        comp.setLocationXY(0, y);
        comp.setSizeWH(compWidth, compHeight);

        y += compHeight + this._gap;
      }
    }
  }

  preferredLayoutSize(container: Container): IntDimension {
    const components = container.getComponents();
    if (components.length === 0) {
      return new IntDimension(0, 0);
    }

    if (this._axis === AsWingConstants.X_AXIS) {
      // Horizontal: sum widths, max height
      let totalWidth = 0;
      let maxHeight = 0;

      for (let i = 0; i < components.length; i++) {
        const prefSize = components[i].getPreferredSize();
        totalWidth += prefSize.width;
        maxHeight = Math.max(maxHeight, prefSize.height);
        if (i > 0) totalWidth += this._gap;
      }

      return new IntDimension(totalWidth, maxHeight);
    } else {
      // Vertical: max width, sum heights
      let maxWidth = 0;
      let totalHeight = 0;

      for (let i = 0; i < components.length; i++) {
        const prefSize = components[i].getPreferredSize();
        maxWidth = Math.max(maxWidth, prefSize.width);
        totalHeight += prefSize.height;
        if (i > 0) totalHeight += this._gap;
      }

      return new IntDimension(maxWidth, totalHeight);
    }
  }

  minimumLayoutSize(container: Container): IntDimension {
    return this.preferredLayoutSize(container);
  }

  /**
   * Gets the axis.
   */
  getAxis(): string {
    return this._axis;
  }

  /**
   * Sets the axis.
   */
  setAxis(axis: string): void {
    this._axis = axis;
  }

  /**
   * Gets the gap.
   */
  getGap(): number {
    return this._gap;
  }

  /**
   * Sets the gap.
   */
  setGap(gap: number): void {
    this._gap = gap;
  }

  toString(): string {
    return `BoxLayout[axis=${this._axis},gap=${this._gap}]`;
  }
}
