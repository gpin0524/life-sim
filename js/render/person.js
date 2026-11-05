/** 「找一個今天活著的人」的結果畫面。 */
(function (App) {
  "use strict";

  const { create, append } = App.dom;
  const { labels, format } = App;
  const c = App.components;

  /** 人物的現況可能包在 state 裡，也可能直接攤在最外層。 */
  function stateOf(person) {
    return person.state || person;
  }

  const isNumber = (value) => typeof value === "number";

  // ---- 上半部：這個人是誰 ----------------------------------------------

  function whereSentence(state) {
    const place = [state.city, labels.place[state.place]].filter(Boolean).join("，");
    const abroad = state.abroad ? "（人在國外）" : "";
    const born = state.born_year ? `出生於 ${state.born_year} 年。` : "";
    return `今年 ${state.age} 歲，住在${place || "這個國家"}${abroad}。${born}`;
  }

  /** 工作狀況不明（欄位不存在）時不下結論。 */
  function workSentence(state) {
    let work = null;
    if (state.in_school) work = "還在讀書";
    else if (state.working === true) work = "在工作" + (state.job_name ? `，是${state.job_name}` : "");
    else if (state.working === false) work = "目前沒有在工作";

    const education = state.education ? `最高學歷：${c.educationName(state.education)}。` : "";
    if (!work && !education) return null;
    return (work ? `${work}。` : "") + education;
  }

  function incomeLines(state) {
    const lines = [];
    if (isNumber(state.income_percentile)) {
      const percent = format.ratioToPercent(state.income_percentile);
      lines.push(`收入大約排在同國家的第 ${percent} 百分位（數字越高越富）。`);
    }
    if (isNumber(state.income_ppp)) {
      lines.push(`收入約 ${c.money(state.income_ppp)}，淨資產約 ${c.money(state.net_worth_ppp)}（購買力平價美元）。`);
    }
    return lines;
  }

  function buildIntroCard(state) {
    const lines = [whereSentence(state), workSentence(state), ...incomeLines(state)].filter(Boolean);
    return c.hero(
      create("h2", null, c.personTitle(state.name, state.sex)),
      ...lines.map((line) => create("p", null, line))
    );
  }

  // ---- 下半部：現在的狀態、家人、大事（沒有資料的區塊整段略過）----------

  const STATUS_BARS = [
    { label: "健康", field: "health" },
    { label: "快樂", field: "happiness" },
    { label: "知識", field: "knowledge" },
    { label: "人際連結", field: "bonds" }
  ];

  function statusSection(state) {
    const bars = STATUS_BARS
      .filter(({ field }) => isNumber(state[field]))
      .map(({ label, field }) => c.barChart(label, state[field] / 100, String(Math.round(state[field]))));
    return bars.length ? [c.sectionTitle("現在的狀態（滿分 100）"), ...bars] : [];
  }

  function partnerLine(state) {
    if (state.partner) {
      const married = state.married ? "（已結婚）" : "";
      return `伴侶：${state.partner.name}，${state.partner.age} 歲${married}`;
    }
    if (typeof state.partnered === "boolean") return state.partnered ? "有伴侶" : "目前沒有伴侶";
    return null;
  }

  function childLines(state) {
    if (Array.isArray(state.kids) && state.kids.length) {
      return state.kids.map((kid) => `孩子：${kid.name}，${kid.age} 歲${kid.alive === false ? "（已過世）" : ""}`);
    }
    if (isNumber(state.children)) {
      return [state.children === 0 ? "沒有孩子" : `孩子：${state.children} 個`];
    }
    if (Array.isArray(state.kids)) return ["沒有孩子"];
    return [];
  }

  function parentLine(title, parent) {
    if (!parent) return null;
    return `${title}：${parent.alive ? `${parent.age} 歲，健在` : "已過世"}`;
  }

  function siblingLine(state) {
    if (Array.isArray(state.siblings)) return `兄弟姊妹：${state.siblings.length} 個`;
    if (isNumber(state.siblings)) return `兄弟姊妹：${state.siblings} 個`;
    return null;
  }

  function familySection(state) {
    const lines = [
      partnerLine(state),
      ...childLines(state),
      parentLine("母親", state.mother),
      parentLine("父親", state.father),
      siblingLine(state),
      state.household ? `同住的家人：共 ${state.household.size} 人` : null
    ].filter(Boolean);
    return lines.length ? [c.sectionTitle("家人"), c.bulletList(lines)] : [];
  }

  function livingFacts(state) {
    const facts = [];
    if (typeof state.home_owned === "boolean") facts.push(state.home_owned ? "自己擁有住所" : "沒有自己的住所");
    if (typeof state.electricity_at_home === "boolean") facts.push(state.electricity_at_home ? "家裡有電" : "家裡沒有電");
    if (state.refugee) facts.push("是難民");
    return facts.length ? create("p", null, facts.join("　·　")) : null;
  }

  function lifeEventsSection(events) {
    if (!Array.isArray(events) || !events.length) return [];
    const lines = events.map((e) => `${e.age} 歲（${e.year} 年）：${labels.events[e.kind] || e.kind}`);
    return [c.sectionTitle("走過的大事"), c.bulletList(lines)];
  }

  function buildDetailsCard(person, state) {
    const birthFamily = person.family_at_birth || state.family_at_birth;
    const fifth = birthFamily && birthFamily.family_fifth;

    const children = [
      ...statusSection(state),
      ...familySection(state),
      livingFacts(state),
      fifth ? create("p", null, `${c.householdFifthText(fifth)}。`) : null,
      ...lifeEventsSection(person.met || state.met)
    ].filter(Boolean);

    return children.length ? c.hero(...children) : null;
  }

  // ---- 原始資料（除錯用）-----------------------------------------------

  /** 可展開的原始答案。欄位對不上時，從這裡能看到引擎實際給了什麼。 */
  function rawDataDetails(person) {
    const details = create("details");
    details.appendChild(create("summary", null, "看原始資料（除錯用）"));
    details.appendChild(create("pre", "raw", JSON.stringify(person, null, 2)));
    return details;
  }

  // ---- 組合 ------------------------------------------------------------

  function renderPerson(person, usage, container) {
    const state = stateOf(person);

    if (person.found === false) {
      append(container,
        c.hero(create("p", null, labels.personNotFound), rawDataDetails(person)),
        c.usageLine(usage));
      return;
    }

    if (!isNumber(state.age)) {
      append(container,
        c.hero(create("p", null, "收到了答案，但裡面沒有預期的欄位（例如年齡），所以無法整理成畫面。"), rawDataDetails(person)),
        c.usageLine(usage));
      return;
    }

    append(container, buildIntroCard(state), buildDetailsCard(person, state));

    if (Array.isArray(person.record) && person.record.length) {
      container.appendChild(c.sectionTitle("過去的故事"));
      App.story.renderStory(person.record, container);
    }

    append(container, rawDataDetails(person), c.usageLine(usage));
  }

  App.renderPerson = renderPerson;
})(window.App = window.App || {});
