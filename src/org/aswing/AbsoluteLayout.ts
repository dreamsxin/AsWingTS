import type { Container } from './Container.js';
import type { Component } from './Component.js';
import type { LayoutManager } from './LayoutManager.js';
import { IntDimension } from './geom/IntDimension.js';

/**
 * AbsoluteLayout - No automatic layout management.
 * Components are positioned manually using setLocation() and setSize().
 * 
 * This is useful when you need precise control over component positions,
 * such as in form builders, custom UI designs, or drag-and-drop interfaces.
 * 
 * @example
 * ```typescript
 * const panel = new JPanel();
 * panel.setLayout(new AbsoluteLayout());
 * 
 * const button = new JButton('Click Me');
 * button.setLocation(50, 100);  // Manual positioning
 * button.setSize(100, 30);
 * panel.add(button);
 * ```
 */
export class AbsoluteLayout implements LayoutManager {
  constructor() {
    // No configuration needed for AbsoluteLayout
  }

  /**
   * Adds a component to the layout.
   * AbsoluteLayout ignores constraints - components use their manually set positions.
   */
  addLayoutComponent(_component: Component, _constraints: unknown): void {
    // AbsoluteLayout doesn't use constraints
    // Components should be positioned using setLocation() and setSize()
  }

  /**
   * Removes a component from the layout.
   * No special cleanup needed.
   */
  removeLayoutComponent(_component: Component): void {
    // Nothing to do
  }

  /**
   * Lays out the components in the container.
   * 
   * AbsoluteLayout does NOT modify component positions or sizes.
   * Components retain whatever position and size were set via:
   * - component.setLocation(x, y)
   * - component.setSize(width, height)
   * - component.setBounds(x, y, width, height)
   * 
   * If a component has no explicit position, it defaults to (0, 0).
   * If a component has no explicit size, it uses its preferred size.
   */
  layoutContainer(container: Container): void {
    const components = container.getComponents();
    
    for (const comp of components) {
      // Force element creation
      comp.getElement();
      
      // If position not set, default to (0, 0)
      if (comp.getX() === 0 && comp.getY() === 0 && 
          comp.getWidth() === 0 && comp.getHeight() === 0) {
        // Use preferred size if no size set
        const prefSize = comp.getPreferredSize();
        comp.setSizeWH(prefSize.width, prefSize.height);
      }
      // Otherwise, keep the manually set position and size
    }
  }

  /**
   * Calculates the preferred size for the container.
   * 
   * For AbsoluteLayout, this is the bounding box that contains
   * all components (their positions + sizes).
   */
  preferredLayoutSize(container: Container): IntDimension {
    const components = container.getComponents();
    
    if (components.length === 0) {
      return new IntDimension(0, 0);
    }

    let maxX = 0;
    let maxY = 0;

    for (const comp of components) {
      const x = comp.getX();
      const y = comp.getY();
      const prefSize = comp.getPreferredSize();
      const width = comp.getWidth() > 0 ? comp.getWidth() : prefSize.width;
      const height = comp.getHeight() > 0 ? comp.getHeight() : prefSize.height;

      maxX = Math.max(maxX, x + width);
      maxY = Math.max(maxY, y + height);
    }

    return new IntDimension(maxX, maxY);
  }

  /**
   * Calculates the minimum size for the container.
   * Same as preferred size for AbsoluteLayout.
   */
  minimumLayoutSize(container: Container): IntDimension {
    return this.preferredLayoutSize(container);
  }

  /**
   * Invalidates the layout.
   * No-op for AbsoluteLayout since there's no cached layout data.
   */
  invalidateLayout(): void {
    // Nothing to invalidate
  }

  toString(): string {
    return 'AbsoluteLayout[]';
  }
}

/**
 * Helper class for defining constraints with AbsoluteLayout.
 * While AbsoluteLayout doesn't require constraints, this can be used
 * for documentation or future extensions.
 */
export class AbsoluteConstraints {
  /**
   * X position of the component.
   */
  x: number;
  
  /**
   * Y position of the component.
   */
  y: number;
  
  /**
   * Width of the component (optional, uses preferred width if not set).
   */
  width?: number;
  
  /**
   * Height of the component (optional, uses preferred height if not set).
   */
  height?: number;

  /**
   * Creates AbsoluteConstraints.
   * @param x X position
   * @param y Y position
   * @param width Width (optional)
   * @param height Height (optional)
   */
  constructor(x: number, y: number, width?: number, height?: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
