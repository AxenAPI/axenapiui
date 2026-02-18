export const getLastCommitDate = (dateString: string) => {
  const inputDate = new Date(dateString);
  const now = new Date();

  function formatDate(date: Date) {
    const day = date.getUTCDate();
    const month = date.toLocaleString('default', { month: 'short', timeZone: 'UTC' }).toLowerCase();
    const year = date.getUTCFullYear();
    return `${day} ${month} ${year}`;
  }

  function getYesterday() {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getUTCDate() - 1);
    return yesterday;
  }

  function isSameDay(date1: Date, date2: Date) {
    return formatDate(date1) === formatDate(date2);
  }

  if (isSameDay(inputDate, now)) {
    const diffMs = now.getTime() - inputDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const hours = diffHours > 0 ? `${diffHours}h ` : '';
    const remainingMins = `${diffMins % 60}m `;
    const result = `${hours + remainingMins}ago`;

    return result;
  }

  const yesterday = getYesterday();
  if (isSameDay(inputDate, yesterday)) {
    return 'yesterday';
  }

  return formatDate(inputDate);
};
