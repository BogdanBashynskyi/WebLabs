import { openDetails } from './details.js';
import { toggle, watchlist } from './state.js';

/**
 * C2. Підключає кнопки карток у списку #results: «До списку» додає серіал до мого списку або
 * прибирає з нього, «Детальніше» відкриває діалог (openDetails з details.js). main.js викликає
 * цю функцію один раз, після першого показу списку. Специфікація — ТЗ, C2.
 *
 * @param {() => void} refresh перемальовує список для поточних фільтрів
 */
export function initList(refresh) {
  const results = document.querySelector('#results');
  const counter = document.querySelector('#watchlist-count');

  if (!(results instanceof HTMLUListElement)) {
    throw new TypeError('Не знайдено список #results');
  }
  if (!(counter instanceof HTMLElement)) {
    throw new TypeError('Не знайдено лічильник #watchlist-count');
  }

  results.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;

    const button = event.target.closest('button[data-action]');
    const card = button?.closest('li[data-id]');
    if (!button || !card || !results.contains(button)) return;

    const id = Number(card.dataset.id);
    if (!Number.isSafeInteger(id)) {
      throw new TypeError(`Некоректний id серіалу: ${card.dataset.id}`);
    }

    if (button.dataset.action === 'details') {
      openDetails(id, button);
      return;
    }
    if (button.dataset.action !== 'toggle') return;

    const cardsBeforeToggle = [...results.querySelectorAll('li[data-id]')];
    const previousIndex = cardsBeforeToggle.indexOf(card);
    toggle(id);
    counter.textContent = String(watchlist.size);
    refresh();

    const cardsAfterToggle = [...results.querySelectorAll('li[data-id]')];
    const updatedCard = cardsAfterToggle.find((item) => item.dataset.id === String(id));
    if (updatedCard) {
      updatedCard.querySelector('button[data-action="toggle"]')?.focus();
      return;
    }

    const nextId = cardsBeforeToggle[previousIndex + 1]?.dataset.id;
    const previousId = cardsBeforeToggle[previousIndex - 1]?.dataset.id;
    const nextCard = cardsAfterToggle.find((item) => item.dataset.id === nextId);
    const previousCard = cardsAfterToggle.find((item) => item.dataset.id === previousId);
    const focusTarget =
      nextCard?.querySelector('button[data-action="toggle"]') ??
      previousCard?.querySelector('button[data-action="toggle"]') ??
      document.querySelector('#results-heading');
    focusTarget?.focus();
  });
}
