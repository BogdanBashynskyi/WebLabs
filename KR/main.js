const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');

if (menuButton && mobileNav) {
  let previousScrollY = 0;

  const setMenuOpen = (isOpen) => {
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Закрити меню' : 'Відкрити меню');
    mobileNav.hidden = !isOpen;
    document.body.classList.toggle('no-scroll', isOpen);
  };

  const closeMenu = () => {
    if (menuButton.getAttribute('aria-expanded') !== 'true') {
      return;
    }

    setMenuOpen(false);
    window.scrollTo(0, previousScrollY);
    menuButton.focus();
  };

  const openMenu = () => {
    previousScrollY = window.scrollY;
    setMenuOpen(true);
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
