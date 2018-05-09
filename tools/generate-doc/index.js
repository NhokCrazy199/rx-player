const { css, hlsjsCSS } = require("./css.js");
const createDocumentationForDir = require("./create_for_dir.js");

// XXX TODO
// const footer = `
// <div class="footer">
//   <a href="./index.html">Home</a>
//   <a href="#">get back to the top</a>
// </div>
// `;
const header = `
<div class="header">
  <div class="header-content">
    <a href="./index.html">API Documentation</a>
    <a href="todo">Demo Page</a>
  </div>
</div>`;

// TODO Find a way for saving image files and other assets locally
// TODO better .md renaming strategy:
//   - those that will be converted: yes
//   - other: no
// TODO Activable/DeActivable/Configurable sidebar
createDocumentationForDir("./doc/", "./doc/pages/", {
  css: [css, hlsjsCSS],
  setTitle: originalTitle => originalTitle + " - RxPlayer Documentation",
  header,
  // footer,
});
