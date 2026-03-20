/**
 * Theme definition interface.
 * Defines a set of CSS classes that can be applied to components.
 */
export interface ThemeDefinition {
  /**
   * Theme name.
   */
  name: string;
  
  /**
   * CSS classes for different component types.
   */
  classes: {
    /**
     * Base class for all themed components.
     */
    base?: string;
    
    /**
     * Class for button components.
     */
    button?: string;
    
    /**
     * Class for label components.
     */
    label?: string;
    
    /**
     * Class for panel components.
     */
    panel?: string;
    
    /**
     * Class for text field components.
     */
    textField?: string;
    
    /**
     * Class for checkbox components.
     */
    checkbox?: string;
    
    /**
     * Class for progress bar components.
     */
    progressBar?: string;
    
    /**
     * Class for frame components.
     */
    frame?: string;
    
    /**
     * Custom classes that can be referenced by name.
     */
    [key: string]: string | undefined;
  };
  
  /**
   * Color palette.
   */
  colors?: {
    primary?: string;
    secondary?: string;
    success?: string;
    warning?: string;
    danger?: string;
    info?: string;
    light?: string;
    dark?: string;
  };
  
  /**
   * Spacing values.
   */
  spacing?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
}

/**
 * Theme Manager - Manages component themes and styling.
 * 
 * @example
 * ```typescript
 * // Apply a theme to a component
 * Theme.apply(button, 'primary');
 * 
 * // Apply multiple themes
 * Theme.apply(label, ['bold', 'centered']);
 * 
 * // Register a custom theme
 * Theme.register('custom', {
 *   name: 'Custom Theme',
 *   classes: {
 *     button: 'my-custom-button'
 *   }
 * });
 * 
 * // Set default theme
 * Theme.setDefault('dark');
 * ```
 */
export class Theme {
  /**
   * Registered themes.
   */
  private static themes: Map<string, ThemeDefinition> = new Map();
  
  /**
   * Default theme name.
   */
  private static defaultThemeName: string | null = null;
  
  /**
   * Component to theme mapping.
   */
  private static componentThemes: WeakMap<any, string[]> = new WeakMap();
  
  /**
   * Predefined themes.
   */
  private static readonly PREDEFINED_THEMES: Record<string, ThemeDefinition> = {
    // Primary theme
    'primary': {
      name: 'Primary',
      classes: {
        base: 'theme-primary',
        button: 'btn-primary',
        label: 'label-primary',
        panel: 'panel-primary',
      },
      colors: {
        primary: '#007bff',
      }
    },
    
    // Secondary theme
    'secondary': {
      name: 'Secondary',
      classes: {
        base: 'theme-secondary',
        button: 'btn-secondary',
        label: 'label-secondary',
        panel: 'panel-secondary',
      },
      colors: {
        secondary: '#6c757d',
      }
    },
    
    // Success theme
    'success': {
      name: 'Success',
      classes: {
        base: 'theme-success',
        button: 'btn-success',
        label: 'label-success',
        panel: 'panel-success',
      },
      colors: {
        success: '#28a745',
      }
    },
    
    // Danger theme
    'danger': {
      name: 'Danger',
      classes: {
        base: 'theme-danger',
        button: 'btn-danger',
        label: 'label-danger',
        panel: 'panel-danger',
      },
      colors: {
        danger: '#dc3545',
      }
    },
    
    // Warning theme
    'warning': {
      name: 'Warning',
      classes: {
        base: 'theme-warning',
        button: 'btn-warning',
        label: 'label-warning',
        panel: 'panel-warning',
      },
      colors: {
        warning: '#ffc107',
      }
    },
    
    // Info theme
    'info': {
      name: 'Info',
      classes: {
        base: 'theme-info',
        button: 'btn-info',
        label: 'label-info',
        panel: 'panel-info',
      },
      colors: {
        info: '#17a2b8',
      }
    },
    
    // Light theme
    'light': {
      name: 'Light',
      classes: {
        base: 'theme-light',
        button: 'btn-light',
        label: 'label-light',
        panel: 'panel-light',
      },
      colors: {
        light: '#f8f9fa',
      }
    },
    
    // Dark theme
    'dark': {
      name: 'Dark',
      classes: {
        base: 'theme-dark',
        button: 'btn-dark',
        label: 'label-dark',
        panel: 'panel-dark',
      },
      colors: {
        dark: '#343a40',
      }
    },
    
    // Size variants
    'sm': {
      name: 'Small',
      classes: {
        button: 'btn-sm',
        textField: 'input-sm',
      }
    },
    
    'lg': {
      name: 'Large',
      classes: {
        button: 'btn-lg',
        textField: 'input-lg',
      }
    },
    
    // Style variants
    'outline': {
      name: 'Outline',
      classes: {
        button: 'btn-outline',
      }
    },
    
    'rounded': {
      name: 'Rounded',
      classes: {
        base: 'rounded',
        button: 'rounded-pill',
        panel: 'rounded-panel',
      }
    },
    
    'shadow': {
      name: 'Shadow',
      classes: {
        base: 'shadow',
        panel: 'panel-shadow',
      }
    },
  };
  
  /**
   * Initialize predefined themes.
   */
  static {
    // Register all predefined themes
    Object.entries(this.PREDEFINED_THEMES).forEach(([name, theme]) => {
      this.themes.set(name, theme);
    });
  }
  
  /**
   * Registers a new theme.
   * @param name Theme name
   * @param definition Theme definition
   */
  static register(name: string, definition: ThemeDefinition): void {
    this.themes.set(name, definition);
  }
  
  /**
   * Unregisters a theme.
   * @param name Theme name
   */
  static unregister(name: string): boolean {
    return this.themes.delete(name);
  }
  
  /**
   * Gets a theme definition by name.
   * @param name Theme name
   * @returns Theme definition or undefined
   */
  static get(name: string): ThemeDefinition | undefined {
    return this.themes.get(name);
  }
  
  /**
   * Checks if a theme exists.
   * @param name Theme name
   * @returns True if theme exists
   */
  static exists(name: string): boolean {
    return this.themes.has(name);
  }
  
  /**
   * Sets the default theme.
   * @param name Theme name
   */
  static setDefault(name: string): void {
    if (!this.themes.has(name)) {
      console.warn(`Theme "${name}" does not exist`);
      return;
    }
    this.defaultThemeName = name;
  }
  
  /**
   * Gets the default theme name.
   * @returns Default theme name or null
   */
  static getDefault(): string | null {
    return this.defaultThemeName;
  }
  
  /**
   * Applies a theme to a component.
   * @param component The component to apply the theme to
   * @param themeName Theme name or array of theme names
   * @param clearExisting Clear existing themes first
   * @returns The component for chaining
   */
  static apply(component: any & { addClass: (className: string) => any; removeClass: (className: string) => any }, 
               themeName: string | string[], 
               clearExisting: boolean = false): any {
    if (clearExisting) {
      this.clear(component);
    }
    
    const themes = Array.isArray(themeName) ? themeName : [themeName];
    const appliedThemes: string[] = [];
    
    for (const name of themes) {
      const theme = this.themes.get(name);
      if (!theme) {
        console.warn(`Theme "${name}" does not exist`);
        continue;
      }
      
      // Get component type class
      const componentType = this.getComponentType(component);
      const className = theme.classes[componentType] || theme.classes.base;
      
      if (className) {
        component.addClass(className);
        appliedThemes.push(name);
      }
    }
    
    // Store applied themes
    this.componentThemes.set(component, appliedThemes);
    
    return component;
  }
  
  /**
   * Removes all themes from a component.
   * @param component The component to clear themes from
   * @returns The component for chaining
   */
  static clear(component: any & { removeClass: (className: string) => any }): any {
    const appliedThemes = this.componentThemes.get(component);
    if (appliedThemes) {
      for (const name of appliedThemes) {
        const theme = this.themes.get(name);
        if (theme) {
          const componentType = this.getComponentType(component);
          const className = theme.classes[componentType] || theme.classes.base;
          if (className) {
            component.removeClass(className);
          }
        }
      }
      this.componentThemes.delete(component);
    }
    return component;
  }
  
  /**
   * Gets the themes applied to a component.
   * @param component The component
   * @returns Array of applied theme names
   */
  static getApplied(component: any): string[] {
    return this.componentThemes.get(component) || [];
  }
  
  /**
   * Gets the component type for theme class lookup.
   * @param component The component
   * @returns Component type string
   */
  private static getComponentType(component: any): string {
    const constructorName = component.constructor.name;
    
    // Map constructor names to theme class keys
    const typeMap: Record<string, string> = {
      'JButton': 'button',
      'JLabel': 'label',
      'JPanel': 'panel',
      'JTextField': 'textField',
      'JCheckBox': 'checkbox',
      'JProgressBar': 'progressBar',
      'JFrame': 'frame',
    };
    
    return typeMap[constructorName] || 'base';
  }
  
  /**
   * Gets all registered theme names.
   * @returns Array of theme names
   */
  static getRegisteredThemes(): string[] {
    return Array.from(this.themes.keys());
  }
  
  /**
   * Creates a color utility for accessing theme colors.
   * @param themeName Theme name
   * @returns Color accessor object
   */
  static colors(themeName: string): Record<string, string | undefined> {
    const theme = this.themes.get(themeName);
    return theme?.colors || {};
  }
  
  /**
   * Creates a spacing utility for accessing theme spacing values.
   * @param themeName Theme name
   * @returns Spacing accessor object
   */
  static spacing(themeName: string): Record<string, string | undefined> {
    const theme = this.themes.get(themeName);
    return theme?.spacing || {};
  }
}
