import { Component } from './Component.js';
import { AWEvent } from './event/AWEvent.js';
import { IntDimension } from './geom/IntDimension.js';

/**
 * A button component that can be clicked.
 */
export class JButton extends Component {
  private _text: string;
  private _selected: boolean;
  private _armed: boolean;

  constructor(text: string = '') {
    super();
    this._name = 'JButton';
    this._text = text;
    this._selected = false;
    this._armed = false;
  }

  override createRootElement(): HTMLElement {
    const element = document.createElement('button');
    element.className = 'aswing-button';
    element.textContent = this._text;

    element.addEventListener('click', (e) => this.handleClick(e));
    element.addEventListener('mousedown', () => (this._armed = true));
    element.addEventListener('mouseup', () => (this._armed = false));
    element.addEventListener('mouseleave', () => (this._armed = false));

    return element;
  }

  private handleClick(_e: MouseEvent): void {
    this.dispatchEvent(new AWEvent(AWEvent.ACT));
  }

  /**
   * Sets the button text.
   */
  setText(text: string): void {
    this._text = text;
    if (this._element) {
      this._element.textContent = text;
    }
  }

  /**
   * Gets the button text.
   */
  getText(): string {
    return this._text;
  }

  /**
   * Sets whether the button is selected.
   */
  setSelected(selected: boolean): void {
    this._selected = selected;
    if (this._element) {
      this._element.classList.toggle('selected', selected);
    }
  }

  /**
   * Returns whether the button is selected.
   */
  isSelected(): boolean {
    return this._selected;
  }

  /**
   * Returns whether the button is armed (pressed but not released).
   */
  isArmed(): boolean {
    return this._armed;
  }

  override getPreferredSize(): IntDimension {
    // Estimate size based on text
    const textWidth = this._text.length * 8 + 20; // Rough estimate
    return new IntDimension(Math.max(textWidth, 60), 28);
  }

  override toString(): string {
    return `JButton[text="${this._text}"]`;
  }
}
