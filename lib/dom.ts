// =======================================================
// Some simple utility code, which helps everything else compress really well.
const doc = typeof document === "undefined" ? null : document;

// Shortcut for querySelector. Minifies well.
export function qs(query: string, node?: Element) {
  return (node || doc).querySelector(query);
}

// Shortcut for querying by ID.  I use data-id, feel free to use real id
// attributes if you want. Minifies well.
export function qId(nodeId: string, node?: Element) {
  return qs("[data-id=" + nodeId + "]", node);
}

export function qsa(query, node?: Element): Array<Element> {
  return Array.from((node || doc).querySelectorAll(query));
}

export function addListener(
  node: Element | Window | Document,
  evtName: string,
  fn: EventListenerOrEventListenerObject,
  capture?: boolean
) {
  node.addEventListener(evtName, fn, capture || false);
}
