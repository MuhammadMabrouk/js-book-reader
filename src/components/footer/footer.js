/*------------------------------------------------------------------------------------------*/
/* Footer Component */
/*------------------------------------------------------------------------------------------*/

const footerEl = document.querySelector(".footer");
const settingsEl = footerEl.querySelector(".footer__settings");
const settingsMenuEl = footerEl.querySelector(".footer__settings__menu");
const tocEl = footerEl.querySelector(".footer__toc");

// toggle footer visibility on click
export function toggleFooterVisibility() {
  document.addEventListener("click", (e) => {
    const clickedEl = e.target;

    if (clickedEl !== footerEl && !footerEl.contains(clickedEl)) {
      footerEl.classList.toggle("visible");
      settingsEl.classList.remove("isOpen");
      tocEl.classList.remove("isOpen");
    }
  });
}

// toggle settings menu
export function toggleSettingsMenu() {
  settingsEl.classList.toggle("isOpen");
}

// toggle settings fonts menu
export function toggleSettingsFontsMenu() {
  settingsMenuEl.classList.toggle("isFontsOpen");
}

// toggle table of content menu
export function toggleTOCMenu() {
  tocEl.classList.toggle("isOpen");
}
