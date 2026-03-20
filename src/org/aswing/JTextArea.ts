import { Component } from './Component.js';
import { AWEvent } from './event/AWEvent.js';
import { IntDimension } from './geom/IntDimension.js';

/**
 * A multi-line text area component for text input and display.
 */
export class JTextArea extends Component {
  private _text: string;
  private _placeholder: string;
  private _editable: boolean;
  private _rows: number;
  private _columns: number;
  private _wrap: boolean;
  private _textareaElement: HTMLTextAreaElement | null;

  constructor(text: string = '', rows: number = 5, columns: number = 30) {
    super();
    this._name = 'JTextArea';
    this._text = text;
    this._placeholder = '';
    this._editable = true;
    this._rows = rows;
    this._columns = columns;
    this._wrap = true;
    this._textareaElement = null;
  }

  override createRootElement(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'aswing-textarea-wrapper';
    wrapper.style.position = 'absolute';

    this._textareaElement = document.createElement('textarea');
    this._textareaElement.className = 'aswing-textarea';
    this._textareaElement.value = this._text;
    this._textareaElement.placeholder = this._placeholder;
    this._textareaElement.readOnly = !this._editable;
    this._textareaElement.rows = this._rows;
    this._textareaElement.cols = this._columns;

    // Calculate size based on rows and columns
    const width = Math.max(this._columns * 8 + 16, 150);
    const height = Math.max(this._rows * 20 + 8, 100);
    this._textareaElement.style.width = `${width}px`;
    this._textareaElement.style.height = `${height}px`;
    this._textareaElement.style.resize = 'both';
    this._textareaElement.style.fontFamily = 'inherit';
    this._textareaElement.style.fontSize = '13px';
    this._textareaElement.style.padding = '8px';
    this._textareaElement.style.boxSizing = 'border-box';

    // Event listeners
    this._textareaElement.addEventListener('input', (e) => {
      this._text = (e.target as HTMLTextAreaElement).value;
      this.dispatchEvent(new AWEvent('textChanged'));
    });

    this._textareaElement.addEventListener('focus', () => {
      this.dispatchEvent(new AWEvent(AWEvent.FOCUS_GAINED));
    });

    this._textareaElement.addEventListener('blur', () => {
      this.dispatchEvent(new AWEvent(AWEvent.FOCUS_LOST));
    });

    wrapper.appendChild(this._textareaElement);
    return wrapper;
  }

  /**
   * Gets the underlying textarea element.
   */
  getTextareaElement(): HTMLTextAreaElement | null {
    return this._textareaElement;
  }

  /**
   * Sets the text.
   */
  setText(text: string): this {
    this._text = text;
    if (this._textareaElement) {
      this._textareaElement.value = text;
    }
    return this;
  }

  /**
   * Gets the text.
   */
  getText(): string {
    return this._text;
  }

  /**
   * Appends text to the end of the textarea.
   */
  append(text: string): this {
    this._text += text;
    if (this._textareaElement) {
      this._textareaElement.value = this._text;
    }
    return this;
  }

  /**
   * Sets the placeholder text.
   */
  setPlaceholder(placeholder: string): this {
    this._placeholder = placeholder;
    if (this._textareaElement) {
      this._textareaElement.placeholder = placeholder;
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
   * Sets whether the textarea is editable.
   */
  setEditable(editable: boolean): this {
    this._editable = editable;
    if (this._textareaElement) {
      this._textareaElement.readOnly = !editable;
      this._textareaElement.style.background = editable ? '#fff' : '#f5f5f5';
    }
    return this;
  }

  /**
   * Returns whether the textarea is editable.
   */
  isEditable(): boolean {
    return this._editable;
  }

  /**
   * Sets the number of rows.
   */
  setRows(rows: number): this {
    this._rows = rows;
    if (this._textareaElement) {
      this._textareaElement.rows = rows;
    }
    return this;
  }

  /**
   * Gets the number of rows.
   */
  getRows(): number {
    return this._rows;
  }

  /**
   * Sets the number of columns.
   */
  setColumns(columns: number): this {
    this._columns = columns;
    if (this._textareaElement) {
      this._textareaElement.cols = columns;
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
   * Sets whether text wrapping is enabled.
   */
  setLineWrap(wrap: boolean): this {
    this._wrap = wrap;
    if (this._textareaElement) {
      this._textareaElement.style.whiteSpace = wrap ? 'normal' : 'nowrap';
      this._textareaElement.style.overflowWrap = wrap ? 'break-word' : 'normal';
    }
    return this;
  }

  /**
   * Returns whether text wrapping is enabled.
   */
  getLineWrap(): boolean {
    return this._wrap;
  }

  /**
   * Selects all text in the textarea.
   */
  selectAll(): this {
    if (this._textareaElement) {
      this._textareaElement.select();
    }
    return this;
  }

  /**
   * Sets the focus to this textarea.
   */
  requestFocus(): this {
    if (this._textareaElement) {
      this._textareaElement.focus();
    }
    return this;
  }

  /**
   * Gets the number of lines in the textarea.
   */
  getLineCount(): number {
    const lines = this._text.split('\n');
    return lines.length;
  }

  /**
   * Inserts text at the specified position.
   */
  insert(text: string, position: number): this {
    if (position < 0) position = 0;
    if (position > this._text.length) position = this._text.length;
    
    this._text = this._text.slice(0, position) + text + this._text.slice(position);
    if (this._textareaElement) {
      this._textareaElement.value = this._text;
    }
    return this;
  }

  /**
   * Replaces the text in the specified range.
   */
  replaceRange(text: string, start: number, end: number): this {
    if (start < 0) start = 0;
    if (end > this._text.length) end = this._text.length;
    if (start > end) [start, end] = [end, start];
    
    this._text = this._text.slice(0, start) + text + this._text.slice(end);
    if (this._textareaElement) {
      this._textareaElement.value = this._text;
    }
    return this;
  }

  override getPreferredSize(): IntDimension {
    const width = Math.max(this._columns * 8 + 16, 150);
    const height = Math.max(this._rows * 20 + 8, 100);
    return new IntDimension(width, height);
  }

  override setSizeWH(width: number, height: number): this {
    super.setSizeWH(width, height);
    if (this._textareaElement) {
      this._textareaElement.style.width = `${width - 4}px`;
      this._textareaElement.style.height = `${height - 4}px`;
    }
    return this;
  }

  override toString(): string {
    return `JTextArea[rows=${this._rows},columns=${this._columns},text="${this._text.substring(0, 20)}${this._text.length > 20 ? '...' : ''}"]`;
  }
}
