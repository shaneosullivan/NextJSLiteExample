import { addListener } from "./dom";

export default function initServiceWorker() {
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
}
