/**
 * A point defining a location in a two-dimensional (x,y) coordinate space.
 */
export class IntPoint {
  public x: number;
  public y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Sets the location as same as the point.
   */
  setLocation(point: IntPoint): void {
    this.x = point.x;
    this.y = point.y;
  }

  /**
   * Sets the location with x and y.
   */
  setLocationXY(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  /**
   * Translates the point by dx and dy.
   */
  translate(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
  }

  /**
   * Returns whether or not the passing o is an same value IntPoint.
   */
  equals(o: unknown): boolean {
    if (!(o instanceof IntPoint)) return false;
    return this.x === o.x && this.y === o.y;
  }

  /**
   * Duplicates current instance.
   */
  clone(): IntPoint {
    return new IntPoint(this.x, this.y);
  }

  /**
   * Returns the distance between this point and another point.
   */
  distance(p: IntPoint): number {
    const dx = this.x - p.x;
    const dy = this.y - p.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Returns the square of the distance between this point and another point.
   */
  distanceSq(p: IntPoint): number {
    const dx = this.x - p.x;
    const dy = this.y - p.y;
    return dx * dx + dy * dy;
  }

  toString(): string {
    return `IntPoint[${this.x},${this.y}]`;
  }
}
