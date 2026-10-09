import { getShow, notes, saveNote } from './state.js';

/** @type {HTMLElement | null} */
let opener = null;
/** @type {number | null} */
let activeShowId = null;

function clearRatingError(rating, error) {
  rating.removeAttribute('aria-invalid');
  const describedBy = rating
    .getAttribute('aria-describedby')
    ?.split(/\s+/)
    .filter((id) => id && id !== error.id);
  if (describedBy?.length) rating.setAttribute('aria-describedby', describedBy.join(' '));
  else rating.removeAttribute('aria-describedby');
  error.textContent = '';
}

function isValidRating(rating) {
  return Number.isInteger(rating.valueAsNumber) && rating.valueAsNumber >= 1 && rating.valueAsNumber <= 10;
}

function showRatingError(rating, error) {
  rating.setAttribute('aria-invalid', 'true');
  rating.setAttribute('aria-describedby', error.id);
  error.textContent = 'Введіть ціле число від 1 до 10.';
}

/**
 * C4. Відкриває діалог #details для серіалу: назва, опис, посилання на сторінку TVmaze і форма
 * з моєю оцінкою й нотаткою. Специфікація — ТЗ, C4.
 *
 * @param {number} id
 * @param {HTMLElement} [trigger]
 */
export function openDetails(id, trigger) {
  const show = getShow(id);
  const dialog = document.querySelector('#details');
  const title = document.querySelector('#details-title');
  const summary = document.querySelector('#details-summary');
  const link = document.querySelector('#details-link');
  const form = document.querySelector('#note-form');
  const rating = document.querySelector('#note-rating');
  const text = document.querySelector('#note-text');
  const error = document.querySelector('#note-rating-error');

  if (!(dialog instanceof HTMLDialogElement)) {
    throw new TypeError('Не знайдено діалог #details');
  }
  if (!(title instanceof HTMLElement)) {
    throw new TypeError('Не знайдено заголовок #details-title');
  }
  if (!(summary instanceof HTMLElement)) {
    throw new TypeError('Не знайдено опис #details-summary');
  }
  if (!(link instanceof HTMLAnchorElement)) {
    throw new TypeError('Не знайдено посилання #details-link');
  }
  if (!(form instanceof HTMLFormElement)) {
    throw new TypeError('Не знайдено форму #note-form');
  }
  if (!(rating instanceof HTMLInputElement) || !(text instanceof HTMLTextAreaElement)) {
    throw new TypeError('Не знайдено поля оцінки або нотатки');
  }
  if (!(error instanceof HTMLElement)) {
    throw new TypeError('Не знайдено повідомлення про помилку #note-rating-error');
  }

  title.textContent = show.name;
  const parsedSummary = new DOMParser().parseFromString(show.summary, 'text/html');
  summary.textContent = [...parsedSummary.body.children]
    .map((paragraph) => paragraph.textContent.trim())
    .filter(Boolean)
    .join('\n');
  if (!summary.textContent) summary.textContent = parsedSummary.body.textContent.trim();
  link.href = show.url;

  activeShowId = id;
  form.noValidate = true;
  const note = notes.get(id);
  rating.value = note ? String(note.rating) : '';
  text.value = note?.text ?? '';
  clearRatingError(rating, error);

  if (!dialog.open) {
    opener = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    dialog.showModal();
  }
}

/**
 * C4. Підключає діалог #details: закриття й форму «Моя оцінка й нотатка». main.js викликає цю
 * функцію один раз. Специфікація — ТЗ, C4.
 *
 * @param {() => void} refresh перемальовує список для поточних фільтрів
 */
export function initDetails(refresh) {
  const dialog = document.querySelector('#details');
  const cancel = dialog?.querySelector('.note-form__actions button[type="button"]');
  const form = document.querySelector('#note-form');
  const rating = document.querySelector('#note-rating');
  const text = document.querySelector('#note-text');
  const error = document.querySelector('#note-rating-error');

  if (!(dialog instanceof HTMLDialogElement)) {
    throw new TypeError('Не знайдено діалог #details');
  }
  if (!(cancel instanceof HTMLButtonElement)) {
    throw new TypeError('Не знайдено кнопку скасування в діалозі #details');
  }
  if (!(form instanceof HTMLFormElement)) {
    throw new TypeError('Не знайдено форму #note-form');
  }
  if (!(rating instanceof HTMLInputElement)) {
    throw new TypeError('Не знайдено поле #note-rating');
  }
  if (!(text instanceof HTMLTextAreaElement)) {
    throw new TypeError('Не знайдено поле #note-text');
  }
  if (!(error instanceof HTMLElement)) {
    throw new TypeError('Не знайдено повідомлення про помилку #note-rating-error');
  }

  cancel.addEventListener('click', () => dialog.close());
  rating.addEventListener('input', () => {
    if (rating.getAttribute('aria-invalid') !== 'true') return;
    if (isValidRating(rating)) clearRatingError(rating, error);
    else showRatingError(rating, error);
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!isValidRating(rating)) {
      showRatingError(rating, error);
      rating.focus();
      return;
    }
    if (activeShowId === null) {
      throw new TypeError('Не вибрано серіал для збереження нотатки');
    }

    const id = activeShowId;
    const show = getShow(id);
    saveNote(id, { rating: rating.valueAsNumber, text: text.value });
    clearRatingError(rating, error);
    refresh();

    const status = document.querySelector('#status');
    if (!(status instanceof HTMLElement)) {
      throw new TypeError('Не знайдено рядок статусу #status');
    }
    status.textContent = `Нотатку до ${show.name} збережено`;

    const refreshedOpener = document.querySelector(
      `#results li[data-id="${id}"] button[data-action="details"]`,
    );
    if (refreshedOpener instanceof HTMLElement) opener = refreshedOpener;
    dialog.close();
    opener?.focus();
  });
  dialog.addEventListener('close', () => {
    if (opener?.isConnected) opener.focus();
    opener = null;
    activeShowId = null;
  });
}
