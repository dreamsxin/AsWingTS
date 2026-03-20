import { JAbstractButton } from './JAbstractButton.js';
import { AWEvent } from './event/AWEvent.js';

/**
 * A button component that can be clicked.
 */
export class JButton extends JAbstractButton {
  constructor(text: string = '') {
    super(text);
    this._name = 'JButton';
  }

  override createRootElement(): HTMLElement {
    const element = document.createElement('button');
    element.className = 'aswing-button';
    element.textContent = this._text;

    element.addEventListener('click', (e) => this.handleClick(e));
    element.addEventListener('mousedown', () => {
      this._armed = true;
      this._pressed = true;
    });
    element.addEventListener('mouseup', () => {
      this._armed = false;
      this._pressed = false;
    });
    element.addEventListener('mouseleave', () => {
      this._armed = false;
      this._pressed = false;
    });

    return element;
  }

  private handleClick(_e: MouseEvent): void {
    this.dispatchEvent(new AWEvent(AWEvent.ACT));
  }

  override toString(): string {
    return `JButton[text="${this._text}"]`;
  }

  /**
   * Sets button type (button, submit, reset).
   * Chainable - returns this for method chaining.
   */
  setType(type: 'button' | 'submit' | 'reset'): this {
    if (this._element) {
      (this._element as HTMLButtonElement).type = type;
    }
    return this;
  }
}
