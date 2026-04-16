import type { Meta, StoryObj } from "@storybook/react";
import { useClient } from "../hooks/useClient.ts";
import { ImgwireProvider } from "./ImgwireProvider.tsx";

type ProviderStoryArgs = {
  apiKey: string;
  baseUrl?: string;
};

function WithProviderExample() {
  const client = useClient();
  return <code>{client.options.apiKey}</code>;
}

function WithoutProviderExample() {
  const client = useClient({ apiKey: "ck_fallback", fetch });
  return <code>{client.options.apiKey}</code>;
}

const meta = {
  title: "Provider/ImgwireProvider",
  args: {
    apiKey: "ck_provider",
    baseUrl: "https://api.imgwire.dev"
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
  render: () => <WithoutProviderExample />
};
