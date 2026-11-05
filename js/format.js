/** 把數字整理成顯示用的文字。 */
(function (App) {
  "use strict";

  /** 46122 -> "$46,122"；不是數字就回傳空字串。 */
  function money(amount) {
    if (typeof amount !== "number") return "";
    return "$" + Math.round(amount).toLocaleString("en-US");
  }

  /** 0.404 -> 40 */
  function ratioToPercent(ratio) {
    return Math.round(Number(ratio) * 100);
  }

  App.format = { money, ratioToPercent };
})(window.App = window.App || {});
