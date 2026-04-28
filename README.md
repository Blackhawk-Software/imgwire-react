![imgwire.dev Logo](https://cdn.imgwire.dev/6b024480-a5ac-426d-b539-2e4fccc4c6ac/26f80c13-48bd-4bb9-866e-5e9392b11a6a/4ba5fe50-433b-40db-a847-938d2081c21a?w=280&quality=80)

# `@imgwire/react`

[![npm version](https://img.shields.io/npm/v/%40imgwire%2Freact)](https://www.npmjs.com/package/@imgwire/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/Blackhawk-Software/imgwire-react/actions/workflows/ci.yml/badge.svg)](https://github.com/Blackhawk-Software/imgwire-react/actions/workflows/ci.yml)
[![Release](https://github.com/Blackhawk-Software/imgwire-react/actions/workflows/release.yml/badge.svg)](https://github.com/Blackhawk-Software/imgwire-react/actions/workflows/release.yml)

`@imgwire/react` is the React SDK for imgwire. It gives you a thin, typed React layer on top of `@imgwire/js` so you can:

- share a single imgwire client through context
- render transformed CDN images declaratively
- generate responsive image markup
- upload files with React state for progress updates

> [!TIP]
> Obtain an API key by signing up at [imgwire.dev](https://imgwire.dev). Read the full API & SDK documentation [here](https://docs.imgwire.dev/guides/frontend-quickstart).

Underlying JavaScript SDK:

- [`@imgwire/js` repository](https://github.com/Blackhawk-Software/imgwire-js)


## Installation

```bash
yarn add @imgwire/react @imgwire/js react react-dom
```

Peer dependencies:

- `react >= 18`
- `react-dom >= 18`

## Quick Start

Wrap your app in `ImgwireProvider`, then use hooks and components anywhere below it.

```tsx
import { ImgwireProvider, Image, useUpload } from "@imgwire/react";

export function App() {
  return (
    <ImgwireProvider config={{ apiKey: "ck_123" }}>
      <Uploader />
      <Image id="img_123" width={400} alt="Example image" />
    </ImgwireProvider>
  );
}

function Uploader() {
  const [upload, progress] = useUpload();

  return (
    <div>
      <input
        type="file"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            void upload(file);
          }
        }}
      />

      <p>{progress.percent ?? 0}%</p>
    </div>
  );
}
```

## Client Setup

### `ImgwireProvider`

`ImgwireProvider` creates an `ImgwireClient` and makes it available through React context.

```tsx
import { ImgwireProvider } from "@imgwire/react";

<ImgwireProvider
  config={{
    apiKey: "ck_123",
    baseUrl: "https://api.imgwire.dev"
  }}
>
  <App />
</ImgwireProvider>;
```

The `config` prop uses the same client options as `@imgwire/js`, including:

- `apiKey`
- `baseUrl`
- `timeoutMs`
- `fetch`
- `getUploadToken`
- `xhrFactory`

This is the recommended setup for most apps.

### `useClient`

If you are inside a provider, `useClient()` returns the shared client.

```tsx
import { useClient } from "@imgwire/react";

function Example() {
  const client = useClient();
  return <div>{client.options.apiKey}</div>;
}
```

If you are not inside a provider, you can create an isolated client by passing config directly:

```tsx
const client = useClient({
  apiKey: "ck_123",
  baseUrl: "http://localhost:8000"
});
```

If neither a provider nor config is available, the hook throws.

## Rendering Images

### `Image`

Use `Image` when you want a normal `<img />` with imgwire transformation support.

You can render from a known CDN URL:

```tsx
<Image
  url="https://cdn.imgwire.dev/example"
  width={800}
  format="webp"
  quality={80}
  alt="Hero image"
/>
```

Or render from an imgwire image id:

```tsx
<Image id="img_123" width={400} height={300} alt="Thumbnail" />
```

When `id` is used, the component resolves the base CDN URL first and then applies transformations.

Resolution behavior:

1. If `url` is present, the component renders immediately.
2. If `id` is present, the component resolves the image URL through a loader.
3. If neither is present, the component throws.

### Transformations

`Image` forwards imgwire URL transformation props to `@imgwire/js`.

Examples:

```tsx
<Image id="img_123" preset="thumbnail" alt="Thumbnail" />
<Image id="img_123" width={600} height={400} crop="600:400:ce" alt="Crop" />
<Image id="img_123" format="avif" quality={75} alt="Optimized" />
```

Both canonical names and supported aliases are available, matching `@imgwire/js`.

### Custom Loaders

By default, `Image` resolves ids through `client.images.fetch(id)` and uses the returned `cdn_url`.

If you want to control that resolution yourself, pass a custom loader:

```tsx
<Image
  id="img_123"
  loader={async (id) => {
    const response = await fetch(`/api/images/${id}`);
    const data = await response.json();
    return { url: data.url };
  }}
  alt="Custom loader example"
/>
```

The loader is only responsible for returning the base URL. Transformations are still applied by the SDK.

### Caching

When rendering by `id`, the resolved base URL is cached in memory.

- cache key: image id
- default TTL: 5 minutes
- concurrent requests for the same id are deduplicated

That means repeated renders of the same image id avoid unnecessary fetches.

## Responsive Images

### `ResponsiveImage`

`ResponsiveImage` builds `src`, `srcSet`, and `sizes` for responsive delivery.

```tsx
import { ResponsiveImage } from "@imgwire/react";

<ResponsiveImage
  id="img_123"
  alt="Responsive image"
  breakpoints={{
    sm: { minWidth: 0, width: 320 },
    md: { minWidth: 640, width: 640 },
    lg: { minWidth: 1024, width: 1024 }
  }}
/>;
```

Default breakpoints are included:

```ts
{
  sm: { minWidth: 0, width: 320 },
  md: { minWidth: 640, width: 640 },
  lg: { minWidth: 1024, width: 1024 },
  xl: { minWidth: 1440, width: 1440 }
}
```

### DPR Variants

Each breakpoint can generate multiple DPR variants.

```tsx
<ResponsiveImage id="img_123" alt="Retina example" dpr={[1, 2, 3]} />
```

Priority order for DPR values:

1. `breakpoint.dpr`
2. `props.dpr`
3. default `[1, 2]`

### Art Direction

Breakpoints can override transformations such as crop, gravity, quality, and format.

```tsx
<ResponsiveImage
  id="img_123"
  alt="Art directed image"
  breakpoints={{
    mobile: {
      minWidth: 0,
      width: 320,
      crop: "320:320:ce:0:0"
    },
    desktop: {
      minWidth: 1024,
      width: 1024,
      crop: "1024:576:ce:0:0"
    }
  }}
/>
```

## Uploading Files

### `useUpload`

`useUpload()` returns an upload function and upload progress state.

```tsx
import { useUpload } from "@imgwire/react";

function UploadButton() {
  const [upload, progress] = useUpload();

  return (
    <button
      type="button"
      onClick={async () => {
        const file = new File(["hello"], "example.txt", {
          type: "text/plain"
        });

        await upload(file);
      }}
    >
      Upload ({progress.percent ?? 0}%)
    </button>
  );
}
```

Progress shape:

```ts
type UploadProgress = {
  loaded: number;
  total: number | null;
  percent: number | null;
  lengthComputable: boolean;
};
```

The hook uses `client.images.upload(...)` from `@imgwire/js`, so it supports the same upload options, including:

- `uploadToken`
- `getUploadToken`
- `customMetadata`
- `fileName`
- `mimeType`
- `purpose`
- `signal`
- `onProgress`

If you need signed uploads, configure `getUploadToken` on the provider client or pass it per upload call.

## Fetching Image Metadata

### `useFetchImage`

Use `useFetchImage(id)` when you need the image record itself rather than a rendered `<img />`.

```tsx
import { useFetchImage } from "@imgwire/react";

function ImageDetails({ id }: { id: string }) {
  const { data, isLoading, error } = useFetchImage(id);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (!data) return null;

  return (
    <div>
      <p>{data.id}</p>
      <p>
        {data.width}x{data.height}
      </p>
    </div>
  );
}
```

## Creating Upload Intents Manually

### `createImage`

If you want lower-level control, use `createImage(...)` to create an upload intent and get the image record plus presigned upload URL.

```tsx
import { createImage } from "@imgwire/react";

const result = await createImage({
  config: {
    apiKey: "ck_123"
  },
  body: {
    file_name: "example.png"
  }
});

console.log(result.uploadUrl);
console.log(result.image.id);
```

You can call it with either:

- `client`: an existing `ImgwireClient`
- `config`: client options used to create a temporary client

## API Notes

- The React SDK is a thin layer over `@imgwire/js`.
- URL generation and transformation validation come from `@imgwire/js`.
- `Image` and `ResponsiveImage` are SSR-safe as long as your `ImgwireClient` configuration is SSR-safe.
- For direct URL rendering, no fetch is performed by the component.

## Development

Development and contribution notes are kept at the end of the README so the main guide stays focused on SDK consumers.

### Scripts

```bash
yarn install
yarn format
yarn typecheck
yarn test
yarn build
yarn storybook
```

### Storybook

Storybook is included for local component development and manual validation.

```bash
yarn storybook
```

### Contributing

When contributing:

- keep public API changes intentional and documented
- prefer behavior-focused tests over snapshots
- run formatting, typecheck, and tests before opening a PR
