import { addListener, qId, qsa } from "./dom";

let activeDialog: { dialogId: string; toggle: (shouldShow: boolean) => void } =
  null;

let keyListenerAdded = false;

// A very simplistic, but mostly sufficient, Dialog handler.
// It just hooks up listeners to DOM nodes rendered by the server.
export function makeDialog(dialogId: string) {
  const node = qId(dialogId);
  const closeButtons = qsa("[data-id=closeDialog]", node);

  function toggleDialog(shouldShow?: boolean) {
    let show = !!shouldShow;

    if (shouldShow === undefined) {
      show = node.classList.contains("hidden");
    }
    node && node.classList.toggle("hidden", !show);

    if (show) {
      if (activeDialog) {
        activeDialog.toggle(false);
      }
      activeDialog = { dialogId, toggle: toggleDialog };
    } else {
      if (activeDialog && activeDialog.dialogId === dialogId) {
        activeDialog = null;
      }
    }
  }

  // Listen for the Esc key and close any open dialog
  if (!keyListenerAdded) {
    keyListenerAdded = true;
    addListener(document.body, "keydown", (evt) => {
      if (activeDialog && evt["key"] == "Escape") {
        activeDialog.toggle(false);
      }
    });
    if (!node.classList.contains("hidden")) {
      activeDialog = { dialogId, toggle: toggleDialog };
    }
  }

  closeButtons.forEach((closeButton) => {
    addListener(
      closeButton,
      "click",
      (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        toggleDialog(false);
      },
      true
    );
  });

  // If the overlay is clicked then hide the dialog
  if (node) {
    addListener(node, "click", (evt) => {
      if (evt.target === node) {
        toggleDialog(false);
      }
    });
  }

  return {
    toggle: toggleDialog,
    node,
  };
}
