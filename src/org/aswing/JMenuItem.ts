import { JButton } from './JButton.js';
import { AWEvent } from './event/AWEvent.js';

/**
 * A menu item that can be added to a menu.
 */
export class JMenuItem extends JButton {
  private _accelerator: string | null;
  protected _icon: HTMLElement | null;

  constructor(text: string = '') {
    super(text);
    this._name = 'JMenuItem';
    this._accelerator = null;
    this._icon = null;
  }

  /**
   * Sets the keyboard accelerator.
   */
  setAccelerator(accelerator: string): this {
    this._accelerator = accelerator;
    return this;
  }

  /**
   * Gets the accelerator.
   */
  getAccelerator(): string | null {
    return this._accelerator;
  }

  /**
   * Sets the icon.
   */
  setIcon(icon: HTMLElement): this {
    this._icon = icon;
    return this;
  }

  /**
   * Gets the icon.
   */
  getIcon(): HTMLElement | null {
    return this._icon;
  }

  override toString(): string {
    return `JMenuItem[text="${this._text}",accelerator=${this._accelerator}]`;
  }
}
