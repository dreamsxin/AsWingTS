/**
 * The Dimension class encapsulates the width and height of a component in a single object.
 * Uses int as its parameters to avoid problems.
 */
export class IntDimension {
  public width: number;
  public height: number;

  constructor(width: number = 0, height: number = 0) {
    this.width = width;
    this.height = height;
  }

  /**
   * Sets the size as same as the dim.
   */
  setSize(dim: IntDimension): void {
    this.width = dim.width;
    this.height = dim.height;
  }

  /**
   * Sets the size with width and height.
   */
  setSizeWH(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  /**
   * Increases the size by s and return its self (this).
   */
  increaseSize(s: IntDimension): IntDimension {
    this.width += s.width;
    this.height += s.height;
    return this;
  }

  /**
   * Decreases the size by s and return its self (this).
   */
  decreaseSize(s: IntDimension): IntDimension {
    this.width -= s.width;
    this.height -= s.height;
    return this;
  }

  /**
   * Modify the size and return itself.
   */
  change(deltaW: number, deltaH: number): IntDimension {
    this.width += deltaW;
    this.height += deltaH;
    return this;
  }

  /**
   * Return a new size with this size with a change.
   */
  changedSize(deltaW: number, deltaH: number): IntDimension {
    return new IntDimension(deltaW, deltaH);
  }

  /**
   * Combines current and specified dimensions by getting max sizes
   * and puts result into itself.
   */
  combine(d: IntDimension): IntDimension {
    this.width = Math.max(this.width, d.width);
    this.height = Math.max(this.height, d.height);
    return this;
  }

  /**
   * Combines current and specified dimensions by getting max sizes
   * and returns new IntDimension object
   */
  combineSize(d: IntDimension): IntDimension {
    return this.clone().combine(d);
  }

  /**
   * Return a new bounds with this size with a location.
   */
  getBounds(x: number = 0, y: number = 0): IntRectangle {
    const p = new IntPoint(x, y);
    const r = new IntRectangle();
    r.setLocation(p);
    r.setSize(this);
    return r;
  }

  /**
   * Returns whether or not the passing o is an same value IntDimension.
   */
  equals(o: unknown): boolean {
    if (!(o instanceof IntDimension)) return false;
    return this.width === o.width && this.height === o.height;
  }

  /**
   * Duplicates current instance.
   */
  clone(): IntDimension {
    return new IntDimension(this.width, this.height);
  }

  /**
   * Create a big dimension for component.
   */
  static createBigDimension(): IntDimension {
    return new IntDimension(100000, 100000);
  }

  toString(): string {
    return `IntDimension[${this.width},${this.height}]`;
  }
}

/**
 * Forward declaration for IntRectangle and IntPoint
 */
import { IntPoint } from './IntPoint.js';
import { IntRectangle } from './IntRectangle.js';
