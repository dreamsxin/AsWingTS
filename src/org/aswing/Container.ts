import { Component } from './Component.js';
import { ContainerEvent } from './event/ContainerEvent.js';
import { IntDimension } from './geom/IntDimension.js';
import { LayoutManager } from './LayoutManager.js';
import { EmptyLayout } from './EmptyLayout.js';
import { Debug } from './Debug.js';

/**
 * Container can contain many components as its children.
 * All children are within its bounds, and when it moves, all children move.
 * When it's removed from the stage, all children are removed.
 */
export class Container extends Component {
  protected _children: Component[];
  protected _layout: LayoutManager;
  protected _childrenDrawTransparentTrigger: boolean;

  constructor() {
    super();
    this._name = 'Container';
    this._children = [];
    this._layout = new EmptyLayout();
    this._childrenDrawTransparentTrigger = true;
  }

  override createRootElement(): HTMLElement {
    const element = document.createElement('div');
    element.className = 'aswing-container';
    return element;
  }

  /**
   * Sets the layout manager for this container.
   */
  setLayout(layout: LayoutManager): void {
    this._layout = layout;
    this.revalidate();
  }

  /**
   * Gets the layout manager.
   */
  getLayout(): LayoutManager {
    return this._layout;
  }

  /**
   * Sets whether children components will draw transparent trigger.
   */
  setChildrenDrawTransparentTrigger(b: boolean): void {
    if (b !== this._childrenDrawTransparentTrigger) {
      this._childrenDrawTransparentTrigger = b;
      this.repaint();
    }
  }

  /**
   * Returns whether children draw transparent trigger.
   */
  isChildrenDrawTransparentTrigger(): boolean {
    return this._childrenDrawTransparentTrigger;
  }

  /**
   * Adds a component to this container.
   */
  add(child: Component, constraints?: unknown): Component {
    return this.addImpl(child, constraints, -1);
  }

  /**
   * Adds a component at the specified index.
   */
  addAt(child: Component, index: number, constraints?: unknown): Component {
    return this.addImpl(child, constraints, index);
  }

  private addImpl(child: Component, constraints: unknown = null, index: number = -1): Component {
    // Remove from previous parent if any
    if (child.getParent()) {
      child.getParent()!.remove(child);
    }

    // Set parent reference
    (child as any)._parent = this;

    // Add to children array
    if (index < 0 || index >= this._children.length) {
      this._children.push(child);
    } else {
      this._children.splice(index, 0, child);
    }

    // Add to DOM - force element creation
    const containerElement = this.getElement();
    const childElement = child.getElement();
    if (containerElement && childElement) {
      if (index < 0 || index >= containerElement.children.length) {
        containerElement.appendChild(childElement);
      } else {
        containerElement.insertBefore(childElement, containerElement.children[index]);
      }
    }
    


    // Apply layout constraints if any
    Debug.log('container', 'addImpl: constraints=', constraints, 'constraints !== null:', constraints !== null);
    if (constraints !== null && constraints !== undefined) {
      Debug.log('container', 'Calling addLayoutComponent');
      this._layout.addLayoutComponent(child, constraints);
    } else {
      Debug.log('container', 'NOT calling addLayoutComponent, constraints:', constraints);
    }

    // Dispatch event
    this.dispatchEvent(new ContainerEvent(ContainerEvent.COM_ADDED, child));

    // Force element creation for the child
    child.getElement();
    
    this.revalidate();
    return child;
  }

  /**
   * Removes a component from this container.
   */
  remove(child: Component): Component | null {
    const index = this._children.indexOf(child);
    if (index >= 0) {
      return this.removeAt(index);
    }
    return null;
  }

  /**
   * Removes a component at the specified index.
   */
  removeAt(index: number): Component | null {
    if (index < 0 || index >= this._children.length) {
      return null;
    }

    const child = this._children[index];
    this._children.splice(index, 1);

    // Remove from DOM
    const childElement = child.getElement();
    if (childElement && childElement.parentElement) {
      childElement.parentElement.removeChild(childElement);
    }

    // Clear parent reference
    (child as any)._parent = null;

    // Remove from layout
    this._layout.removeLayoutComponent(child);

    // Dispatch event
    this.dispatchEvent(new ContainerEvent(ContainerEvent.COM_REMOVED, child));

    this.revalidate();
    return child;
  }

  /**
   * Removes all components from this container.
   */
  removeAll(): void {
    while (this._children.length > 0) {
      this.removeAt(0);
    }
  }

  /**
   * Gets the number of children.
   */
  getComponentCount(): number {
    return this._children.length;
  }

  /**
   * Gets a component at the specified index.
   */
  getComponentAt(index: number): Component | null {
    if (index < 0 || index >= this._children.length) {
      return null;
    }
    return this._children[index];
  }

  /**
   * Gets all children components.
   */
  getComponents(): Component[] {
    return [...this._children];
  }

  /**
   * Checks if this container contains the specified component.
   */
  containsComponent(comp: Component): boolean {
    return this._children.includes(comp);
  }

  /**
   * Gets the index of the specified component.
   */
  getComponentIndex(comp: Component): number {
    return this._children.indexOf(comp);
  }

  override invalidate(): void {
    super.invalidate();
    for (const child of this._children) {
      child.invalidate();
    }
  }

  override validate(): void {
    super.validate();
    if (this._layout) {
      this._layout.layoutContainer(this);
    }
  }

  override getPreferredSize(): IntDimension {
    return this._layout.preferredLayoutSize(this);
  }

  override getMinimumSize(): IntDimension {
    return this._layout.minimumLayoutSize(this);
  }

  override setSizeWH(width: number, height: number): void {
    super.setSizeWH(width, height);
    // Re-run layout when container is resized
    this.revalidate();
  }

  override toString(): string {
    return `${this._name}[${this._x},${this._y},${this._width},${this._height},children=${this._children.length}]`;
  }
}
