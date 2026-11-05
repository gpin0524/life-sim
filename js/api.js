/**
 * 跟 1in8b Engine 說話的地方。
 * 這個檔案只管網路，不碰畫面；對外給的是整理好的資料，出錯就丟 Error。
 */
(function (App) {
  "use strict";

  const { apiBase, personEndpoints } = App.config;

  // ---- 小工具 ----------------------------------------------------------

  /** 把 { a: 1, b: "" } 變成 "a=1"；空值不會送出。 */
  function buildQuery(params) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([name, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        query.append(name, String(value));
      }
    });
    return query.toString();
  }

  /** 答案裡的 error 可能是文字、物件，這裡統一成文字。 */
  function messageFrom(errorValue) {
    if (errorValue === null || errorValue === undefined) return "";
    if (typeof errorValue === "string") return errorValue;
    if (errorValue.message) return String(errorValue.message);
    try {
      return JSON.stringify(errorValue);
    } catch (_) {
      return String(errorValue);
    }
  }

  async function readJson(response) {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (_) {
      return null;
    }
  }

  /** 瀏覽器在連上伺服器之前就失敗時，只會給很短的英文，這裡補上說明。 */
  function describeFailure(error) {
    const message = messageFrom(error);
    const isNetworkFailure =
      message === "Load failed" || message === "Failed to fetch" || /NetworkError/i.test(message);
    if (!isNetworkFailure) return message;
    return `連線失敗（${message}）：瀏覽器沒有收到 1in8b.life 的回應，可能是網路、擋修器或跨來源限制。`;
  }

  // ---- 帶金鑰的請求 ----------------------------------------------------

  async function authorizedGet(path, params, apiKey) {
    const url = `${apiBase}${path}?${buildQuery(params)}`;
    const response = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
    return { status: response.status, ok: response.ok, body: await readJson(response) };
  }

  /** 成功就回傳內容；失敗就把答案裡的 error 文字丟出去。 */
  function unwrap({ status, ok, body }) {
    if (ok && body && !body.error) return body;
    if (body && body.error) throw new Error(messageFrom(body.error));
    throw new Error(`呼叫失敗（HTTP ${status}）`);
  }

  /** 依序試每個網址；回 404 就換下一個，最後一個一律照結果處理。 */
  async function getFromFirstAvailablePath(paths, params, apiKey) {
    for (let index = 0; index < paths.length; index += 1) {
      const result = await authorizedGet(paths[index], params, apiKey);
      const isLastPath = index === paths.length - 1;
      if (result.status !== 404 || isLastPath) return unwrap(result);
    }
    throw new Error("沒有可用的網址。");
  }

  // ---- 對外的功能 ------------------------------------------------------

  /** 國家清單（不需要金鑰）。回傳 [{ iso3, name }]，依中文名稱排序。 */
  async function loadCountries() {
    const response = await fetch(`${apiBase}/countries`);
    const body = await readJson(response);
    const list = Array.isArray(body) ? body : body && (body.countries || body.data || body.items);

    if (!response.ok || !Array.isArray(list)) {
      throw new Error(body && body.error ? messageFrom(body.error) : "讀不到國家清單");
    }

    return list
      .filter((country) => country.iso3)
      .map((country) => ({ iso3: country.iso3, name: chineseNameOf(country) }))
      .sort((a, b) => a.name.localeCompare(b.name, "zh-Hant"));
  }

  function chineseNameOf(country) {
    const name = country.name || {};
    return name.zh || name["zh-Hant"] || name.en || country.iso3;
  }

  /** 一個人的一生。回傳 { life, usage }。 */
  async function fetchLife(params, apiKey) {
    const body = await getFromFirstAvailablePath(["/life"], params, apiKey);
    const life = body.lives && body.lives[0];
    if (!life) throw new Error("答案裡沒有人生資料。");
    return { life, usage: body.usage };
  }

  /** 答案裡人物的位置沒有文件可查，所以幾種可能的位置都試。 */
  function firstPerson(body) {
    if (Array.isArray(body.people) && body.people[0]) return body.people[0];
    if (body.person) return body.person;
    if (Array.isArray(body.results) && body.results[0]) return body.results[0];
    if (body.found === false) return body; // 抽不到符合條件的人，也是正常的答案
    return null;
  }

  /** 今天活著的人。回傳 { person, usage }。 */
  async function fetchPerson(params, apiKey) {
    const body = await getFromFirstAvailablePath(personEndpoints, params, apiKey);
    const person = firstPerson(body);
    if (!person) throw new Error("這次沒有找到符合條件的人。可以放寬條件再試一次。");
    return { person, usage: body.usage };
  }

  App.api = { loadCountries, fetchLife, fetchPerson, describeFailure, buildQuery };
})(window.App = window.App || {});
