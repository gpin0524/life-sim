/**
 * 設定與中文文字。
 * 所有「會變動的數字、網址、顯示用文字」集中在這裡，其他檔案不要重複寫。
 */
(function (App) {
  "use strict";

  App.config = {
    apiBase: "https://1in8b.life/api/v1",
    responseLanguage: "zh",
    // 「找一個今天活著的人」的網址沒有查到說明，先試前面的，回 404 再試下一個。
    personEndpoints: ["/person", "/meet"],
    limits: {
      birthYear: { label: "出生年份", min: 1950, max: 2025 },
      age: { label: "年齡", min: 0, max: 76 },
      children: { label: "孩子數", min: 0, max: 20 }
    }
  };

  App.labels = {
    education: {
      none: "沒有受過正式教育",
      primary: "小學",
      lower_secondary: "國中",
      upper_secondary: "高中",
      university: "大學",
      graduate: "研究所"
    },
    sex: { F: "女生", M: "男生" },
    place: { town: "城鎮", village: "鄉村" },
    events: {
      home_phone: "家裡裝了電話",
      mobile_phone: "有了手機",
      home_computer: "家裡有了電腦",
      earthquake: "發生地震",
      storm: "遇到風災",
      economic_crisis: "遇上經濟危機",
      war: "遇上戰爭",
      flood: "遇上水災",
      drought: "遇上乾旱",
      tv: "家裡有了電視",
      electricity: "家裡通了電",
      power_cut: "遇到停電"
    },
    // 人生階段：atMostAge 是這個階段最大的歲數
    lifeStages: [
      { atMostAge: 12, title: "童年（0～12 歲）" },
      { atMostAge: 19, title: "少年時代（13～19 歲）" },
      { atMostAge: 34, title: "青年（20～34 歲）" },
      { atMostAge: 59, title: "壯年（35～59 歲）" },
      { atMostAge: Infinity, title: "晚年（60 歲以後）" }
    ],
    personNotFound: "這次在抽到的幾個人裡，沒有人符合這組條件。這是正常的，因為找人是隨機抽人來比對。可以再按一次，或放寬條件（例如把學歷調低、拿掉工作類別或孩子數）。",
    submitButton: { life: "出生", person: "找人" },
    busyStatus: { life: "出生中…", person: "找人中…（可能要幾秒）" },
    hint: {
      life: "每次「出生」是一個人的一生，約用 1 個人生單位（免費金鑰每月 2000 單位）。每次都是隨機的，再按一次就是另一個人。",
      person: "找人會用較多單位（我試過一次，帶學歷條件用了 20 單位），而免費金鑰每次最多 60 單位，請少按幾次。條件越多，越可能抽不到人，抽不到時也可能用掉單位。"
    },
    disclaimer: {
      life: "這是 1in8b Engine（1in8b.life）模擬的一個人生，不是真實的人。故事裡的事件與數字依真實統計的機率抽出，只是大概，不能用來判斷任何真實的人。",
      person: "這是 1in8b Engine（1in8b.life）模擬的一個人，不是真實的人。數字是依真實統計抽出的，只是大概，不能用來判斷任何真實的人。"
    }
  };
})(window.App = window.App || {});
