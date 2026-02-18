// перенесена из /src/pages/documentation/hooks/useUrlToBreadcrumbs.tsx
export function urlToBreadcrumbs(rawUrl: string): Array<{ title: string }> {
  if (!rawUrl || rawUrl === '/') return [];

  // Убираем начальный и конечный слеши, разбиваем на сегменты
  const segments = rawUrl.replace(/^\/+|\/+$/g, '').split('/');

  // Фильтруем пустые сегменты и преобразуем в объекты breadcrumbs
  return segments.filter(segment => segment.trim() !== '').map(segment => ({ title: segment }));
}
