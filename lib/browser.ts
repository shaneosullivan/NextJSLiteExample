import { makeDialog } from "./dialog";
import { addListener, qId } from "./dom";
import { formatNow } from "./format";

(function () {
  // This is the function that initialises the application. It is invoked by a
  // script tag that the server renders, and optionally passes through any
  // information it needs, such as user information, public keys etc.
  function startApp(options) {
    console.log(
      "This runs in the browser: Date is ",
      formatNow(),
      " got options ",
      options
    );

    // Optional, if you only want this to run once
    delete window["startApp"];

    addListener(qId("genTime"), "click", () => {
      qId("genClientTime").textContent = formatNow();
    });

    const { toggle } = makeDialog("helpDialog");
    // Show and hide a dialog
    addListener(qId("toggleHelpDialog"), "click", () => {
      toggle();
    });

    // Listen for a click on a button, then get new UI from an API endpoint,
    // passing a couple of parameter. Insert the resulting
    // HTML into an existing placeholder node.
    addListener(qId("fetchApi"), "click", () => {
      fetch("/api/genUI?param1=foo&param2=bar")
        .then((res) => res.text())
        .then((text) => {
          // Yeah I know this is dodgy, this is just an example :-)
          qId("genUITarget").innerHTML = text;
        });
    });
  }

  // Optional, use a ServiceWorker.  See the code in
  // public/service_worker.js for what is executed. It's mostly from
  // https://developers.google.com/web/fundamentals/primers/service-workers
  if ("serviceWorker" in navigator) {
    addListener(window, "load", function () {
      navigator.serviceWorker.register("/service_worker.js").then(
        function (registration) {
          // Registration was successful
        },
        function (err) {
          // registration failed :(
          console.log("ServiceWorker registration failed: ", err);
        }
      );
    });
  }

  window["startApp"] = startApp;
})();
