import { FC } from 'react';

import { sanitizeHtmlTable } from '../helpers/sanitizeHtmlTable';

import styles from './html-table.module.css';

export interface HtmlRawTableViewerProps {
  htmlContent: string;
}

export const HtmlRawTableViewer: FC<HtmlRawTableViewerProps> = ({ htmlContent }) => (
  <div
    className={styles.htmlRawTableViewer}
    contentEditable={false}
    dangerouslySetInnerHTML={{ __html: sanitizeHtmlTable(htmlContent) }}
  />
);
