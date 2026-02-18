import { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { notificationModel, TNotificationProps } from '@shared/notification/notification.model';

/**
 * Извлекает сообщение об ошибке из ответа API.
 * Бэкенд всегда возвращает ошибку в формате объекта с полем message.
 */
function extractErrorMessage(error: AxiosError): string {
  // Если есть response с данными и это объект с полем message
  const { data } = error.response || {};
  if (data && typeof data === 'object' && 'message' in data) {
    const { message } = data as { message: unknown };
    if (typeof message === 'string') {
      return message;
    }
  }

  // Если сообщение не найдено, используем дефолтное
  return 'Произошла ошибка при выполнении запроса';
}

/**
 * Response interceptor для автоматической обработки ошибок API.
 * Показывает нотификацию с текстом ошибки из ответа бэкенда.
 */
export function setupErrorInterceptor(error: AxiosError<unknown, InternalAxiosRequestConfig>) {
  // Показываем нотификацию только для ошибок с response (HTTP ошибки)
  // Network errors и другие ошибки без response обрабатываются отдельно
  if (error.response) {
    const errorMessage = extractErrorMessage(error);
    const errorKey = `api-error-${Date.now()}-${Math.random()}`;

    // Показываем нотификацию об ошибке
    notificationModel.events.showError({
      key: errorKey,
      title: 'Ошибка',
      message: 'Ошибка',
      description: errorMessage,
      placement: 'bottomRight',
    } as TNotificationProps);
  } else if (error.request) {
    // Ошибка сети (нет ответа от сервера)
    const errorKey = `network-error-${Date.now()}-${Math.random()}`;
    notificationModel.events.showError({
      key: errorKey,
      title: 'Ошибка сети',
      message: 'Ошибка',
      description: 'Проверьте подключение к интернету.',
      placement: 'bottomRight',
    } as TNotificationProps);
  }

  // Пробрасываем ошибку дальше, чтобы она могла быть обработана в эффектах
  return Promise.reject(error);
}
