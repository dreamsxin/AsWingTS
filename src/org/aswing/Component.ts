import { AWEvent } from './event/AWEvent.js';
import { MovedEvent } from './event/MovedEvent.js';
import { ResizedEvent } from './event/ResizedEvent.js';
import { IntDimension } from './geom/IntDimension.js';
import { IntPoint } from './geom/IntPoint.js';
import { IntRectangle } from './geom/IntRectangle.js';
import { AsWingManager } from './AsWingManager.js';
import type { Container } from './Container.js';

/**
 * Base class for all UI components.
 * Provides common functionality for positioning, sizing, visibility, and events.
 */
export class Component extends EventTarget {
  protected _name: string;
  protected _visible: boolean;
  protected _enabled: boolean;
  public _x: number;
  public _y: number;
  public _width: number;
  public _height: number;
  protected _preferredSize: IntDimension | null;
  protected _minimumSize: IntDimension | null;
  protected _maximumSize: IntDimension | null;
  protected _opaque: boolean;
  protected _drawTransparentTrigger: boolean;
  protected _element: HTMLElement | null;

  constructor() {
    super();
    this._name = 'Component';
    this._visible = true;
    this._enabled = true;
    this._x = 0;
    this._y = 0;
    this._width = 0;
    this._height = 0;
    this._preferredSize = null;
    this._minimumSize = null;
    this._maximumSize = null;
    this._opaque = false;
    this._drawTransparentTrigger = true;
    this._element = null;
  }

  /**
   * Creates and returns the DOM element for this component.
   */
  protected createRootElement(): HTMLElement {
    const element = document.createElement('div');
    element.className = 'aswing-component';
    return element;
  }

  /**
   * Gets the underlying DOM element.
   */
  getElement(): HTMLElement | null {
    if (!this._element) {
      this._element = this.createRootElement();
    }
    return this._element;
  }

  /**
   * Sets the component name.
   */
  setName(name: string): void {
    this._name = name;
  }

  /**
   * Gets the component name.
   */
  getName(): string {
    return this._name;
  }

  /**
   * Sets whether the component is visible.
   */
  setVisible(visible: boolean): void {
    if (this._visible !== visible) {
      this._visible = visible;
      if (this._element) {
        this._element.style.display = visible ? '' : 'none';
      }
      if (visible) {
        this.dispatchEvent(new AWEvent(AWEvent.SHOWN));
      } else {
        this.dispatchEvent(new AWEvent(AWEvent.HIDDEN));
      }
    }
  }

  /**
   * Returns whether the component is visible.
   */
  isVisible(): boolean {
    return this._visible;
  }

  /**
   * Sets whether the component is enabled.
   */
  setEnabled(enabled: boolean): void {
    this._enabled = enabled;
    if (this._element) {
      this._element.style.pointerEvents = enabled ? 'auto' : 'none';
      this._element.style.opacity = enabled ? '1' : '0.5';
    }
  }

  /**
   * Returns whether the component is enabled.
   */
  isEnabled(): boolean {
    return this._enabled;
  }

  /**
   * Sets the location of this component.
   */
  setLocation(x: number, y: number): void {
    this.setLocationPoint(new IntPoint(x, y));
  }

  /**
   * Sets the location of this component using a point.
   */
  setLocationPoint(p: IntPoint): void {
    this.setLocationXY(p.x, p.y);
  }

  /**
   * Sets the location of this component with x and y.
   */
  setLocationXY(x: number, y: number): void {
    const oldLocation = new IntPoint(this._x, this._y);
    this._x = x;
    this._y = y;

    // Force element creation to ensure CSS is applied
    this.getElement();
    if (this._element) {
      this._element.style.position = 'absolute';
      this._element.style.left = `${x}px`;
      this._element.style.top = `${y}px`;
    }

    const newLocation = new IntPoint(this._x, this._y);
    if (!oldLocation.equals(newLocation)) {
      this.dispatchEvent(new MovedEvent(MovedEvent.MOVED, oldLocation, newLocation));
    }
  }

  /**
   * Gets the x coordinate.
   */
  getX(): number {
    return this._x;
  }

  /**
   * Gets the y coordinate.
   */
  getY(): number {
    return this._y;
  }

  /**
   * Gets the location.
   */
  getLocation(): IntPoint {
    return new IntPoint(this._x, this._y);
  }

  /**
   * Sets the size of this component.
   */
  setSize(width: number, height: number): void {
    this.setSizeDimension(new IntDimension(width, height));
  }

  /**
   * Sets the size of this component using a dimension.
   */
  setSizeDimension(d: IntDimension): void {
    this.setSizeWH(d.width, d.height);
  }

  /**
   * Sets the size of this component with width and height.
   */
  setSizeWH(width: number, height: number): void {
    const oldSize = new IntDimension(this._width, this._height);
    this._width = width;
    this._height = height;

    // Force element creation to ensure CSS is applied
    this.getElement();
    if (this._element) {
      this._element.style.width = `${width}px`;
      this._element.style.height = `${height}px`;
    }

    const newSize = new IntDimension(this._width, this._height);
    if (!oldSize.equals(newSize)) {
      this.dispatchEvent(new ResizedEvent(ResizedEvent.RESIZED, oldSize, newSize));
    }
  }

  /**
   * Gets the width.
   */
  getWidth(): number {
    return this._width;
  }

  /**
   * Gets the height.
   */
  getHeight(): number {
    return this._height;
  }

  /**
   * Gets the size.
   */
  getSize(): IntDimension {
    return new IntDimension(this._width, this._height);
  }

  /**
   * Gets the bounds of this component.
   */
  getBounds(): IntRectangle {
    return new IntRectangle(this._x, this._y, this._width, this._height);
  }

  /**
   * Sets the bounds of this component.
   */
  setBounds(x: number, y: number, width: number, height: number): void {
    this.setLocation(x, y);
    this.setSize(width, height);
  }

  /**
   * Sets the preferred size.
   */
  setPreferredSize(size: IntDimension): void {
    this._preferredSize = size;
  }

  /**
   * Gets the preferred size.
   */
  getPreferredSize(): IntDimension {
    if (this._preferredSize) {
      return this._preferredSize.clone();
    }
    // If size is set, use it as preferred size
    if (this._width > 0 || this._height > 0) {
      return new IntDimension(this._width, this._height);
    }
    return new IntDimension(0, 0);
  }

  /**
   * Sets the minimum size.
   */
  setMinimumSize(size: IntDimension): void {
    this._minimumSize = size;
  }

  /**
   * Gets the minimum size.
   */
  getMinimumSize(): IntDimension {
    if (this._minimumSize) {
      return this._minimumSize.clone();
    }
    return new IntDimension(0, 0);
  }

  /**
   * Sets the maximum size.
   */
  setMaximumSize(size: IntDimension): void {
    this._maximumSize = size;
  }

  /**
   * Gets the maximum size.
   */
  getMaximumSize(): IntDimension {
    if (this._maximumSize) {
      return this._maximumSize.clone();
    }
    return IntDimension.createBigDimension();
  }

  /**
   * Sets whether the component is opaque.
   */
  setOpaque(opaque: boolean): void {
    this._opaque = opaque;
    if (this._element) {
      this._element.style.background = opaque ? '' : 'transparent';
    }
  }

  /**
   * Returns whether the component is opaque.
   */
  isOpaque(): boolean {
    return this._opaque;
  }

  /**
   * Sets whether to draw transparent trigger.
   */
  setDrawTransparentTrigger(draw: boolean): void {
    this._drawTransparentTrigger = draw;
  }

  /**
   * Returns whether to draw transparent trigger.
   */
  isDrawTransparentTrigger(): boolean {
    return this._drawTransparentTrigger;
  }

  /**
   * Invalidates the component, marking it as needing layout.
   */
  invalidate(): void {
    // To be overridden by subclasses
  }

  /**
   * Validates the component.
   */
  validate(): void {
    // To be overridden by subclasses
  }

  /**
   * Revalidates the component.
   */
  revalidate(): void {
    this.invalidate();
    this.validate();
  }

  /**
   * Requests a repaint of this component.
   */
  repaint(): void {
    this.dispatchEvent(new AWEvent(AWEvent.PAINT));
  }

  /**
   * Checks if a point is within this component's bounds.
   */
  contains(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this._width && y < this._height;
  }

  /**
   * Checks if a point is within this component's bounds.
   */
  containsPoint(p: IntPoint): boolean {
    return this.contains(p.x, p.y);
  }

  toString(): string {
    return `${this._name}[${this._x},${this._y},${this._width},${this._height}]`;
  }

  /**
   * Gets the parent container (if any).
   * Internal use - will be set by Container when child is added.
   */
  getParent(): Container | null {
    return (this as any)._parent || null;
  }
}

// Add parent reference property
(Component as any).prototype._parent = null;
