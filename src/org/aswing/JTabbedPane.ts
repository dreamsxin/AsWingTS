import { Container } from './Container.js';
import { JPanel } from './JPanel.js';
import { JButton } from './JButton.js';
import { AWEvent } from './event/AWEvent.js';
import { IntDimension } from './geom/IntDimension.js';
import { AsWingConstants } from './AsWingConstants.js';

interface Tab {
  title: string;
  component: Container;
  enabled: boolean;
  icon?: HTMLElement;
}

/**
 * A tabbed pane that allows switching between multiple panels.
 */
export class JTabbedPane extends Container {
  private _tabs: Tab[];
  private _selectedIndex: number;
  private _tabPlacement: string;
  private _tabBarElement: HTMLElement | null;
  private _contentElement: HTMLElement | null;

  constructor(tabPlacement: string = AsWingConstants.TOP) {
    super();
    this._name = 'JTabbedPane';
    this._tabs = [];
    this._selectedIndex = -1;
    this._tabPlacement = tabPlacement;
    this._tabBarElement = null;
    this._contentElement = null;
  }

  static readonly TOP = AsWingConstants.TOP;
  static readonly BOTTOM = AsWingConstants.BOTTOM;
  static readonly LEFT = AsWingConstants.LEFT;
  static readonly RIGHT = AsWingConstants.RIGHT;

  override createRootElement(): HTMLElement {
    const element = document.createElement('div');
    element.className = 'aswing-tabbedpane';
    element.style.position = 'absolute';
    element.style.background = '#fff';
    element.style.border = '1px solid #ccc';
    element.style.borderRadius = '4px';
    element.style.overflow = 'hidden';

    // Tab bar
    this._tabBarElement = document.createElement('div');
    this._tabBarElement.className = 'aswing-tabbedpane-tabbar';
    this._tabBarElement.style.display = 'flex';
    this._tabBarElement.style.background = '#f5f5f5';
    this._tabBarElement.style.borderBottom = '1px solid #ccc';
    
    if (this._tabPlacement === AsWingConstants.TOP) {
      this._tabBarElement.style.flexDirection = 'row';
    } else if (this._tabPlacement === AsWingConstants.BOTTOM) {
      this._tabBarElement.style.flexDirection = 'row';
    } else if (this._tabPlacement === AsWingConstants.LEFT) {
      this._tabBarElement.style.flexDirection = 'column';
    } else if (this._tabPlacement === AsWingConstants.RIGHT) {
      this._tabBarElement.style.flexDirection = 'column';
    }

    // Content area
    this._contentElement = document.createElement('div');
    this._contentElement.className = 'aswing-tabbedpane-content';
    this._contentElement.style.position = 'relative';
    this._contentElement.style.background = '#fff';

    if (this._tabPlacement === AsWingConstants.TOP || this._tabPlacement === AsWingConstants.LEFT) {
      element.appendChild(this._tabBarElement);
      element.appendChild(this._contentElement);
    } else {
      element.appendChild(this._contentElement);
      element.appendChild(this._tabBarElement);
    }

    return element;
  }

  /**
   * Adds a tab with the specified title and component.
   */
  addTab(title: string, component: Container): this {
    const tab: Tab = {
      title,
      component,
      enabled: true
    };
    
    this._tabs.push(tab);
    this.updateTabBar();
    
    // Select first tab if none selected
    if (this._selectedIndex < 0) {
      this.setSelectedIndex(0);
    }
    
    return this;
  }

  /**
   * Removes a tab at the specified index.
   */
  removeTabAt(index: number): this {
    if (index < 0 || index >= this._tabs.length) return this;
    
    this._tabs.splice(index, 1);
    this.updateTabBar();
    
    // Adjust selected index
    if (this._selectedIndex >= this._tabs.length) {
      this.setSelectedIndex(this._tabs.length - 1);
    }
    
    return this;
  }

  /**
   * Gets the number of tabs.
   */
  getTabCount(): number {
    return this._tabs.length;
  }

  /**
   * Sets the selected tab by index.
   */
  setSelectedIndex(index: number): this {
    if (index < 0 || index >= this._tabs.length) return this;
    
    const oldIndex = this._selectedIndex;
    this._selectedIndex = index;
    
    this.updateTabSelection();
    this.updateContent();
    
    if (oldIndex !== index) {
      this.dispatchEvent(new AWEvent('stateChanged'));
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
   * Gets the selected component.
   */
  getSelectedComponent(): Container | null {
    if (this._selectedIndex < 0 || this._selectedIndex >= this._tabs.length) {
      return null;
    }
    return this._tabs[this._selectedIndex].component;
  }

  /**
   * Sets the title of a tab.
   */
  setTitleAt(index: number, title: string): this {
    if (index < 0 || index >= this._tabs.length) return this;
    
    this._tabs[index].title = title;
    this.updateTabBar();
    
    return this;
  }

  /**
   * Gets the title of a tab.
   */
  getTitleAt(index: number): string {
    if (index < 0 || index >= this._tabs.length) return '';
    return this._tabs[index].title;
  }

  /**
   * Sets whether a tab is enabled.
   */
  setEnabledAt(index: number, enabled: boolean): this {
    if (index < 0 || index >= this._tabs.length) return this;
    
    this._tabs[index].enabled = enabled;
    this.updateTabBar();
    
    // If disabled tab is selected, select another
    if (!enabled && this._selectedIndex === index) {
      for (let i = 0; i < this._tabs.length; i++) {
        if (this._tabs[i].enabled) {
          this.setSelectedIndex(i);
          break;
        }
      }
    }
    
    return this;
  }

  private updateTabBar(): void {
    if (!this._tabBarElement) return;
    
    this._tabBarElement.innerHTML = '';
    
    this._tabs.forEach((tab, index) => {
      const tabButton = new JButton(tab.title);
      const btnEl = tabButton.getElement()!;
      btnEl.style.position = 'relative';
      btnEl.style.flex = '0 0 auto';
      btnEl.style.padding = '8px 16px';
      btnEl.style.margin = '0';
      btnEl.style.border = 'none';
      btnEl.style.borderRadius = '0';
      btnEl.style.background = 'transparent';
      btnEl.style.color = tab.enabled ? '#666' : '#ccc';
      btnEl.style.cursor = tab.enabled ? 'pointer' : 'not-allowed';
      btnEl.style.borderBottom = '2px solid transparent';
      btnEl.style.transition = 'all 0.15s';
      
      if (!tab.enabled) {
        btnEl.style.pointerEvents = 'none';
      }
      
      tabButton.addEventListener(AWEvent.ACT, () => {
        if (tab.enabled) {
          this.setSelectedIndex(index);
        }
      });
      
      this._tabBarElement!.appendChild(btnEl);
    });
    
    this.updateTabSelection();
  }

  private updateTabSelection(): void {
    if (!this._tabBarElement) return;
    
    const tabButtons = this._tabBarElement.querySelectorAll('.aswing-button');
    tabButtons.forEach((btn, index) => {
      const buttonEl = btn as HTMLElement;
      if (index === this._selectedIndex) {
        buttonEl.style.background = '#fff';
        buttonEl.style.color = '#007bff';
        buttonEl.style.borderBottom = '2px solid #007bff';
        buttonEl.style.fontWeight = 'bold';
      } else {
        buttonEl.style.background = 'transparent';
        buttonEl.style.color = '#666';
        buttonEl.style.borderBottom = '2px solid transparent';
        buttonEl.style.fontWeight = 'normal';
      }
    });
  }

  private updateContent(): void {
    if (!this._contentElement) return;
    
    this._contentElement.innerHTML = '';
    
    if (this._selectedIndex >= 0 && this._selectedIndex < this._tabs.length) {
      const component = this._tabs[this._selectedIndex].component;
      const componentEl = component.getElement();
      if (componentEl) {
        componentEl.style.position = 'absolute';
        componentEl.style.left = '0px';
        componentEl.style.top = '0px';
        
        // Calculate content size based on tab placement
        let contentWidth: number;
        let contentHeight: number;
        
        if (this._tabPlacement === AsWingConstants.TOP || this._tabPlacement === AsWingConstants.BOTTOM) {
          contentWidth = this.getWidth() - 2; // Account for border
          contentHeight = this.getHeight() - 42; // tabBar height + borders
        } else {
          contentWidth = this.getWidth() - 102; // tabBar width + borders
          contentHeight = this.getHeight() - 2;
        }
        
        componentEl.style.width = `${contentWidth}px`;
        componentEl.style.height = `${contentHeight}px`;
        
        // Update component size to match
        component.setSizeWH(contentWidth, contentHeight);
        
        this._contentElement.appendChild(componentEl);
        
        // Trigger layout for the component
        component.revalidate();
      }
    }
  }

  override getPreferredSize(): IntDimension {
    return new IntDimension(400, 300);
  }

  override setSizeWH(width: number, height: number): this {
    super.setSizeWH(width, height);
    
    if (this._tabBarElement && this._contentElement) {
      const tabBarHeight = 40;
      
      if (this._tabPlacement === AsWingConstants.TOP || this._tabPlacement === AsWingConstants.BOTTOM) {
        this._tabBarElement.style.width = `${width - 2}px`; // Account for border
        this._tabBarElement.style.height = `${tabBarHeight}px`;
        this._contentElement.style.width = `${width - 2}px`;
        this._contentElement.style.height = `${height - tabBarHeight - 2}px`;
      } else {
        const tabBarWidth = 100;
        this._tabBarElement.style.width = `${tabBarWidth}px`;
        this._tabBarElement.style.height = `${height - 2}px`;
        this._contentElement.style.width = `${width - tabBarWidth - 2}px`;
        this._contentElement.style.height = `${height - 2}px`;
      }
      
      // Update content if tab is selected
      this.updateContent();
    }
    
    return this;
  }

  override toString(): string {
    return `JTabbedPane[tabs=${this._tabs.length},selected=${this._selectedIndex}]`;
  }
}
