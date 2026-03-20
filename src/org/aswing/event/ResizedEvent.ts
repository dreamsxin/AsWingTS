import { AWEvent } from './AWEvent.js';
import { IntDimension } from '../geom/IntDimension.js';

/**
 * Event dispatched when a component is resized.
 */
export class ResizedEvent extends AWEvent {
  /**
   * The RESIZED event type constant.
   */
  static readonly RESIZED = 'resized';

  private _oldSize: IntDimension;
  private _newSize: IntDimension;

  /**
   * Creates a new ResizedEvent instance.
   * @param type The event type
   * @param oldSize The previous size
   * @param newSize The new size
   */
  constructor(type: string, oldSize: IntDimension, newSize: IntDimension) {
    super(type, false, false);
    this._oldSize = oldSize;
    this._newSize = newSize;
  }

  /**
   * Returns the old size.
   */
  getOldSize(): IntDimension {
    return this._oldSize;
  }

  /**
   * Returns the new size.
   */
  getNewSize(): IntDimension {
    return this._newSize;
  }

  override toString(): string {
    return `ResizedEvent[type=${this.type}, old=${this._oldSize}, new=${this._newSize}]`;
  }
}
