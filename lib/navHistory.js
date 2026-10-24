// Remembers whether the visitor has moved between pages inside the site, so a
// "back" button can use router.back() only when the previous entry is ours.
let lastPath = null;
let navigatedInside = false;

export function trackPath(path) {
  if (lastPath !== null && lastPath !== path) navigatedInside = true;
  lastPath = path;
}

// Back/forward: set on popstate, cleared by the next click/submit (a new navigation).
// Pages read it while mounting (render / layout effects), so a back/forward keeps the
// browser's restored scroll and skips entrance animations.
let traversal = false;

export function markTraversal() {
  traversal = true;
}

export function clearTraversal() {
  traversal = false;
}

export function isTraversal() {
  return traversal;
}

// False during the first (hydration) render of the visit, true afterwards: client-side
// renders may differ from the server HTML (e.g. /shop restoring its view from the URL)
let hydrated = false;

export function markHydrated() {
  hydrated = true;
}

export function hasHydrated() {
  return hydrated;
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
