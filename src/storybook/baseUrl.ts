export type StoryBaseUrlArgs = {
  environment: "production" | "local";
};

export function buildStoryBaseUrl({ environment }: StoryBaseUrlArgs) {
  return environment === "local"
    ? "http://localhost:8000"
    : "https://api.imgwire.dev";
}
