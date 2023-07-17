import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

execSync("yarn clean", { stdio: "inherit" });

fs.rmSync(path.join(__dirname, "../yarn.lock"), { force: true });
fs.rmSync(path.join(__dirname, "../node_modules"), {
  recursive: true,
  force: true,
});
