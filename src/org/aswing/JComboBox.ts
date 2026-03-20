import { Component } from './Component.js';
import { AWEvent } from './event/AWEvent.js';
import { IntDimension } from './geom/IntDimension.js';

/**
 * A combo box component that allows selecting from a dropdown list.
 */
export class JComboBox<T = any> extends Component {
  private _items: T[];
  private _selectedIndex: number;
  private _editable: boolean;
  private _selectElement: HTMLSelectElement | null;

  constructor(items: T[] = []) {
    super();
    this._name = 'JComboBox';
    this._items = items;
    this._selectedIndex = items.length > 0 ? 0 : -1;
    this._editable = false;
    this._selectElement = null;
  }

  override createRootElement(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'aswing-combobox-wrapper';
    wrapper.style.position = 'absolute';

    this._selectElement = document.createElement('select');
    this._selectElement.className = 'aswing-combobox';
    this._selectElement.style.width = '150px';
    this._selectElement.style.height = '32px';
    this._selectElement.style.padding = '6px 12px';
    this._selectElement.style.fontSize = '13px';
    this._selectElement.style.border = '1px solid #ccc';
    this._selectElement.style.borderRadius = '3px';
    this._selectElement.style.background = '#fff';
    this._selectElement.style.cursor = 'pointer';

    // Populate options
    this._items.forEach((item, index) => {
      const option = document.createElement('option');
      option.value = String(index);
      option.textContent = this.getItemText(item);
      option.selected = (index === this._selectedIndex);
      this._selectElement!.appendChild(option);
    });

    // Event listeners
    this._selectElement.addEventListener('change', (e) => {
      const newIndex = parseInt((e.target as HTMLSelectElement).value);
      this._selectedIndex = newIndex;
      this.dispatchEvent(new AWEvent('itemStateChanged'));
      this.dispatchEvent(new AWEvent(AWEvent.ACT));
    });

    wrapper.appendChild(this._selectElement);
    return wrapper;
  }

  /**
   * Gets the select element.
   */
  getSelectElement(): HTMLSelectElement | null {
    return this._selectElement;
  }

  /**
   * Gets the item text (override for custom display).
   */
  protected getItemText(item: T): string {
    if (item === null || item === undefined) return '';
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && 'toString' in item) {
      return String(item);
    }
    return String(item);
  }

  /**
   * Adds an item to the combo box.
   */
  addItem(item: T): this {
    this._items.push(item);
    if (this._selectElement) {
      const option = document.createElement('option');
      option.value = String(this._items.length - 1);
      option.textContent = this.getItemText(item);
      this._selectElement.appendChild(option);
    }
    if (this._selectedIndex < 0 && this._items.length > 0) {
      this._selectedIndex = 0;
    }
    return this;
  }

  /**
   * Inserts an item at the specified index.
   */
  insertItemAt(item: T, index: number): this {
    if (index < 0) index = 0;
    if (index > this._items.length) index = this._items.length;
    
    this._items.splice(index, 0, item);
    
    if (this._selectElement) {
      const option = document.createElement('option');
      option.value = String(index);
      option.textContent = this.getItemText(item);
      
      const options = this._selectElement.options;
      if (index >= options.length) {
        this._selectElement.appendChild(option);
      } else {
        this._selectElement.insertBefore(option, options[index]);
        // Update all option values after insertion
        for (let i = index; i < this._items.length; i++) {
          options[i].value = String(i);
        }
      }
    }
    
    return this;
  }

  /**
   * Removes an item at the specified index.
   */
  removeItemAt(index: number): this {
    if (index < 0 || index >= this._items.length) return this;
    
    this._items.splice(index, 1);
    
    if (this._selectElement) {
      const options = this._selectElement.options;
      if (options[index]) {
        options[index].remove();
        // Update all option values after removal
        for (let i = index; i < this._items.length; i++) {
          options[i].value = String(i);
        }
      }
    }
    
    // Adjust selected index if needed
    if (this._selectedIndex >= this._items.length) {
      this._selectedIndex = this._items.length - 1;
    }
    
    return this;
  }

  /**
   * Removes all items.
   */
  removeAllItems(): this {
    this._items = [];
    this._selectedIndex = -1;
    
    if (this._selectElement) {
      this._selectElement.innerHTML = '';
    }
    
    return this;
  }

  /**
   * Gets the number of items.
   */
  getItemCount(): number {
    return this._items.length;
  }

  /**
   * Gets an item at the specified index.
   */
  getItemAt(index: number): T | null {
    if (index < 0 || index >= this._items.length) return null;
    return this._items[index];
  }

  /**
   * Gets all items.
   */
  getItems(): T[] {
    return [...this._items];
  }

  /**
   * Sets the selected index.
   */
  setSelectedIndex(index: number): this {
    if (index < -1 || index >= this._items.length) return this;
    
    this._selectedIndex = index;
    
    if (this._selectElement) {
      this._selectElement.selectedIndex = index;
    }
    
    return this;
  }

  /**
   * Gets the selected index.
   */
  getSelectedIndex(): number {
    return this._selectedIndex;
  }

  /**
   * Gets the selected item.
   */
  getSelectedItem(): T | null {
    if (this._selectedIndex < 0 || this._selectedIndex >= this._items.length) {
      return null;
    }
    return this._items[this._selectedIndex];
  }

  /**
   * Sets the selected item.
   */
  setSelectedItem(item: T): this {
    const index = this._items.indexOf(item);
    if (index >= 0) {
      this.setSelectedIndex(index);
    }
    return this;
  }

  /**
   * Sets whether the combo box is editable.
   * Note: This is a visual setting only in this implementation.
   */
  setEditable(editable: boolean): this {
    this._editable = editable;
    return this;
  }

  /**
   * Returns whether the combo box is editable.
   */
  isEditable(): boolean {
    return this._editable;
  }

  override getPreferredSize(): IntDimension {
    let maxWidth = 150;
    for (const item of this._items) {
      const text = this.getItemText(item);
      maxWidth = Math.max(maxWidth, text.length * 8 + 40);
    }
    return new IntDimension(maxWidth, 32);
  }

  override setSizeWH(width: number, height: number): this {
    super.setSizeWH(width, height);
    if (this._selectElement) {
      this._selectElement.style.width = `${width - 4}px`;
      this._selectElement.style.height = `${height - 4}px`;
    }
    return this;
  }

  override toString(): string {
    const selectedItem = this.getSelectedItem();
    return `JComboBox[items=${this._items.length},selected=${selectedItem}]`;
  }
}
