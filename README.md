# 一個人的一生（1in8b Engine）

用瀏覽器直接打開 `index.html` 就能用，不需要安裝任何東西。
資料來自 [1in8b Engine](https://1in8b.life/en/api/)，需要自己的 API 金鑰（`k8b_` 開頭，只在頁面開著時使用，不會被儲存）。

## 檔案結構

```
index.html            頁面骨架（只有結構，沒有樣式與程式）
css/style.css         所有樣式，依區塊分段
js/
  config.js           網址、數字上限、全部中文文字（要改字從這裡改）
  dom.js              建立／操作網頁元素的小工具
  format.js           金額、百分比的顯示格式
  validation.js       檢查使用者輸入，不合格就丟出中文錯誤訊息
  api.js              只負責跟 1in8b 的網路請求，不碰畫面
  ui.js               錯誤、狀態、模式切換的顯示控制
  form.js             讀取表單，整理成 API 參數
  render/
    components.js     共用小元件（卡片、長條圖、清單、用量）
    story.js          逐年故事（分組、分階段、決定的標示）
    life.js           「看一個人的一生」的結果畫面
    person.js         「找一個今天活著的人」的結果畫面
  app.js              主程式：把表單、API、畫面接起來
```

## 設計原則

- **一個檔案只做一件事**：網路、輸入檢查、畫面各自獨立，改其中一個不必動其他的。
- **依賴往下流**：`app.js` → `form / api / ui / render` → `config / dom / format`。
- **沒有全域變數亂跑**：所有東西掛在一個 `App` 物件下，每個檔案用函式包起來。
- **文字與設定集中**：中文標籤、網址、範圍都在 `config.js`。
- **兩種模式共用同一個流程**：`app.js` 裡的 `MODES` 表描述「怎麼讀參數、怎麼呼叫、怎麼顯示」，要加第三種模式只要加一項。
- **不用 ES module**：用一般的 `<script>`，這樣直接用瀏覽器開本機檔案（`file://`）也能執行。`index.html` 裡 script 的順序有相依性，請勿調換。

## 常見修改

| 想做的事 | 改哪裡 |
|---|---|
| 改任何中文文字、提示、免責聲明 | `js/config.js` |
| 改年份、年齡等範圍 | `js/config.js` 的 `limits`，以及 `index.html` 對應欄位的 `min`／`max` |
| 改顏色、版面 | `css/style.css` |
| 加新的篩選欄位 | `index.html` 加欄位 → `js/form.js` 讀值 |
| 改結果的呈現 | `js/render/` 底下對應的檔案 |
| 「找人」網址不對 | `js/config.js` 的 `personEndpoints` |
