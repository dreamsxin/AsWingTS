import { Component } from './Component.js';
import { AWEvent } from './event/AWEvent.js';
import { IntDimension } from './geom/IntDimension.js';
import { AsWingConstants } from './AsWingConstants.js';

/**
 * A slider component that allows selecting a value from a range.
 */
export class JSlider extends Component {
  private _minimum: number;
  private _maximum: number;
  private _value: number;
  private _orientation: string;
  private _paintTicks: boolean;
  private _paintLabels: boolean;
  private _majorTickSpacing: number;
  private _minorTickSpacing: number;
  private _sliderElement: HTMLElement | null;
  private _trackElement: HTMLElement | null;
  private _thumbElement: HTMLElement | null;
  private _isDragging: boolean;

  constructor(orientation: string = AsWingConstants.HORIZONTAL, 
              minimum: number = 0, 
              maximum: number = 100, 
              value: number = 50) {
    super();
    this._name = 'JSlider';
    this._orientation = orientation;
    this._minimum = minimum;
    this._maximum = maximum;
    this._value = Math.max(minimum, Math.min(maximum, value));
    this._paintTicks = false;
    this._paintLabels = false;
    this._majorTickSpacing = 0;
    this._minorTickSpacing = 0;
    this._sliderElement = null;
    this._trackElement = null;
    this._thumbElement = null;
    this._isDragging = false;
  }

  static readonly HORIZONTAL = AsWingConstants.HORIZONTAL;
  static readonly VERTICAL = AsWingConstants.VERTICAL;

  override createRootElement(): HTMLElement {
    this._sliderElement = document.createElement('div');
    this._sliderElement.className = 'aswing-slider';
    this._sliderElement.style.position = 'absolute';

    if (this._orientation === AsWingConstants.HORIZONTAL) {
      this._sliderElement.style.width = '200px';
      this._sliderElement.style.height = '20px';
    } else {
      this._sliderElement.style.width = '20px';
      this._sliderElement.style.height = '200px';
    }

    // Track
    this._trackElement = document.createElement('div');
    this._trackElement.className = 'aswing-slider-track';
    this._trackElement.style.position = 'absolute';
    this._trackElement.style.background = '#e0e0e0';
    this._trackElement.style.borderRadius = '10px';
    
    if (this._orientation === AsWingConstants.HORIZONTAL) {
      this._trackElement.style.left = '0';
      this._trackElement.style.top = '50%';
      this._trackElement.style.transform = 'translateY(-50%)';
      this._trackElement.style.width = '100%';
      this._trackElement.style.height = '4px';
    } else {
      this._trackElement.style.left = '50%';
      this._trackElement.style.top = '0';
      this._trackElement.style.transform = 'translateX(-50%)';
      this._trackElement.style.width = '4px';
      this._trackElement.style.height = '100%';
    }

    // Thumb
    this._thumbElement = document.createElement('div');
    this._thumbElement.className = 'aswing-slider-thumb';
    this._thumbElement.style.position = 'absolute';
    this._thumbElement.style.width = '16px';
    this._thumbElement.style.height = '16px';
    this._thumbElement.style.background = '#fff';
    this._thumbElement.style.border = '2px solid #007bff';
    this._thumbElement.style.borderRadius = '50%';
    this._thumbElement.style.cursor = 'pointer';
    this._thumbElement.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)';
    
    this.updateThumbPosition();

    // Events
    this._thumbElement.addEventListener('mousedown', (e) => this.onThumbMouseDown(e));

    this._sliderElement.appendChild(this._trackElement);
    this._sliderElement.appendChild(this._thumbElement);

    return this._sliderElement;
  }

  private onThumbMouseDown(e: MouseEvent): void {
    this._isDragging = true;
    e.preventDefault();
    e.stopPropagation();

    const sliderRect = this._sliderElement!.getBoundingClientRect();
    
    const onMouseMove = (e: MouseEvent) => {
      if (!this._isDragging || !this._sliderElement || !this._thumbElement) return;

      let newValue: number;
      
      if (this._orientation === AsWingConstants.HORIZONTAL) {
        const x = e.clientX - sliderRect.left;
        const trackWidth = sliderRect.width - 16; // Account for thumb width
        const percent = Math.max(0, Math.min(1, (x - 8) / trackWidth));
        newValue = Math.round(this._minimum + percent * (this._maximum - this._minimum));
      } else {
        const y = e.clientY - sliderRect.top;
        const trackHeight = sliderRect.height - 16;
        const percent = Math.max(0, Math.min(1, (trackHeight - (y - 8)) / trackHeight));
        newValue = Math.round(this._minimum + percent * (this._maximum - this._minimum));
      }
      
      if (newValue !== this._value) {
        this._value = newValue;
        this.updateThumbPosition();
        this.dispatchEvent(new AWEvent('stateChanged'));
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      this._isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  private updateThumbPosition(): void {
    if (!this._thumbElement || !this._sliderElement) return;

    const percent = (this._value - this._minimum) / (this._maximum - this._minimum);
    const rect = this._sliderElement.getBoundingClientRect();

    if (this._orientation === AsWingConstants.HORIZONTAL) {
      const trackWidth = rect.width - 16;
      const x = 8 + percent * trackWidth;
      this._thumbElement.style.left = `${x}px`;
      this._thumbElement.style.top = '50%';
      this._thumbElement.style.transform = 'translate(-50%, -50%)';
    } else {
      const trackHeight = rect.height - 16;
      const y = 8 + percent * trackHeight;
      this._thumbElement.style.left = '50%';
      this._thumbElement.style.top = `${y}px`;
      this._thumbElement.style.transform = 'translate(-50%, -50%)';
    }
  }

  /**
   * Sets the slider value.
   */
  setValue(value: number): this {
    const oldValue = this._value;
    this._value = Math.max(this._minimum, Math.min(this._maximum, value));
    
    if (oldValue !== this._value) {
      this.updateThumbPosition();
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
   * Sets the orientation.
   */
  setOrientation(orientation: string): this {
    this._orientation = orientation;
    return this;
  }

  /**
   * Gets the orientation.
   */
  getOrientation(): string {
    return this._orientation;
  }

  /**
   * Sets whether to paint tick marks.
   */
  setPaintTicks(paint: boolean): this {
    this._paintTicks = paint;
    return this;
  }

  /**
   * Sets the major tick spacing.
   */
  setMajorTickSpacing(spacing: number): this {
    this._majorTickSpacing = spacing;
    return this;
  }

  /**
   * Sets the minor tick spacing.
   */
  setMinorTickSpacing(spacing: number): this {
    this._minorTickSpacing = spacing;
    return this;
  }

  /**
   * Sets whether to paint labels.
   */
  setPaintLabels(paint: boolean): this {
    this._paintLabels = paint;
    return this;
  }

  override getPreferredSize(): IntDimension {
    if (this._orientation === AsWingConstants.HORIZONTAL) {
      return new IntDimension(200, 20);
    } else {
      return new IntDimension(20, 200);
    }
  }

  override setSizeWH(width: number, height: number): this {
    super.setSizeWH(width, height);
    if (this._sliderElement) {
      this._sliderElement.style.width = `${width}px`;
      this._sliderElement.style.height = `${height}px`;
    }
    return this;
  }

  override toString(): string {
    return `JSlider[value=${this._value},min=${this._minimum},max=${this._maximum}]`;
  }
}
