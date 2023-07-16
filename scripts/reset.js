const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

execSync("yarn clean", { stdio: "inherit" });

fs.rmSync(path.join(__dirname, "../yarn.lock"), { force: true });
fs.rmSync(path.join(__dirname, "../node_modules"), {
  recursive: true,
  force: true,
});
