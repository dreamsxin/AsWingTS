import { AWEvent } from './event/AWEvent.js';
import { MovedEvent } from './event/MovedEvent.js';
import { ResizedEvent } from './event/ResizedEvent.js';
import { IntDimension } from './geom/IntDimension.js';
import { IntPoint } from './geom/IntPoint.js';
import { IntRectangle } from './geom/IntRectangle.js';
import { AsWingManager } from './AsWingManager.js';
import { Theme } from './Theme.js';
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
  
  /**
   * Internal parent reference - managed by Container class.
   */
  _parent: Container | null;

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
    this._parent = null;
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
   * Chainable - returns this for method chaining.
   */
  setName(name: string): this {
    this._name = name;
    return this;
  }

  /**
   * Gets the component name.
   */
  getName(): string {
    return this._name;
  }

  /**
   * Sets whether the component is visible.
   * Chainable - returns this for method chaining.
   */
  setVisible(visible: boolean): this {
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
    return this;
  }

  /**
   * Returns whether the component is visible.
   */
  isVisible(): boolean {
    return this._visible;
  }

  /**
   * Sets whether the component is enabled.
   * Chainable - returns this for method chaining.
   */
  setEnabled(enabled: boolean): this {
    this._enabled = enabled;
    if (this._element) {
      this._element.style.pointerEvents = enabled ? 'auto' : 'none';
      this._element.style.opacity = enabled ? '1' : '0.5';
    }
    return this;
  }

  /**
   * Returns whether the component is enabled.
   */
  isEnabled(): boolean {
    return this._enabled;
  }

  /**
   * Sets the location of this component.
   * Chainable - returns this for method chaining.
   */
  setLocation(x: number, y: number): this {
    this.setLocationPoint(new IntPoint(x, y));
    return this;
  }

  /**
   * Sets the location of this component using a point.
   * Chainable - returns this for method chaining.
   */
  setLocationPoint(p: IntPoint): this {
    this.setLocationXY(p.x, p.y);
    return this;
  }

  /**
   * Sets the location of this component with x and y.
   * Chainable - returns this for method chaining.
   */
  setLocationXY(x: number, y: number): this {
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
    return this;
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
   * Chainable - returns this for method chaining.
   */
  setSize(width: number, height: number): this {
    this.setSizeDimension(new IntDimension(width, height));
    return this;
  }

  /**
   * Sets the size of this component using a dimension.
   * Chainable - returns this for method chaining.
   */
  setSizeDimension(d: IntDimension): this {
    this.setSizeWH(d.width, d.height);
    return this;
  }

  /**
   * Sets the size of this component with width and height.
   * Chainable - returns this for method chaining.
   */
  setSizeWH(width: number, height: number): this {
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
    return this;
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
   * Chainable - returns this for method chaining.
   */
  setBounds(x: number, y: number, width: number, height: number): this {
    this.setLocationXY(x, y);
    this.setSizeWH(width, height);
    return this;
  }

  /**
   * Sets the preferred size.
   * Chainable - returns this for method chaining.
   */
  setPreferredSize(size: IntDimension): this {
    this._preferredSize = size;
    return this;
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
   * Chainable - returns this for method chaining.
   */
  setMinimumSize(size: IntDimension): this {
    this._minimumSize = size;
    return this;
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
   * Chainable - returns this for method chaining.
   */
  setMaximumSize(size: IntDimension): this {
    this._maximumSize = size;
    return this;
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
   * Chainable - returns this for method chaining.
   */
  setOpaque(opaque: boolean): this {
    this._opaque = opaque;
    if (this._element) {
      this._element.style.background = opaque ? '' : 'transparent';
    }
    return this;
  }

  /**
   * Returns whether the component is opaque.
   */
  isOpaque(): boolean {
    return this._opaque;
  }

  /**
   * Sets whether to draw transparent trigger.
   * Chainable - returns this for method chaining.
   */
  setDrawTransparentTrigger(draw: boolean): this {
    this._drawTransparentTrigger = draw;
    return this;
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

  // === Style Helper Methods ===

  /**
   * Sets a CSS style property.
   * Chainable for convenience.
   */
  setStyle(property: string, value: string): this {
    this.getElement();
    if (this._element) {
      (this._element.style as any)[property] = value;
    }
    return this;
  }

  /**
   * Sets multiple CSS style properties.
   * Chainable for convenience.
   */
  setStyles(styles: Record<string, string>): this {
    this.getElement();
    if (this._element) {
      Object.assign(this._element.style, styles);
    }
    return this;
  }

  /**
   * Adds a CSS class.
   */
  addClass(className: string): this {
    this.getElement();
    if (this._element) {
      this._element.classList.add(className);
    }
    return this;
  }

  /**
   * Removes a CSS class.
   */
  removeClass(className: string): this {
    this.getElement();
    if (this._element) {
      this._element.classList.remove(className);
    }
    return this;
  }

  /**
   * Sets font weight.
   */
  setFontWeight(weight: string): this {
    return this.setStyle('fontWeight', weight);
  }

  /**
   * Sets font size.
   */
  setFontSize(size: string): this {
    return this.setStyle('fontSize', size);
  }

  /**
   * Sets text color.
   */
  setColor(color: string): this {
    return this.setStyle('color', color);
  }

  /**
   * Sets background color.
   */
  setBackground(color: string): this {
    return this.setStyle('background', color);
  }

  /**
   * Sets border.
   */
  setBorder(border: string): this {
    return this.setStyle('border', border);
  }

  /**
   * Sets padding.
   */
  setPadding(padding: string): this {
    return this.setStyle('padding', padding);
  }

  /**
   * Sets margin.
   */
  setMargin(margin: string): this {
    return this.setStyle('margin', margin);
  }

  /**
   * Sets text alignment.
   * Chainable - returns this for method chaining.
   */
  setTextAlign(align: 'left' | 'center' | 'right' | 'justify'): this {
    return this.setStyle('textAlign', align);
  }

  /**
   * Sets line height.
   * Chainable - returns this for method chaining.
   */
  setLineHeight(height: string): this {
    return this.setStyle('lineHeight', height);
  }

  /**
   * Sets font family.
   * Chainable - returns this for method chaining.
   */
  setFontFamily(family: string): this {
    return this.setStyle('fontFamily', family);
  }

  /**
   * Sets font style (normal, italic, oblique).
   * Chainable - returns this for method chaining.
   */
  setFontStyle(style: string): this {
    return this.setStyle('fontStyle', style);
  }

  /**
   * Sets font variant (normal, small-caps).
   * Chainable - returns this for method chaining.
   */
  setFontVariant(variant: string): this {
    return this.setStyle('fontVariant', variant);
  }

  /**
   * Sets width only (convenience method).
   * Chainable - returns this for method chaining.
   */
  setWidth(width: number): this {
    this.setSizeWH(width, this._height);
    return this;
  }

  /**
   * Sets height only (convenience method).
   * Chainable - returns this for method chaining.
   */
  setHeight(height: number): this {
    this.setSizeWH(this._width, height);
    return this;
  }

  /**
   * Sets opacity (0.0 to 1.0).
   * Chainable - returns this for method chaining.
   */
  setOpacity(opacity: number): this {
    return this.setStyle('opacity', String(Math.max(0, Math.min(1, opacity))));
  }

  /**
   * Sets cursor style.
   * Chainable - returns this for method chaining.
   */
  setCursor(cursor: string): this {
    return this.setStyle('cursor', cursor);
  }

  /**
   * Sets visibility (show/hide).
   * Alias for setVisible().
   * Chainable - returns this for method chaining.
   */
  setShow(show: boolean): this {
    return this.setVisible(show);
  }

  /**
   * Hides the component.
   * Chainable - returns this for method chaining.
   */
  hide(): this {
    return this.setVisible(false);
  }

  /**
   * Shows the component.
   * Chainable - returns this for method chaining.
   */
  show(): this {
    return this.setVisible(true);
  }

  // === Theme Methods ===

  /**
   * Applies a theme to this component.
   * Chainable - returns this for method chaining.
   * 
   * @param themeName Theme name or array of theme names
   * @param clearExisting Clear existing themes first
   * 
   * @example
   * ```typescript
   * button.applyTheme('primary');
   * button.applyTheme(['primary', 'lg', 'rounded']);
   * ```
   */
  applyTheme(themeName: string | string[], clearExisting: boolean = false): this {
    Theme.apply(this, themeName, clearExisting);
    return this;
  }

  /**
   * Removes all themes from this component.
   * Chainable - returns this for method chaining.
   */
  clearTheme(): this {
    Theme.clear(this);
    return this;
  }

  /**
   * Gets the themes applied to this component.
   * @returns Array of applied theme names
   */
  getAppliedThemes(): string[] {
    return Theme.getApplied(this);
  }

  /**
   * Checks if a theme is applied to this component.
   * @param themeName Theme name to check
   * @returns True if theme is applied
   */
  hasTheme(themeName: string): boolean {
    return Theme.getApplied(this).includes(themeName);
  }

  /**
   * Internal method to set parent - only used by Container.
   * @internal
   */
  _setParent(parent: Container | null): void {
    this._parent = parent;
  }

  /**
   * Called when mouse is pressed down on the component.
   * Can be overridden by subclasses.
   */
  onMouseDown(): void {
    // To be overridden
  }

  /**
   * Called when mouse is released.
   * Can be overridden by subclasses.
   */
  onMouseUp(): void {
    // To be overridden
  }

  /**
   * Called when mouse leaves the component.
   * Can be overridden by subclasses.
   */
  onMouseLeave(): void {
    // To be overridden
  }

  // === Performance Optimization ===

  private _batchUpdates: boolean = false;
  private _pendingUpdates: Array<() => void> = [];
  private _updateScheduled: boolean = false;

  /**
   * Enables or disables batch updates for performance.
   */
  setBatchUpdates(enabled: boolean): this {
    this._batchUpdates = enabled;
    if (!enabled && this._pendingUpdates.length > 0) {
      this.flushUpdates();
    }
    return this;
  }

  /**
   * Gets whether batch updates are enabled.
   */
  isBatchUpdates(): boolean {
    return this._batchUpdates;
  }

  /**
   * Queues an update for batch processing.
   */
  queueUpdate(update: () => void): this {
    if (this._batchUpdates) {
      this._pendingUpdates.push(update);
      if (!this._updateScheduled) {
        this._updateScheduled = true;
        requestAnimationFrame(() => this.flushUpdates());
      }
    } else {
      update();
    }
    return this;
  }

  /**
   * Flushes all pending updates.
   */
  flushUpdates(): this {
    while (this._pendingUpdates.length > 0) {
      const update = this._pendingUpdates.shift();
      if (update) update();
    }
    this._updateScheduled = false;
    return this;
  }
}

// Initialize parent reference
(Component as any).prototype._parent = null;
