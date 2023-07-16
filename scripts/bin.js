#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Get the name of the new project from the command line arguments
const projectName = process.argv[2];
if (!projectName) {
  console.error("Please provide a name for the new project");
  process.exit(1);
}

// Create the new project directory
const projectDir = path.join(process.cwd(), projectName);
fs.mkdirSync(projectDir);

// Copy the boilerplate files into the new project directory
// Note: This assumes that your boilerplate files are in a directory named 'template'
const boilerplateDir = path.join(__dirname, "template");
execSync(`cp -R ${boilerplateDir}/* ${projectDir}`);

// Update the name field in the new package.json
const packageJsonPath = path.join(projectDir, "package.json");
const packageJson = require(packageJsonPath);
packageJson.name = projectName;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log(`Created new project in ${projectDir}`);
