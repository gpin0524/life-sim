/**
 * 把逐年紀錄 [[年齡, 句子, 註解?], ...] 變成一段一段的故事。
 * groupByAge、stageIndexFor、isDecision 是不碰畫面的純函式，方便單獨測試。
 */
(function (App) {
  "use strict";

  const { create, append } = App.dom;
  const { lifeStages } = App.labels;

  const DECISION_PATTERN = /^(Decision|決定|决定|抉擇)\s*[:：]/;

  /** 同一歲的句子放在一起。 */
  function groupByAge(record) {
    const groups = [];
    record.forEach((entry) => {
      if (!Array.isArray(entry)) return;
      const [age, text, note] = entry;
      const last = groups[groups.length - 1];
      if (last && last.age === age) {
        last.items.push({ text, note });
      } else {
        groups.push({ age, items: [{ text, note }] });
      }
    });
    return groups;
  }

  function stageIndexFor(age) {
    const index = lifeStages.findIndex((stage) => age <= stage.atMostAge);
    return index === -1 ? lifeStages.length - 1 : index;
  }

  function isDecision(text) {
    return DECISION_PATTERN.test(text || "");
  }

  function ageLabel(age) {
    return age === 0 ? "出生" : `${age} 歲`;
  }

  function renderItem({ text, note }) {
    const nodes = [create("p", isDecision(text) ? "decision" : "", text)];
    if (note) nodes.push(create("p", "note", `註：${note}`));
    return nodes;
  }

  function renderAgeRow(group) {
    const items = group.items.flatMap(renderItem);
    return append(create("div", "age"), create("div", "n", ageLabel(group.age)), append(create("div"), ...items));
  }

  function renderStage(stageIndex) {
    const section = create("section", "stage");
    section.appendChild(create("h3", null, lifeStages[stageIndex].title));
    return section;
  }

  /** 依人生階段分段，把整個故事放進 container。 */
  function renderStory(record, container) {
    let currentStage = -1;
    let stageElement = null;

    groupByAge(record).forEach((group) => {
      const stageIndex = stageIndexFor(group.age);
      if (stageIndex !== currentStage) {
        currentStage = stageIndex;
        stageElement = renderStage(stageIndex);
        container.appendChild(stageElement);
      }
      stageElement.appendChild(renderAgeRow(group));
    });
  }

  App.story = { renderStory, groupByAge, stageIndexFor, isDecision };
})(window.App = window.App || {});
