export type TBreadcrumb = {
  title: string;
};

export interface BreadcrumbsProps {
  /** Путь к странице для построения навигационной цепочки */
  path: string;
}
