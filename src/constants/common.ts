import { checkIsReadOnlyMode } from '@/helpers/utils';

/**
 * Экземпляр пустого массива. Существует для того, чтобы не
 * захламлять память лишними созданными пустыми массивами.
 */
export const EMPTY_ARRAY: [] = [];

/**
 * Пустой символ.
 */
export const SPACE_CHAR = ' ';

/**
 * Разделитель для текста с перечислениями
 */
export const TEXT_COMMA_SEPARATOR = ', ';

/**
 * Символ пустой строки.
 */
export const EMPTY_CHAR = '';

/**
 * Экземпляр пустого объекта. Существует для того, чтобы не
 * захламлять память лишними созданными пустыми массивами.
 */
export const EMPTY_OBJECT = {};

/**
 * Символ стрелочки вправо
 */
export const ARROW_RIGHT = '🠖';

/**
 * Символ стрелочки влево
 */
export const ARROW_LEFT = '🠔';

/**
 * Символ стрелочки двусторонней
 */
export const ARROW_BOTH = '🠔🠖';

/**
 * Задержка в миллисекундах для сохранения изменений в файле
 */
export const SAVE_DELAY_MS = 5000;

/**
 * Проверка, что приложение находится в состоянии readOnly
 */
export const IS_READ_ONLY = checkIsReadOnlyMode();

export const YANDEX_VIEW_URL = 'https://wiki.yandex.ru/';
export const SIDEBAR_WIDTH = 320;
