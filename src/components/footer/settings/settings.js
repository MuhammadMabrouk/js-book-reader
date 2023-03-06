/*------------------------------------------------------------------------------------------*/
/* Settings Component */
/*------------------------------------------------------------------------------------------*/

const bodyTag = document.body;
const appOpts = bodyTag.dataset;
const bookViewerEl = document.querySelector(".bookViewer");
const fontSizeResetBtn = document.querySelector(".footer__settings__fontSize__btn.reset__btn");
const fontFamilySelectedBtn = document.querySelector(".footer__settings__fontFamily__selected");
const colorModeBtns = document.querySelectorAll(".footer__settings__colorMode__btn");
const fontFamilyBtns = document.querySelectorAll(".footer__settings__fonts__btn");
const appStorage = "bookReaderSavedSettings";
const savedSettings = localStorage.getItem(appStorage);
const appSettings = savedSettings ? JSON.parse(savedSettings) : {};
let renderedFontsize = null;

// apply a setting for the app
function applyAppSetting(setting) {
  const varToStr = (varObj, isKebabCase = false) => {
    const propName = Object.keys(varObj)[0];
    return isKebabCase ? propName.split(/(?=[A-Z])/).join("-").toLowerCase() : propName;
  };
  const varToVal = (varObj) => Object.values(varObj)[0];

  // change the setting
  appSettings[varToStr(setting)] = varToVal(setting);
  bodyTag.setAttribute(`data-${varToStr(setting, true)}`, varToVal(setting));
}

// save the app settings in the localStorage
function saveAppSettings() {
  localStorage.setItem(appStorage, JSON.stringify(appSettings));
}

// get the app settings from the localStorage
export function getAppSettings() {
  getAppModeSettings();
  getAppFontFamilySettings();
  getAppFontsizeSettings();
}

// get app mode settings
function getAppModeSettings() {
  let mode;

  if (appSettings) {
    // check if there is a saved mode
    if (appSettings.mode) {
      mode = appSettings.mode;
      applyAppSetting({ mode });
      setAppMode();

      // so, try to use the browser's default mode or create your own default
    } else {

      // check to see if Media-Queries are supported
      if (window.matchMedia) {
        // check if the dark-mode Media-Query matches
        mode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      } else {
        // default (in case Media-Queries are not supported)
        mode = appOpts.mode;
      }

      applyAppSetting({ mode });
      saveAppSettings();
      setAppMode();
    }
  }
}

// get app font family settings
function getAppFontFamilySettings() {
  let fontFamily;

  if (appSettings) {
    fontFamily = appSettings.fontFamily ? appSettings.fontFamily : appOpts.fontFamily;

    applyAppSetting({ fontFamily });
    saveAppSettings();
    setAppFontFamily();
  }
}

// get app fontsize settings
function getAppFontsizeSettings() {
  let fontsize;

  if (appSettings) {
    fontsize = appSettings.fontsize ? appSettings.fontsize : appOpts.fontsize;

    applyAppSetting({ fontsize });
    saveAppSettings();
    setAppFontsize();
  }
}

// change the app mode
export function changeAppMode(e) {
  const mode = e.target.dataset.mode;

  applyAppSetting({ mode });
  saveAppSettings();
  setAppMode();
}

// set app mode
function setAppMode() {
  colorModeBtns.forEach(btn => {
    if (btn.dataset.mode === appOpts.mode) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

// change the app font family
export function changeAppFontFamily(e) {
  const fontFamily = e.target.dataset.fontFamily;

  applyAppSetting({ fontFamily });
  saveAppSettings();
  setAppFontFamily();
}

// set app font family
function setAppFontFamily() {
  let fontFamily;

  fontFamilyBtns.forEach(btn => {
    if (btn.dataset.fontFamily === appOpts.fontFamily) {
      btn.classList.add("active");

      // update the value/name of the font family
      fontFamily = btn.dataset.fontFamily;
      fontFamilySelectedBtn.textContent = btn.textContent;
    } else {
      btn.classList.remove("active");
    }
  });

  bookViewerEl.style.setProperty("font-family", `"${fontFamily}", sans-serif`);
}

// change the app font size
export function changeAppFontsize(e) {
  const action = e.target.dataset.action;
  let fontsize = +appOpts.fontsize;

  switch (action) {
    case "increase":
      fontsize = fontsize < 1.5 ? fontsize + 0.125 : 1.5;
      break;
  
    case "reset":
      fontsize = 1;
      break;
  
    case "decrease":
      fontsize = fontsize > 0.75 ? fontsize - 0.125 : 0.75;
      break;
  }

  applyAppSetting({ fontsize });
  saveAppSettings();
  setAppFontsize();
}

// set app font size
function setAppFontsize() {
  renderedFontsize = `${Math.round((+appOpts.fontsize / 1) * 100)}%`;

  fontSizeResetBtn.textContent = renderedFontsize;
  bookViewerEl.style.setProperty("font-size", `${appOpts.fontsize}rem`);
}
