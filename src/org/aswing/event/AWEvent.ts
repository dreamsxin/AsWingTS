/**
 * The Event class is used as the base class for the AsWing Component events.
 */
export class AWEvent extends Event {
  /**
   * The ACT event type constant.
   */
  static readonly ACT = 'act';

  /**
   * The SHOWN event type constant.
   */
  static readonly SHOWN = 'shown';

  /**
   * The HIDDEN event type constant.
   */
  static readonly HIDDEN = 'hidden';

  /**
   * The PAINT event type constant.
   */
  static readonly PAINT = 'paint';

  /**
   * The FOCUS_GAINED event type constant.
   */
  static readonly FOCUS_GAINED = 'focusGained';

  /**
   * The FOCUS_LOST event type constant.
   */
  static readonly FOCUS_LOST = 'focusLost';

  /**
   * Creates a new AWEvent instance.
   * @param type The event type
   * @param bubbles Indicates whether the event is bubbling
   * @param cancelable Indicates whether the event can be canceled
   */
  constructor(
    type: string,
    bubbles: boolean = false,
    cancelable: boolean = false
  ) {
    super(type, { bubbles, cancelable });
  }

  override toString(): string {
    return `AWEvent[type=${this.type}, bubbles=${this.bubbles}, cancelable=${this.cancelable}]`;
  }
}
