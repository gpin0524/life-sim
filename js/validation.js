/**
 * 檢查使用者輸入。
 * 不合格就丟出 Error，訊息是要直接顯示給使用者看的中文。
 */
(function (App) {
  "use strict";

  const API_KEY_PATTERN = /^k8b_/;
  const ISO3_PATTERN = /^[A-Z]{3}$/;

  function requireApiKey(rawText) {
    const key = rawText.trim();
    if (!API_KEY_PATTERN.test(key)) {
      throw new Error("請先在最上方貼上以 k8b_ 開頭的 API 金鑰。");
    }
    return key;
  }

  function requireIso3(rawText) {
    const code = rawText.trim().toUpperCase();
    if (!ISO3_PATTERN.test(code)) {
      throw new Error("請選擇或輸入 3 個字母的 ISO3 國家代碼。");
    }
    return code;
  }

  /** 空白 -> null（代表不指定）；否則必須是範圍內的整數。 */
  function optionalInteger(rawText, { label, min, max }) {
    const text = rawText.trim();
    if (text === "") return null;
    const number = Number(text);
    if (!Number.isInteger(number) || number < min || number > max) {
      throw new Error(`${label}請填 ${min} 到 ${max} 之間的整數，或留白。`);
    }
    return number;
  }

  App.validation = { requireApiKey, requireIso3, optionalInteger };
})(window.App = window.App || {});
