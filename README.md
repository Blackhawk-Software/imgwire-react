# @imgwire/react

`@imgwire/react` is a TypeScript-first React SDK for imgwire. It wraps `@imgwire/js` with provider-based client access, declarative image rendering, responsive image helpers, and upload hooks with progress tracking.

## Install

```bash
yarn add @imgwire/react @imgwire/js react react-dom
```

## Example

```tsx
import { ImgwireProvider, Image, useUpload } from "@imgwire/react";

function App() {
  return (
    <ImgwireProvider config={{ apiKey: "ck_123" }}>
      <Uploader />
      <Image id="img_123" width={400} alt="Example" />
    </ImgwireProvider>
  );
}

function Uploader() {
  const [upload, progress] = useUpload();

  return (
    <input
      type="file"
      onChange={(event) => {
        const file = event.target.files?.[0];
        if (file) {
          void upload(file);
        }
      }}
    />
  );
}
```
