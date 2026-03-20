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
  private _editorElement: HTMLInputElement | null;

  constructor(items: T[] = []) {
    super();
    this._name = 'JComboBox';
    this._items = items;
    this._selectedIndex = items.length > 0 ? 0 : -1;
    this._editable = false;
    this._selectElement = null;
    this._editorElement = null;
  }

  override createRootElement(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'aswing-combobox-wrapper';
    wrapper.style.position = 'absolute';
    wrapper.style.display = 'flex';

    if (this._editable) {
      // Editor input
      this._editorElement = document.createElement('input');
      this._editorElement.type = 'text';
      this._editorElement.className = 'aswing-combobox-editor';
      this._editorElement.style.flex = '1';
      this._editorElement.style.height = '32px';
      this._editorElement.style.padding = '6px 12px';
      this._editorElement.style.fontSize = '13px';
      this._editorElement.style.border = '1px solid #ccc';
      this._editorElement.style.borderRight = 'none';
      this._editorElement.style.borderRadius = '3px 0 0 3px';
      this._editorElement.value = this._items.length > 0 ? this.getItemText(this._items[this._selectedIndex]) : '';

      this._editorElement.addEventListener('input', (e) => {
        this.dispatchEvent(new AWEvent('itemStateChanged'));
      });

      this._editorElement.addEventListener('change', () => {
        this.dispatchEvent(new AWEvent(AWEvent.ACT));
      });

      wrapper.appendChild(this._editorElement);
    }

    this._selectElement = document.createElement('select');
    this._selectElement.className = 'aswing-combobox';
    this._selectElement.style.width = this._editable ? 'auto' : '150px';
    this._selectElement.style.height = '32px';
    this._selectElement.style.padding = '6px 12px';
    this._selectElement.style.fontSize = '13px';
    this._selectElement.style.border = '1px solid #ccc';
    this._selectElement.style.borderRadius = this._editable ? '0 3px 3px 0' : '3px';
    this._selectElement.style.background = '#fff';
    this._selectElement.style.cursor = 'pointer';
    this._selectElement.style.flex = this._editable ? '0 0 auto' : '1';

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
      if (this._editable && this._editorElement) {
        this._editorElement.value = this.getItemText(this._items[newIndex]);
      }
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

  /**
   * Gets the editor text (for editable combo boxes).
   */
  getEditorText(): string {
    if (this._editable && this._editorElement) {
      return this._editorElement.value;
    }
    return this._selectedIndex >= 0 ? this.getItemText(this._items[this._selectedIndex]) : '';
  }

  /**
   * Sets the editor text (for editable combo boxes).
   */
  setEditorText(text: string): this {
    if (this._editable && this._editorElement) {
      this._editorElement.value = text;
    }
    return this;
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
