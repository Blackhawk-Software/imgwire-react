import type { Meta, StoryObj } from "@storybook/react";
import type { FC } from "react";
import { ImgwireProvider } from "../provider/ImgwireProvider.tsx";
import {
  DEFAULT_BREAKPOINTS,
  ResponsiveImage
} from "./ResponsiveImage.tsx";

const meta = {
  title: "Components/ResponsiveImage",
  component: ResponsiveImage,
  render: (args) => <ResponsiveImage {...args} />,
  decorators: [
    (Story: FC) => (
      <ImgwireProvider config={{ apiKey: "ck_storybook", fetch: fetch }}>
        <Story />
      </ImgwireProvider>
    )
  ],
  args: {
    url: "https://cdn.imgwire.dev/example.jpg",
    alt: "Responsive example"
  }
} satisfies Meta<typeof ResponsiveImage>;

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
      mobile: { minWidth: 0, width: 320, crop: "1:1:ce" },
      desktop: { minWidth: 1024, width: 1024, crop: "16:9:ce" }
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
