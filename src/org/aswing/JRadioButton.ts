import { JAbstractButton } from './JAbstractButton.js';
import { AWEvent } from './event/AWEvent.js';
import { IntDimension } from './geom/IntDimension.js';

/**
 * Radio button group manager.
 * Ensures only one radio button in a group is selected at a time.
 */
export class ButtonGroup {
  private _buttons: JRadioButton[] = [];
  private _selectedButton: JRadioButton | null = null;

  /**
   * Adds a radio button to this group.
   */
  add(button: JRadioButton): void {
    if (!this._buttons.includes(button)) {
      this._buttons.push(button);
      button.setButtonGroup(this);
    }
  }

  /**
   * Removes a radio button from this group.
   */
  remove(button: JRadioButton): void {
    const index = this._buttons.indexOf(button);
    if (index >= 0) {
      this._buttons.splice(index, 1);
      button.setButtonGroup(null);
      if (this._selectedButton === button) {
        this._selectedButton = null;
      }
    }
  }

  /**
   * Removes all buttons from this group.
   */
  removeAll(): void {
    this._buttons.forEach(btn => btn.setButtonGroup(null));
    this._buttons = [];
    this._selectedButton = null;
  }

  /**
   * Gets the selected button.
   */
  getSelected(): JRadioButton | null {
    return this._selectedButton;
  }

  /**
   * Sets the selected button.
   */
  setSelected(button: JRadioButton | null): void {
    if (this._selectedButton === button) return;
    
    if (this._selectedButton) {
      this._selectedButton.setSelected(false);
    }
    
    this._selectedButton = button;
    
    if (this._selectedButton) {
      this._selectedButton.setSelected(true);
    }
  }

  /**
   * Gets all buttons in this group.
   */
  getButtons(): JRadioButton[] {
    return [...this._buttons];
  }

  /**
   * Gets the number of buttons in this group.
   */
  getButtonCount(): number {
    return this._buttons.length;
  }

  /**
   * Clears the selection.
   */
  clearSelection(): void {
    this.setSelected(null);
  }
}

/**
 * A radio button component that can be selected or deselected.
 * Should be added to a ButtonGroup for exclusive selection.
 */
export class JRadioButton extends JAbstractButton {
  private _buttonGroup: ButtonGroup | null;

  constructor(text: string = '', selected: boolean = false) {
    super(text);
    this._name = 'JRadioButton';
    this._buttonGroup = null;
    if (selected) {
      this.setSelected(selected);
    }
  }

  override createRootElement(): HTMLElement {
    const wrapper = document.createElement('label');
    wrapper.className = 'aswing-radiobutton-wrapper';
    wrapper.style.position = 'absolute';
    wrapper.style.display = 'inline-flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '6px';
    wrapper.style.cursor = 'pointer';
    wrapper.style.userSelect = 'none';

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.className = 'aswing-radiobutton';
    radio.checked = this._selected;

    const label = document.createElement('span');
    label.className = 'aswing-radiobutton-label';
    label.textContent = this._text;
    label.style.fontSize = '13px';

    radio.addEventListener('change', (e) => {
      const checked = (e.target as HTMLInputElement).checked;
      this.setSelected(checked);
      this.dispatchEvent(new AWEvent('stateChanged'));
      this.dispatchEvent(new AWEvent(AWEvent.ACT));
    });

    wrapper.appendChild(radio);
    wrapper.appendChild(label);
    return wrapper;
  }

  /**
   * Gets the radio input element.
   */
  getRadioElement(): HTMLInputElement | null {
    return this._element?.querySelector('input[type="radio"]') as HTMLInputElement | null;
  }

  /**
   * Sets whether the radio button is selected.
   */
  override setSelected(selected: boolean): this {
    super.setSelected(selected);
    const radio = this.getRadioElement();
    if (radio) {
      radio.checked = selected;
    }
    
    // If part of a group, update the group
    if (selected && this._buttonGroup) {
      this._buttonGroup.setSelected(this);
    }
    
    return this;
  }

  /**
   * Sets the button group for this radio button.
   * @internal
   */
  setButtonGroup(group: ButtonGroup | null): void {
    this._buttonGroup = group;
  }

  /**
   * Gets the button group.
   */
  getButtonGroup(): ButtonGroup | null {
    return this._buttonGroup;
  }

  override setText(text: string): this {
    super.setText(text);
    const label = this._element?.querySelector('.aswing-radiobutton-label');
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
    return `JRadioButton[text="${this._text}", selected=${this._selected}]`;
  }
}
