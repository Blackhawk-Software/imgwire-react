import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ImgwireProvider } from "../provider/ImgwireProvider.tsx";
import { useClient } from "./useClient.ts";
import { useUpload } from "./useUpload.ts";

type UploadStoryArgs = {
  apiKey: string;
  baseUrl?: string;
  buttonLabel: string;
  fileName: string;
  fileContents: string;
  fileType: string;
};

function UploadStory({
  buttonLabel,
  fileName,
  fileContents,
  fileType
}: Omit<UploadStoryArgs, "apiKey" | "baseUrl">) {
  const [upload, progress] = useUpload();
  const client = useClient();
  const [status, setStatus] = useState("idle");

  return (
    <div>
      <button
        onClick={async () => {
          setStatus("uploading");
          const file = new File([fileContents], fileName, {
            type: fileType
          });
          await upload(file).catch(() => undefined);
          setStatus("finished");
        }}
        type="button"
      >
        {buttonLabel}
      </button>
      <p>Client API key: {client.options.apiKey}</p>
      <p>Upload file: {fileName}</p>
      <p>Upload type: {fileType}</p>
      <p>Status: {status}</p>
      <p>Loaded: {progress.loaded}</p>
      <p>Percent: {progress.percent ?? "n/a"}</p>
    </div>
  );
}

const meta = {
  title: "Hooks/useUpload",
  component: UploadStory,
  render: ({
    apiKey,
    baseUrl,
    buttonLabel,
    fileName,
    fileContents,
    fileType
  }) => (
    <ImgwireProvider config={{ apiKey, baseUrl, fetch }}>
      <UploadStory
        buttonLabel={buttonLabel}
        fileContents={fileContents}
        fileName={fileName}
        fileType={fileType}
      />
    </ImgwireProvider>
  ),
  args: {
    apiKey: "ck_storybook",
    baseUrl: "https://api.imgwire.dev",
    buttonLabel: "Upload",
    fileName: "example.txt",
    fileContents: "hello",
    fileType: "text/plain"
  },
  argTypes: {
    apiKey: {
      control: "text"
    },
    baseUrl: {
      control: "text"
    },
    buttonLabel: {
      control: "text"
    },
    fileName: {
      control: "text"
    },
    fileContents: {
      control: "text"
    },
    fileType: {
      control: "text"
    }
  }
} satisfies Meta<UploadStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ProgressStates: Story = {};
