import type { Meta, StoryObj } from "@storybook/react";
import { ImgwireProvider } from "../provider/ImgwireProvider.tsx";
import {
  DEFAULT_BREAKPOINTS,
  type ResponsiveImageProps,
  ResponsiveImage
} from "./ResponsiveImage.tsx";

type ResponsiveImageStoryArgs = ResponsiveImageProps & {
  apiKey: string;
  baseUrl?: string;
};

const meta = {
  title: "Components/ResponsiveImage",
  component: ResponsiveImage,
  render: ({ apiKey, baseUrl, ...args }) => (
    <ImgwireProvider config={{ apiKey, baseUrl, fetch }}>
      <ResponsiveImage {...args} />
    </ImgwireProvider>
  ),
  argTypes: {
    breakpoints: {
      control: false
    },
    loader: {
      control: false
    }
  },
  args: {
    apiKey: "ck_storybook",
    baseUrl: "https://api.imgwire.dev",
    url: "https://cdn.imgwire.dev/example.jpg",
    alt: "Responsive example"
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
      mobile: { minWidth: 0, width: 320, crop: "320:320:ce" },
      desktop: { minWidth: 1024, width: 1024, crop: "1024:576:ce" }
    }
  }
};

function cloneBreakpoints(
  breakpoints: Record<string, (typeof DEFAULT_BREAKPOINTS)[string]>
) {
  return Object.fromEntries(
    Object.entries(breakpoints).map(([key, value]) => [key, { ...value }])
  );
}
