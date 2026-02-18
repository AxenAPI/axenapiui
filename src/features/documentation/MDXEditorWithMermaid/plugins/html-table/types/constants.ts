import type { CSSProperties } from 'react';

import styles from '../ui/html-table.module.css';

import type { CellCoordinates, HtmlAlignType } from './types';

/** Default alignment for table columns and cells */
export const DEFAULT_CELL_ALIGNMENT: HtmlAlignType = 'left';

/** Maps table cell alignment types to CSS module classes */
export const ALIGN_TO_CLASS_MAP: Record<HtmlAlignType, string> = {
  center: styles.centeredCell,
  justify: styles.justifiedCell,
  left: styles.leftAlignedCell,
  right: styles.rightAlignedCell,
} as const;

/** Maps table cell alignment types to inline CSS styles */
export const ALIGN_TO_STYLE_MAP: Record<HtmlAlignType, CSSProperties> = {
  center: { textAlign: 'center' },
  justify: { textAlign: 'justify' },
  left: { textAlign: 'left' },
  right: { textAlign: 'right' },
} as const;

/** Coordinates when no cell is selected (-1, -1) */
export const INACTIVE_CELL_COORDINATES: CellCoordinates = [-1, -1] as const;

/** Index of the header row in the table (always 0) */
export const HEADER_ROW_INDEX = 0;

/** HTML cell types */
export const CELL_TYPE_HEADER = 'th' as const;
export const CELL_TYPE_DATA = 'td' as const;

/** Priority for MDAST visitors (higher = processed first) */
export const MDAST_VISITOR_PRIORITY = 100;

/** Priority for Lexical DOM conversion */
export const LEXICAL_CONVERSION_PRIORITY = 4;

/** Popover side offset in pixels */
export const POPOVER_SIDE_OFFSET = 5;

/** Lexical node version for serialization */
export const TABLE_NODE_VERSION = 2;

/** Throttle delay for mouse events in ms (~60fps) */
export const THROTTLE_DELAY = 16;
