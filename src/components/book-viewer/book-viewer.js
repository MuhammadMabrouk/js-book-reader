import { startAjaxLoading, stopAjaxLoading } from "../ajax-loader/ajax-loader.js";
import { initActionsPopover } from "../actions-popover/actions-popover.js";
/*------------------------------------------------------------------------------------------*/
/* Book Viewer Component */
/*------------------------------------------------------------------------------------------*/

const booksDir = "assets/packages";
const bookId = "26dd5f00-0c75-4367-adea-537ece731385";
const bookRoot = `${booksDir}/${bookId}`;
const parser = new DOMParser();
const bookViewerEl = document.querySelector(".bookViewer");
let chapters;
export let currentChapter = 0;
export let chaptersCount;
export let currentPage = 0;
export let pagesCount;

// fetch nav data to get all chapters
async function getChaptersData() {
  const res = await fetch(`${bookRoot}/Navigation/nav.xhtml`);
  const data = await res.text();
  const xmlDoc = parser.parseFromString(data, "text/xml");

  // get the filenames of each chapter in the correct order
  const toc = xmlDoc.getElementById("toc");
  const chapters = [...toc.getElementsByTagName("a")].map(ref => {
    return { ref: ref.getAttribute("href"), title: ref.textContent };
  });

  // get number of all chapters
  getAllChaptersNum(chapters.length);

  return chapters;
}

// initialize app chapters
export async function initAppChapters() {
  chapters = await getChaptersData(`${booksDir}/${bookId}`);

  // get the chapter content
  const filename = extractURLFilename() || extractFilename(chapters[currentChapter].ref);
  const content = await getChapterContent(filename);

  // get the chapter index
  chapters.some((item, i) => {
    const filenameParam = filename.split("#")[0] || null;
    item.ref.lastIndexOf(filenameParam) != -1 && (currentChapter = i);
  });

  // update number of current chapter
  updateCurrentChapterNum(currentChapter);

  // render table of contents
  renderTOC(chapters);

  // display the chapter content
  displayChapter(content);
}

// get next chapter
export function getNextChapter() {
  if (currentChapter < chaptersCount - 1) {
    currentChapter++;

    // fetch chapter content
    const filename = extractFilename(chapters[currentChapter].ref);
    getChapterContent(filename).then(content => {

      // display the chapter content
      displayChapter(content);

      // update number of current chapter
      updateCurrentChapterNum(currentChapter);
    });
  }
}

// get prev chapter
export function getPrevChapter() {
  if (currentChapter > 0) {
    currentChapter--;

    // fetch chapter content
    const filename = extractFilename(chapters[currentChapter].ref);
    getChapterContent(filename).then(content => {

      // display the chapter content
      displayChapter(content);

      // update number of current chapter
      updateCurrentChapterNum(currentChapter);
    });
  }
}

// get number of all chapters
function getAllChaptersNum(count) {
  const navTotalEl = document.querySelector(".footer__nav__totChapters");
  navTotalEl.textContent = chaptersCount = count;
}

// update number of current chapter
function updateCurrentChapterNum(currentChapter) {
  const navCurrentEl = document.querySelector(".footer__nav__curChapter");
  navCurrentEl.textContent = currentChapter + 1;
}

// get next page
export function getNextPage() {
  updateCurrentPage("++");
}

// get prev page
export function getPrevPage() {
  updateCurrentPage("--");
}

// get first page
function getFirstPage() {
  updateCurrentPage("/");
}

// update current page
function updateCurrentPage(action) {
  const wrapper = bookViewerEl.children[0];
  const style = window.getComputedStyle(wrapper);
  const columnGap = +style.columnGap.replace("px", "");
  
  if (action === "++") {
    if (pagesCount - 1 == currentPage) { return; }

    currentPage++;
  }

  if (action === "--") {
    if (currentPage == 0) { return; }

    currentPage--;
  }

  if (action === "/") {
    currentPage = 0;
  }

  // update number of current page
  updateCurrentPageNum();

  wrapper.style.transform = `translateX(calc(${currentPage * 100}% + ${currentPage * columnGap}px))`;
}

// get number of all pages
export function getPagesCount() {
  const wrapper = bookViewerEl.children[0];
  const count = Math.round(wrapper.scrollWidth / wrapper.clientWidth);
  const totPagesNumEl = document.querySelector(".footer__nav__totPages");

  totPagesNumEl.textContent = pagesCount = count;
}

// update number of current page
function updateCurrentPageNum() {
  const curPageNumEl = document.querySelector(".footer__nav__curPage");
  curPageNumEl.textContent = currentPage + 1;

  // update progress percentage
  updateProgressPercentage();
}

// fetch chapter content
async function getChapterContent(filename) {
  const [paramValue, hashValue] = filename.split("#");
  const res = await fetch(`${bookRoot}/Content/${paramValue}`);
  const data = await res.text();
  const xmlDoc = parser.parseFromString(data, "text/xml");

  // set a query parameter value to the desired chapter
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set("filename", paramValue);

  // update window url
  const newUrl = `${window.location.pathname}?${urlParams.toString()}${hashValue ? `#${hashValue}` : ""}`;
  window.history.pushState(null, null, newUrl);

  return xmlDoc.body.innerHTML;
}

// display chapter content on the page
function displayChapter(content) {
  bookViewerEl.innerHTML = content;

  // highlight the active chapter in table of contents
  setActiveChapterInTOC();

  // initialize images in the content
  bookViewerEl.querySelectorAll("img").forEach(img => {
    const src = img.getAttribute("src");
    const path = src.substring(3);
    const finalPath = `${bookRoot}/${path}`;

    img.setAttribute("src", finalPath);
  });

  // initialize links in the content
  bookViewerEl.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // start loading spinner
      startAjaxLoading();

      // fetch chapter content
      const filename = extractFilename(link.getAttribute("href"));
      getChapterContent(filename).then(content => {

        // display the chapter content
        displayChapter(content);

        // stop loading spinner
        stopAjaxLoading();
      });
    });
  });

  // initialize actions popover in the content
  initActionsPopover(bookViewerEl);

  // get number of all pages
  getPagesCount();

  // get first page
  getFirstPage();

  // go to footer note
  if (window.location.hash) {
    goToFootNote(window.location.hash.substring(1));
  }
}

// go to footer note
function goToFootNote(id) {
  const targetElement = document.querySelector(`[id="${id}"]`);

  if (!targetElement) { return; }

  let interval;

  // highlight the target element
  targetElement.classList.add("active");

  // update number of current chapter
  currentChapter = chapters.length - 1;
  updateCurrentChapterNum(currentChapter);

  // start loading spinner
  startAjaxLoading();

  // create observer to check if target element is visible in the viewport
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {

        // clear interval
        clearInterval(interval);

        // stop observing the target element
        observer.unobserve(targetElement);

        // stop loading spinner
        stopAjaxLoading();

      } else {

        // go to next page every 100ms until the element is visible
        interval = setInterval(() => getNextPage(), 250);
      }
    });
  });

  // start observing the target element
  observer.observe(targetElement);
}

// render table of contents
function renderTOC(chapters) {
  const tocMenuEl = document.querySelector(".footer__toc__list");

  chapters.forEach((chapter, index) => {
    // create new li and button elements
    const li = document.createElement("li");
    const button = document.createElement("button");

    // set text content of button
    button.textContent = chapter.title;

    // add event listener to button
    button.addEventListener("click", () => {

      // fetch chapter content
      const filename = extractFilename(chapter.ref);
      getChapterContent(filename).then(content => {

        // update number of current chapter
        currentChapter = index;
        updateCurrentChapterNum(currentChapter);

        // display the chapter content
        displayChapter(content);
      });
    });

    // append button to li and li to menu
    li.appendChild(button);
    tocMenuEl.appendChild(li);
  });
}

// highlight the active chapter in table of contents
function setActiveChapterInTOC() {
  const tocMenuEl = document.querySelector(".footer__toc__list");
  const chaptersEls = tocMenuEl.querySelectorAll("li");

  chaptersEls.forEach((el, index) => {
    const btnClasses = el.querySelector("button").classList;
    currentChapter === index ? btnClasses.add("active") : btnClasses.remove("active");
  });
}

// extract filename from ref
function extractFilename(ref) {
  return ref.substring(ref.lastIndexOf("/") + 1);
}

// extract filename from url
function extractURLFilename() {
  const url = new URL(window.location.href);
  const paramValue = url.searchParams.get("filename");
  const hashValue = window.location.hash;

  if (paramValue && hashValue) {
    return `${paramValue}${hashValue}`;
  } else if (paramValue) {
    return paramValue;
  } else {
    return null;
  }
}

// update progress percentage
function updateProgressPercentage() {
  const footerEl = document.querySelector(".footer");
  const fullWidth = footerEl.clientWidth;
  const chapterPartWidth = fullWidth / chaptersCount;
  const chaptersProgress = chapterPartWidth * currentChapter;
  const pagePartWidth = chapterPartWidth / pagesCount;
  const pagesProgress = pagePartWidth * currentPage;
  const percentage = Math.min(
    ((chaptersProgress + pagesProgress) / fullWidth) * 100,
    100
  );

  footerEl.style.setProperty("--progress-percentage", `${percentage}%`);
}
