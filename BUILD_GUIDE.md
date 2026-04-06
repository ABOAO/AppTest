# AppTest 打包安裝指南

## 1) Android / iOS（Expo 專案）
目錄：`android/`

### 先決條件
- Node.js 18+
- Expo 帳號
- `eas-cli`（已放在 `devDependencies`）

### 安裝依賴
```bash
cd android
npm install
```

### Android
- 產出 APK（可直接安裝測試）
```bash
npm run build:android:apk
```
- 產出 AAB（上架 Play Store）
```bash
npm run build:android:aab
```

### iOS
- 產出 Simulator 版（開發測試）
```bash
npm run build:ios:sim
```
- 產出 IPA（上架/TestFlight）
```bash
npm run build:ios:ipa
```

> `eas.json` 已建立好 development / preview / production profiles，可直接用。

---

## 2) iOS 原生專案（Xcode 專案）
目錄：`IOS/pwnagotchi.app-master/`

### 先決條件
- Xcode 15+
- 已設定 Apple Team 與簽章
- 先把 `scripts/exportOptions.plist` 的 `YOUR_TEAM_ID` 換成你的 Team ID

### 一鍵打包 IPA
```bash
cd IOS/pwnagotchi.app-master
./scripts/build_ios_release.sh
```

輸出位置：
- Archive: `build/ios-pwnagotchi.xcarchive`
- Export: `build/export/`
