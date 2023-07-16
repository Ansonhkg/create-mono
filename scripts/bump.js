const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Read the current version from package.json
const packageJsonPath = path.resolve(__dirname, "../package.json");
const packageJson = require(packageJsonPath);
let [major, minor, patch] = packageJson.version.split(".").map(Number);

// Ask the user for the new version
console.log(`Current version is ${major}.${minor}.${patch}`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  "Which version do you want to bump? (major, minor, patch): ",
  (version) => {
    // Update the version
    switch (version) {
      case "major":
        major++;
        minor = 0;
        patch = 0;
        break;
      case "minor":
        minor++;
        patch = 0;
        break;
      case "patch":
      default:
        patch++;
        break;
    }

    // Save the new version to package.json
    packageJson.version = `${major}.${minor}.${patch}`;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    console.log(`Version bumped to ${major}.${minor}.${patch}`);

    rl.close();
  }
);
