import type { Meta, StoryObj } from "@storybook/react-vite";
import { useClient } from "../hooks/useClient.ts";
import {
  buildStoryBaseUrl,
  type StoryBaseUrlArgs
} from "../storybook/baseUrl.ts";
import { ImgwireProvider } from "./ImgwireProvider.tsx";

type ProviderStoryArgs = StoryBaseUrlArgs & {
  apiKey: string;
  fallbackApiKey: string;
  fallbackEnvironment: "production" | "local";
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
    environment: "production",
    fallbackApiKey: "ck_fallback",
    fallbackEnvironment: "production"
  },
  argTypes: {
    apiKey: {
      control: "text"
    },
    environment: {
      control: "inline-radio",
      options: ["production", "local"]
    },
    fallbackApiKey: {
      control: "text"
    },
    fallbackEnvironment: {
      control: "inline-radio",
      options: ["production", "local"]
    }
  }
} satisfies Meta<ProviderStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;
type ProviderStory = StoryObj<ProviderStoryArgs>;

export const WithProvider: ProviderStory = {
  render: ({ apiKey, environment }) => (
    <ImgwireProvider
      config={{
        apiKey,
        baseUrl: buildStoryBaseUrl({ environment }),
        fetch
      }}
    >
      <WithProviderExample />
    </ImgwireProvider>
  )
};

export const WithoutProvider: ProviderStory = {
  args: {},
  render: ({ fallbackApiKey, fallbackEnvironment }) => (
    <WithoutProviderExample
      apiKey={fallbackApiKey}
      baseUrl={buildStoryBaseUrl({ environment: fallbackEnvironment })}
    />
  )
};
