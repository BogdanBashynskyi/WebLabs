/**
 * Challenge 1: normalizeShow
 * Перетворює сирий запис TVmaze на плоский об'єкт Show з рівно 7 полями.
 *
 * @param {Object} raw - Вхідний сирий запис TVmaze
 * @returns {Object} Нормалізований об'єкт Show
 */
export function normalizeShow(raw) {
  // Рік витягуємо з перших 4 цифр рядка premiered (наприклад, "2013-02-01" -> 2013)
  let year = null;
  if (typeof raw.premiered === 'string' && raw.premiered.length >= 4) {
    const parsedYear = parseInt(raw.premiered.slice(0, 4), 10);
    year = Number.isNaN(parsedYear) ? null : parsedYear;
  }

  // Оцінка: 0 — це валідна оцінка, тому перевіряємо через typeof або strict not null
  let rating = null;
  if (raw.rating && typeof raw.rating.average === 'number') {
    rating = raw.rating.average;
  }

  // Runtime: беремо як є, якщо це число, інакше null
  const runtime = typeof raw.runtime === 'number' ? raw.runtime : null;

  // Network: беремо назву мережі, якщо об'єкт network існує
  const network = raw.network && typeof raw.network.name === 'string' ? raw.network.name : null;

  // Genres: створюємо НОВИЙ масив-копію, щоб уникнути мутації вихідних даних
  const genres = Array.isArray(raw.genres) ? [...raw.genres] : [];

  // Повертаємо об'єкт строго з 7 полями (url, language тощо відкидаються)
  return {
    id: raw.id,
    name: raw.name,
    year,
    rating,
    runtime,
    network,
    genres,
  };
}
