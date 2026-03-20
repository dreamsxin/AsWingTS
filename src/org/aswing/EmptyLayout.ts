import type { Container } from './Container.js';
import type { Component } from './Component.js';
import type { LayoutManager } from './LayoutManager.js';
import { IntDimension } from './geom/IntDimension.js';

/**
 * A dummy layout manager that does nothing.
 * Used as the default layout for containers.
 */
export class EmptyLayout implements LayoutManager {
  addLayoutComponent(_component: Component, _constraints: unknown): void {
    // Do nothing
  }

  removeLayoutComponent(_component: Component): void {
    // Do nothing
  }

  layoutContainer(_container: Container): void {
    // Do nothing - components keep their own positions
  }

  preferredLayoutSize(container: Container): IntDimension {
    let maxWidth = 0;
    let maxHeight = 0;

    const components = container.getComponents();
    for (const comp of components) {
      const prefSize = comp.getPreferredSize();
      maxWidth = Math.max(maxWidth, prefSize.width);
      maxHeight = Math.max(maxHeight, prefSize.height);
    }

    return new IntDimension(maxWidth, maxHeight);
  }

  minimumLayoutSize(container: Container): IntDimension {
    return this.preferredLayoutSize(container);
  }

  toString(): string {
    return 'EmptyLayout[]';
  }
}
