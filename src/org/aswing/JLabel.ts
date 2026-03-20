import { Component } from './Component.js';
import { IntDimension } from './geom/IntDimension.js';
import { AsWingConstants } from './AsWingConstants.js';

/**
 * A label component for displaying text or images.
 */
export class JLabel extends Component {
  private _text: string;
  private _horizontalAlignment: string;
  private _verticalAlignment: string;

  constructor(text: string = '', alignment: string = AsWingConstants.CENTER) {
    super();
    this._name = 'JLabel';
    this._text = text;
    this._horizontalAlignment = alignment;
    this._verticalAlignment = AsWingConstants.CENTER;
  }

  override createRootElement(): HTMLElement {
    const element = document.createElement('div');
    element.className = 'aswing-label';
    element.textContent = this._text;
    this.applyAlignment(element);
    return element;
  }

  private applyAlignment(element: HTMLElement): void {
    element.style.textAlign = this._horizontalAlignment;
    element.style.display = 'flex';
    element.style.alignItems = this.getFlexAlignment(this._verticalAlignment);
    element.style.justifyContent = this.getFlexJustify(this._horizontalAlignment);
  }

  private getFlexAlignment(vertical: string): string {
    switch (vertical) {
      case AsWingConstants.TOP:
        return 'flex-start';
      case AsWingConstants.BOTTOM:
        return 'flex-end';
      default:
        return 'center';
    }
  }

  private getFlexJustify(horizontal: string): string {
    switch (horizontal) {
      case AsWingConstants.LEFT:
        return 'flex-start';
      case AsWingConstants.RIGHT:
        return 'flex-end';
      default:
        return 'center';
    }
  }

  /**
   * Sets the label text.
   */
  setText(text: string): void {
    this._text = text;
    if (this._element) {
      this._element.textContent = text;
    }
  }

  /**
   * Gets the label text.
   */
  getText(): string {
    return this._text;
  }

  /**
   * Sets the horizontal alignment.
   * Chainable - returns this for method chaining.
   */
  setHorizontalAlignment(alignment: string): this {
    this._horizontalAlignment = alignment;
    if (this._element) {
      this._element.style.textAlign = alignment;
      this._element.style.justifyContent = this.getFlexJustify(alignment);
    }
    return this;
  }

  /**
   * Gets the horizontal alignment.
   */
  getHorizontalAlignment(): string {
    return this._horizontalAlignment;
  }

  /**
   * Sets the vertical alignment.
   * Chainable - returns this for method chaining.
   */
  setVerticalAlignment(alignment: string): this {
    this._verticalAlignment = alignment;
    if (this._element) {
      this._element.style.alignItems = this.getFlexAlignment(alignment);
    }
    return this;
  }

  /**
   * Gets the vertical alignment.
   */
  getVerticalAlignment(): string {
    return this._verticalAlignment;
  }

  /**
   * Sets text alignment (alias for setHorizontalAlignment with textAlign values).
   * Chainable - returns this for method chaining.
   */
  setTextAlign(align: 'left' | 'center' | 'right' | 'justify'): this {
    this.setHorizontalAlignment(align);
    return this;
  }

  override getPreferredSize(): IntDimension {
    const textWidth = this._text.length * 8 + 10; // Rough estimate
    return new IntDimension(textWidth, 20);
  }

  override toString(): string {
    return `JLabel[text="${this._text}"]`;
  }
}
