import { AWEvent } from './AWEvent.js';
import { IntPoint } from '../geom/IntPoint.js';

/**
 * Event dispatched when a component is moved.
 */
export class MovedEvent extends AWEvent {
  /**
   * The MOVED event type constant.
   */
  static readonly MOVED = 'moved';

  private _oldLocation: IntPoint;
  private _newLocation: IntPoint;

  /**
   * Creates a new MovedEvent instance.
   * @param type The event type
   * @param oldLocation The previous location
   * @param newLocation The new location
   */
  constructor(type: string, oldLocation: IntPoint, newLocation: IntPoint) {
    super(type, false, false);
    this._oldLocation = oldLocation;
    this._newLocation = newLocation;
  }

  /**
   * Returns the old location.
   */
  getOldLocation(): IntPoint {
    return this._oldLocation;
  }

  /**
   * Returns the new location.
   */
  getNewLocation(): IntPoint {
    return this._newLocation;
  }

  override toString(): string {
    return `MovedEvent[type=${this.type}, old=${this._oldLocation}, new=${this._newLocation}]`;
  }
}
