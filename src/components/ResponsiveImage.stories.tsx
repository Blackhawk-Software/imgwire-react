import type { Meta, StoryObj } from "@storybook/react-vite";
import { ImgwireProvider } from "../provider/ImgwireProvider.tsx";
import {
  buildStoryBaseUrl,
  type StoryBaseUrlArgs
} from "../storybook/baseUrl.ts";
import {
  DEFAULT_BREAKPOINTS,
  type ResponsiveImageProps,
  ResponsiveImage
} from "./ResponsiveImage.tsx";

type ResponsiveImageStoryArgs = ResponsiveImageProps &
  StoryBaseUrlArgs & {
    apiKey: string;
  };

const meta = {
  title: "Components/ResponsiveImage",
  component: ResponsiveImage,
  render: ({ apiKey, environment, ...args }) => (
    <ImgwireProvider
      config={{
        apiKey,
        baseUrl: buildStoryBaseUrl({ environment }),
        fetch
      }}
    >
      <ResponsiveImage {...args} />
    </ImgwireProvider>
  ),
  args: {
    apiKey: "ck_storybook",
    environment: "production",
    url: "https://cdn.conveyer.dev/5f81fbbb-e95b-4b2d-96d6-73e501d5ce64.png",
    alt: "Responsive example",
    style: {
      display: "block",
      maxWidth: "100%"
    }
  },
  argTypes: {
    breakpoints: {
      control: "object"
    },
    dpr: {
      control: "object"
    },
    loader: {
      control: false
    },
    apiKey: {
      control: "text"
    },
    environment: {
      control: "inline-radio",
      options: ["production", "local"]
    },
    style: {
      control: "object"
    }
  }
} satisfies Meta<ResponsiveImageStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultBreakpoints: Story = {
  args: {
    breakpoints: cloneBreakpoints(DEFAULT_BREAKPOINTS)
  }
};

export const CustomBreakpoints: Story = {
  args: {
    breakpoints: {
      mobile: { minWidth: 0, width: 320, crop: "320:320:ce:0:0" },
      desktop: { minWidth: 1024, width: 1024, crop: "1024:576:ce:0:0" }
    }
  }
};

export const WithLoader: Story = {
  args: {
    id: "09661334-1db6-45b0-82ee-59209a1be498",
    url: undefined,
    breakpoints: cloneBreakpoints(DEFAULT_BREAKPOINTS)
  }
};

function cloneBreakpoints(
  breakpoints: Record<string, (typeof DEFAULT_BREAKPOINTS)[string]>
) {
  return Object.fromEntries(
    Object.entries(breakpoints).map(([key, value]) => [key, { ...value }])
  );
}
