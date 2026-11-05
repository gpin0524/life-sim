/** 操作網頁元素的小工具。 */
(function (App) {
  "use strict";

  function byId(id) {
    return document.getElementById(id);
  }

  /** 建立元素。文字一律用 textContent 放入，所以不會有 HTML 注入的問題。 */
  function create(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined && text !== null) element.textContent = text;
    return element;
  }

  /** 把多個子元素放進 parent；空值（null/undefined）會被略過。 */
  function append(parent, ...children) {
    children.filter(Boolean).forEach((child) => parent.appendChild(child));
    return parent;
  }

  function empty(element) {
    element.textContent = "";
  }

  App.dom = { byId, create, append, empty };
})(window.App = window.App || {});
