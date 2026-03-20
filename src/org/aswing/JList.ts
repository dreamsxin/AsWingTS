import { Component } from './Component.js';
import { AWEvent } from './event/AWEvent.js';
import { IntDimension } from './geom/IntDimension.js';

/**
 * Selection mode constants for JList.
 */
export class ListSelectionModel {
  /** No selection allowed */
  static readonly NONE = 'none';
  /** Single selection only */
  static readonly SINGLE = 'single';
  /** Single interval selection */
  static readonly SINGLE_INTERVAL = 'singleInterval';
  /** Multiple intervals selection */
  static readonly MULTIPLE_INTERVAL = 'multipleInterval';
}

/**
 * A list component that displays a scrollable list of items.
 */
export class JList<T = any> extends Component {
  private _items: T[];
  private _selectedIndices: number[];
  private _selectionMode: string;
  private _visibleRowCount: number;
  private _listElement: HTMLUListElement | null;

  constructor(items: T[] = []) {
    super();
    this._name = 'JList';
    this._items = items;
    this._selectedIndices = [];
    this._selectionMode = ListSelectionModel.SINGLE;
    this._visibleRowCount = 8;
    this._listElement = null;
  }

  override createRootElement(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'aswing-list-wrapper';
    wrapper.style.position = 'absolute';
    wrapper.style.overflow = 'auto';
    wrapper.style.border = '1px solid #ccc';
    wrapper.style.background = '#fff';

    this._listElement = document.createElement('ul');
    this._listElement.className = 'aswing-list';
    this._listElement.style.listStyle = 'none';
    this._listElement.style.margin = '0';
    this._listElement.style.padding = '0';

    // Calculate height based on visible row count
    const itemHeight = 28;
    const height = this._visibleRowCount * itemHeight;
    const width = 200;
    this._listElement.style.width = `${width}px`;
    this._listElement.style.minHeight = `${height}px`;

    // Populate list items
    this._items.forEach((item, index) => {
      const li = this.createListItem(item, index);
      this._listElement!.appendChild(li);
    });

    wrapper.appendChild(this._listElement);
    return wrapper;
  }

  /**
   * Creates a list item element.
   */
  protected createListItem(item: T, index: number): HTMLLIElement {
    const li = document.createElement('li');
    li.className = 'aswing-list-item';
    li.textContent = this.getItemText(item);
    li.style.padding = '8px 12px';
    li.style.cursor = 'pointer';
    li.style.userSelect = 'none';
    li.style.borderBottom = '1px solid #eee';
    li.style.fontSize = '13px';

    li.addEventListener('click', () => {
      this.handleItemClick(index);
    });

    return li;
  }

  /**
   * Handles item click.
   */
  protected handleItemClick(index: number): void {
    if (this._selectionMode === ListSelectionModel.NONE) return;

    if (this._selectionMode === ListSelectionModel.SINGLE) {
      this._selectedIndices = [index];
      this.updateSelectionVisual();
      this.dispatchEvent(new AWEvent('valueChanged'));
      this.dispatchEvent(new AWEvent(AWEvent.ACT));
    } else {
      // Multiple selection (simplified)
      const pos = this._selectedIndices.indexOf(index);
      if (pos >= 0) {
        this._selectedIndices.splice(pos, 1);
      } else {
        this._selectedIndices.push(index);
      }
      this.updateSelectionVisual();
      this.dispatchEvent(new AWEvent('valueChanged'));
    }
  }

  /**
   * Updates the visual selection state.
   */
  protected updateSelectionVisual(): void {
    if (!this._listElement) return;

    const items = this._listElement.querySelectorAll('.aswing-list-item');
    items.forEach((item, index) => {
      const li = item as HTMLLIElement;
      if (this._selectedIndices.includes(index)) {
        li.style.background = '#007bff';
        li.style.color = '#fff';
      } else {
        li.style.background = '';
        li.style.color = '';
      }
    });
  }

  /**
   * Gets the list element.
   */
  getListElement(): HTMLUListElement | null {
    return this._listElement;
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
   * Adds an item to the list.
   */
  addItem(item: T): this {
    this._items.push(item);
    if (this._listElement) {
      const li = this.createListItem(item, this._items.length - 1);
      this._listElement.appendChild(li);
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

    if (this._listElement) {
      const li = this.createListItem(item, index);
      const children = this._listElement.children;
      if (index >= children.length) {
        this._listElement.appendChild(li);
      } else {
        this._listElement.insertBefore(li, children[index]);
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

    if (this._listElement) {
      const children = this._listElement.children;
      if (children[index]) {
        children[index].remove();
      }
    }

    // Adjust selected indices
    this._selectedIndices = this._selectedIndices
      .filter(i => i !== index)
      .map(i => i > index ? i - 1 : i);

    return this;
  }

  /**
   * Removes all items.
   */
  clear(): this {
    this._items = [];
    this._selectedIndices = [];

    if (this._listElement) {
      this._listElement.innerHTML = '';
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
  getElementAt(index: number): T | null {
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
   * Sets the selection mode.
   */
  setSelectionMode(mode: string): this {
    this._selectionMode = mode;
    if (mode === ListSelectionModel.NONE) {
      this._selectedIndices = [];
      this.updateSelectionVisual();
    }
    return this;
  }

  /**
   * Gets the selection mode.
   */
  getSelectionMode(): string {
    return this._selectionMode;
  }

  /**
   * Sets the selected index.
   */
  setSelectedIndex(index: number): this {
    if (index < -1 || index >= this._items.length) return this;

    if (index === -1) {
      this._selectedIndices = [];
    } else if (this._selectionMode === ListSelectionModel.SINGLE) {
      this._selectedIndices = [index];
    } else {
      if (!this._selectedIndices.includes(index)) {
        this._selectedIndices.push(index);
      }
    }

    this.updateSelectionVisual();
    return this;
  }

  /**
   * Gets the selected index (-1 if none).
   */
  getSelectedIndex(): number {
    return this._selectedIndices.length > 0 ? this._selectedIndices[0] : -1;
  }

  /**
   * Gets the selected indices.
   */
  getSelectedIndices(): number[] {
    return [...this._selectedIndices];
  }

  /**
   * Gets the selected value.
   */
  getSelectedValue(): T | null {
    const index = this.getSelectedIndex();
    if (index < 0) return null;
    return this._items[index];
  }

  /**
   * Gets all selected values.
   */
  getSelectedValues(): T[] {
    return this._selectedIndices.map(i => this._items[i]);
  }

  /**
   * Sets the visible row count.
   */
  setVisibleRowCount(count: number): this {
    this._visibleRowCount = count;
    if (this._listElement) {
      this._listElement.style.minHeight = `${count * 28}px`;
    }
    return this;
  }

  /**
   * Gets the visible row count.
   */
  getVisibleRowCount(): number {
    return this._visibleRowCount;
  }

  /**
   * Ensures the specified index is visible.
   */
  ensureIndexIsVisible(index: number): this {
    if (!this._listElement || index < 0 || index >= this._items.length) return this;

    const items = this._listElement.querySelectorAll('.aswing-list-item');
    if (items[index]) {
      items[index].scrollIntoView({ block: 'nearest' });
    }

    return this;
  }

  /**
   * Gets the first visible index.
   */
  getFirstVisibleIndex(): number {
    if (!this._listElement) return 0;
    const wrapper = this._listElement.parentElement;
    if (!wrapper) return 0;
    return Math.floor(wrapper.scrollTop / 28);
  }

  /**
   * Gets the last visible index.
   */
  getLastVisibleIndex(): number {
    if (!this._listElement) return 0;
    const wrapper = this._listElement.parentElement;
    if (!wrapper) return this._items.length - 1;
    const visibleCount = Math.ceil(wrapper.clientHeight / 28);
    return Math.min(this._items.length - 1, this.getFirstVisibleIndex() + visibleCount);
  }

  override getPreferredSize(): IntDimension {
    let maxWidth = 200;
    for (const item of this._items) {
      const text = this.getItemText(item);
      maxWidth = Math.max(maxWidth, text.length * 8 + 40);
    }
    const height = Math.min(this._items.length, this._visibleRowCount) * 28;
    return new IntDimension(maxWidth, height + 2);
  }

  override setSizeWH(width: number, height: number): this {
    super.setSizeWH(width, height);
    if (this._listElement) {
      this._listElement.style.width = `${width - 4}px`;
      this._listElement.style.minHeight = `${height - 4}px`;
    }
    return this;
  }

  override toString(): string {
    return `JList[items=${this._items.length},selected=${this.getSelectedIndex()}]`;
  }
}
