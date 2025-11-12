# PDF.js サンプル使用方法

## セットアップ

1. 依存パッケージはすでにインストール済みです（pdfjs-dist）

2. `public`フォルダにサンプルPDFファイルを配置してください：
   ```
   public/sample.pdf
   ```

## 使い方

### 1. 開発サーバーを起動
```bash
pnpm dev
```

### 2. ブラウザでアクセス
http://localhost:3000

## 主な機能

- ✅ PDFファイルの表示
- ✅ ページネーション（前へ/次へ）
- ✅ ページ番号の表示
- ✅ レスポンシブデザイン
- ✅ エラーハンドリング

## カスタマイズ

### 異なるPDFを表示する場合

`app/page.tsx`で以下のようにURLを変更：

```tsx
<PdfViewer pdfUrl="/your-pdf-file.pdf" />
```

または外部URLも使用可能：

```tsx
<PdfViewer pdfUrl="https://example.com/document.pdf" />
```

### 拡大率を変更する場合

`app/components/PdfViewer.tsx`の`scale`パラメータを変更：

```tsx
const viewport = page.getViewport({ scale: 1.5 }); // 1.5を変更
```

## テスト用PDFの生成

テスト用のPDFが必要な場合は、以下のサイトから無料でダウンロードできます：
- https://pdfobject.com/pdf/sample.pdf
- https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf
