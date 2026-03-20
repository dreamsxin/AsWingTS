import { Container } from './Container.js';
import { BorderLayout } from './BorderLayout.js';
import { IntDimension } from './geom/IntDimension.js';
import { AsWingManager } from './AsWingManager.js';

/**
 * A top-level window with a title and border.
 */
export class JFrame extends Container {
  private _title: string;
  private _closable: boolean;
  private _titleBar: HTMLElement | null = null;
  private _titleLabel: HTMLElement | null = null;
  private _contentPane: Container | null = null;

  private _titleBarHeight: number = 28;

  constructor(title: string = '') {
    super();
    this._name = 'JFrame';
    this._title = title;
    this._closable = false;
    this._defaultCloseOperation = JFrame.DO_NOTHING_ON_CLOSE;
    // Initialize content pane eagerly
    this._contentPane = new Container();
    this._contentPane.setLayout(new BorderLayout());
  }

  static readonly DO_NOTHING_ON_CLOSE = 0;
  static readonly HIDE_ON_CLOSE = 1;
  static readonly DISPOSE_ON_CLOSE = 2;

  private _defaultCloseOperation: number;

  override createRootElement(): HTMLElement {
    const element = document.createElement('div');
    element.className = 'aswing-frame';
    element.style.position = 'absolute';
    element.style.background = '#fff';
    element.style.border = '1px solid #999';
    element.style.boxShadow = '2px 2px 10px rgba(0,0,0,0.3)';
    element.style.overflow = 'hidden';

    // Create title bar
    this._titleBar = document.createElement('div');
    this._titleBar.className = 'aswing-frame-titlebar';
    this._titleBar.style.background = 'linear-gradient(to bottom, #f5f5f5, #e0e0e0)';
    this._titleBar.style.padding = '0 8px';
    this._titleBar.style.borderBottom = '1px solid #999';
    this._titleBar.style.cursor = 'default';
    this._titleBar.style.userSelect = 'none';
    this._titleBar.style.height = '28px';
    this._titleBar.style.boxSizing = 'border-box';
    this._titleBar.style.display = 'flex';
    this._titleBar.style.alignItems = 'center';
    this._titleBar.style.overflow = 'hidden';

    this._titleLabel = document.createElement('span');
    this._titleLabel.textContent = this._title;
    this._titleLabel.style.fontWeight = 'bold';
    this._titleLabel.style.fontSize = '13px';
    this._titleLabel.style.lineHeight = '1';

    this._titleBar.appendChild(this._titleLabel);
    element.appendChild(this._titleBar);

    // Store title bar height
    this._titleBarHeight = 28;

    // Attach content pane element
    if (this._contentPane) {
      const contentElement = this._contentPane.getElement()!;
      contentElement.style.position = 'absolute';
      contentElement.style.top = `${this._titleBarHeight}px`;
      contentElement.style.left = '0';
      contentElement.style.width = '100%';
      contentElement.style.height = `calc(100% - ${this._titleBarHeight}px)`;
      contentElement.style.overflow = 'hidden';
      element.appendChild(contentElement);
    }

    return element;
  }

  /**
   * Sets the frame title.
   */
  setTitle(title: string): void {
    this._title = title;
    if (this._titleLabel) {
      this._titleLabel.textContent = title;
    }
  }

  /**
   * Gets the frame title.
   */
  getTitle(): string {
    return this._title;
  }

  /**
   * Sets whether the frame can be closed.
   */
  setClosable(closable: boolean): void {
    this._closable = closable;
  }

  /**
   * Returns whether the frame is closable.
   */
  isClosable(): boolean {
    return this._closable;
  }

  /**
   * Sets the default close operation.
   */
  setDefaultCloseOperation(operation: number): void {
    this._defaultCloseOperation = operation;
  }

  /**
   * Gets the default close operation.
   */
  getDefaultCloseOperation(): number {
    return this._defaultCloseOperation;
  }

  /**
   * Gets the content pane.
   */
  getContentPane(): Container {
    if (!this._contentPane) {
      this._contentPane = new Container();
      this._contentPane.setLayout(new BorderLayout());
    }
    return this._contentPane;
  }

  /**
   * Sets the content pane.
   */
  setContentPane(contentPane: Container): void {
    this._contentPane = contentPane;
  }

  /**
   * Adds a component to the content pane.
   */
  override add(child: any, constraints?: any): any {
    return this.getContentPane().add(child, constraints);
  }

  /**
   * Override setSizeWH to also resize content pane.
   * Chainable - returns this for method chaining.
   */
  override setSizeWH(width: number, height: number): this {
    super.setSizeWH(width, height);
    // Update content pane size to match frame interior size
    if (this._contentPane) {
      const innerHeight = height - this._titleBarHeight;
      this._contentPane.setSizeWH(width, innerHeight > 0 ? innerHeight : 0);
    }
    return this;
  }

  /**
   * Packs the frame to fit its contents.
   */
  pack(): void {
    const prefSize = this._contentPane!.getPreferredSize();
    const titleBarHeight = this._titleBar ? this._titleBar.offsetHeight : 24;
    this.setSize(prefSize.width, prefSize.height + titleBarHeight);
  }

  /**
   * Sets the frame visible.
   * Chainable - returns this for method chaining.
   */
  override setVisible(visible: boolean): this {
    super.setVisible(visible);
    if (visible && !this._element?.parentElement) {
      // Add to root container
      const root = AsWingManager.getRoot(false);
      if (root) {
        root.appendChild(this._element!);
      }
    }
    return this;
  }

  override getPreferredSize(): IntDimension {
    const contentPref = this._contentPane!.getPreferredSize();
    const titleBarHeight = this._titleBar ? this._titleBar.offsetHeight : 24;
    return new IntDimension(contentPref.width, contentPref.height + titleBarHeight);
  }

  override toString(): string {
    return `JFrame[title="${this._title}",${this._x},${this._y},${this._width},${this._height}]`;
  }
}


