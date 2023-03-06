import {
  getAppSettings,
  changeAppMode,
  changeAppFontFamily,
  changeAppFontsize,
} from "../components/footer/settings/settings.js";
import {
  initAppChapters,
  getNextChapter,
  getPrevChapter,
  getNextPage,
  getPrevPage,
} from "../components/book-viewer/book-viewer.js";
import {
  toggleFooterVisibility,
  toggleSettingsMenu,
  toggleSettingsFontsMenu,
  toggleTOCMenu,
} from "../components/footer/footer.js";

document.addEventListener("DOMContentLoaded", () => {
  // get the app settings from the localStorage
  getAppSettings();

  // initialize app chapters
  initAppChapters();

  // toggle footer visibility
  toggleFooterVisibility();

  // change the app mode
  window._changeAppMode = changeAppMode;

  // change the app font family
  window._changeAppFontFamily = changeAppFontFamily;

  // change the app font size
  window._changeAppFontsize = changeAppFontsize;

  // toggle settings menu
  window._toggleSettingsMenu = toggleSettingsMenu;

  // toggle settings fonts menu
  window._toggleSettingsFontsMenu = toggleSettingsFontsMenu;

  // toggle table of content menu
  window._toggleTOCMenu = toggleTOCMenu;

  // get next chapter/page
  window._getNextChapter = getNextChapter;
  window._getNextPage = getNextPage;

  // get prev chapter/page
  window._getPrevChapter = getPrevChapter;
  window._getPrevPage = getPrevPage;
});
