# @tryrelaykit/sdk

Embeddable RelayKit toolbar for feedback and collaboration.

## Installation

```sh
npm install @tryrelaykit/sdk
```

## Usage (React/Next.js)

```tsx
import { RelayKit } from "@tryrelaykit/sdk";

export default function RootLayout() {
  return (
    <>
      {/* ...your layout... */}
      <RelayKit orgId="YOUR_ORG_ID" />
    </>
  );
}
```

- The toolbar will be injected automatically when the component is mounted.
- You do **not** need to import any CSS or other assets.

## Usage (Script Tag)

```html
<script src="https://cdn.relaykit.co/relaykit-toolbar.js"></script>
<script>
  RelayKitToolbar.init({ orgId: "YOUR_ORG_ID" });
</script>
```

- The toolbar will be injected into the page when `init` is called.

## Options

- `orgId`: Your organization ID (required)
- You can pass additional options as needed.
