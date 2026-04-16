import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { ImgwireProvider } from "../provider/ImgwireProvider.tsx";
import {
  buildStoryBaseUrl,
  type StoryBaseUrlArgs
} from "../storybook/baseUrl.ts";
import { Image } from "./Image.tsx";

type ImageStoryArgs = ComponentProps<typeof Image> &
  StoryBaseUrlArgs & {
    apiKey: string;
  };

const meta = {
  title: "Components/Image",
  component: Image,
  render: ({ apiKey, environment, ...args }) => (
    <ImgwireProvider
      config={{
        apiKey,
        baseUrl: buildStoryBaseUrl({ environment }),
        fetch
      }}
    >
      <Image {...args} />
    </ImgwireProvider>
  ),
  args: {
    apiKey: "ck_storybook",
    environment: "production",
    url: "https://cdn.conveyer.dev/5f81fbbb-e95b-4b2d-96d6-73e501d5ce64.png",
    alt: "Example",
    style: {
      display: "block",
      maxWidth: "100%"
    }
  },
  argTypes: {
    apiKey: {
      control: "text"
    },
    environment: {
      control: "inline-radio",
      options: ["production", "local"]
    },
    style: {
      control: "object"
    },
    background: {
      control: "color"
    },
    bg: {
      control: false
    },
    bl: {
      control: false
    },
    c: {
      control: false
    },
    el: {
      control: false
    },
    ex: {
      control: false
    },
    extend_ar: {
      control: false
    },
    exar: {
      control: false
    },
    fl: {
      control: false
    },
    f: {
      control: false
    },
    ext: {
      control: false
    },
    g: {
      control: false
    },
    h: {
      control: false
    },
    kcr: {
      control: false
    },
    mh: {
      control: false
    },
    mw: {
      control: false
    },
    pd: {
      control: false
    },
    pix: {
      control: false
    },
    q: {
      control: false
    },
    rot: {
      control: false
    },
    sh: {
      control: false
    },
    scp: {
      control: false
    },
    sm: {
      control: false
    },
    w: {
      control: false
    },
    z: {
      control: false
    }
  }
} satisfies Meta<ImageStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DirectUrl: Story = {};

export const Transformed: Story = {
  args: {
    width: 150,
    rotate: 90,
    format: "webp",
    quality: 80
  }
};

export const WithLoader: Story = {
  args: {
    id: "6e8963fa-72c9-4544-a47c-e8be72ce3e23",
    url: undefined,
    width: 640
  }
};
