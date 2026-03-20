import { IntPoint } from './IntPoint.js';
import { IntDimension } from './IntDimension.js';

/**
 * A rectangle defined by its top-left corner location (x,y) and its size (width,height).
 */
export class IntRectangle {
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Sets the bounds of this rectangle.
   */
  setBounds(x: number, y: number, width: number, height: number): void {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Sets the bounds of this rectangle from another rectangle.
   */
  setBoundsRect(r: IntRectangle): void {
    this.x = r.x;
    this.y = r.y;
    this.width = r.width;
    this.height = r.height;
  }

  /**
   * Sets the location of this rectangle.
   */
  setLocation(p: IntPoint): void {
    this.x = p.x;
    this.y = p.y;
  }

  /**
   * Sets the location of this rectangle with x and y.
   */
  setLocationXY(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  /**
   * Sets the size of this rectangle.
   */
  setSize(d: IntDimension): void {
    this.width = d.width;
    this.height = d.height;
  }

  /**
   * Sets the size of this rectangle with width and height.
   */
  setSizeWH(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  /**
   * Returns the location of this rectangle.
   */
  getLocation(): IntPoint {
    return new IntPoint(this.x, this.y);
  }

  /**
   * Returns the size of this rectangle.
   */
  getSize(): IntDimension {
    return new IntDimension(this.width, this.height);
  }

  /**
   * Returns whether this rectangle contains the specified point.
   */
  containsPoint(p: IntPoint): boolean {
    return this.containsXY(p.x, p.y);
  }

  /**
   * Returns whether this rectangle contains the specified x,y coordinates.
   */
  containsXY(x: number, y: number): boolean {
    return x >= this.x && y >= this.y && x < this.x + this.width && y < this.y + this.height;
  }

  /**
   * Returns whether this rectangle contains the specified rectangle.
   */
  containsRect(r: IntRectangle): boolean {
    return (
      r.x >= this.x &&
      r.y >= this.y &&
      r.x + r.width <= this.x + this.width &&
      r.y + r.height <= this.y + this.height
    );
  }

  /**
   * Returns whether this rectangle intersects with the specified rectangle.
   */
  intersects(r: IntRectangle): boolean {
    return (
      this.x < r.x + r.width &&
      this.x + this.width > r.x &&
      this.y < r.y + r.height &&
      this.y + this.height > r.y
    );
  }

  /**
   * Returns the intersection of this rectangle with the specified rectangle.
   */
  intersection(r: IntRectangle): IntRectangle {
    const x0 = Math.max(this.x, r.x);
    const y0 = Math.max(this.y, r.y);
    const x1 = Math.min(this.x + this.width, r.x + r.width);
    const y1 = Math.min(this.y + this.height, r.y + r.height);

    if (x1 <= x0 || y1 <= y0) {
      return new IntRectangle();
    }

    return new IntRectangle(x0, y0, x1 - x0, y1 - y0);
  }

  /**
   * Returns the union of this rectangle with the specified rectangle.
   */
  union(r: IntRectangle): IntRectangle {
    const x0 = Math.min(this.x, r.x);
    const y0 = Math.min(this.y, r.y);
    const x1 = Math.max(this.x + this.width, r.x + r.width);
    const y1 = Math.max(this.y + this.height, r.y + r.height);

    return new IntRectangle(x0, y0, x1 - x0, y1 - y0);
  }

  /**
   * Returns whether this rectangle is empty.
   */
  isEmpty(): boolean {
    return this.width <= 0 || this.height <= 0;
  }

  /**
   * Returns whether or not the passing o is an same value IntRectangle.
   */
  equals(o: unknown): boolean {
    if (!(o instanceof IntRectangle)) return false;
    return (
      this.x === o.x &&
      this.y === o.y &&
      this.width === o.width &&
      this.height === o.height
    );
  }

  /**
   * Duplicates current instance.
   */
  clone(): IntRectangle {
    return new IntRectangle(this.x, this.y, this.width, this.height);
  }

  /**
   * Returns the center x coordinate.
   */
  getCenterX(): number {
    return this.x + this.width / 2;
  }

  /**
   * Returns the center y coordinate.
   */
  getCenterY(): number {
    return this.y + this.height / 2;
  }

  toString(): string {
    return `IntRectangle[${this.x},${this.y},${this.width},${this.height}]`;
  }
}
