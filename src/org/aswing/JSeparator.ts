import { Component } from './Component.js';
import { IntDimension } from './geom/IntDimension.js';
import { AsWingConstants } from './AsWingConstants.js';

/**
 * A separator component that draws a line.
 */
export class JSeparator extends Component {
  private _orientation: string;

  constructor(orientation: string = AsWingConstants.HORIZONTAL) {
    super();
    this._name = 'JSeparator';
    this._orientation = orientation;
  }

  static readonly HORIZONTAL = AsWingConstants.HORIZONTAL;
  static readonly VERTICAL = AsWingConstants.VERTICAL;

  override createRootElement(): HTMLElement {
    const element = document.createElement('div');
    element.className = 'aswing-separator';
    element.style.position = 'absolute';

    if (this._orientation === AsWingConstants.HORIZONTAL) {
      element.style.width = '100%';
      element.style.height = '2px';
      element.style.borderTop = '1px solid #ccc';
      element.style.borderBottom = '1px solid #fff';
    } else {
      element.style.width = '2px';
      element.style.height = '100%';
      element.style.borderLeft = '1px solid #ccc';
      element.style.borderRight = '1px solid #fff';
    }

    return element;
  }

  /**
   * Gets the orientation.
   */
  getOrientation(): string {
    return this._orientation;
  }

  /**
   * Sets the orientation.
   */
  setOrientation(orientation: string): this {
    this._orientation = orientation;
    return this;
  }

  override getPreferredSize(): IntDimension {
    if (this._orientation === AsWingConstants.HORIZONTAL) {
      return new IntDimension(100, 2);
    } else {
      return new IntDimension(2, 100);
    }
  }

  override toString(): string {
    return `JSeparator[orientation=${this._orientation}]`;
  }
}
