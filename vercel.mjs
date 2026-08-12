const FRONTEND_PROJECT_ID = "prj_XCquuo4eQ2DvgqcsN990d0QUoV1S";
const BACKEND_PROJECT_ID = "prj_3ZTlC9WzZFzBLMgyQjC1GpDUV4ql";
const FRONTEND_ORIGINS = [
  "https://techeducoderlms.vercel.app",
  "https://techeducoderlms-unique-iits-projects.vercel.app",
  "https://techeducoderlms-git-main-unique-iits-projects.vercel.app",
].join(",");

const projectId = process.env.VERCEL_PROJECT_ID;

const frontendConfig = {
  framework: "nextjs",
  installCommand: "npm ci --include=dev",
  buildCommand: "npm --workspace client run build",
  outputDirectory: "client/.next",
  env: {
    NEXT_PUBLIC_SERVER_URI: "https://techeducoderlmsbackend.vercel.app/api/v1/",
  },
};

const backendConfig = {
  framework: null,
  installCommand: "npm ci --include=dev",
  buildCommand: "npm --workspace server run build",
  env: {
    ORIGIN: FRONTEND_ORIGINS,
    CLIENT_URL: FRONTEND_ORIGINS,
    REDIS_DISABLED: "true",
  },
  builds: [
    {
      src: "server/api/index.ts",
      use: "@vercel/node",
      config: {
        includeFiles: ["server/mails/**"],
      },
    },
  ],
  routes: [
    {
      src: "/(.*)",
      dest: "/server/api/index.ts",
    },
  ],
};

export const config =
  projectId === BACKEND_PROJECT_ID ? backendConfig : frontendConfig;
