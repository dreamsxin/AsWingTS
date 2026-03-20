import type { Container } from './Container.js';
import type { Component } from './Component.js';
import { IntDimension } from './geom/IntDimension.js';

/**
 * Interface for layout managers.
 * Layout managers determine the size and position of components within a container.
 */
export interface LayoutManager {
  /**
   * Adds a component to the layout with the specified constraints.
   */
  addLayoutComponent(component: Component, constraints: unknown): void;

  /**
   * Removes a component from the layout.
   */
  removeLayoutComponent(component: Component): void;

  /**
   * Lays out the components in the specified container.
   */
  layoutContainer(container: Container): void;

  /**
   * Calculates the preferred size for the container.
   */
  preferredLayoutSize(container: Container): IntDimension;

  /**
   * Calculates the minimum size for the container.
   */
  minimumLayoutSize(container: Container): IntDimension;

  /**
   * Calculates the maximum size for the container.
   */
  maximumLayoutSize?(container: Container): IntDimension;

  /**
   * Returns the alignment along the x-axis.
   */
  layoutAlignmentX?(container: Container): number;

  /**
   * Returns the alignment along the y-axis.
   */
  layoutAlignmentY?(container: Container): number;

  /**
   * Invalidates the layout, marking it as needing recalculation.
   */
  invalidateLayout?(): void;
}
