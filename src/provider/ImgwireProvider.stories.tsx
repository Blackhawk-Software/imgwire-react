import type { Meta, StoryObj } from "@storybook/react";
import { useClient } from "../hooks/useClient.ts";
import { ImgwireProvider } from "./ImgwireProvider.tsx";

function WithProviderExample() {
  const client = useClient();
  return <code>{client.options.apiKey}</code>;
}

function WithoutProviderExample() {
  const client = useClient({ apiKey: "ck_fallback", fetch });
  return <code>{client.options.apiKey}</code>;
}

const meta = {
  title: "Provider/ImgwireProvider"
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithProvider: Story = {
  args: {},
  render: () => (
    <ImgwireProvider config={{ apiKey: "ck_provider", fetch }}>
      <WithProviderExample />
    </ImgwireProvider>
  )
};

export const WithoutProvider: Story = {
  args: {},
  render: () => <WithoutProviderExample />
};
