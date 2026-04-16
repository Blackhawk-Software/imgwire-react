import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ImgwireProvider } from "../provider/ImgwireProvider.tsx";
import { useUpload } from "./useUpload.ts";

type UploadStoryArgs = {
  apiKey: string;
  baseUrl?: string;
};

function UploadStory() {
  const [upload, progress] = useUpload();
  const [status, setStatus] = useState("idle");

  return (
    <div>
      <button
        onClick={async () => {
          setStatus("uploading");
          const file = new File(["hello"], "example.txt", {
            type: "text/plain"
          });
          await upload(file).catch(() => undefined);
          setStatus("finished");
        }}
        type="button"
      >
        Upload
      </button>
      <p>Status: {status}</p>
      <p>Loaded: {progress.loaded}</p>
      <p>Percent: {progress.percent ?? "n/a"}</p>
    </div>
  );
}

const meta = {
  title: "Hooks/useUpload",
  component: UploadStory,
  render: ({ apiKey, baseUrl }) => (
    <ImgwireProvider config={{ apiKey, baseUrl, fetch }}>
      <UploadStory />
    </ImgwireProvider>
  ),
  args: {
    apiKey: "ck_storybook",
    baseUrl: "https://api.imgwire.dev"
  }
} satisfies Meta<UploadStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ProgressStates: Story = {};
