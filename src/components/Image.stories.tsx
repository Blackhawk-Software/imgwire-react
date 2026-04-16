import type { Meta, StoryObj } from "@storybook/react";
import { ImgwireProvider } from "../provider/ImgwireProvider.tsx";
import { type ImageProps, Image } from "./Image.tsx";

type ImageStoryArgs = ImageProps & {
  apiKey: string;
  baseUrl?: string;
};

const meta = {
  title: "Components/Image",
  component: Image,
  render: ({ apiKey, baseUrl, ...args }) => (
    <ImgwireProvider config={{ apiKey, baseUrl, fetch }}>
      <Image {...args} />
    </ImgwireProvider>
  ),
  args: {
    apiKey: "ck_storybook",
    baseUrl: "https://api.imgwire.dev",
    url: "https://cdn.imgwire.dev/example.jpg",
    alt: "Example"
  },
  argTypes: {
    loader: {
      control: false
    }
  }
} satisfies Meta<ImageStoryArgs>;

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
  }
};
