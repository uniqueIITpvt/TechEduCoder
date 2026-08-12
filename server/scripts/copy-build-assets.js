const { cpSync, existsSync, mkdirSync } = require("node:fs");
const { join } = require("node:path");

const projectRoot = join(__dirname, "..");
const sourceDirectory = join(projectRoot, "mails");
const targetDirectory = join(projectRoot, "build", "mails");

if (!existsSync(sourceDirectory)) {
  throw new Error(`Build asset directory is missing: ${sourceDirectory}`);
}

mkdirSync(targetDirectory, { recursive: true });
cpSync(sourceDirectory, targetDirectory, { recursive: true });

console.log("Copied email templates to build/mails.");
