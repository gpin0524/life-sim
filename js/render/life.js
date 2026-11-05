/** 「看一個人的一生」的結果畫面。 */
(function (App) {
  "use strict";

  const { create } = App.dom;
  const c = App.components;

  function birthSentence(life, countryName) {
    const year = life.born_year ? `${life.born_year} 年` : "";
    const death = typeof life.age_at_death === "number" ? `活到 ${life.age_at_death} 歲。` : "";
    return `${year}出生於${countryName}，${death}`;
  }

  /** 學歷、孩子、兄弟姊妹等一行摘要；沒有資料的項目就略過。 */
  function summaryLine(life) {
    const parts = [];
    const fifth = life.family_at_birth && life.family_at_birth.family_fifth;
    if (fifth) parts.push(c.householdFifthText(fifth));
    if (life.education) parts.push(`最高學歷：${c.educationName(life.education)}`);
    if (typeof life.children === "number") parts.push(`孩子：${life.children} 個`);
    if (typeof life.siblings === "number") parts.push(`兄弟姊妹：${life.siblings} 個`);
    return parts.length ? create("p", null, parts.join("　·　")) : null;
  }

  function renderLife(life, countryName, usage, container) {
    container.appendChild(
      c.hero(
        create("h2", null, c.personTitle(life.name, life.sex)),
        create("p", null, birthSentence(life, countryName)),
        summaryLine(life)
      )
    );

    if (Array.isArray(life.record) && life.record.length) {
      App.story.renderStory(life.record, container);
    } else {
      container.appendChild(create("p", null, "這次沒有逐年的紀錄。"));
    }

    const usageNode = c.usageLine(usage);
    if (usageNode) container.appendChild(usageNode);
  }

  App.renderLife = renderLife;
})(window.App = window.App || {});
