import { render } from "react-dom";
import BrowserComponent from "../components/BrowserComponent";
import { addListener, qId } from "../lib/dom";
import initServiceWorker from "../lib/initServiceWorker";

(function () {
  // This is the function that initialises the application. It is invoked by a
  // script tag that the server renders, and optionally passes through any
  // information it needs, such as user information, public keys etc.
  function startPage() {
    addListener(qId("genReactUI"), "click", () => {
      const destinationNode = qId("reactDestination");

      // Here you can see us rendering a React component client side.
      render(<BrowserComponent />, destinationNode);
    });
  }

  initServiceWorker();

  window["startPage"] = startPage;
})();
