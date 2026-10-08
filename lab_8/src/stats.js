/**
 * Challenge 4: genreStats
 * Розраховує кількість серіалів та середню оцінку для кожного жанру.
 *
 * @param {Array} shows - Масив серіалів
 * @returns {Object} Словник { [genre]: { count, averageRating } }
 */
export function genreStats(shows) {
  const stats = {};

  // Проходимося по кожному серіалу
  for (const show of shows) {
    if (!Array.isArray(show.genres)) continue;

    for (const genre of show.genres) {
      if (!stats[genre]) {
        stats[genre] = {
          count: 0,
          ratedCount: 0,
          totalRating: 0,
        };
      }

      stats[genre].count += 1;

      // Оцінка 0 — це валідна оцінка, null — відсутність
      if (typeof show.rating === 'number') {
        stats[genre].ratedCount += 1;
        stats[genre].totalRating += show.rating;
      }
    }
  }

  // Формуємо фінальний об'єкт за правилами ТЗ
  const result = {};

  for (const [genre, data] of Object.entries(stats)) {
    let averageRating = null;

    if (data.ratedCount > 0) {
      // Округлюємо до 1 знака після коми та перетворюємо назад у число
      const rawAvg = data.totalRating / data.ratedCount;
      averageRating = Math.round(rawAvg * 10) / 10;
    }

    result[genre] = {
      count: data.count,
      averageRating,
    };
  }

  return result;
}
