/**
 * Challenge 3: sortShows
 * Сортування серіалів за ключем (name, year, rating) без мутації вихідного масиву.
 * Значення null ЗАВЖДИ йдуть у кінець масиву незалежно від напрямку ('asc' чи 'desc').
 *
 * @param {Array} shows - Масив серіалів
 * @param {string} key - 'name' | 'year' | 'rating'
 * @param {string} [direction='asc'] - 'asc' | 'desc'
 * @returns {Array} Новий відсортований масив
 */
export function sortShows(shows, key, direction = 'asc') {
  // Створюємо поверхневу копію масиву перед сортуванням
  return [...shows].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];

    // Правило ТЗ: значення null ЗАВЖДИ в кінці масиву
    const isNullA = valA === null || valA === undefined;
    const isNullB = valB === null || valB === undefined;

    if (isNullA && isNullB) return 0;
    if (isNullA) return 1; // null зміщується праворуч
    if (isNullB) return -1; // число/рядок залишається ліворуч

    let comparison = 0;

    if (key === 'name') {
      // Порівняння рядків через localeCompare без упередження до регістру (case-insensitive)
      comparison = String(valA).localeCompare(String(valB), undefined, {
        sensitivity: 'base',
      });
    } else {
      // Числове порівняння для year та rating
      comparison = valA - valB;
    }

    // Враховуємо напрямок сортування
    return direction === 'desc' ? -comparison : comparison;
  });
}
