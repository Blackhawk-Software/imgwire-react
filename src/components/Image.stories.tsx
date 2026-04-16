import type { Meta, StoryObj } from "@storybook/react";
import type { FC } from "react";
import { ImgwireProvider } from "../provider/ImgwireProvider.tsx";
import { Image } from "./Image.tsx";

const meta = {
  title: "Components/Image",
  component: Image,
  render: (args) => <Image {...args} />,
  decorators: [
    (Story: FC) => (
      <ImgwireProvider config={{ apiKey: "ck_storybook", fetch: fetch }}>
        <Story />
      </ImgwireProvider>
    )
  ],
  args: {
    url: "https://cdn.imgwire.dev/example.jpg",
    alt: "Example"
  }
} satisfies Meta<typeof Image>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DirectUrl: Story = {};

export const Transformed: Story = {
  args: {
    width: 800,
    format: "webp",
    quality: 80
  }
};

export const WithLoader: Story = {
  args: {
    id: "img_123",
    url: undefined,
    loader: async () => ({
      url: "https://cdn.imgwire.dev/example.jpg"
    })
  },
  argTypes: {
    loader: {
      control: false
    }
  }
};
