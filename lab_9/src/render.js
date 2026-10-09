/** @typedef {import('./state.js').Show} Show */
import { notes, shows, watchlist } from './state.js';

/**
 * C1. Показує серіали в списку #results — по картці з шаблону #show-card на кожен, у тому
 * самому порядку, — і оновлює рядок статусу #status. Специфікація — ТЗ, C1.
 *
 * @param {readonly Show[]} list серіали, які треба показати
 */
export function renderShows(list) {
  const results = document.querySelector('#results');
  const status = document.querySelector('#status');
  const template = document.querySelector('#show-card');

  if (!(results instanceof HTMLUListElement)) {
    throw new TypeError('Не знайдено список #results');
  }
  if (!(status instanceof HTMLElement)) {
    throw new TypeError('Не знайдено рядок статусу #status');
  }
  if (!(template instanceof HTMLTemplateElement)) {
    throw new TypeError('Не знайдено шаблон #show-card');
  }

  const cards = list.map((show) => {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector('li');
    if (!(card instanceof HTMLLIElement)) {
      throw new TypeError('Шаблон #show-card має містити елемент <li>');
    }

    card.dataset.id = String(show.id);
    const fields = card.querySelectorAll('[data-field]');
    for (const field of fields) {
      const name = field.getAttribute('data-field');
      if (name === 'name') field.textContent = show.name;
      if (name === 'year') field.textContent = show.year ?? '—';
      if (name === 'genres') field.textContent = show.genres.length ? show.genres.join(', ') : '—';
      if (name === 'rating') field.textContent = show.rating ?? '—';
    }

    const toggleButton = card.querySelector('[data-action="toggle"]');
    if (!(toggleButton instanceof HTMLButtonElement)) {
      throw new TypeError('У шаблоні #show-card немає кнопки [data-action="toggle"]');
    }
    toggleButton.setAttribute('aria-pressed', String(watchlist.has(show.id)));

    const note = notes.get(show.id);
    const myRating = card.querySelector('[data-field="my-rating"]');
    const mine = card.querySelector('.card__mine');
    const noteText = card.querySelector('[data-field="note"]');
    if (myRating instanceof HTMLElement && mine instanceof HTMLElement) {
      mine.hidden = !note;
      myRating.textContent = note ? String(note.rating) : '';
    }
    if (noteText instanceof HTMLElement) {
      noteText.hidden = !note?.text;
      noteText.textContent = note?.text ?? '';
    }

    return fragment;
  });

  results.replaceChildren(...cards);
  status.textContent = list.length ? `Знайдено: ${list.length} з ${shows.length}` : 'Нічого не знайдено';
}
