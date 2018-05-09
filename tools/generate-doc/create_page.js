const { promisify } = require("util");
const jsdom = require("jsdom");
const fs = require("fs");
const path = require("path");
const hljs = require("highlight.js");
const emoji = require("markdown-it-emoji");
const md = require("markdown-it")({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (_) {}
    }
    return "";
  },
  html: true,
  linkify: true,
  typographer: true,
  xhtmlOut: true,
});

md.use(emoji);
md.renderer.rules.emoji = function(token, idx) {
  return `<span class="emoji emoji_${token[idx].markup}">${token[idx].content}</span>`;
};

module.exports = async function createDocumentationPage(
  filePath,
  outDir,
  options = {}
)  {
  const {
    css = [],
    setTitle = (a) => a,
    header = "",
    footer = "",
  } = options;

  let data;
  try {
    data = await promisify(fs.readFile)(filePath, "utf8");
  } catch (err) {
    /* eslint-disable no-console */
    console.error("error reading file:", err);
    /* eslint-enable no-console */
    return;
  }

  // remove original table of contents if one
  const contentWOTOC = removeTableOfContentFromMD(data);

  // generate new table of contents
  const { content, toc } = constructTableOfContents(contentWOTOC);

  const domSidebar = toc && convertMDToJSDOM(toc);
  const domContent = convertMDToJSDOM(content);

  const firstH1Tag = domContent.window.document.querySelector("h1");
  const pageTitle = firstH1Tag && firstH1Tag.textContent ?
    firstH1Tag.textContent : "Untitled Page";

  const cssString = css.map(cssContent => `<style type="text/css">
    ${cssContent}
  </style>`
  ).join("\n") || "";
  const sidebarString = domSidebar != null ?
    `<div class="sidebar">${domSidebar.serialize()}</div>` :
    "";
  const result = `<head>
  <meta charset="utf-8">
  ${cssString}
  <title>${setTitle(pageTitle)}</title>
  </head>
<body>
  <div class="page-wrapper">
    ${sidebarString}
    <div class="content-wrapper">
      ${header}
      <div class="content">
        ${domContent.serialize()}
      </div>
    </div>
    ${footer}
  </div>
</body>`;

  const outFile = path.join(outDir, path.basename(filePath, ".md") + ".html");
  try {
    await promisify(fs.writeFile)(outFile, result);
  } catch (err) {
    /* eslint-disable no-console */
    console.error("error writing file:", err);
    /* eslint-enable no-console */
    return;
  }
};

/**
 * Mutate <a> HTML tags to replace links to ".md" files to links to ".html"
 * files.
 * @param {HTMLElement} aTag
 */
function updateATag(aTag) {
  const href = aTag.href;
  const extname = path.extname(href);
  if (extname === ".md" || extname.startsWith(".md#")) {
    const newExt = ".html" + extname.substr(3, extname.length);
    aTag.href = path.join(
      path.dirname(href),
      path.basename(href, extname)
    ) + newExt;
    return;
  }
}

function convertMDToJSDOM(data) {
  const dom = new jsdom.JSDOM(md.render(data));
  const aTags = dom.window.document.getElementsByTagName("a");
  for (let i = 0; i < aTags.length; i++) {
    updateATag(aTags[i]);
  }
  return dom;
}

function removeTableOfContentFromMD(md) {
  const lines = md.split(/\r\n|\n|\r/);
  for (let i = 0, len = lines.length; i < len; i++) {
    if (/^ *## +table of contents/i.test(lines[i])) {
      const start = i;
      for (i = i + 1; i < len; i++) {
        if (/^ *## +/.test(lines[i])) {
          lines.splice(start, i - 1 - start);
          return lines.join("\n");
        }
      }
    }
  }
  return lines.join("\n");
}

function constructTableOfContents(md) {
  const tocLines = [];
  const newContent = [];
  const lines = md.split(/\r\n|\n|\r/);
  for (let i = 0, len = lines.length; i < len; i++) {
    if (/^ *# +/.test(lines[i])) {
      const regExec = /^ *# +(.*)$/.exec(lines[i]);
      if (regExec && regExec[1]) {
        const tocLine = regExec[1].replace(/#*$/, "").trim();
        const uri = "title-" + encodeURI(tocLine);
        tocLines.push(`[${tocLine}](#${uri})`);
        newContent.push(`<a name="${uri}"></a>`);
      }
    } else if (/^ *## +/.test(lines[i])) {
      const regExec = /^ *## +(.*)$/.exec(lines[i]);
      if (regExec && regExec[1]) {
        const tocLine = regExec[1].replace(/#*$/, "").trim();
        const uri = "chapter-" + encodeURI(tocLine);
        tocLines.push(`  - [${tocLine}](#${uri})`);
        newContent.push(`<a name="${uri}"></a>`);
      }
    } else if (/^ *### +/.test(lines[i])) {
      const regExec = /^ *### +(.*)$/.exec(lines[i]);
      if (regExec && regExec[1]) {
        const tocLine = regExec[1].replace(/#*$/, "").trim();
        const uri = "subchapter-" + encodeURI(tocLine);
        tocLines.push(`    - [${tocLine}](#${uri})`);
        newContent.push(`<a name="${uri}"></a>`);
      }
    }
    newContent.push(lines[i]);
  }
  return { toc: tocLines.join("\n"), content: newContent.join("\n") };
}
