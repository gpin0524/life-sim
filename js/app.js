/**
 * 主程式：把表單、API、畫面接在一起。
 * 兩種模式用同樣的流程（讀表單 → 呼叫 → 顯示），差別只在下面這張表。
 */
(function (App) {
  "use strict";

  const { api, form, ui, labels } = App;

  const MODES = {
    life: {
      readParams: form.readLifeParams,
      fetch: api.fetchLife,
      render: ({ life, usage }, countryName, container) =>
        App.renderLife(life, countryName, usage, container)
    },
    person: {
      readParams: form.readPersonParams,
      fetch: api.fetchPerson,
      render: ({ person, usage }, _countryName, container) =>
        App.renderPerson(person, usage, container)
    }
  };

  let currentMode = "life";

  /** 按下「出生」或「找人」。 */
  async function handleSubmit() {
    ui.clearError();
    ui.clearResult();
    ui.hideDisclaimer();

    const modeName = currentMode;
    const mode = MODES[modeName];

    try {
      const apiKey = form.readApiKey();
      const params = mode.readParams();
      const countryName = form.readCountryLabel();

      ui.setSubmitEnabled(false);
      ui.setStatus(labels.busyStatus[modeName]);

      const data = await mode.fetch(params, apiKey);
      mode.render(data, countryName, ui.resultContainer());
      ui.showDisclaimer(labels.disclaimer[modeName]);
    } catch (error) {
      ui.showError(api.describeFailure(error));
    } finally {
      ui.setSubmitEnabled(true);
      ui.setStatus("");
    }
  }

  async function loadCountryList() {
    try {
      form.fillCountries(await api.loadCountries());
    } catch (error) {
      form.useManualCountryInput();
      ui.showError(
        `國家清單載入失敗：${api.describeFailure(error)}。` +
        "瀏覽器在連線到 1in8b.life 之前就被擋下或中斷了（常見原因：沒有網路、廣告／隱私擋修器、或從本機檔案開啟時被跨來源限制擋住）。" +
        "你可以先手動輸入 ISO3 國家代碼再試，或改用其他瀏覽器、關掉擋修器後重新整理。"
      );
    } finally {
      ui.setSubmitEnabled(true);
    }
  }

  function start() {
    ui.onModeTabClick((mode) => {
      currentMode = mode;
      ui.setMode(mode);
    });
    document.getElementById("submit").addEventListener("click", handleSubmit);
    ui.setMode(currentMode);
    loadCountryList();
  }

  document.addEventListener("DOMContentLoaded", start);
})(window.App = window.App || {});
