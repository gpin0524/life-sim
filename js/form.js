/** 讀取表單：把欄位的值整理成要送給 API 的參數。 */
(function (App) {
  "use strict";

  const { byId } = App.dom;
  const { requireApiKey, requireIso3, optionalInteger } = App.validation;
  const { limits, responseLanguage } = App.config;

  // ---- 國家欄位 --------------------------------------------------------

  function fillCountries(countries) {
    const select = byId("country");
    App.dom.empty(select);
    countries.forEach(({ iso3, name }) => {
      const option = App.dom.create("option", null, name);
      option.value = iso3;
      select.appendChild(option);
    });
  }

  /** 國家清單載入失敗時，把下拉選單換成可以自己輸入 ISO3 的文字框。 */
  function useManualCountryInput() {
    const input = document.createElement("input");
    input.id = "country";
    input.type = "text";
    input.maxLength = 3;
    input.placeholder = "手動輸入 ISO3，例如 TWN";
    const old = byId("country");
    old.parentNode.replaceChild(input, old);
  }

  function readCountryCode() {
    return requireIso3(byId("country").value);
  }

  /** 畫面上顯示的國家名稱（下拉選單用中文名，手動輸入就用代碼）。 */
  function readCountryLabel() {
    const field = byId("country");
    if (field.tagName === "SELECT") return field.options[field.selectedIndex].text;
    return field.value.trim().toUpperCase();
  }

  // ---- 金鑰與共用參數 --------------------------------------------------

  function readApiKey() {
    return requireApiKey(byId("key").value);
  }

  function readSharedParams() {
    return {
      country: readCountryCode(),
      sex: byId("sex").value,
      lang: responseLanguage
    };
  }

  // ---- 各模式的參數 ----------------------------------------------------

  function readLifeParams() {
    return {
      record: 1,
      ...readSharedParams(),
      year: optionalInteger(byId("year").value, limits.birthYear),
      fifth: byId("fifth").value,
      place: byId("place").value
    };
  }

  function readPersonParams() {
    return {
      ...readSharedParams(),
      age: optionalInteger(byId("age").value, limits.age),
      education: byId("education").value,
      job: byId("job").value,
      partnered: byId("partnered").value,
      children: optionalInteger(byId("children").value, limits.children),
      tries: byId("tries").value,
      record: byId("withRecord").value
    };
  }

  App.form = {
    fillCountries, useManualCountryInput, readCountryLabel,
    readApiKey, readLifeParams, readPersonParams
  };
})(window.App = window.App || {});
