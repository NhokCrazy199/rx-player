const css = `
* {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}
body {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: #333;
    background-color: #fafbfc;
}
.content-wrapper {
    position: absolute;
    top: 0px;
    left: 0px;
    margin-left: 360px;
    margin-bottom: 60px;
    width: 1000px;
    background-color: #fff;
    padding: 5px 40px;
}
.content {
    margin-left: auto;
    margin-right: auto;
    max-width: 750px;
    padding-bottom: 50px
}
.footer {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 1rem;
    background-color: #efefef;
    text-align: center;
}
h1, h2, h3, h4, h5, h6 {
    font-family: inherit;
    font-weight: 500;
    line-height: 1.1;
    color: inherit;
}
h1, h2, h3 {
    margin-top: 25px;
    margin-bottom: 10px;
}
h1 {
    font-size: 32px;
}
h2 {
    display: block;
    font-size: 25px;
    font-weight: bold;
}
h3 {
    font-size: 23px;
}
h4 {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 18px;
}
pre {
    display: block;
    padding: 9.5px;
    margin: 0 0 10px;
    font-size: 13px;
    line-height: 1.42857143;
    color: #333;
    word-break: break-all;
    word-wrap: break-word;
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 4px;
}
a:hover {
    color: #071269;
    text-decoration: underline;
}
a {
    color: #071269;
    text-decoration: none;
}
code {
    font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
    padding: 2px 4px;
    font-size: 90%;
    color: #484848;
    background-color: #f9f2f4;
    border-radius: 4px;
}
pre code {
    padding: 0;
    font-size: inherit;
    color: inherit;
    white-space: pre-wrap;
    background-color: transparent;
    border-radius: 0;
}
.language-js {
    padding: 9.5px;
    display: block;
    overflow-x: auto;
    padding: 0.5em;
    color: #333;
    background: #f8f8f8;
}
.emoji_warning {
    color: #B71C1C;
    padding-left: 4px;
    padding-right: 3px;
    font-size: 1.3em;
}
.sidebar {
    height: 100%;
    width: 360px;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    background-color: #fafafa;
    overflow-x: hidden;
    padding: 5px 20px;
    font-size: 1.2em;
    line-height: 2em;
}
.sidebar a {
    color: #364149;
}
.sidebar a:hover {
    text-decoration: none;
    color: #008cff;
}
.sidebar ul {
  list-style-type: none;
}
.header {
  top: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
}
`;

const hlsjsCSS = `
/*

github.com style (c) Vasily Polovnyov <vast@whiteants.net>

*/

.hljs {
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  color: #333;
  background: #f8f8f8;
}

.hljs-comment,
.hljs-quote {
  color: #998;
  font-style: italic;
}

.hljs-keyword,
.hljs-selector-tag,
.hljs-subst {
  color: #333;
  font-weight: bold;
}

.hljs-number,
.hljs-literal,
.hljs-variable,
.hljs-template-variable,
.hljs-tag .hljs-attr {
  color: #008080;
}

.hljs-string,
.hljs-doctag {
  color: #d14;
}

.hljs-title,
.hljs-section,
.hljs-selector-id {
  color: #900;
  font-weight: bold;
}

.hljs-subst {
  font-weight: normal;
}

.hljs-type,
.hljs-class .hljs-title {
  color: #458;
  font-weight: bold;
}

.hljs-tag,
.hljs-name,
.hljs-attribute {
  color: #000080;
  font-weight: normal;
}

.hljs-regexp,
.hljs-link {
  color: #009926;
}

.hljs-symbol,
.hljs-bullet {
  color: #990073;
}

.hljs-built_in,
.hljs-builtin-name {
  color: #0086b3;
}

.hljs-meta {
  color: #999;
  font-weight: bold;
}

.hljs-deletion {
  background: #fdd;
}

.hljs-addition {
  background: #dfd;
}

.hljs-emphasis {
  font-style: italic;
}

.hljs-strong {
  font-weight: bold;
}
`;

module.exports = { css, hlsjsCSS };
