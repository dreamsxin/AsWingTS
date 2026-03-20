import { Container } from './Container.js';
import { BorderLayout } from './BorderLayout.js';

/**
 * A generic lightweight container.
 */
export class JPanel extends Container {
  constructor() {
    super();
    this._name = 'JPanel';
  }

  override createRootElement(): HTMLElement {
    const element = document.createElement('div');
    element.className = 'aswing-panel';
    return element;
  }

  /**
   * Sets whether the panel has a border.
   */
  setBorderVisible(visible: boolean): void {
    if (this._element) {
      this._element.style.border = visible ? '1px solid #ccc' : 'none';
    }
  }

  override toString(): string {
    return `JPanel[${this._x},${this._y},${this._width},${this._height},children=${this.getComponentCount()}]`;
  }
}
