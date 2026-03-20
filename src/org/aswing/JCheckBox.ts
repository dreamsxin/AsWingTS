import { JAbstractButton } from './JAbstractButton.js';
import { AWEvent } from './event/AWEvent.js';
import { IntDimension } from './geom/IntDimension.js';

/**
 * A checkbox component that can be selected or deselected.
 */
export class JCheckBox extends JAbstractButton {
  private _checked: boolean;

  constructor(text: string = '', checked: boolean = false) {
    super(text);
    this._name = 'JCheckBox';
    this._checked = checked;
  }

  override createRootElement(): HTMLElement {
    const wrapper = document.createElement('label');
    wrapper.className = 'aswing-checkbox-wrapper';
    wrapper.style.position = 'absolute';
    wrapper.style.display = 'inline-flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '6px';
    wrapper.style.cursor = 'pointer';
    wrapper.style.userSelect = 'none';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'aswing-checkbox';
    checkbox.checked = this._checked;

    const label = document.createElement('span');
    label.className = 'aswing-checkbox-label';
    label.textContent = this._text;
    label.style.fontSize = '13px';

    checkbox.addEventListener('change', (e) => {
      this._checked = (e.target as HTMLInputElement).checked;
      this._selected = this._checked;
      this.dispatchEvent(new AWEvent('stateChanged'));
      this.dispatchEvent(new AWEvent(AWEvent.ACT));
    });

    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);
    return wrapper;
  }

  /**
   * Gets the checkbox input element.
   */
  getCheckboxElement(): HTMLInputElement | null {
    return this._element?.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
  }

  /**
   * Sets whether the checkbox is checked.
   * Chainable - returns this for method chaining.
   */
  setChecked(checked: boolean): this {
    this._checked = checked;
    this._selected = checked;
    const checkbox = this.getCheckboxElement();
    if (checkbox) {
      checkbox.checked = checked;
    }
    return this;
  }

  /**
   * Returns whether the checkbox is checked.
   */
  isChecked(): boolean {
    return this._checked;
  }

  /**
   * Toggles the checked state.
   * Chainable - returns this for method chaining.
   */
  toggle(): this {
    this.setChecked(!this._checked);
    return this;
  }

  override setText(text: string): this {
    super.setText(text);
    const label = this._element?.querySelector('.aswing-checkbox-label');
    if (label) {
      label.textContent = text;
    }
    return this;
  }

  override getPreferredSize(): IntDimension {
    const textWidth = this._text.length * 8 + 8;
    return new IntDimension(Math.max(textWidth + 20, 50), 20);
  }

  override toString(): string {
    return `JCheckBox[text="${this._text}", checked=${this._checked}]`;
  }
}

// Add stateChanged event type
declare module './event/AWEvent.js' {
  interface AWEvent {
    'stateChanged': 'stateChanged';
  }
}
