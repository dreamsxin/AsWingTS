import { Component } from './Component.js';
import { IntDimension } from './geom/IntDimension.js';

/**
 * A progress bar component that displays the progress of a task.
 */
export class JProgressBar extends Component {
  private _minimum: number;
  private _maximum: number;
  private _value: number;
  private _stringPainted: boolean;
  private _orientation: string;
  private _barElement: HTMLElement | null;
  private _fillElement: HTMLElement | null;
  private _labelElement: HTMLElement | null;

  constructor(orientation: string = JProgressBar.HORIZONTAL, minimum: number = 0, maximum: number = 100, value: number = 0) {
    super();
    this._name = 'JProgressBar';
    this._orientation = orientation;
    this._minimum = minimum;
    this._maximum = maximum;
    this._value = value;
    this._stringPainted = false;
    this._barElement = null;
    this._fillElement = null;
    this._labelElement = null;
  }

  static readonly HORIZONTAL = 'horizontal';
  static readonly VERTICAL = 'vertical';

  override createRootElement(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'aswing-progressbar-wrapper';
    wrapper.style.position = 'absolute';

    if (this._orientation === JProgressBar.HORIZONTAL) {
      wrapper.style.width = '200px';
      wrapper.style.height = '20px';
    } else {
      wrapper.style.width = '20px';
      wrapper.style.height = '200px';
    }

    this._barElement = document.createElement('div');
    this._barElement.className = 'aswing-progressbar';
    this._barElement.style.position = 'relative';
    this._barElement.style.width = '100%';
    this._barElement.style.height = '100%';
    this._barElement.style.background = '#e0e0e0';
    this._barElement.style.borderRadius = '10px';
    this._barElement.style.overflow = 'hidden';
    this._barElement.style.border = '1px solid #ccc';

    this._fillElement = document.createElement('div');
    this._fillElement.className = 'aswing-progressbar-fill';
    this._fillElement.style.position = 'absolute';
    this._fillElement.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    this._fillElement.style.borderRadius = '8px';
    this._fillElement.style.transition = 'width 0.3s ease, height 0.3s ease';
    this._fillElement.style.margin = '1px';

    if (this._orientation === JProgressBar.HORIZONTAL) {
      this._fillElement.style.left = '0';
      this._fillElement.style.top = '0';
      this._fillElement.style.height = 'calc(100% - 2px)';
      this._fillElement.style.width = this._getPercent() + '%';
    } else {
      this._fillElement.style.left = '0';
      this._fillElement.style.bottom = '0';
      this._fillElement.style.width = 'calc(100% - 2px)';
      this._fillElement.style.height = this._getPercent() + '%';
    }

    this._barElement.appendChild(this._fillElement);

    if (this._stringPainted) {
      this._labelElement = document.createElement('div');
      this._labelElement.className = 'aswing-progressbar-label';
      this._labelElement.style.position = 'absolute';
      this._labelElement.style.top = '0';
      this._labelElement.style.left = '0';
      this._labelElement.style.width = '100%';
      this._labelElement.style.height = '100%';
      this._labelElement.style.display = 'flex';
      this._labelElement.style.alignItems = 'center';
      this._labelElement.style.justifyContent = 'center';
      this._labelElement.style.fontSize = '11px';
      this._labelElement.style.color = '#333';
      this._labelElement.textContent = this._getValueString();
      this._barElement.appendChild(this._labelElement);
    }

    wrapper.appendChild(this._barElement);
    return wrapper;
  }

  private _getPercent(): number {
    const range = this._maximum - this._minimum;
    if (range <= 0) return 0;
    return ((this._value - this._minimum) / range) * 100;
  }

  private _getValueString(): string {
    return `${Math.round(this._getPercent())}%`;
  }

  /**
   * Sets the minimum value.
   */
  setMinimum(minimum: number): void {
    this._minimum = minimum;
    this._updateFill();
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
  setMaximum(maximum: number): void {
    this._maximum = maximum;
    this._updateFill();
  }

  /**
   * Gets the maximum value.
   */
  getMaximum(): number {
    return this._maximum;
  }

  /**
   * Sets the current value.
   */
  setValue(value: number): void {
    this._value = Math.max(this._minimum, Math.min(this._maximum, value));
    this._updateFill();
    if (this._labelElement) {
      this._labelElement.textContent = this._getValueString();
    }
  }

  /**
   * Gets the current value.
   */
  getValue(): number {
    return this._value;
  }

  /**
   * Sets whether to paint the progress string.
   */
  setStringPainted(painted: boolean): void {
    this._stringPainted = painted;
  }

  /**
   * Returns whether the progress string is painted.
   */
  isStringPainted(): boolean {
    return this._stringPainted;
  }

  /**
   * Gets the orientation.
   */
  getOrientation(): string {
    return this._orientation;
  }

  private _updateFill(): void {
    if (this._fillElement) {
      const percent = this._getPercent() + '%';
      if (this._orientation === JProgressBar.HORIZONTAL) {
        this._fillElement.style.width = percent;
      } else {
        this._fillElement.style.height = percent;
      }
    }
  }

  override getPreferredSize(): IntDimension {
    if (this._orientation === JProgressBar.HORIZONTAL) {
      return new IntDimension(200, 20);
    } else {
      return new IntDimension(20, 200);
    }
  }

  override setSizeWH(width: number, height: number): this {
    super.setSizeWH(width, height);
    if (this._barElement) {
      if (this._orientation === JProgressBar.HORIZONTAL) {
        this._barElement.style.width = `${width}px`;
      } else {
        this._barElement.style.height = `${height}px`;
      }
    }
    return this;
  }

  override toString(): string {
    return `JProgressBar[value=${this._value}/${this._maximum}, ${this._orientation}]`;
  }
}
