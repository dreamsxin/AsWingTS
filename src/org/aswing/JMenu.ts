import { Container } from './Container.js';
import { JMenuItem } from './JMenuItem.js';
import { JMenuBar } from './JMenuBar.js';
import { JButton } from './JButton.js';
import { AWEvent } from './event/AWEvent.js';
import { IntDimension } from './geom/IntDimension.js';
import { FlowLayout } from './FlowLayout.js';

/**
 * A menu that can be added to a menu bar or another menu.
 */
export class JMenu extends JButton {
  private _menuItems: JMenuItem[];
  private _popupElement: HTMLElement | null;
  private _menuBar: JMenuBar | null;
  private _isOpen: boolean;

  constructor(text: string = '') {
    super(text);
    this._name = 'JMenu';
    this._menuItems = [];
    this._popupElement = null;
    this._menuBar = null;
    this._isOpen = false;
    
    // Style as menu button
    this.getElement()!.style.padding = '8px 16px';
    this.getElement()!.style.border = 'none';
    this.getElement()!.style.background = 'transparent';
    this.getElement()!.style.borderRadius = '0';
  }

  /**
   * Adds a menu item to this menu.
   */
  add(item: JMenuItem): JMenuItem {
    this._menuItems.push(item);
    this._updatePopup();
    return item;
  }

  /**
   * Removes a menu item from this menu.
   */
  remove(item: JMenuItem): JMenuItem | null {
    const index = this._menuItems.indexOf(item);
    if (index >= 0) {
      this._menuItems.splice(index, 1);
      this._updatePopup();
    }
    return item;
  }

  /**
   * Adds a separator to the menu.
   */
  addSeparator(): void {
    const separator = document.createElement('hr');
    separator.style.margin = '4px 0';
    separator.style.border = 'none';
    separator.style.borderTop = '1px solid #e0e0e0';
    
    if (this._popupElement) {
      this._popupElement.appendChild(separator);
    }
  }

  /**
   * Gets the number of menu items.
   */
  getItemCount(): number {
    return this._menuItems.length;
  }

  /**
   * Gets a menu item at the specified index.
   */
  getItem(index: number): JMenuItem | null {
    if (index < 0 || index >= this._menuItems.length) return null;
    return this._menuItems[index];
  }

  /**
   * Sets the parent menu bar.
   * @internal
   */
  setMenuBar(menuBar: JMenuBar | null): void {
    this._menuBar = menuBar;
  }

  /**
   * Gets the parent menu bar.
   */
  getMenuBar(): JMenuBar | null {
    return this._menuBar;
  }

  /**
   * Opens the menu popup.
   */
  open(): void {
    if (this._isOpen) return;
    
    this._createPopup();
    this._isOpen = true;
    this.getElement()!.style.background = '#e0e0e0';
  }

  /**
   * Closes the menu popup.
   */
  close(): void {
    if (!this._isOpen) return;
    
    if (this._popupElement && this._popupElement.parentElement) {
      this._popupElement.parentElement.removeChild(this._popupElement);
    }
    this._popupElement = null;
    this._isOpen = false;
    this.getElement()!.style.background = 'transparent';
  }

  /**
   * Checks if the menu is open.
   */
  isOpen(): boolean {
    return this._isOpen;
  }

  private _createPopup(): void {
    if (this._popupElement) return;

    this._popupElement = document.createElement('div');
    this._popupElement.className = 'aswing-menu-popup';
    this._popupElement.style.position = 'absolute';
    this._popupElement.style.background = '#fff';
    this._popupElement.style.border = '1px solid #ccc';
    this._popupElement.style.borderRadius = '4px';
    this._popupElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    this._popupElement.style.minWidth = '150px';
    this._popupElement.style.padding = '4px 0';
    this._popupElement.style.zIndex = '1000';

    // Position below the menu button
    const buttonRect = this.getElement()!.getBoundingClientRect();
    this._popupElement.style.left = `${buttonRect.left}px`;
    this._popupElement.style.top = `${buttonRect.bottom}px`;

    // Add menu items
    this._menuItems.forEach(item => {
      const itemEl = item.getElement();
      if (itemEl) {
        itemEl.style.position = 'relative';
        itemEl.style.left = '0';
        itemEl.style.top = '0';
        itemEl.style.width = '100%';
        itemEl.style.padding = '8px 16px';
        itemEl.style.margin = '0';
        itemEl.style.border = 'none';
        itemEl.style.background = 'transparent';
        itemEl.style.textAlign = 'left';
        itemEl.style.borderRadius = '0';
        this._popupElement!.appendChild(itemEl);
      }
    });

    document.body.appendChild(this._popupElement);

    // Close on outside click
    setTimeout(() => {
      const closeOnOutsideClick = (e: MouseEvent) => {
        if (!this._popupElement!.contains(e.target as Node)) {
          this.close();
          document.removeEventListener('click', closeOnOutsideClick);
        }
      };
      document.addEventListener('click', closeOnOutsideClick);
    }, 100);
  }

  private _updatePopup(): void {
    if (this._popupElement) {
      this._popupElement.innerHTML = '';
      this._menuItems.forEach(item => {
        const itemEl = item.getElement();
        if (itemEl) {
          this._popupElement!.appendChild(itemEl);
        }
      });
    }
  }

  override toString(): string {
    return `JMenu[text="${this._text}",items=${this._menuItems.length}]`;
  }
}
