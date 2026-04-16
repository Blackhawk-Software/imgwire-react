import type { Meta, StoryObj } from "@storybook/react";
import type { FC } from "react";
import { useState } from "react";
import { ImgwireProvider } from "../provider/ImgwireProvider.tsx";
import { useUpload } from "./useUpload.ts";

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
  decorators: [
    (Story: FC) => (
      <ImgwireProvider config={{ apiKey: "ck_storybook", fetch: fetch }}>
        <Story />
      </ImgwireProvider>
    )
  ]
} satisfies Meta<typeof UploadStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ProgressStates: Story = {};
