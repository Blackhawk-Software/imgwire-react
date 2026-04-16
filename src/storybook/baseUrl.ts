export type StoryBaseUrlArgs = {
  environment: "production" | "local";
};

export function buildStoryBaseUrl({ environment }: StoryBaseUrlArgs) {
  return environment === "local"
    ? "https://imgwire.ngrok.io"
    : "https://api.imgwire.dev";
}
