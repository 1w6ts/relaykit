import { createRoot } from "react-dom/client";
import App from "./App";

declare global {
  interface Window {
    RelayKitToolbar: {
      init: (options?: Record<string, any>) => void;
    };
  }
}

function injectCss() {
  if (document.getElementById("relaykit-toolbar-style")) return;
  const link = document.createElement("link");
  link.id = "relaykit-toolbar-style";
  link.rel = "stylesheet";
  link.href = "http://localhost:3007/toolbar.css"; // <-- update with your actual CDN path
  document.head.appendChild(link);
}

// Expose a global init function for embedding
window.RelayKitToolbar = {
  init: (options = {}) => {
    injectCss();
    let root = document.getElementById("relaykit-toolbar-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "relaykit-toolbar-root";
      document.body.appendChild(root);
    }
    createRoot(root).render(<App {...options} />);
  },
};
