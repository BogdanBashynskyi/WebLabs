const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');

if (menuButton && mobileNav) {
  let previousScrollY = 0;

  const closeMenu = () => {
    if (menuButton.getAttribute('aria-expanded') !== 'true') {
      return;
    }

    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Відкрити меню');
    mobileNav.hidden = true;
    document.body.classList.remove('menu-open');
    window.scrollTo(0, previousScrollY);
    menuButton.focus();
  };

  const openMenu = () => {
    previousScrollY = window.scrollY;
    mobileNav.hidden = false;
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Закрити меню');
    document.body.classList.add('menu-open');
    mobileNav.querySelector('a')?.focus();
  };

  menuButton.addEventListener('click', () => {
    if (menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mobileNav.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      return;
    }

    if (event.key !== 'Tab' || menuButton.getAttribute('aria-expanded') !== 'true') {
      return;
    }

    const focusableElements = [...mobileNav.querySelectorAll('a[href]')];
    const firstElement = focusableElements[0];
    const lastElement = focusableElements.at(-1);

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement?.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement?.focus();
    }
  });
}
