import fs from "fs";
import path from "path";

const getDirectories = source =>
  fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

const getDirectorySize = dir => {
  let size = 0;

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      size += getDirectorySize(filePath);
    } else {
      size += stat.size;
    }
  });

  return size;
};

const formatSizeUnits = bytes => {
  if      (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + " GB"; }
  else if (bytes >= 1048576)    { bytes = (bytes / 1048576).toFixed(2) + " MB"; }
  else if (bytes >= 1024)       { bytes = (bytes / 1024).toFixed(2) + " KB"; }
  else if (bytes > 1)           { bytes = bytes + " bytes"; }
  else if (bytes == 1)          { bytes = bytes + " byte"; }
  else                          { bytes = "0 bytes"; }
  return bytes;
}

const packageDirs = getDirectories('./packages');

// Determine the longest module name
const longestModuleName = packageDirs.reduce((max, cur) => Math.max(max, cur.length), 0);

packageDirs.forEach(moduleDir => {
  const distPath = `./packages/${moduleDir}/dist`;

  // If dist folder exists for the module, get its size
  if(fs.existsSync(distPath)) {
    const dirSize = getDirectorySize(distPath);
    console.log(`${moduleDir.padEnd(longestModuleName)} dist size: ${formatSizeUnits(dirSize)}`);
  } else {
    console.log(`${moduleDir.padEnd(longestModuleName)} No dist directory`);
  }
});
