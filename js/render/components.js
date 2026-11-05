/** 好幾個畫面都會用到的小元件。 */
(function (App) {
  "use strict";

  const { create, append } = App.dom;
  const { labels, format } = App;

  /** 人物卡片外框。 */
  function hero(...children) {
    return append(create("div", "hero"), ...children);
  }

  function sectionTitle(text) {
    return create("div", "sec", text);
  }

  /** 例：「鄧梓涵（女生）」。 */
  function personTitle(name, sexCode) {
    const gender = labels.sex[sexCode];
    return (name || "這個人") + (gender ? `（${gender}）` : "");
  }

  function bulletList(lines) {
    const list = create("ul", "plain");
    lines.forEach((line) => list.appendChild(create("li", null, line)));
    return list;
  }

  /** 長條圖。ratio 是 0 到 1。寬度稍後才設定，這樣才有動畫。 */
  function barChart(label, ratio, valueText) {
    const clamped = Math.max(0, Math.min(1, Number(ratio) || 0));
    const fill = create("div", "fill");
    setTimeout(() => { fill.style.width = `${clamped * 100}%`; }, 30);

    const top = append(create("div", "top"), create("span", null, label), create("span", null, valueText));
    return append(create("div", "bar"), top, append(create("div", "track"), fill));
  }

  /** 「本月已使用 83 / 2000 個人生單位（這次用了 20）。」 */
  function usageLine(usage) {
    if (!usage || typeof usage.used !== "number") return null;
    let text = `本月已使用 ${usage.used} / ${usage.quota || "?"} 個人生單位`;
    if (typeof usage.this_call === "number") text += `（這次用了 ${usage.this_call}）`;
    return create("div", "usage", `${text}。`);
  }

  function educationName(code) {
    return labels.education[code] || code;
  }

  function householdFifthText(fifth) {
    return `出生時家境：第 ${fifth} 組（1 最低、5 最高）`;
  }

  App.components = {
    hero, sectionTitle, personTitle, bulletList, barChart, usageLine,
    educationName, householdFifthText, money: format.money
  };
})(window.App = window.App || {});
