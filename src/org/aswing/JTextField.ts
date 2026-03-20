import { Component } from './Component.js';
import { AWEvent } from './event/AWEvent.js';
import { IntDimension } from './geom/IntDimension.js';

/**
 * A text field component for single-line text input.
 */
export class JTextField extends Component {
  private _text: string;
  private _placeholder: string;
  private _editable: boolean;
  private _columns: number;
  private _inputElement: HTMLInputElement | null;
  private _echoChar: string | null;
  private _validator: ((text: string) => boolean) | null;

  constructor(text: string = '', columns: number = 20) {
    super();
    this._name = 'JTextField';
    this._text = text;
    this._placeholder = '';
    this._editable = true;
    this._columns = columns;
    this._inputElement = null;
    this._echoChar = null;
    this._validator = null;
  }

  override createRootElement(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'aswing-textfield-wrapper';
    wrapper.style.position = 'absolute';

    this._inputElement = document.createElement('input');
    this._inputElement.type = 'text';
    this._inputElement.className = 'aswing-textfield';
    this._inputElement.value = this._text;
    this._inputElement.placeholder = this._placeholder;
    this._inputElement.readOnly = !this._editable;

    // Calculate width based on columns
    const width = Math.max(this._columns * 8 + 16, 100);
    this._inputElement.style.width = `${width}px`;
    this._inputElement.style.height = '24px';

    // Event listeners
    this._inputElement.addEventListener('input', (e) => {
      this._text = (e.target as HTMLInputElement).value;
      this.dispatchEvent(new AWEvent('textChanged'));
    });

    this._inputElement.addEventListener('focus', () => {
      this.dispatchEvent(new AWEvent(AWEvent.FOCUS_GAINED));
    });

    this._inputElement.addEventListener('blur', () => {
      this.dispatchEvent(new AWEvent(AWEvent.FOCUS_LOST));
    });

    this._inputElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.dispatchEvent(new AWEvent(AWEvent.ACT));
      }
    });

    wrapper.appendChild(this._inputElement);
    return wrapper;
  }

  /**
   * Gets the underlying input element.
   */
  getInputElement(): HTMLInputElement | null {
    return this._inputElement;
  }

  /**
   * Sets the text.
   */
  setText(text: string): void {
    this._text = text;
    if (this._inputElement) {
      this._inputElement.value = text;
    }
  }

  /**
   * Gets the text.
   */
  getText(): string {
    return this._text;
  }

  /**
   * Sets the placeholder text.
   * Chainable - returns this for method chaining.
   */
  setPlaceholder(placeholder: string): this {
    this._placeholder = placeholder;
    if (this._inputElement) {
      this._inputElement.placeholder = placeholder;
    }
    return this;
  }

  /**
   * Gets the placeholder.
   */
  getPlaceholder(): string {
    return this._placeholder;
  }

  /**
   * Sets whether the field is editable.
   * Chainable - returns this for method chaining.
   */
  setEditable(editable: boolean): this {
    this._editable = editable;
    if (this._inputElement) {
      this._inputElement.readOnly = !editable;
      this._inputElement.style.background = editable ? '#fff' : '#f5f5f5';
    }
    return this;
  }

  /**
   * Returns whether the field is editable.
   */
  isEditable(): boolean {
    return this._editable;
  }

  /**
   * Sets the number of columns (affects width).
   * Chainable - returns this for method chaining.
   */
  setColumns(columns: number): this {
    this._columns = columns;
    if (this._inputElement) {
      const width = Math.max(columns * 8 + 16, 100);
      this._inputElement.style.width = `${width}px`;
      this._width = width;
    }
    return this;
  }

  /**
   * Gets the number of columns.
   */
  getColumns(): number {
    return this._columns;
  }

  /**
   * Selects all text in the field.
   * Chainable - returns this for method chaining.
   */
  selectAll(): this {
    if (this._inputElement) {
      this._inputElement.select();
    }
    return this;
  }

  /**
   * Sets the focus to this text field.
   * Chainable - returns this for method chaining.
   */
  requestFocus(): this {
    if (this._inputElement) {
      this._inputElement.focus();
    }
    return this;
  }

  /**
   * Sets the maximum length of the text field.
   * Chainable - returns this for method chaining.
   */
  setMaxLength(maxLength: number): this {
    if (this._inputElement) {
      this._inputElement.maxLength = maxLength;
    }
    return this;
  }

  /**
   * Gets the maximum length.
   */
  getMaxLength(): number {
    return this._inputElement?.maxLength || 0;
  }

  override getPreferredSize(): IntDimension {
    const width = Math.max(this._columns * 8 + 16, 100);
    return new IntDimension(width, 28);
  }

  override setSizeWH(width: number, height: number): this {
    super.setSizeWH(width, height);
    if (this._inputElement) {
      this._inputElement.style.width = `${width - 4}px`;
      this._inputElement.style.height = `${height - 4}px`;
    }
    return this;
  }

  /**
   * Sets the echo character for password mode.
   */
  setEchoChar(echoChar: string | null): this {
    (this as any)._echoChar = echoChar;
    if (this._inputElement) {
      this._inputElement.type = echoChar ? 'password' : 'text';
    }
    return this;
  }

  /**
   * Enables password mode.
   */
  setPasswordMode(enabled: boolean = true): this {
    return this.setEchoChar(enabled ? '•' : null);
  }

  /**
   * Sets a validator function.
   */
  setValidator(validator: ((text: string) => boolean) | null): this {
    (this as any)._validator = validator;
    return this;
  }

  /**
   * Gets whether the current text is valid.
   */
  isValid(): boolean {
    const validator = (this as any)._validator;
    if (!validator) return true;
    return validator(this._text);
  }

  override toString(): string {
    return `JTextField[text="${this._text}", columns=${this._columns}]`;
  }
}

// Add textChanged event type to AWEvent
declare module './event/AWEvent.js' {
  interface AWEvent {
    'textChanged': 'textChanged';
  }
}
