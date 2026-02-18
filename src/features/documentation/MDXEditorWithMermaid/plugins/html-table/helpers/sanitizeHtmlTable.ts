import DOMPurify, { type Config } from 'dompurify';

const SANITIZE_CONFIG: Config = {
  ALLOW_DATA_ATTR: false,
  ALLOWED_ATTR: ['align', 'colspan', 'href', 'rel', 'rowspan', 'style', 'target', 'title'],
  ALLOWED_TAGS: [
    'a',
    'b',
    'br',
    'caption',
    'code',
    'del',
    'em',
    'i',
    'ins',
    'mark',
    's',
    'strong',
    'sub',
    'sup',
    'table',
    'tbody',
    'td',
    'tfoot',
    'th',
    'thead',
    'tr',
    'u',
  ],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
  SANITIZE_DOM: true,
};

export function sanitizeHtmlTable(html: string): string {
  return DOMPurify.sanitize(html, SANITIZE_CONFIG) as string;
}
