import { Container } from './Container.js';
import { JButton } from './JButton.js';
import { JSeparator } from './JSeparator.js';
import { IntDimension } from './geom/IntDimension.js';
import { FlowLayout } from './FlowLayout.js';
import { AsWingConstants } from './AsWingConstants.js';

/**
 * A toolbar component that holds buttons and other controls.
 */
export class JToolBar extends Container {
  private _orientation: string;
  private _floatable: boolean;
  private _rollover: boolean;

  constructor(orientation: string = AsWingConstants.HORIZONTAL) {
    super();
    this._name = 'JToolBar';
    this._orientation = orientation;
    this._floatable = true;
    this._rollover = true;
    
    // Set layout based on orientation
    const flowLayout = new FlowLayout(AsWingConstants.LEFT, 2, 2);
    this.setLayout(flowLayout);
    
    // Add constants to FlowLayout for compatibility
    (FlowLayout as any).LEFT = AsWingConstants.LEFT;
    (FlowLayout as any).CENTER = AsWingConstants.CENTER;
    (FlowLayout as any).RIGHT = AsWingConstants.RIGHT;
  }

  static readonly HORIZONTAL = AsWingConstants.HORIZONTAL;
  static readonly VERTICAL = AsWingConstants.VERTICAL;

  /**
   * Adds a button to the toolbar.
   */
  add(component: any, constraints?: any): any {
    return super.add(component, constraints);
  }

  /**
   * Adds a separator to the toolbar.
   */
  addSeparator(): void {
    const separator = new JSeparator(
      this._orientation === AsWingConstants.HORIZONTAL 
        ? AsWingConstants.VERTICAL 
        : AsWingConstants.HORIZONTAL
    );
    
    if (this._orientation === AsWingConstants.HORIZONTAL) {
      separator.setSize(2, 24);
    } else {
      separator.setSize(24, 2);
    }
    
    this.add(separator);
  }

  /**
   * Gets the orientation.
   */
  getOrientation(): string {
    return this._orientation;
  }

  /**
   * Sets the orientation.
   */
  setOrientation(orientation: string): this {
    this._orientation = orientation;
    return this;
  }

  /**
   * Sets whether the toolbar can be floated (dragged).
   */
  setFloatable(floatable: boolean): this {
    this._floatable = floatable;
    return this;
  }

  /**
   * Returns whether the toolbar is floatable.
   */
  isFloatable(): boolean {
    return this._floatable;
  }

  /**
   * Sets whether buttons show rollover effect.
   */
  setRollover(rollover: boolean): this {
    this._rollover = rollover;
    return this;
  }

  /**
   * Returns whether rollover is enabled.
   */
  isRollover(): boolean {
    return this._rollover;
  }

  override getPreferredSize(): IntDimension {
    if (this._orientation === AsWingConstants.HORIZONTAL) {
      return new IntDimension(200, 28);
    } else {
      return new IntDimension(28, 200);
    }
  }

  override toString(): string {
    return `JToolBar[orientation=${this._orientation},components=${this.getComponentCount()}]`;
  }
}
