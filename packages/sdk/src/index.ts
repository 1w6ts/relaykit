import * as React from "react";

export function init(options?: Record<string, any>) {
  let root = document.getElementById("relaykit-toolbar-root");
  if (!root) {
    root = document.createElement("div");
    root.id = "relaykit-toolbar-root";
    document.body.appendChild(root);
  }
  if (window.RelayKitToolbar) {
    window.RelayKitToolbar.init(options);
  } else {
    const s = document.createElement("script");
    s.id = "relaykit-toolbar-script";
    s.src = "https://your-cdn.com/relaykit-toolbar.js";
    s.onload = () => {
      window.RelayKitToolbar?.init(options);
    };
    document.body.appendChild(s);
  }
}

export function RelayKit(props: Record<string, any>) {
  React.useEffect(() => {
    if (window.RelayKitToolbar) {
      window.RelayKitToolbar.init(props);
    } else if (!document.getElementById("relaykit-toolbar-script")) {
      const s = document.createElement("script");
      s.id = "relaykit-toolbar-script";
      s.src = "https://your-cdn.com/relaykit-toolbar.js";
      s.onload = () => {
        window.RelayKitToolbar?.init(props);
      };
      document.body.appendChild(s);
    }
  }, []);
  return null;
}

declare global {
  interface Window {
    RelayKitToolbar?: {
      init: (options?: Record<string, any>) => void;
    };
  }
}
