# assets/

遊戲用美術（v0.73 起為 Dong 的 **v0.72 美術整合包 R1** kundao-art-v072-complete，2026-11-06）：`manifest.json` 為主清單，437 項 ID，每項有執行尺寸 PNG（`file`）與 2 倍版（`file2x`／`hires`，`*@2x.png`），共 874 張。原 v0.69 包的 391 項 ID 與尺寸全部保留但全部重新輸出（材質與輪廓統整），新增 46 項（狀態圖示、五營兵、接地陰影、脈衝環、陰陽斬擊與火球、三枚劍潭靈獸招式圖示、塔陰陽相容圖、陰陽升級卡、新地形物件、備用特效）。除 title_logo.png 與 title_logo@2x.png 之外，所有檔案與 `meta/SHA256SUMS-art-pack-v072r1.txt` 逐一相符，匯入時未壓縮、未改圖；這兩張依 Dong 指示（v0.73a）換回 v0.69 包的毛筆字標題（與 meta/v069/sha256.txt 相符），R1 包的細體排版標題不採用；另 fx_vein 與 fx_vein_01 到 03（含 @2x，共 8 張）依 Dong 指示（v0.74）改用 Dong 提供的參考圖裁切重製，R1 包的平面龍脈不採用；fx_hit_pop 與 fx_spark（含 @2x，共 4 張）依 Dong 指示（v0.74）換回 v0.69 包的星芒小圖，R1 包的版本與 fx_fu_boom 相同；v0.75 另以 Dong 的透明素材表整組取代塔 27 張（含相容 3 張）、封印 4 張、筊杯 3 張、符爆 3 張，並從構想圖裁切五行徽章 5 張（新 ID）。v0.85 起基準改為 Dong 的 R2 單張素材包（assets/meta/r2，611 ID）：R2 重製的 54 項採用、Dong 已定案的覆蓋不動、藥師改 R2 少女、八位神明接進降駕；新增 174 項的 @2x 由 R2 master 重取樣，未接線的 166 項列在 inline-exclude.json 的 R2 分組；meta/overrides.csv 改以 meta/SHA256SUMS-art-pack-r2.txt 為基準。v0.76 曾以構想圖裁切取代 33 項攻擊與地圖效果（投射物、區域、法器視覺、升階）與 player_yao（保生藥師），印線圖示換回 v0.62 包、封印特效改透明內底。所有與 R1 包不同的檔案列在 meta/overrides.csv（含來源）。v0.79 起衍生素材（85 項）全彩輸出、執行檔存 WebP（品質 92、alpha 無損）、@2x 維持 PNG，不再做調色盤量化；鏡光束三張為程式生成。

| 路徑 | 內容 |
| --- | --- |
| *.png | 執行尺寸與 @2x PNG（遊戲只載入執行尺寸；@2x 供 Retina 或日後使用） |
| manifest.json | 主清單：id、file、w、h、file2x／hires、master（指向包內 artwork/，不在 repo）、anchor（腳底或底部錨點比例）、contentBounds（透明範圍）、部分有 nineSlice |
| inline-exclude.json | 內嵌版不嵌入的 ID 清單（分組附原因）；build.js 讀取。接上鉤子後從這裡移除 |
| meta/ | R1 包附帶資料：README-art-pack-v072r1.md、SHA256SUMS-art-pack-v072r1.txt、catalog.json（素材目錄）、asset-changes.csv／json（逐項來源與方法）、asset-validation.json、browser-validation.json、gameplay-source-check.json、pagoda-levels.json、proportion-and-render.json（比例與渲染假設）、node-validation.txt |
| meta/v069/ | v0.69 包的對照表（polarity-map、pagoda-levels、map-effect-replacements、ui-usage、asset-changes、reference-coverage、validation-report、sha256）與包的 README，供查閱 |
| art-catalog.json、phase2-art.json、weapon-routes.json、trial-stages.json、mirror-map.json、ui-icons.json | v0.62 包（kundao-v050-art）附帶的舊對照表，保留供查閱，以 manifest.json 為準 |

不進 repo、由 Dong 另行保管：工作主圖 artwork/（437 張，96 MB）、參考來源 reference-only/（只有連結，禁止當貼圖）。檢視圖 previews/ 放在 docs/art-previews-v072r1/，素材總覽頁放在 repo 根目錄 art-gallery.html（與 assets/ 同目錄直接開）。

遊戲啟動時讀 `manifest.json`，載到的素材由 src/18-assets-manifest-json.js 的渲染器畫出；`node tools/validate-assets.js` 檢查缺檔與尺寸（含 @2x）。命名規則：陰陽版本 `<id>_yang`／`<id>_yin`，塔 `fx_ta_pillar_<1到9>[_yang|_yin]`，照規則命名的新圖不用改程式就會被 `sprPol`／`sprTa` 選到。
