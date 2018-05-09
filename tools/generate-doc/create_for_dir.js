const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const createDocumentationPage = require("./create_page.js");

module.exports = async function createDocumentationForDir(
  pathName,
  outDir,
  options
) {
  // Loop through all the files in the temp directory
  let files;
  try {
    files = await promisify(fs.readdir)(pathName);
  } catch (err) {
    /* eslint-disable no-console */
    console.error("error reading directory:", err);
    /* eslint-enable no-console */
    return;
  }

  const doesOutDirExists = await promisify(fs.exists)(outDir);
  if (!doesOutDirExists) {
    await promisify(mkdirParent)(outDir);
  }

  files.forEach(async function(file) {
    let stat;
    try {
      stat = await promisify(fs.stat)(path.join(pathName, file));
    } catch (err) {
      /* eslint-disable no-console */
      console.error("error stating file:", err);
      /* eslint-enable no-console */
      return;
    }

    if (stat.isDirectory()) {
      createDocumentationForDir(
        path.join(pathName, file),
        path.join(outDir, file),
        options
      );
    }
    if(stat.isFile()) {
      const extname = path.extname(file);
      if (extname === ".md") {
        createDocumentationPage(path.join(pathName, file), outDir, options);
      }
    }
  });
};

function mkdirParent(dirPath, mode, callback) {
  //Call the standard fs.mkdir
  fs.mkdir(dirPath, mode, function(error) {
    //When it fail in this way, do the custom steps
    if (error && error.errno === 34) {
      //Create all the parents recursively
      fs.mkdirParent(path.dirname(dirPath), mode, callback);
      //And then the directory
      fs.mkdirParent(dirPath, mode, callback);
    }
    //Manually run the callback since we used our own callback to do all these
    callback && callback(error);
  });
}
