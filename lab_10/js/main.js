/* Courtly Booking — entry point */

import { fetchVenues } from './api.js';
import { renderResults } from './render.js';
import { openBooking } from './booking.js';
import { toISODate } from './format.js';

const form = document.getElementById('search-form');
const results = document.getElementById('results');
const status = document.getElementById('status');

// Venues currently on screen
let venues = [];

/* Mobile menu */

const menuBtn = document.querySelector('.menu-toggle');
const nav = document.getElementById('site-nav');

menuBtn.addEventListener('click', () => {
  const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('is-open', !isOpen);
});

/* Search */

form.date.value = toISODate(new Date());

function readFilters() {
  return {
    city: form.city.value,
    sport: form.sport.value,
  };
}

async function handleSearch(event) {
  event.preventDefault();
  status.textContent = 'Шукаємо…';
  results.setAttribute('aria-busy', 'true');

  const found = await fetchVenues(readFilters());
  renderResults(results, found);
  venues = found;
  bindBookButtons();
  results.setAttribute('aria-busy', 'false');

  const count = results.children.length;
  status.textContent = count ? `Знайдено: ${count}` : 'Нічого не знайдено';
}

form.addEventListener('submit', handleSearch);

/* Booking */

function bindBookButtons() {
  document.querySelectorAll('.venue-card__book').forEach((button) => {
    button.addEventListener('click', () => {
      const venue = venues.find((item) => item.id === button.dataset.id);
      openBooking(venue, form.date.value);
    });
  });
}

/* Initial state: popular venues */

const popularVenues = await fetchVenues({ popular: true });
venues = popularVenues;
renderResults(results, venues);
results.setAttribute('aria-busy', 'false');
status.textContent = `Популярні майданчики: ${results.children.length}`;
bindBookButtons();
