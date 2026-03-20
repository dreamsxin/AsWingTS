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
    element.style.whiteSpace = 'nowrap';

    element.addEventListener('click', (e) => this.handleClick(e));
    element.addEventListener('mousedown', (e) => {
      this._armed = true;
      this._pressed = true;
      this.onMouseDown();
    });
    element.addEventListener('mouseup', (e) => {
      this._armed = false;
      this._pressed = false;
      this.onMouseUp();
    });
    element.addEventListener('mouseleave', () => {
      this._armed = false;
      this._pressed = false;
      this.onMouseLeave();
    });

    return element;
  }

  private handleClick(_e: MouseEvent): void {
    this.dispatchEvent(new AWEvent(AWEvent.ACT));
  }

  override onMouseDown(): void {
    super.onMouseDown();
    this._pressed = true;
    if (this._element) {
      this._element.classList.add('pressed');
    }
  }

  override onMouseUp(): void {
    super.onMouseUp();
    this._pressed = false;
    if (this._element) {
      this._element.classList.remove('pressed');
    }
  }

  override onMouseLeave(): void {
    super.onMouseLeave();
    this._pressed = false;
    if (this._element) {
      this._element.classList.remove('pressed');
    }
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
