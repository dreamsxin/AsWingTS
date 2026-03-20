import { Container } from './Container.js';
import { JMenu } from './JMenu.js';
import { IntDimension } from './geom/IntDimension.js';
import { FlowLayout } from './FlowLayout.js';
import { AsWingConstants } from './AsWingConstants.js';

/**
 * A menu bar that holds menus.
 */
export class JMenuBar extends Container {
  private _menus: JMenu[];

  constructor() {
    super();
    this._name = 'JMenuBar';
    this._menus = [];
    this.setLayout(new FlowLayout(AsWingConstants.LEFT, 0, 0));
  }

  /**
   * Adds a menu to the menu bar.
   */
  add(menu: JMenu): JMenu {
    this._menus.push(menu);
    menu.setMenuBar(this);
    return super.add(menu) as JMenu;
  }

  /**
   * Removes a menu from the menu bar.
   */
  remove(menu: JMenu): JMenu | null {
    const index = this._menus.indexOf(menu);
    if (index >= 0) {
      this._menus.splice(index, 1);
      menu.setMenuBar(null);
    }
    return super.remove(menu) as JMenu | null;
  }

  /**
   * Gets the number of menus.
   */
  getMenuCount(): number {
    return this._menus.length;
  }

  /**
   * Gets a menu at the specified index.
   */
  getMenu(index: number): JMenu | null {
    if (index < 0 || index >= this._menus.length) return null;
    return this._menus[index];
  }

  /**
   * Gets all menus.
   */
  getMenus(): JMenu[] {
    return [...this._menus];
  }

  override getPreferredSize(): IntDimension {
    return new IntDimension(400, 28);
  }

  override toString(): string {
    return `JMenuBar[menus=${this._menus.length}]`;
  }
}
