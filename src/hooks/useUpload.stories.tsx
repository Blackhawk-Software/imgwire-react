import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ImgwireProvider } from "../provider/ImgwireProvider.tsx";
import {
  buildStoryBaseUrl,
  type StoryBaseUrlArgs
} from "../storybook/baseUrl.ts";
import { useClient } from "./useClient.ts";
import { useUpload } from "./useUpload.ts";

type UploadStoryArgs = StoryBaseUrlArgs & {
  apiKey: string;
  buttonLabel: string;
};

function UploadStory({
  buttonLabel
}: Omit<UploadStoryArgs, "apiKey" | "environment">) {
  const [upload, progress] = useUpload();
  const client = useClient();
  const [status, setStatus] = useState("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <div>
      <input
        accept="image/*"
        onChange={(event) => {
          setSelectedFile(event.target.files?.[0] ?? null);
          setStatus("idle");
        }}
        type="file"
      />
      <button
        onClick={async () => {
          if (!selectedFile) {
            setStatus("select an image");
            return;
          }

          setStatus("uploading");
          await upload(selectedFile)
            .then(() => {
              setStatus("finished");
            })
            .catch(() => {
              setStatus("failed");
            });
        }}
        disabled={!selectedFile}
        type="button"
      >
        {buttonLabel}
      </button>
      <p>Client API key: {client.options.apiKey}</p>
      <p>Selected file: {selectedFile?.name ?? "none"}</p>
      <p>Selected type: {selectedFile?.type ?? "n/a"}</p>
      <p>Status: {status}</p>
      <p>Loaded: {progress.loaded}</p>
      <p>Percent: {progress.percent ?? "n/a"}</p>
    </div>
  );
}

const meta = {
  title: "Hooks/useUpload",
  component: UploadStory,
  render: ({ apiKey, environment, buttonLabel }) => (
    <ImgwireProvider
      config={{
        apiKey,
        baseUrl: buildStoryBaseUrl({ environment }),
        fetch
      }}
    >
      <UploadStory buttonLabel={buttonLabel} />
    </ImgwireProvider>
  ),
  args: {
    apiKey: "ck_storybook",
    environment: "production",
    buttonLabel: "Upload selected image"
  },
  argTypes: {
    apiKey: {
      control: "text"
    },
    environment: {
      control: "inline-radio",
      options: ["production", "local"]
    },
    buttonLabel: {
      control: "text"
    }
  }
} satisfies Meta<UploadStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ProgressStates: Story = {};
