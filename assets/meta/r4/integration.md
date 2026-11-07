# R4 素材接入說明

## 入口與識別碼

以 `assets/manifest.json` 作載入清單，`metadata/catalog.json` 提供完整用途、狀態、來源、錨點與 SHA-256。保留原包全部識別碼；新的正式關卡、人物性別與事件以新增 ID 提供。CSV 適合逐項審查，JSON 適合接入。

`assets/` 是標準尺寸，每個 ID 各有一個 PNG；`masters/` 是選定原生 PNG，完全相同的原生檔案依 SHA-256 共用一份母圖，請依 catalog 的 `master` 欄位取用。既有 ID 的標準尺寸不變，原生像素不變。新圖匯出只做 alpha 邊界裁切、等比縮放與裝框，不改色或以程式重繪。角色建議依可見高度 60 世界像素與腳底錨點 `[0.5,0.95]` 渲染，避免透明留白造成角色身高不一。

## 乩童與三昧真火

角色主圖為 `player_jitong_male`、`player_jitong_female`；青年投擲與收勢沿用 `player_tangki_throw`、`player_tangki_recoil`，少女新增同名尾碼 `_throw`、`_recoil`。待機主圖拿實心圓紙標，動作幀與飛行物分開。

去程、回程分別用 `proj_angbiao_throw`、`proj_angbiao_return`。兩者共用同一紙標原圖，回程靠遊戲旋轉及路徑變換，不算兩張新設計。其相容來源 `proj_angbiao_spear` 的舊 ID 雖含 spear，實際像素就是紙標，不代表本版仍使用槍。

軌跡採弧線去程與迴力鏢式回程。沿完整往返路徑逐段產生火焰；每段從自己的生成時間計時，初始 0.5 秒後消失。`fx_sanmei_ignite`、`fx_sanmei_sustain`、`fx_sanmei_extinguish` 分別供起燃、持續與熄滅使用。升級延長留火，但 `duration_increment_by_level`、`dot_damage_per_tick`、`tick_interval_seconds` 都是 `null`，不得把預覽頁的播放速度當作遊戲平衡數值。

`angbiao-preview.html` 可離線查看弧線往返與火帶存續。滑桿調整的是視覺檢視時間，不是已定案的等級曲線。精確契約見 `metadata/tangki-fire-contract.json`。

## 場景與圖層

正式場景名單見 `metadata/stages.json`。舊 `stage_dadaocheng_scene` 與新增 `stage_zhongyuan_scene` 均採 1536×1024，保留燈篙頂與供桌的完整構圖；兩者共用原生圖，不重算新圖。顯示於其他寬高比時請等比完整置入，避免裁掉畫面上下方的關鍵物件。

場景底圖、地面 tile、碰撞物件、事件道具與戰鬥效果分開。王船燃燒、橋段崩落等是狀態圖；玩法的倒數、碰撞區與事件時間由程式控制。地面 tile 提供材質塊，但未宣稱已通過引擎無縫鋪排測試。

`fx_darkness_mask` 是暗視野霧邊：中央透明，四角不完全不透明。保留整張 512×512 畫布，不可依內容裁切。需要完全遮黑時，遊戲先建立外圍黑色遮罩並挖出玩家視窗，再疊此霧邊；單張 PNG 不能取代完整遮罩。

標準輸出與透明素材採 straight-alpha RGBA；原生實心背景亦可為 RGB。部分原生圖的 alpha=0 區域仍有 RGB 顏色，應依 alpha 合成；檢視器顯示的背景色不等於實際可見光暈。

## 名稱、別名與候選狀態

原九條法器線的 63 個名稱依背景定案表完整保留，包括原文鎖定字形「関嶺鼎」。尪仔標七個名稱是本輪依同一台灣地名規則編製，狀態為 `proposed_current_names`。舊塔層數組圖保留為相容項目，正式塔線主圖已改為台灣燈塔意象。

角色預設、心魔與天魔對照見 `class-roster.json`，保生藥師預設少女。靈獸縮圖與中首領共用時明示 alias；鏡界中首領可依本世隊伍前幾隻靈獸動態映射，不限定三個固定預設。

候選偶師、舊補充靈獸、未來除夕年獸及五個補充地景不等於正式新增職業／關卡。保留狀態欄供接入端選用。

## 驗證界線

本包驗證實際檔案、PNG 解碼、標準尺寸、透明通道、SHA-256、別名、需求對照與預覽頁靜態資源。動作軌跡與 0.5 秒火焰存續另以數值測試檢查。未取得遊戲原始碼，因此未聲稱完成遊戲程式更新、碰撞測試、戰鬥平衡或瀏覽器實際遊玩測試。
