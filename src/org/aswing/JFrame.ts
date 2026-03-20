import { Container } from './Container.js';
import { BorderLayout } from './BorderLayout.js';
import { IntDimension } from './geom/IntDimension.js';
import { AsWingManager } from './AsWingManager.js';
import { JButton } from './JButton.js';
import { AWEvent } from './event/AWEvent.js';

/**
 * A top-level window with a title and border.
 * Supports custom title bar, close button, dragging, and themes.
 */
export class JFrame extends Container {
  private _title: string;
  private _closable: boolean;
  private _resizable: boolean;
  private _draggable: boolean;
  private _titleBar: HTMLElement | null = null;
  private _titleLabel: HTMLElement | null = null;
  private _closeButton: JButton | null = null;
  private _minimizeButton: JButton | null = null;
  private _maximizeButton: JButton | null = null;
  private _contentPane: Container | null = null;
  private _dragOffsetX: number = 0;
  private _dragOffsetY: number = 0;
  private _isDragging: boolean = false;

  private _titleBarHeight: number = 28;

  constructor(title: string = '') {
    super();
    this._name = 'JFrame';
    this._title = title;
    this._closable = true;
    this._resizable = true;
    this._draggable = true;
    this._defaultCloseOperation = JFrame.HIDE_ON_CLOSE;
    // Initialize content pane eagerly
    this._contentPane = new Container();
    this._contentPane.setLayout(new BorderLayout());
  }

  static readonly DO_NOTHING_ON_CLOSE = 0;
  static readonly HIDE_ON_CLOSE = 1;
  static readonly DISPOSE_ON_CLOSE = 2;
  static readonly EXIT_ON_CLOSE = 3;

  private _defaultCloseOperation: number;
  private _onCloseCallback: (() => void) | null = null;

  override createRootElement(): HTMLElement {
    const element = document.createElement('div');
    element.className = 'aswing-frame';
    element.style.position = 'absolute';
    element.style.background = '#fff';
    element.style.border = '1px solid #999';
    element.style.boxShadow = '2px 2px 10px rgba(0,0,0,0.3)';
    element.style.overflow = 'hidden';
    element.style.borderRadius = '6px';

    // Create title bar
    this._titleBar = document.createElement('div');
    this._titleBar.className = 'aswing-frame-titlebar';
    this._titleBar.style.background = 'linear-gradient(to bottom, #f5f5f5, #e0e0e0)';
    this._titleBar.style.padding = '0 8px';
    this._titleBar.style.borderBottom = 'none';
    this._titleBar.style.cursor = 'move';
    this._titleBar.style.userSelect = 'none';
    this._titleBar.style.height = `${this._titleBarHeight}px`;
    this._titleBar.style.boxSizing = 'border-box';
    this._titleBar.style.display = 'flex';
    this._titleBar.style.alignItems = 'center';
    this._titleBar.style.justifyContent = 'space-between';
    this._titleBar.style.borderRadius = '6px 6px 0 0';
    this._titleBar.style.color = '#fff';

    // Left side: Title
    const titleContainer = document.createElement('div');
    titleContainer.style.display = 'flex';
    titleContainer.style.alignItems = 'center';
    titleContainer.style.gap = '8px';
    titleContainer.style.flex = '1';
    titleContainer.style.minWidth = '0'; // Allow shrinking
    titleContainer.style.overflow = 'hidden'; // Hide overflow text
    titleContainer.style.marginRight = '4px'; // Gap before controls

    this._titleLabel = document.createElement('span');
    this._titleLabel.textContent = this._title;
    this._titleLabel.style.fontWeight = 'bold';
    this._titleLabel.style.fontSize = '13px';
    this._titleLabel.style.lineHeight = '1';
    this._titleLabel.style.color = '#333';
    this._titleLabel.style.textShadow = 'none';
    this._titleLabel.style.whiteSpace = 'nowrap';
    this._titleLabel.style.overflow = 'hidden';
    this._titleLabel.style.textOverflow = 'ellipsis';

    titleContainer.appendChild(this._titleLabel);
    this._titleBar.appendChild(titleContainer);

    // Right side: Window controls
    const controlsContainer = document.createElement('div');
    controlsContainer.style.display = 'flex';
    controlsContainer.style.alignItems = 'center';
    controlsContainer.style.gap = '0';
    controlsContainer.style.flexShrink = '0';
    controlsContainer.style.width = '28px';
    controlsContainer.style.height = '100%';
    controlsContainer.style.marginLeft = 'auto';
    controlsContainer.style.marginRight = '-5px'; // Move 5px to the right
    controlsContainer.style.justifyContent = 'flex-end';

    // Minimize button (optional)
    if (this._minimizeButton) {
      const minEl = this._minimizeButton.getElement();
      if (minEl) {
        minEl.style.margin = '0';
        controlsContainer.appendChild(minEl);
      }
    }

    // Maximize button (optional)
    if (this._maximizeButton) {
      const maxEl = this._maximizeButton.getElement();
      if (maxEl) {
        maxEl.style.margin = '0';
        controlsContainer.appendChild(maxEl);
      }
    }

    // Close button
    if (this._closable) {
      this._closeButton = new JButton('×');
      // Force element creation first
      const closeBtnElement = this._closeButton.getElement()!;
      // Then set size to ensure CSS is applied
      this._closeButton.setSize(28, 28);
      // Add special class for close button styling
      closeBtnElement.classList.add('close-btn');
      closeBtnElement.style.padding = '0';
      closeBtnElement.style.fontSize = '20px';
      closeBtnElement.style.fontWeight = '300';
      closeBtnElement.style.lineHeight = '1';
      closeBtnElement.style.cursor = 'pointer';
      closeBtnElement.style.width = '28px';
      closeBtnElement.style.height = '28px';
      closeBtnElement.style.minWidth = '28px';
      closeBtnElement.style.display = 'flex';
      closeBtnElement.style.alignItems = 'center';
      closeBtnElement.style.justifyContent = 'center';
      closeBtnElement.style.flexShrink = '0';
      closeBtnElement.style.margin = '0';
      
      this._closeButton.addEventListener('act', () => {
        this.doClose();
      });
      
      controlsContainer.appendChild(closeBtnElement);
    }

    this._titleBar.appendChild(controlsContainer);
    
    // Force reflow to ensure flex layout is calculated
    void controlsContainer.offsetWidth;
    element.appendChild(this._titleBar);

    // Setup dragging
    if (this._draggable) {
      this._setupDragging(element);
    }

    // Bring to front on click
    const bringToFront = () => {
      element.style.zIndex = '1000';
    };
    
    element.addEventListener('mousedown', bringToFront);
    element.addEventListener('focus', bringToFront);

    // Attach content pane element
    if (this._contentPane) {
      const contentElement = this._contentPane.getElement()!;
      contentElement.style.position = 'absolute';
      contentElement.style.top = `${this._titleBarHeight}px`;
      contentElement.style.left = '0';
      contentElement.style.width = '100%';
      contentElement.style.height = `calc(100% - ${this._titleBarHeight}px)`;
      contentElement.style.overflow = 'auto';
      contentElement.style.borderRadius = '0 0 6px 6px';
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
   * Sets whether the frame is closable.
   * Chainable - returns this for method chaining.
   */
  setClosable(closable: boolean): this {
    this._closable = closable;
    
    // Update close button visibility if element exists
    if (this._closeButton && this._closeButton.getElement()) {
      this._closeButton.setVisible(closable);
    }
    
    return this;
  }

  /**
   * Returns whether the frame is closable.
   */
  isClosable(): boolean {
    return this._closable;
  }

  /**
   * Sets whether the frame is draggable.
   * Chainable - returns this for method chaining.
   */
  setDraggable(draggable: boolean): this {
    this._draggable = draggable;
    if (this._titleBar) {
      this._titleBar.style.cursor = draggable ? 'move' : 'default';
    }
    return this;
  }

  /**
   * Returns whether the frame is draggable.
   */
  isDraggable(): boolean {
    return this._draggable;
  }

  /**
   * Sets whether the frame is resizable.
   * Chainable - returns this for method chaining.
   */
  setResizable(resizable: boolean): this {
    this._resizable = resizable;
    if (this._element) {
      this._element.style.resize = resizable ? 'both' : 'none';
    }
    return this;
  }

  /**
   * Returns whether the frame is resizable.
   */
  isResizable(): boolean {
    return this._resizable;
  }

  /**
   * Sets the default close operation.
   * Chainable - returns this for method chaining.
   */
  setDefaultCloseOperation(operation: number): this {
    this._defaultCloseOperation = operation;
    return this;
  }

  /**
   * Gets the default close operation.
   */
  getDefaultCloseOperation(): number {
    return this._defaultCloseOperation;
  }

  /**
   * Sets a custom close callback.
   * Chainable - returns this for method chaining.
   */
  setOnClose(callback: () => void): this {
    this._onCloseCallback = callback;
    return this;
  }

  /**
   * Performs the close operation.
   */
  doClose(): void {
    // Call custom callback first
    if (this._onCloseCallback) {
      this._onCloseCallback();
      return;
    }

    // Handle default close operation
    switch (this._defaultCloseOperation) {
      case JFrame.DO_NOTHING_ON_CLOSE:
        // Do nothing
        break;
      case JFrame.HIDE_ON_CLOSE:
        this.setVisible(false);
        break;
      case JFrame.DISPOSE_ON_CLOSE:
        if (this._element && this._element.parentElement) {
          this._element.parentElement.removeChild(this._element);
        }
        break;
      case JFrame.EXIT_ON_CLOSE:
        // In browser context, just hide
        this.setVisible(false);
        break;
    }

    this.dispatchEvent(new AWEvent('windowClosed'));
  }

  /**
   * Minimizes the frame.
   */
  minimize(): this {
    // Could implement minimize functionality
    return this;
  }

  /**
   * Maximizes the frame.
   */
  maximize(): this {
    if (this._element && this._element.parentElement) {
      const parent = this._element.parentElement;
      this.setSize(parent.clientWidth, parent.clientHeight);
      this.setLocation(0, 0);
    }
    return this;
  }

  /**
   * Restores the frame to its previous size.
   */
  restore(): this {
    // Could implement restore functionality
    return this;
  }

  /**
   * Sets up dragging functionality.
   */
  private _setupDragging(element: HTMLElement): void {
    if (!this._titleBar) return;

    this._titleBar.addEventListener('mousedown', (e) => {
      // Don't start drag if clicking on buttons
      if ((e.target as HTMLElement).closest('button')) return;

      this._isDragging = true;
      this._dragOffsetX = e.clientX - this._x;
      this._dragOffsetY = e.clientY - this._y;

      // Bring to front
      element.style.zIndex = '1000';
    });

    document.addEventListener('mousemove', (e) => {
      if (!this._isDragging) return;

      const newX = e.clientX - this._dragOffsetX;
      const newY = e.clientY - this._dragOffsetY;

      this.setLocationXY(newX, newY);
    });

    document.addEventListener('mouseup', () => {
      this._isDragging = false;
    });
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

  /**
   * Applies a theme to the frame title bar.
   * Chainable - returns this for method chaining.
   */
  override applyTheme(themeName: string | string[], clearExisting: boolean = false): this {
    super.applyTheme(themeName, clearExisting);
    
    // Apply theme to title bar
    const themes = Array.isArray(themeName) ? themeName : [themeName];
    const themeClasses = themes.map(t => `frame-${t}`).join(' ');
    
    if (this._titleBar) {
      if (clearExisting) {
        this._titleBar.className = 'aswing-frame-titlebar';
      }
      this._titleBar.classList.add(...themes.map(t => `frame-${t}`));
      
      // Apply gradient based on theme (overrides default)
      const themeGradients: Record<string, string> = {
        'primary': 'linear-gradient(135deg, #007bff, #0056b3)',
        'secondary': 'linear-gradient(135deg, #6c757d, #545b62)',
        'success': 'linear-gradient(135deg, #28a745, #1e7e34)',
        'danger': 'linear-gradient(135deg, #dc3545, #bd2130)',
        'warning': 'linear-gradient(135deg, #ffc107, #e0a800)',
        'info': 'linear-gradient(135deg, #17a2b8, #117a8b)',
        'light': 'linear-gradient(135deg, #f8f9fa, #e2e6ea)',
        'dark': 'linear-gradient(135deg, #343a40, #23272b)',
      };
      
      for (const theme of themes) {
        if (themeGradients[theme]) {
          this._titleBar.style.background = themeGradients[theme];
          // Update text color for dark themes
          if (['primary', 'success', 'danger', 'info', 'dark'].includes(theme)) {
            if (this._titleLabel) this._titleLabel.style.color = '#fff';
            if (this._closeButton) {
              const closeEl = this._closeButton.getElement();
              if (closeEl) closeEl.style.color = '#fff';
            }
          } else {
            if (this._titleLabel) this._titleLabel.style.color = '#333';
            if (this._closeButton) {
              const closeEl = this._closeButton.getElement();
              if (closeEl) closeEl.style.color = '#666';
            }
          }
          break;
        }
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


