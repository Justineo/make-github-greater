const EXCLUDE = 'a, .header-search, .header-nav';
const ITEM_KEY = 'mgg-current';

function isInteractive(elem) {
  while (elem !== document.body) {
    if (elem.matches(EXCLUDE)) {
      return true;
    }
    elem = elem.parentNode;
  }
  return false;
}

function asap(selector, callback) {
  function tryInit() {
    if (document && document.querySelector(selector)) {
      document.removeEventListener('DOMNodeInserted', tryInit);
      document.removeEventListener('DOMContentLoaded', tryInit);
      console.log(performance.now());
      callback();
    }
  }

  if (document.readyState !== 'loading') {
    tryInit();
  } else {
    document.addEventListener('DOMNodeInserted', tryInit);
    document.addEventListener('DOMContentLoaded', tryInit);
  }
}

let style;
let white = kolor('#fff');
let black = kolor('#000');

function updateStyle(backgroundColor) {
  let textColor = backgroundColor.contrastRatio(white) > backgroundColor.contrastRatio(black)
      ? '#fff' : '#000';

  let color = kolor(textColor);
  style.textContent = `
.header {
  background-color: ${backgroundColor};
  border-bottom: 1px solid ${kolor(color.fadeOut(0.925))};
}

.header-logo-invertocat,
.header .header-search-wrapper {
  color: ${color};
}

.header .header-search-wrapper {
  background-color: ${kolor(color.fadeOut(0.875))};
}

.header .header-search-wrapper.focus {
  background-color: ${kolor(color.fadeOut(0.825))};
}

.header-nav-link {
  color: ${kolor(color.fadeOut(0.25))};
}

.header .header-search-input::-webkit-input-placeholder {
  color: ${kolor(color.fadeOut(0.25))};
}

.header .header-search-input::-moz-placeholder {
  color: ${kolor(color.fadeOut(0.25))};
}

.header-logo-invertocat:hover,
.header-nav-link:hover,
.header-nav-link:focus {
  color: ${color};
}

.header-nav-link:hover .dropdown-caret,
.header-nav-link:focus .dropdown-caret {
  border-top-color: ${color}
}

.header .header-search-scope {
  color: ${kolor(color.fadeOut(0.25))};
  border-right-color: ${backgroundColor};
}

.header .header-search-wrapper.focus .header-search-scope {
  color: ${color};
  background-color: ${kolor(color.fadeOut(0.925))};
  border-right-color: ${backgroundColor};
}

.notification-indicator .mail-status {
  border-color: ${backgroundColor};
}
`;
}

let current = localStorage.getItem(ITEM_KEY);
function load() {
  style = document.createElement('style');
  document.body.appendChild(style);

  if (current) {
    updateStyle(kolor(current));
  }
}

function init() {
  let header = document.querySelector('.header');
  if (!header) {
    return;
  }

  let picker = document.createElement('input');
  picker.type = 'color';
  document.body.appendChild(picker);
  picker.style.cssText = `position: absolute; top: -${picker.offsetHeight}px; left: -${picker.offsetWidth}px;`;
  picker.value = current;
  picker.addEventListener('input', () => {
    let {value} = picker;
    localStorage.setItem(ITEM_KEY, value);
    updateStyle(kolor(value));
  });

  header.addEventListener('dblclick', ({target}) => {
    if (isInteractive(target)) {
      return;
    }

    picker.click();
  });
}

asap('body', load);
asap('.header', init);
