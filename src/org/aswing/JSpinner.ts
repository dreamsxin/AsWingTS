import { Component } from './Component.js';
import { JButton } from './JButton.js';
import { JTextField } from './JTextField.js';
import { AWEvent } from './event/AWEvent.js';
import { IntDimension } from './geom/IntDimension.js';
import { BorderLayout } from './BorderLayout.js';
import { AsWingConstants } from './AsWingConstants.js';

/**
 * A spinner component that allows selecting a number from a range.
 */
export class JSpinner extends Component {
  private _minimum: number;
  private _maximum: number;
  private _value: number;
  private _stepSize: number;
  private _textField: JTextField | null;
  private _upButton: JButton | null;
  private _downButton: JButton | null;
  private _spinnerElement: HTMLElement | null;

  constructor(minimum: number = 0, 
              maximum: number = 100, 
              value: number = 0, 
              stepSize: number = 1) {
    super();
    this._name = 'JSpinner';
    this._minimum = minimum;
    this._maximum = maximum;
    this._value = Math.max(minimum, Math.min(maximum, value));
    this._stepSize = stepSize;
    this._textField = null;
    this._upButton = null;
    this._downButton = null;
    this._spinnerElement = null;
  }

  override createRootElement(): HTMLElement {
    this._spinnerElement = document.createElement('div');
    this._spinnerElement.className = 'aswing-spinner';
    this._spinnerElement.style.position = 'absolute';
    this._spinnerElement.style.display = 'flex';
    this._spinnerElement.style.width = '100px';
    this._spinnerElement.style.height = '28px';

    // Text field
    this._textField = new JTextField(String(this._value));
    this._textField.setSize(70, 28);
    const textFieldEl = this._textField.getElement()!;
    textFieldEl.style.position = 'absolute';
    textFieldEl.style.left = '0';
    textFieldEl.style.top = '0';
    textFieldEl.style.width = '72px';
    textFieldEl.style.height = '28px';
    textFieldEl.style.borderRight = 'none';
    textFieldEl.style.borderTopRightRadius = '0';
    textFieldEl.style.borderBottomRightRadius = '0';
    
    // Prevent direct text input, only allow through buttons
    const inputEl = this._textField.getInputElement();
    if (inputEl) {
      inputEl.style.textAlign = 'right';
      inputEl.style.paddingRight = '8px';
      inputEl.readOnly = true;
    }

    // Up button
    this._upButton = new JButton('▲');
    this._upButton.setSize(28, 14);
    const upButtonEl = this._upButton.getElement()!;
    upButtonEl.style.position = 'absolute';
    upButtonEl.style.right = '0';
    upButtonEl.style.top = '0';
    upButtonEl.style.width = '28px';
    upButtonEl.style.height = '15px';
    upButtonEl.style.padding = '0';
    upButtonEl.style.margin = '0';
    upButtonEl.style.border = 'none';
    upButtonEl.style.borderLeft = '1px solid #ccc';
    upButtonEl.style.borderBottom = '1px solid #ccc';
    upButtonEl.style.borderTopRightRadius = '3px';
    upButtonEl.style.fontSize = '9px';
    upButtonEl.style.lineHeight = '1';
    upButtonEl.classList.add('spinner-btn');
    
    this._upButton.addEventListener(AWEvent.ACT, () => {
      this.setValue(this._value + this._stepSize);
    });

    // Down button
    this._downButton = new JButton('▼');
    this._downButton.setSize(28, 14);
    const downButtonEl = this._downButton.getElement()!;
    downButtonEl.style.position = 'absolute';
    downButtonEl.style.right = '0';
    downButtonEl.style.bottom = '0';
    downButtonEl.style.width = '28px';
    downButtonEl.style.height = '15px';
    downButtonEl.style.padding = '0';
    downButtonEl.style.margin = '0';
    downButtonEl.style.border = 'none';
    downButtonEl.style.borderLeft = '1px solid #ccc';
    downButtonEl.style.borderTop = '1px solid #ccc';
    downButtonEl.style.borderBottomRightRadius = '3px';
    downButtonEl.style.fontSize = '9px';
    downButtonEl.style.lineHeight = '1';
    downButtonEl.classList.add('spinner-btn');
    
    this._downButton.addEventListener(AWEvent.ACT, () => {
      this.setValue(this._value - this._stepSize);
    });

    this._spinnerElement.appendChild(textFieldEl);
    this._spinnerElement.appendChild(upButtonEl);
    this._spinnerElement.appendChild(downButtonEl);

    return this._spinnerElement;
  }

  /**
   * Sets the spinner value.
   */
  setValue(value: number): this {
    const oldValue = this._value;
    this._value = Math.max(this._minimum, Math.min(this._maximum, value));
    
    if (oldValue !== this._value) {
      if (this._textField) {
        this._textField.setText(String(this._value));
      }
      this.dispatchEvent(new AWEvent('stateChanged'));
    }
    
    return this;
  }

  /**
   * Gets the current value.
   */
  getValue(): number {
    return this._value;
  }

  /**
   * Sets the minimum value.
   */
  setMinimum(minimum: number): this {
    this._minimum = minimum;
    if (this._value < minimum) {
      this.setValue(minimum);
    }
    return this;
  }

  /**
   * Gets the minimum value.
   */
  getMinimum(): number {
    return this._minimum;
  }

  /**
   * Sets the maximum value.
   */
  setMaximum(maximum: number): this {
    this._maximum = maximum;
    if (this._value > maximum) {
      this.setValue(maximum);
    }
    return this;
  }

  /**
   * Gets the maximum value.
   */
  getMaximum(): number {
    return this._maximum;
  }

  /**
   * Sets the step size.
   */
  setStepSize(stepSize: number): this {
    this._stepSize = stepSize;
    return this;
  }

  /**
   * Gets the step size.
   */
  getStepSize(): number {
    return this._stepSize;
  }

  override getPreferredSize(): IntDimension {
    return new IntDimension(100, 28);
  }

  override setSizeWH(width: number, height: number): this {
    super.setSizeWH(width, height);
    if (this._spinnerElement) {
      this._spinnerElement.style.width = `${width}px`;
      this._spinnerElement.style.height = `${height}px`;
      
      if (this._textField) {
        const textFieldEl = this._textField.getElement();
        if (textFieldEl) {
          textFieldEl.style.width = `${width - 28}px`;
          textFieldEl.style.height = `${height}px`;
        }
      }
      
      if (this._upButton) {
        const upButtonEl = this._upButton.getElement();
        if (upButtonEl) {
          upButtonEl.style.width = `${28}px`;
          upButtonEl.style.height = `${height / 2}px`;
        }
      }
      
      if (this._downButton) {
        const downButtonEl = this._downButton.getElement();
        if (downButtonEl) {
          downButtonEl.style.width = `${28}px`;
          downButtonEl.style.height = `${height / 2}px`;
        }
      }
    }
    return this;
  }

  override toString(): string {
    return `JSpinner[value=${this._value},min=${this._minimum},max=${this._maximum}]`;
  }
}
