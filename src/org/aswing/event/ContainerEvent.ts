import { AWEvent } from './AWEvent.js';
import type { Component } from '../Component.js';

/**
 * Event dispatched when a component is added to or removed from a container.
 */
export class ContainerEvent extends AWEvent {
  /**
   * The COM_ADDED event type constant.
   */
  static readonly COM_ADDED = 'comAdded';

  /**
   * The COM_REMOVED event type constant.
   */
  static readonly COM_REMOVED = 'comRemoved';

  private _child: Component | null;

  /**
   * Creates a new ContainerEvent instance.
   * @param type The event type
   * @param child The child component that was added or removed
   */
  constructor(type: string, child: Component | null = null) {
    super(type, false, false);
    this._child = child;
  }

  /**
   * Returns the child component that was added or removed.
   */
  getChild(): Component | null {
    return this._child;
  }

  override toString(): string {
    return `ContainerEvent[type=${this.type}, child=${this._child}]`;
  }
}
