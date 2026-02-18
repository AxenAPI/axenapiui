import { type JSX } from 'react';

import styles from './html-table.module.css';

export function InvalidTableFallback(): JSX.Element {
  return (
    <div className={styles.tableError} role="alert">
      <p>Unable to render table. The table data may be corrupted.</p>
    </div>
  );
}
