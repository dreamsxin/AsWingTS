import { Container } from './Container.js';
import { IntDimension } from './geom/IntDimension.js';
import { AsWingConstants } from './AsWingConstants.js';

/**
 * Scroll policy constants.
 */
export class ScrollPaneConstants {
  /** Never show scroll bar */
  static readonly NEVER = 'never';
  /** Always show scroll bar */
  static readonly ALWAYS = 'always';
  /** Show scroll bar when needed */
  static readonly AS_NEEDED = 'asNeeded';
}

/**
 * A container that provides scrolling for its contents.
 */
export class JScrollPane extends Container {
  private _viewportView: Container | null;
  private _horizontalScrollBarPolicy: string;
  private _verticalScrollBarPolicy: string;
  private _scrollPaneElement: HTMLElement | null;
  private _viewportElement: HTMLElement | null;

  constructor(view: Container | null = null,
              vPolicy: string = ScrollPaneConstants.AS_NEEDED,
              hPolicy: string = ScrollPaneConstants.AS_NEEDED) {
    super();
    this._name = 'JScrollPane';
    this._viewportView = view;
    this._horizontalScrollBarPolicy = hPolicy;
    this._verticalScrollBarPolicy = vPolicy;
    this._scrollPaneElement = null;
    this._viewportElement = null;
  }

  override createRootElement(): HTMLElement {
    this._scrollPaneElement = document.createElement('div');
    this._scrollPaneElement.className = 'aswing-scrollpane';
    this._scrollPaneElement.style.position = 'absolute';
    this._scrollPaneElement.style.overflow = 'auto';
    this._scrollPaneElement.style.background = '#fff';
    this._scrollPaneElement.style.border = '1px solid #ccc';

    this._viewportElement = document.createElement('div');
    this._viewportElement.className = 'aswing-viewport';
    this._viewportElement.style.position = 'relative';
    this._viewportElement.style.minWidth = '100%';
    this._viewportElement.style.minHeight = '100%';

    this._scrollPaneElement.appendChild(this._viewportElement);

    // Add viewport view if provided
    if (this._viewportView) {
      const viewElement = this._viewportView.getElement();
      if (viewElement) {
        this._viewportElement.appendChild(viewElement);
      }
    }

    return this._scrollPaneElement;
  }

  /**
   * Gets the scroll pane element.
   */
  getScrollPaneElement(): HTMLElement | null {
    return this._scrollPaneElement;
  }

  /**
   * Gets the viewport element.
   */
  getViewportElement(): HTMLElement | null {
    return this._viewportElement;
  }

  /**
   * Sets the view component to be displayed in the viewport.
   */
  setViewportView(view: Container): this {
    this._viewportView = view;

    if (this._viewportElement) {
      this._viewportElement.innerHTML = '';
      const viewElement = view.getElement();
      if (viewElement) {
        this._viewportElement.appendChild(viewElement);
      }
    }

    return this;
  }

  /**
   * Gets the view component.
   */
  getViewportView(): Container | null {
    return this._viewportView;
  }

  /**
   * Sets the horizontal scroll bar policy.
   */
  setHorizontalScrollBarPolicy(policy: string): this {
    this._horizontalScrollBarPolicy = policy;
    this.updateScrollBars();
    return this;
  }

  /**
   * Gets the horizontal scroll bar policy.
   */
  getHorizontalScrollBarPolicy(): string {
    return this._horizontalScrollBarPolicy;
  }

  /**
   * Sets the vertical scroll bar policy.
   */
  setVerticalScrollBarPolicy(policy: string): this {
    this._verticalScrollBarPolicy = policy;
    this.updateScrollBars();
    return this;
  }

  /**
   * Gets the vertical scroll bar policy.
   */
  getVerticalScrollBarPolicy(): string {
    return this._verticalScrollBarPolicy;
  }

  /**
   * Updates scroll bar visibility based on policies.
   */
  protected updateScrollBars(): void {
    if (!this._scrollPaneElement) return;

    // Horizontal
    if (this._horizontalScrollBarPolicy === ScrollPaneConstants.NEVER) {
      this._scrollPaneElement.style.overflowX = 'hidden';
    } else if (this._horizontalScrollBarPolicy === ScrollPaneConstants.ALWAYS) {
      this._scrollPaneElement.style.overflowX = 'scroll';
    } else {
      this._scrollPaneElement.style.overflowX = 'auto';
    }

    // Vertical
    if (this._verticalScrollBarPolicy === ScrollPaneConstants.NEVER) {
      this._scrollPaneElement.style.overflowY = 'hidden';
    } else if (this._verticalScrollBarPolicy === ScrollPaneConstants.ALWAYS) {
      this._scrollPaneElement.style.overflowY = 'scroll';
    } else {
      this._scrollPaneElement.style.overflowY = 'auto';
    }
  }

  /**
   * Scrolls the view to make the specified rectangle visible.
   */
  scrollRectToVisible(rect: { x: number; y: number; width: number; height: number }): this {
    if (!this._scrollPaneElement) return this;

    this._scrollPaneElement.scrollLeft = rect.x;
    this._scrollPaneElement.scrollTop = rect.y;

    return this;
  }

  /**
   * Gets the current scroll position (horizontal).
   */
  getHorizontalScrollPosition(): number {
    return this._scrollPaneElement?.scrollLeft || 0;
  }

  /**
   * Gets the current scroll position (vertical).
   */
  getVerticalScrollPosition(): number {
    return this._scrollPaneElement?.scrollTop || 0;
  }

  /**
   * Sets the horizontal scroll position.
   */
  setHorizontalScrollPosition(position: number): this {
    if (this._scrollPaneElement) {
      this._scrollPaneElement.scrollLeft = position;
    }
    return this;
  }

  /**
   * Sets the vertical scroll position.
   */
  setVerticalScrollPosition(position: number): this {
    if (this._scrollPaneElement) {
      this._scrollPaneElement.scrollTop = position;
    }
    return this;
  }

  /**
   * Gets the maximum horizontal scroll position.
   */
  getMaximumHorizontalScroll(): number {
    if (!this._scrollPaneElement) return 0;
    return this._scrollPaneElement.scrollWidth - this._scrollPaneElement.clientWidth;
  }

  /**
   * Gets the maximum vertical scroll position.
   */
  getMaximumVerticalScroll(): number {
    if (!this._scrollPaneElement) return 0;
    return this._scrollPaneElement.scrollHeight - this._scrollPaneElement.clientHeight;
  }

  /**
   * Scrolls to the top-left corner.
   */
  scrollToTop(): this {
    return this.scrollToPosition(0, 0);
  }

  /**
   * Scrolls to the bottom-right corner.
   */
  scrollToBottom(): this {
    if (!this._scrollPaneElement) return this;
    return this.scrollToPosition(
      this.getMaximumHorizontalScroll(),
      this.getMaximumVerticalScroll()
    );
  }

  /**
   * Scrolls to the specified position.
   */
  scrollToPosition(x: number, y: number): this {
    if (this._scrollPaneElement) {
      this._scrollPaneElement.scrollLeft = x;
      this._scrollPaneElement.scrollTop = y;
    }
    return this;
  }

  /**
   * Adds a scroll listener.
   */
  addScrollListener(callback: (event: { scrollLeft: number; scrollTop: number }) => void): this {
    if (this._scrollPaneElement) {
      this._scrollPaneElement.addEventListener('scroll', () => {
        callback({
          scrollLeft: this._scrollPaneElement!.scrollLeft,
          scrollTop: this._scrollPaneElement!.scrollTop
        });
      });
    }
    return this;
  }

  override getPreferredSize(): IntDimension {
    if (this._viewportView) {
      return this._viewportView.getPreferredSize();
    }
    return new IntDimension(200, 150);
  }

  override setSizeWH(width: number, height: number): this {
    super.setSizeWH(width, height);
    if (this._scrollPaneElement) {
      this._scrollPaneElement.style.width = `${width}px`;
      this._scrollPaneElement.style.height = `${height}px`;
    }
    return this;
  }

  override toString(): string {
    return `JScrollPane[hPolicy=${this._horizontalScrollBarPolicy},vPolicy=${this._verticalScrollBarPolicy}]`;
  }
}
