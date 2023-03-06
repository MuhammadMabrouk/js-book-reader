/*------------------------------------------------------------------------------------------*/
/* Actions Popover Component */
/*------------------------------------------------------------------------------------------*/

const popoverEl = document.querySelector(".actionsPopover");
const popoverHighlightBtn = popoverEl.querySelector(".highlight");
const popoverUnhighlightBtn = popoverEl.querySelector(".unhighlight");
const popoverCopyBtn = popoverEl.querySelector(".copy");

// initialize actions popover elements
export function initActionsPopover(container) {
  const hostEls = container.querySelectorAll("p");
  let activeHostEl;

  hostEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    const top = parseInt(rect.top);
    const centerX = parseInt(rect.left + rect.width / 2);

    // manage actions popover visibility on click
    el.addEventListener("click", () => {

      if (activeHostEl === el) { return; }

      // keep track of active element
      activeHostEl = el;

      // toggle highlight button
      if (el.classList.contains("highlighted")) {
        popoverUnhighlightBtn.removeAttribute("hidden");
        popoverHighlightBtn.setAttribute("hidden", "");
      } else {
        popoverHighlightBtn.removeAttribute("hidden");
        popoverUnhighlightBtn.setAttribute("hidden", "");
      }

      // update actions popover position
      popoverEl.style.setProperty("top", `${top}px`);
      popoverEl.style.setProperty("left", `${centerX}px`);

      // show actions popover
      popoverEl.classList.add("is-visible");
    });
  });

  // hide actions popover on click outside
  document.addEventListener("click", (e) => {
    if (e.target !== activeHostEl) {

      // hide actions popover
      popoverEl.classList.remove("is-visible");

      // reset the active element
      activeHostEl = null;
    }
  });

  // highlight text on click
  popoverHighlightBtn.addEventListener("click", () => highlightText(activeHostEl));

  // unhighlight text on click
  popoverUnhighlightBtn.addEventListener("click", () => unhighlightText(activeHostEl));

  // copy text on click
  popoverCopyBtn.addEventListener("click", () => copyText(activeHostEl));
}

// highlight text on click
function highlightText(el) {

  // highlight text paragraph
  el.classList.add("highlighted");

  // toggle highlight button
  popoverUnhighlightBtn.removeAttribute("hidden");
  popoverHighlightBtn.setAttribute("hidden", "");
}

// unhighlight text on click
function unhighlightText(el) {

  // highlight text paragraph
  el.classList.remove("highlighted");

  // toggle highlight button
  popoverHighlightBtn.removeAttribute("hidden");
  popoverUnhighlightBtn.setAttribute("hidden", "");
}

// copy text on click
function copyText(el) {
  navigator.clipboard.writeText(el.textContent);
}
