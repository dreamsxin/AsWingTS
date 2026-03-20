/**
 * Common constants used throughout AsWingTS.
 */
export class AsWingConstants {
  // Orientation
  static readonly HORIZONTAL = 'horizontal';
  static readonly VERTICAL = 'vertical';

  // Alignment
  static readonly LEFT = 'left';
  static readonly CENTER = 'center';
  static readonly RIGHT = 'right';
  static readonly TOP = 'top';
  static readonly BOTTOM = 'bottom';

  // Leading/Trailing
  static readonly LEADING = 'leading';
  static readonly TRAILING = 'trailing';

  // North/South/East/West for BorderLayout
  static readonly NORTH = 'north';
  static readonly SOUTH = 'south';
  static readonly EAST = 'east';
  static readonly WEST = 'west';

  // Visibility
  static readonly VISIBLE = true;
  static readonly INVISIBLE = false;

  // Selection
  static readonly SELECTED = true;
  static readonly UNSELECTED = false;

  // Orientation for BoxLayout
  static readonly X_AXIS = 'xAxis';
  static readonly Y_AXIS = 'yAxis';
  static readonly LINE_X_AXIS = 'lineXAxis';
  static readonly PAGE_Y_AXIS = 'pageYAxis';

  // JFrame close operations
  static readonly DO_NOTHING_ON_CLOSE = 0;
  static readonly HIDE_ON_CLOSE = 1;
  static readonly DISPOSE_ON_CLOSE = 2;
}
