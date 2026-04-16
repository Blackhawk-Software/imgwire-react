import type { Meta, StoryObj } from "@storybook/react";
import { useClient } from "../hooks/useClient.ts";
import { ImgwireProvider } from "./ImgwireProvider.tsx";

type ProviderStoryArgs = {
  apiKey: string;
  baseUrl?: string;
  fallbackApiKey: string;
  fallbackBaseUrl?: string;
};

function WithProviderExample() {
  const client = useClient();
  return <code>{client.options.apiKey}</code>;
}

function WithoutProviderExample({
  apiKey,
  baseUrl
}: {
  apiKey: string;
  baseUrl?: string;
}) {
  const client = useClient({ apiKey, baseUrl, fetch });
  return <code>{client.options.apiKey}</code>;
}

const meta = {
  title: "Provider/ImgwireProvider",
  args: {
    apiKey: "ck_provider",
    baseUrl: "https://api.imgwire.dev",
    fallbackApiKey: "ck_fallback",
    fallbackBaseUrl: "https://api.imgwire.dev"
  },
  argTypes: {
    apiKey: {
      control: "text"
    },
    baseUrl: {
      control: "text"
    },
    fallbackApiKey: {
      control: "text"
    },
    fallbackBaseUrl: {
      control: "text"
    }
  }
} satisfies Meta<ProviderStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;
type ProviderStory = StoryObj<ProviderStoryArgs>;

export const WithProvider: ProviderStory = {
  render: ({ apiKey, baseUrl }) => (
    <ImgwireProvider config={{ apiKey, baseUrl, fetch }}>
      <WithProviderExample />
    </ImgwireProvider>
  )
};

export const WithoutProvider: ProviderStory = {
  args: {},
  render: ({ fallbackApiKey, fallbackBaseUrl }) => (
    <WithoutProviderExample apiKey={fallbackApiKey} baseUrl={fallbackBaseUrl} />
  )
};
