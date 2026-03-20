/**
 * AsWingTS Debug Configuration
 * 
 * Global debug settings for controlling console output.
 */
export class Debug {
  /**
   * Enable or disable all debug logging.
   * Set to false in production to suppress console output.
   */
  static enabled: boolean = false;

  /**
   * Enable or disable BorderLayout debug logging.
   */
  static layout: boolean = false;

  /**
   * Enable or disable Container debug logging.
   */
  static container: boolean = false;

  /**
   * Enable or disable Component debug logging.
   */
  static component: boolean = false;

  /**
   * Enable or disable event debug logging.
   */
  static events: boolean = false;

  /**
   * Log a message if the corresponding debug category is enabled.
   * @param category The debug category
   * @param args The message arguments
   */
  static log(category: 'all' | keyof typeof Debug, ...args: any[]): void {
    if (!this.enabled) return;
    
    if (category === 'all' || (typeof category === 'string' && this[category as keyof typeof Debug] === true)) {
      console.log(`[${category.toUpperCase()}]`, ...args);
    }
  }

  /**
   * Log a warning if debug is enabled.
   * @param category The debug category
   * @param args The message arguments
   */
  static warn(category: 'all' | keyof typeof Debug, ...args: any[]): void {
    if (!this.enabled) return;
    
    if (category === 'all' || (typeof category === 'string' && this[category as keyof typeof Debug] === true)) {
      console.warn(`[${category.toUpperCase()}]`, ...args);
    }
  }

  /**
   * Log an error if debug is enabled.
   * @param category The debug category
   * @param args The message arguments
   */
  static error(category: 'all' | keyof typeof Debug, ...args: any[]): void {
    if (category === 'all' || (typeof category === 'string' && this[category as keyof typeof Debug] === true)) {
      console.error(`[${category.toUpperCase()}]`, ...args);
    }
  }

  /**
   * Enable all debug categories.
   */
  static enableAll(): void {
    this.enabled = true;
    this.layout = true;
    this.container = true;
    this.component = true;
    this.events = true;
  }

  /**
   * Disable all debug categories.
   */
  static disableAll(): void {
    this.enabled = false;
    this.layout = false;
    this.container = false;
    this.component = false;
    this.events = false;
  }

  /**
   * Get current debug configuration as a string.
   */
  static toString(): string {
    return `Debug[enabled=${this.enabled}, layout=${this.layout}, container=${this.container}, component=${this.component}, events=${this.events}]`;
  }
}
