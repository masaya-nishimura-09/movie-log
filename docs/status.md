# 映画記録アプリ フロントエンド ステータス

最終更新: 2026-08-20

このドキュメントは、フロントエンド基盤の決定事項と未決事項を管理する作業用ドキュメント。
決定したものは「確定事項」へ移し、決定の理由も併せて残す。

---

## 現状

`create-next-app` 直後の素の状態。画面の実装は未着手。

| 項目 | 内容 |
| --- | --- |
| フレームワーク | Next.js 16.3.1（App Router） |
| ランタイム | React 19.2.8 |
| 言語 | TypeScript 5 |
| スタイリング | Tailwind CSS v4（PostCSS 経由） |
| Lint / Format | Biome 2.4.2 |
| パッケージマネージャ | pnpm 11.22.0 |
| ディレクトリ | `src/app/` に `layout.tsx` / `page.tsx` / `globals.css` のみ |

デザインは別途進行中のため、本ドキュメントでは扱わない。

---

## 前提：バックエンド API

リポジトリ: `../movie-log-api`（Go + Gin + GORM + PostgreSQL）
要件の詳細は `../movie-log-api/docs/requirements.md` を参照。

### エンドポイント

| メソッド | パス | 認証 | 概要 |
| --- | --- | --- | --- |
| POST | `/users/register` | 不要 | ユーザー登録 |
| POST | `/auth/login` | 不要 | ログイン。レート制限 5回/分 |
| POST | `/auth/refresh` | 不要 | トークン再発行。レート制限 5回/分 |
| POST | `/auth/logout` | 不要 | リフレッシュトークンの失効 |
| PUT | `/users/` | 必要 | ユーザー更新 |
| DELETE | `/users/` | 必要 | ユーザー削除 |
| POST | `/records/` | 必要 | 視聴記録の作成 |
| GET | `/records/` | 必要 | 視聴記録の一覧 |
| GET | `/records/:id` | 必要 | 視聴記録の取得 |
| PUT | `/records/:id` | 必要 | 視聴記録の更新 |
| DELETE | `/records/:id` | 必要 | 視聴記録の削除 |

### 契約

- 認証は `Authorization` ヘッダの Bearer トークン
- ログイン・リフレッシュは `{ access_token, refresh_token }` を **JSON ボディで返す**（Cookie ではない）
- レスポンスのフィールドは **snake_case**
- 記録 ID は `record_id` として **文字列** で返る（Go 側で `strconv.FormatUint` している）
- 日時は UTC の RFC3339
- 一覧は `{ records: [...] }` でラップされる。**ページネーション・絞り込み・並び替えは無い**
- エラーは `{ code, message }` の固定形式。`code` は `INVALID_INPUT` / `INVALID_ACCESS_TOKEN` / `INVALID_REFRESH_TOKEN` / `INVALID_CREDENTIALS` / `UNAUTHENTICATED` / `USER_NOT_FOUND` / `RECORD_NOT_FOUND` / `USER_ALREADY_EXISTS` / `INTERNAL_SERVER_ERROR`

### enum（バックエンドに定義済み。取得用 API は無い）

| 種別 | 個数 |
| --- | --- |
| Genre | 19 |
| MoodTag | 18 |
| Platform | 30 |
| CreditRole | 5（監督 / 脚本 / 撮影 / 音楽 / キャスト） |

---

## 確定事項

（まだ無い。決まり次第ここへ移す）

---

## 未決の論点

### A. 開発ツール

| 論点 | 状態 | 選択肢・メモ |
| --- | --- | --- |
| A-1 Biome のルール厳格度 | 未決 | 現状は `recommended` のみ。`complexity` / `suspicious` / `nursery` の追加、`noExplicitAny` などの個別強化をどこまでやるか |
| A-2 Biome のフォーマット規約 | 未決 | 現状は space / 幅2 のみ指定。行幅、クォート、セミコロン、trailing comma を明示するか |
| A-3 tsconfig の強化 | 未決 | `noUncheckedIndexedAccess` / `exactOptionalPropertyTypes` / `noImplicitOverride` / `verbatimModuleSyntax` を入れるか。`target` を ES2017 から上げるか |
| A-4 テスト | 未決 | 単体（Vitest + Testing Library）と E2E（Playwright）をどこまで導入するか。学習目的としてどこに時間を使うか |
| A-5 Git hooks / CI | 未決 | commit 前の lint・型チェック（lefthook / husky）、GitHub Actions の要否 |
| A-6 環境変数 | 未決 | API のベース URL の持ち方。`NEXT_PUBLIC_` を使うか（=クライアントに露出させるか）は E の結論に依存 |

### B. ディレクトリ構成

| 論点 | 状態 | 選択肢・メモ |
| --- | --- | --- |
| B-1 Atomic Design を採用するか | 未決 | atoms / molecules / organisms / templates / pages の5層。App Router の `app/` が pages・templates の役割を持つため、そのまま当てると層が重複する |
| B-2 採用する場合の App Router との噛み合わせ | 未決 | `app/` はルーティングとデータ取得のみに限定し、UI は `components/` 配下に Atomic 層を置く、など |
| B-3 機能単位で切るか | 未決 | Atomic Design（見た目の粒度）と feature 単位（`features/record/` など、関心事の単位）は排他ではない。併用するか片方にするか |
| B-4 命名規則 | 未決 | ファイル名（kebab-case / PascalCase）、ディレクトリ名、コンポーネントの export 形式（named / default） |
| B-5 import パス | 未決 | `@/*` エイリアスは設定済み。相対パスとの使い分けを決めるか |

### C. 型と API 通信

| 論点 | 状態 | 選択肢・メモ |
| --- | --- | --- |
| C-1 型定義の作り方 | 未決 | 1. 手書き 2. バックエンドに OpenAPI 定義を追加して生成（`openapi-typescript` 等） 3. zod スキーマを正としてそこから型を導出。バックエンドは現状 OpenAPI 定義を持たないため、2 は API 側の作業が必要 |
| C-2 実行時バリデーション | 未決 | API レスポンスを zod 等で検証するか、型アサーションで済ませるか。「型は嘘をつきうる」問題への態度を決める |
| C-3 命名の変換 | 未決 | API は snake_case、TS の慣習は camelCase。1. 変換層を挟む 2. snake_case のまま使う 3. 生成時に変換。変換するなら境界をどこに置くか |
| C-4 enum の同期 | 未決 | Genre / MoodTag / Platform / CreditRole をフロントに持つ必要がある。1. 手で写す 2. 取得 API をバックエンドに追加 3. 生成。「二重管理をどう扱うか」が論点 |
| C-5 入力バリデーション | 未決 | 入力ルールはバックエンドが持つ（タイトル255文字、公開年1888〜現在+5、スコア1〜5 など）。フロントで再実装するか、サーバのエラーに任せるか、どこまで二重化するか |
| C-6 fetch ラッパ | 未決 | 素の `fetch` を薄く包むか、ライブラリを使うか。ベース URL・認証ヘッダ・エラー正規化・リトライの責務をどこに置くか |
| C-7 エラーの型と扱い | 未決 | `{ code, message }` を型付きの例外にするか、Result 型で返すか。UI へどう伝えるか |
| C-8 `record_id` の扱い | 未決 | API は文字列で返す。フロントの型を string にするか number にするか |

### D. 状態とデータ取得

| 論点 | 状態 | 選択肢・メモ |
| --- | --- | --- |
| D-1 Server / Client Components の使い分け方針 | 未決 | 既定を Server にして、対話が必要な葉だけ Client にする方針を取るか。E の結論（トークンの置き場所）に強く依存する |
| D-2 データ取得の置き場 | 未決 | Server Components から直接取得、Route Handler 経由、Client からの取得。混在させる場合の基準 |
| D-3 キャッシュと再検証 | 未決 | Next.js のキャッシュをどう使うか。作成・更新・削除後の再検証手段（`revalidatePath` / `revalidateTag` / クライアント側の再取得） |
| D-4 変更操作の方式 | 未決 | Server Actions を使うか、Route Handler + fetch にするか |
| D-5 フォーム | 未決 | 記録の作成・編集は項目が多い（映画情報 + 視聴情報 + クレジットの可変長リスト）。React Hook Form 等を使うか、`useActionState` で素朴に組むか |
| D-6 クライアント状態管理 | 未決 | サーバ状態が主体で、クライアント固有の状態は少ない見込み。ライブラリ（TanStack Query / Zustand 等）が要るかどうか |

### E. 認証と通信経路（最上流）

B・C・D の形を規定するため、ここから決める。

| 論点 | 状態 | 選択肢・メモ |
| --- | --- | --- |
| E-1 トークンの保管場所 | 未決 | 1. httpOnly Cookie に入れ、Next.js を BFF として API を中継する 2. クライアント（localStorage / メモリ）に保持し、ブラウザから API を直接叩く。XSS 耐性・Server Components からの参照可否・実装量のトレードオフ |
| E-2 CORS | 未決 | **バックエンドに CORS ミドルウェアが無い**。2 を選ぶならバックエンドに CORS 対応の追加が必要。1 なら通信がサーバ間になるため不要 |
| E-3 ルート保護 | 未決 | middleware で未認証を弾くか、レイアウトやページ側で判定するか |
| E-4 リフレッシュ戦略 | 未決 | 401 を受けてから再発行するか、期限を見て先回りするか。同時多発リクエスト時の重複リフレッシュをどう防ぐか |
| E-5 ログアウト | 未決 | `/auth/logout` にリフレッシュトークンを渡す必要がある。保管場所の決定に従って経路が決まる |

### F. UI 基盤

| 論点 | 状態 | 選択肢・メモ |
| --- | --- | --- |
| F-1 デザイントークン | 未決 | Tailwind v4 の `@theme` に色・タイポグラフィ・余白をどう定義するか。デザインが別途進行中のため、確定はその成果物に合わせる |
| F-2 UI ライブラリ | 未決 | 素の Tailwind のみか、shadcn/ui 等を入れるか。学習目的との兼ね合い |
| F-3 アイコン | 未決 | ライブラリを使うか、SVG を直接置くか |
| F-4 フォント | 未決 | 現状は Geist（`create-next-app` の既定）。日本語フォントの扱いを決める必要がある |
| F-5 ダークモード | 未決 | 現状 `globals.css` は `prefers-color-scheme` のみ。手動切り替えを持たせるか |
| F-6 レスポンシブ方針 | 未決 | 将来 Flutter でスマホアプリを作る計画があるため、Web をどこまでモバイル対応させるか |

---

## バックエンドへの申し送り（フロント都合で発生しうる変更）

| 項目 | 状態 | 内容 |
| --- | --- | --- |
| CORS 対応 | 未決 | E-1 でクライアント直接通信を選んだ場合に必要 |
| enum 取得 API | 未決 | C-4 で API 経由の同期を選んだ場合に必要 |
| OpenAPI 定義 | 未決 | C-1 で型生成を選んだ場合に必要 |
| 一覧のページネーション・絞り込み | 未決 | 記録が増えた場合に必要。MVP の範囲外 |

---

## 次のステップ

1. E（認証と通信経路）を決める
2. E の結論を踏まえて B・C・D を決める
3. A・F を決める
4. 確定したものを「確定事項」へ移し、実装に着手する
