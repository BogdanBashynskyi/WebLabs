/**
 * Challenge 2: filterShows
 * Фільтрація списку серіалів за назвою, жанром та мінімальним рейтингом.
 *
 * @param {Array} shows - Масив нормалізованих об'єктів Show
 * @param {Object} [options={}] - Опції фільтрації { query, genre, minRating }
 * @returns {Array} Новий відфільтрований масив
 */
export function filterShows(shows, options = {}) {
  const { query, genre, minRating } = options;

  // Обробка фільтра query: очищаємо від пробілів та переводимо в нижній регістр
  const cleanQuery = typeof query === 'string' ? query.trim().toLowerCase() : '';
  const isQueryActive = cleanQuery.length > 0;

  // Обробка фільтра genre: точний збіг (не порожній рядок)
  const isGenreActive = typeof genre === 'string' && genre.length > 0;

  // Обробка фільтра minRating: якщо передано 0, null або undefined — фільтр НЕ активний!
  // За ТЗ: при minRating: 0 серіали без оцінки залишаються.
  const isRatingActive = typeof minRating === 'number' && minRating > 0;

  return shows.filter((show) => {
    // 1. Перевірка назви (case-insensitive підрядок)
    if (isQueryActive) {
      const showName = typeof show.name === 'string' ? show.name.toLowerCase() : '';
      if (!showName.includes(cleanQuery)) {
        return false;
      }
    }

    // 2. Перевірка жанру (точний збіг у масиві genres)
    if (isGenreActive) {
      if (!Array.isArray(show.genres) || !show.genres.includes(genre)) {
        return false;
      }
    }

    // 3. Перевірка рейтингу (тільки якщо minRating > 0)
    if (isRatingActive) {
      // Серіали без оцінки (null) не проходять активний фільтр
      if (typeof show.rating !== 'number' || show.rating < minRating) {
        return false;
      }
    }

    return true;
  });
}
