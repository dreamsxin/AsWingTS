import { JAbstractButton } from './JAbstractButton.js';
import { AWEvent } from './event/AWEvent.js';

/**
 * A toggle button that can be selected or deselected.
 * Unlike JCheckBox, it looks like a regular button but maintains state.
 */
export class JToggleButton extends JAbstractButton {
  constructor(text: string = '', selected: boolean = false) {
    super(text);
    this._name = 'JToggleButton';
    if (selected) {
      this.setSelected(selected);
    }
  }

  override createRootElement(): HTMLElement {
    const element = document.createElement('button');
    element.className = 'aswing-toggle-button';
    element.textContent = this._text;

    element.addEventListener('click', () => {
      this.setSelected(!this._selected);
      this.dispatchEvent(new AWEvent(AWEvent.ACT));
    });

    this.updateVisualState();
    return element;
  }

  /**
   * Sets whether the button is selected.
   */
  override setSelected(selected: boolean): this {
    this._selected = selected;
    this.updateVisualState();
    return this;
  }

  /**
   * Returns whether the button is selected.
   */
  override isSelected(): boolean {
    return this._selected;
  }

  /**
   * Toggles the selected state.
   */
  toggle(): this {
    this.setSelected(!this._selected);
    return this;
  }

  private updateVisualState(): void {
    if (this._element) {
      this._element.classList.toggle('selected', this._selected);
      if (this._selected) {
        this._element.setAttribute('aria-pressed', 'true');
      } else {
        this._element.removeAttribute('aria-pressed');
      }
    }
  }

  override toString(): string {
    return `JToggleButton[text="${this._text}", selected=${this._selected}]`;
  }
}
