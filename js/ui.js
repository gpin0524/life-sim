/** 頁面上「訊息、狀態、模式切換」的顯示控制。 */
(function (App) {
  "use strict";

  const { byId } = App.dom;
  const { labels } = App;

  function showError(message) {
    const box = byId("error");
    box.textContent = message;
    box.style.display = "block";
  }

  function clearError() {
    const box = byId("error");
    box.textContent = "";
    box.style.display = "none";
  }

  function setStatus(text) {
    byId("status").textContent = text;
  }

  function setSubmitEnabled(enabled) {
    byId("submit").disabled = !enabled;
  }

  function resultContainer() {
    return byId("result");
  }

  function clearResult() {
    App.dom.empty(resultContainer());
  }

  function showDisclaimer(text) {
    const box = byId("note");
    box.textContent = text;
    box.style.display = "block";
  }

  function hideDisclaimer() {
    byId("note").style.display = "none";
  }

  /** 切換「看一生」與「找人」：分頁標籤、各自的欄位、按鈕文字、提示。 */
  function setMode(mode) {
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.classList.toggle("on", tab.dataset.mode === mode);
    });
    document.querySelectorAll("[data-for]").forEach((part) => {
      part.classList.toggle("hide", part.dataset.for !== mode);
    });
    byId("submit").textContent = labels.submitButton[mode];
    byId("hint").textContent = labels.hint[mode];
    clearError();
    clearResult();
    hideDisclaimer();
  }

  function onModeTabClick(callback) {
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", () => callback(tab.dataset.mode));
    });
  }

  App.ui = {
    showError, clearError, setStatus, setSubmitEnabled,
    resultContainer, clearResult, showDisclaimer, hideDisclaimer,
    setMode, onModeTabClick
  };
})(window.App = window.App || {});
