/** 「找一個今天活著的人」的結果畫面。 */
(function (App) {
  "use strict";

  const { create, append } = App.dom;
  const { labels, format } = App;
  const c = App.components;

  // ---- 上半部：這個人是誰 ----------------------------------------------

  function whereSentence(state) {
    const place = [state.city, labels.place[state.place]].filter(Boolean).join("，");
    const abroad = state.abroad ? "（人在國外）" : "";
    const born = state.born_year ? `出生於 ${state.born_year} 年。` : "";
    return `今年 ${state.age} 歲，住在${place || "這個國家"}${abroad}。${born}`;
  }

  function workSentence(state) {
    let work;
    if (state.in_school) work = "還在讀書";
    else if (state.working) work = "在工作" + (state.job_name ? `，是${state.job_name}` : "");
    else work = "目前沒有在工作";
    return `${work}。最高學歷：${c.educationName(state.education) || "不明"}。`;
  }

  function incomeLines(state) {
    const lines = [];
    if (typeof state.income_percentile === "number") {
      const percent = format.ratioToPercent(state.income_percentile);
      lines.push(`收入大約排在同國家的第 ${percent} 百分位（數字越高越富）。`);
    }
    if (typeof state.income_ppp === "number") {
      lines.push(`收入約 ${c.money(state.income_ppp)}，淨資產約 ${c.money(state.net_worth_ppp)}（購買力平價美元）。`);
    }
    return lines;
  }

  function buildIntroCard(state) {
    const lines = [whereSentence(state), workSentence(state), ...incomeLines(state)];
    return c.hero(
      create("h2", null, c.personTitle(state.name, state.sex)),
      ...lines.map((line) => create("p", null, line))
    );
  }

  // ---- 下半部：現在的狀態、家人、大事 ----------------------------------

  const STATUS_BARS = [
    { label: "健康", field: "health" },
    { label: "快樂", field: "happiness" },
    { label: "知識", field: "knowledge" },
    { label: "人際連結", field: "bonds" }
  ];

  function statusBars(state) {
    return STATUS_BARS
      .filter(({ field }) => typeof state[field] === "number")
      .map(({ label, field }) => c.barChart(label, state[field] / 100, String(Math.round(state[field]))));
  }

  function partnerLine(state) {
    if (state.partner) {
      const married = state.married ? "（已結婚）" : "";
      return `伴侶：${state.partner.name}，${state.partner.age} 歲${married}`;
    }
    return state.partnered ? "有伴侶" : "目前沒有伴侶";
  }

  function childLines(state) {
    if (!Array.isArray(state.kids) || !state.kids.length) return ["沒有孩子"];
    return state.kids.map((kid) => `孩子：${kid.name}，${kid.age} 歲${kid.alive === false ? "（已過世）" : ""}`);
  }

  function parentLine(title, parent) {
    if (!parent) return null;
    return `${title}：${parent.alive ? `${parent.age} 歲，健在` : "已過世"}`;
  }

  function familyLines(state) {
    return [
      partnerLine(state),
      ...childLines(state),
      parentLine("母親", state.mother),
      parentLine("父親", state.father),
      Array.isArray(state.siblings) ? `兄弟姊妹：${state.siblings.length} 個` : null,
      state.household ? `同住的家人：共 ${state.household.size} 人` : null
    ].filter(Boolean);
  }

  function livingFacts(state) {
    const facts = [];
    if (typeof state.home_owned === "boolean") facts.push(state.home_owned ? "自己擁有住所" : "沒有自己的住所");
    if (typeof state.electricity_at_home === "boolean") facts.push(state.electricity_at_home ? "家裡有電" : "家裡沒有電");
    if (state.refugee) facts.push("是難民");
    return facts.length ? create("p", null, facts.join("　·　")) : null;
  }

  function lifeEvents(events) {
    if (!Array.isArray(events) || !events.length) return [];
    const lines = events.map((e) => `${e.age} 歲（${e.year} 年）：${labels.events[e.kind] || e.kind}`);
    return [c.sectionTitle("走過的大事"), c.bulletList(lines)];
  }

  function buildDetailsCard(person) {
    const state = person.state || {};
    const fifth = person.family_at_birth && person.family_at_birth.family_fifth;

    return c.hero(
      c.sectionTitle("現在的狀態（滿分 100）"),
      ...statusBars(state),
      c.sectionTitle("家人"),
      c.bulletList(familyLines(state)),
      livingFacts(state),
      fifth ? create("p", null, `${c.householdFifthText(fifth)}。`) : null,
      ...lifeEvents(person.met)
    );
  }

  // ---- 組合 ------------------------------------------------------------

  function renderPerson(person, usage, container) {
    const state = person.state || {};
    append(container, buildIntroCard(state), buildDetailsCard(person));

    if (Array.isArray(person.record) && person.record.length) {
      container.appendChild(c.sectionTitle("過去的故事"));
      App.story.renderStory(person.record, container);
    }

    append(container, c.usageLine(usage));
  }

  App.renderPerson = renderPerson;
})(window.App = window.App || {});
