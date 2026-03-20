import { Component } from './Component.js';
import { AWEvent } from './event/AWEvent.js';
import { IntDimension } from './geom/IntDimension.js';

/**
 * Abstract base class for button components.
 * Provides common button functionality like selection, armed state, and icons.
 */
export abstract class JAbstractButton extends Component {
  protected _text: string;
  protected _selected: boolean;
  protected _armed: boolean;
  protected _mnemonic: string | null;
  protected _icon: HTMLElement | null;
  protected _pressed: boolean;

  constructor(text: string = '') {
    super();
    this._name = 'JAbstractButton';
    this._text = text;
    this._selected = false;
    this._armed = false;
    this._mnemonic = null;
    this._icon = null;
    this._pressed = false;
  }

  override createRootElement(): HTMLElement {
    const element = document.createElement('button');
    element.className = 'aswing-abstract-button';
    element.textContent = this._text;
    return element;
  }

  /**
   * Sets the button text.
   * Chainable - returns this for method chaining.
   */
  setText(text: string): this {
    this._text = text;
    if (this._element) {
      this._element.textContent = text;
    }
    return this;
  }

  /**
   * Gets the button text.
   */
  getText(): string {
    return this._text;
  }

  /**
   * Sets whether the button is selected.
   * Chainable - returns this for method chaining.
   */
  setSelected(selected: boolean): this {
    this._selected = selected;
    if (this._element) {
      this._element.classList.toggle('selected', selected);
    }
    return this;
  }

  /**
   * Returns whether the button is selected.
   */
  isSelected(): boolean {
    return this._selected;
  }

  /**
   * Sets the mnemonic (keyboard shortcut) for this button.
   * Chainable - returns this for method chaining.
   */
  setMnemonic(mnemonic: string): this {
    this._mnemonic = mnemonic;
    return this;
  }

  /**
   * Gets the mnemonic.
   */
  getMnemonic(): string | null {
    return this._mnemonic;
  }

  /**
   * Sets the icon for this button.
   * Chainable - returns this for method chaining.
   */
  setIcon(icon: HTMLElement): this {
    this._icon = icon;
    if (this._element) {
      // Clear existing icon
      const existingIcon = this._element.querySelector('.aswing-button-icon');
      if (existingIcon) {
        existingIcon.remove();
      }
      // Add new icon
      icon.classList.add('aswing-button-icon');
      this._element.insertBefore(icon, this._element.firstChild);
    }
    return this;
  }

  /**
   * Gets the icon.
   */
  getIcon(): HTMLElement | null {
    return this._icon;
  }

  /**
   * Returns whether the button is armed (pressed but not released).
   */
  isArmed(): boolean {
    return this._armed;
  }

  /**
   * Returns whether the button is pressed.
   */
  isPressed(): boolean {
    return this._pressed;
  }

  override getPreferredSize(): IntDimension {
    const textWidth = this._text.length * 8 + 24;
    return new IntDimension(Math.max(textWidth, 60), 28);
  }

  override toString(): string {
    return `${this._name}[text="${this._text}", selected=${this._selected}]`;
  }
}
