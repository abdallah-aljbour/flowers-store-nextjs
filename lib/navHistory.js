// Remembers whether the visitor has moved between pages inside the site, so a
// "back" button can use router.back() only when the previous entry is ours.
let lastPath = null;
let navigatedInside = false;

export function trackPath(path) {
  if (lastPath !== null && lastPath !== path) navigatedInside = true;
  lastPath = path;
}

// Back/forward (popstate): the page that shows next keeps the browser's restored scroll
let traversal = false;

export function markTraversal() {
  traversal = true;
}

// True once after a back/forward navigation
export function consumeTraversal() {
  const was = traversal;
  traversal = false;
  return was;
}

export function cameFromInsideSite() {
  if (typeof window === "undefined" || window.history.length < 2) return false;
  if (navigatedInside) return true;
  try {
    return Boolean(document.referrer) && new URL(document.referrer).origin === window.location.origin;
  } catch {
    return false;
  }
}
