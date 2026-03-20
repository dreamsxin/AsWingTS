import { IntDimension } from './geom/IntDimension.js';

/**
 * The main manager for AsWingTS framework.
 * Manages the root container and stage settings.
 */
export class AsWingManager {
  private static _stage: HTMLElement | null = null;
  private static _root: HTMLElement | null = null;
  private static _initialWidth: number = 0;
  private static _initialHeight: number = 0;
  private static _preventNullFocus: boolean = true;
  private static _nextFrameCalls: Array<() => void> = [];
  private static _frameTriggerScheduled: boolean = false;

  /**
   * Sets the root container for AsWingTS components.
   * Should be called before application start.
   */
  static setRoot(root: HTMLElement): void {
    this._root = root;
    if (root && !this._stage && root.parentElement) {
      this.initStage(root.parentElement as HTMLElement);
    }
  }

  /**
   * Init AsWingTS as standard settings.
   * @param root The default root container for popups, or null for no default root
   * @param preventNullFocus Prevent focus transfer to null (default: true)
   */
  static initAsStandard(root: HTMLElement | null, preventNullFocus: boolean = true): void {
    if (root) {
      this.setRoot(root);
    }
    this._preventNullFocus = preventNullFocus;
  }

  /**
   * Sets whether or not to prevent focus transfer to null.
   */
  static setPreventNullFocus(prevent: boolean): void {
    this._preventNullFocus = prevent;
  }

  /**
   * Returns the preventNullFocus property.
   */
  static isPreventNullFocus(): boolean {
    return this._preventNullFocus;
  }

  /**
   * Sets the initial stage size.
   */
  static setInitialStageSize(width: number, height: number): void {
    this._initialWidth = width;
    this._initialHeight = height;
  }

  /**
   * Returns the stage initial size.
   */
  static getInitialStageSize(): IntDimension {
    return new IntDimension(this._initialWidth, this._initialHeight);
  }

  /**
   * Returns the root container which components are based on.
   */
  static getRoot(checkError: boolean = true): HTMLElement | null {
    if (this._root == null) {
      return this.getStage(checkError);
    }
    return this._root;
  }

  /**
   * Init the stage for AsWingTS.
   */
  static initStage(stage: HTMLElement): void {
    if (!this._stage) {
      this._stage = stage;
      this._initialWidth = stage.clientWidth || window.innerWidth;
      this._initialHeight = stage.clientHeight || window.innerHeight;
    }
  }

  /**
   * Returns whether or not stage is initialized.
   */
  static isStageInited(): boolean {
    return this._stage != null;
  }

  /**
   * Returns the stage.
   */
  static getStage(checkError: boolean = true): HTMLElement | null {
    if (checkError && !this._stage) {
      throw new Error('AsWingManager not initialized. Call initAsStandard() or setRoot() first.');
    }
    return this._stage;
  }

  /**
   * Adds a function to the queue to be invoked at next frame.
   */
  static callNextFrame(func: () => void): void {
    this._nextFrameCalls.push(func);
    if (!this._frameTriggerScheduled) {
      this._frameTriggerScheduled = true;
      requestAnimationFrame(() => this.__enterFrame());
    }
  }

  /**
   * Calls a function after a delay.
   */
  static callLater(func: () => void, time: number = 40): void {
    setTimeout(func, time);
  }

  private static __enterFrame(): void {
    const calls = this._nextFrameCalls;
    this._nextFrameCalls = [];
    this._frameTriggerScheduled = false;

    for (const func of calls) {
      func();
    }
  }
}
