# 映画記録アプリ フロントエンド ステータス

最終更新: 2026-08-20

このドキュメントは、フロントエンド基盤の決定事項と未決事項を管理する作業用ドキュメント。
書くのは未決のものと、決めたがまだ反映されていないものだけ。済んだものは削除する。

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
| テスト（単体） | Vitest（未導入） |
| テスト（E2E） | Cypress（未導入） |
| パッケージマネージャ | pnpm 11.22.0 |
| ディレクトリ | `src/app/` に `layout.tsx` / `page.tsx`、`src/styles/` に `globals.css` |

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

## 決定済み・未実装

- 認証は BFF 方式。ブラウザは Next.js としか通信せず、Next.js のサーバが Go API を中継する。
  トークンは httpOnly Cookie に入れ、`refresh_token` は `path` を `/api/auth` に限定する。
  Cookie をセットするのはログインと再発行の Route Handler。
- ログアウトは Next.js 側で Cookie から `refresh_token` を読んで Go の `/auth/logout` に渡し、両方の Cookie を削除する。
  削除時はセット時と同じ `path` を指定しないと消えない（`refresh_token` は `/api/auth`）。
- ルート保護とトークンの再発行は `src/proxy.ts` に一本化する（Next.js 16 では middleware は proxy に改称）。
  Cookie は Server Component では書き換えられず、Proxy なら書けるため。未認証は `/login` へリダイレクトする。
  Go API を呼ぶラッパ関数は Cookie を読んで `Authorization` ヘッダを付けるだけで、認証の判定はしない。
  実際の認可は Go API の JWT ミドルウェアが持つので、Proxy が唯一の防御にはならない。
- Go API のベース URL は環境変数 `API_BASE_URL` で持つ。`NEXT_PUBLIC_` は付けない。
  BFF なのでブラウザから呼ぶことがなく、公開するとクライアントから直接叩く実装を誘発するため。
  実値は `.env.local`、雛形は `.env.example` としてコミットする。
- API の型は手書きせず、zod スキーマを書いて `z.infer` で導出する。レスポンスは `parse` で実行時に検証する。
  TypeScript の型はビルドで消えるため、手書きの型では API の変更に気づけないため。
- API の形（snake_case）と画面が使う形（camelCase）を分け、境界層で変換する。
  画面は API の存在を知らない状態にして、API が変わったときに直す範囲を境界層だけに閉じる。
- Go 側のような項目ごとの値オブジェクトやドメイン層はフロントに作らない。
  不変条件を守るのはサーバの責務で、フロントに同じものを置くと二重管理になるため。
- enum（Genre / MoodTag / Platform / CreditRole）のコード一覧は zod スキーマとして手で写す。
  Go 側の値は英語の snake_case（`action`、`science_fiction`）で、表示ラベルは Go に無くフロントで持つしかない。
  そのラベルの対応表をどのみち作るため、コード一覧を API で取る利点が小さい。
  写し忘れは、未知の値が返ってきた時点で `parse` が失敗するので気づける。
- 多言語対応は翻訳ライブラリを入れず、Next.js 標準の方式で組む（`app/[lang]/` と辞書 JSON、`getDictionary()`）。
  対応言語は日本語と英語。言語の追加が JSON を1枚足すだけで済む形にする。
  英語も含め、表示文字列はすべて辞書から引き、直書きしない。enum のラベルも辞書に入れる。
  辞書のキーは単語ではなく意味・文脈で切る。重複を嫌ってまとめると、文脈ごとの訳し分けができなくなるため。
  ロケールの判定とリダイレクトは Proxy に置く（認証の Proxy と同じファイルに収まる）。
  ロケールを取る `next/root-params` は Server Component でしか使えないので、Client Component へは props で渡す。
- `record_id` は API が返す文字列のまま扱い、数値に変換しない。
  ID は計算に使わず、JavaScript の数値は 2^53 までしか正確に扱えないため。Go 側が文字列化しているのもその配慮と見られる。
- API のエラーは、取得系（一覧・詳細）では throw して `error.tsx` に拾わせ、`RECORD_NOT_FOUND` は `notFound()` で 404 画面へ送る。
  変更系（フォーム送信）は throw せず戻り値として返す。入力内容を保ったまま、該当の入力欄にエラーを出すため。
  `INVALID_ACCESS_TOKEN` はエラー画面ではなくログイン画面へリダイレクトする（Proxy をすり抜けた場合の受け皿）。
- エラーの `code` は Go 側の9種類だけを許すユニオン型にする。綴りの誤りや対応漏れをコンパイラが検出できるため。
- 変更系の戻り値は判別可能ユニオンにする。`success` と `data` が独立した形だと、成功時でも `data` の有無を
  毎回確認することになるため（kitchen-log の `AppActionResult` がその形になっている）。
  入力エラーは zod の `error.flatten().fieldErrors` をそのまま載せ、入力欄ごとに表示する。
  メッセージ本文は載せず辞書のキーで持つ（多言語対応のため）。

  ```ts
  type ActionResult<T> =
    | { success: true; data: T }
    | { success: false; messageKey: string; errors?: Record<string, string[]> };
  ```
- 入力バリデーションはフロントにも zod で書き、内容は Go と同じ強度にする（`../movie-log-api/docs/requirements.md` の「入力ルール(確定)」が出典）。
  サーバ任せにできない理由は2つ。Go のエラーはどのフィールドが不正か構造化して返さず、フィールド名が message の文字列の中にしかないこと。
  そして `toDomain()` が最初の失敗で return するため、複数フィールドのエラーを一度に返せないこと。
  ずれの影響は非対称で、フロントが厳しすぎるとサーバが通す入力を弾いてしまう。緩い分はサーバが弾くので実害が小さい。
- Go API を呼ぶラッパは、素の `fetch` を薄く包む。ライブラリは入れない。
  Next.js が拡張しているのは `fetch` そのもので、`next` オプション（キャッシュと再検証）は `fetch` でしか使えないため。
  担わせるのは、ベース URL の付与、Cookie から読んだトークンの `Authorization` ヘッダ付与、zod スキーマでの検証、エラーの `ApiError` への正規化の4つ。
  リフレッシュは Proxy が持つので担わせない。リトライも入れない。
  キャッシュ指定の引数は今は入れない。全ページが認証必須で Cookie を読むため動的レンダリングになりキャッシュが効かず、
  必要になったら省略可能な引数を足すだけで済むため。
  `server-only` も入れない。正しく書けば起きない誤りを早期検出するだけで、呼ぶ場所が限られるため。
  ジェネリクスはラッパ内部に閉じ、画面からは `getRecords()` のような素朴な関数を呼ぶ形にする。
- コンポーネントは既定を Server Component にし、`"use client"` は対話が必要な葉にだけ付ける。
  トークンが httpOnly Cookie にありサーバでしか読めないため、取得はサーバ側で行い、結果を props で下へ渡す。
  `page.tsx` が認証確認とデータ取得を担い、表示コンポーネントは props を受け取るだけにする。
  同じ構成が kitchen-log でも採られている（`page.tsx` は Server、`recipe-menu.tsx` のような操作部だけ `"use client"`）。
- データ取得は Server Component（`page.tsx`）から行う。取得関数をどのファイルに置くかは B で決める。
- キャッシュ対策は何もしない。`revalidatePath` も入れない。Next.js 16 では `fetch` が既定でキャッシュされず、
  クライアント側の動的セグメントのキャッシュも既定 0 秒（v15.0.0 で 30 秒から変更）のため、古い内容が残らない。
  例外は `<Link prefetch={true}>` を明示した場合（5分）と、ブラウザの戻る・進む操作のみ。必要になったら1行足せば済む。

---

## 未決の論点

### A. 開発ツール

| 論点 | 内容・選択肢 |
| --- | --- |
| A-5 Git hooks / CI | commit 前に `lint` と `typecheck` を走らせるか（lefthook / husky）、GitHub Actions の要否 |

### B. ディレクトリ構成

| 論点 | 内容・選択肢 |
| --- | --- |
| B-1 Atomic Design を採用するか | atoms / molecules / organisms / templates / pages の5層。App Router の `app/` が pages・templates の役割を持つため、そのまま当てると層が重複する |
| B-2 採用する場合の App Router との噛み合わせ | `app/` はルーティングとデータ取得のみに限定し、UI は `components/` 配下に Atomic 層を置く、など |
| B-3 機能単位で切るか | Atomic Design（見た目の粒度）と feature 単位（`features/record/` など、関心事の単位）は排他ではない。併用するか片方にするか |
| B-4 命名規則 | ファイル名（kebab-case / PascalCase）、ディレクトリ名、コンポーネントの export 形式（named / default） |
| B-5 import パス | `@/*` エイリアスは設定済み。相対パスとの使い分けを決めるか |
| B-6 ファイル名・再エクスポートの規約 | 構成が決まったら Biome の `style/useFilenamingConvention` と `performance/noBarrelFile` を設定する |

### D. 状態とデータ取得

| 論点 | 内容・選択肢 |
| --- | --- |
| D-4 変更操作の方式 | Server Actions を使うか、Route Handler + fetch にするか |
| D-5 フォーム | 記録の作成・編集は項目が多い（映画情報 + 視聴情報 + クレジットの可変長リスト）。React Hook Form 等を使うか、`useActionState` で素朴に組むか |
| D-6 クライアント状態管理 | サーバ状態が主体で、クライアント固有の状態は少ない見込み。ライブラリ（TanStack Query / Zustand 等）が要るかどうか |
| D-7 TMDBによる入力補助 | 映画情報を自分で入力するのは面倒なのでTMDBのデータで検索して入力を補助するか。フロントで呼ぶかバックエンドで呼ぶか。言語の選択をどうするか。 |

### F. UI 基盤

| 論点 | 内容・選択肢 |
| --- | --- |
| F-1 デザイントークン | Tailwind v4 の `@theme` に色・タイポグラフィ・余白をどう定義するか。デザインが別途進行中のため、確定はその成果物に合わせる |
| F-2 UI ライブラリ | 素の Tailwind のみか、shadcn/ui 等を入れるか。学習目的との兼ね合い |
| F-3 アイコン | ライブラリを使うか、SVG を直接置くか |
| F-4 フォント | 現状は Geist（`create-next-app` の既定）。日本語フォントの扱いを決める必要がある |
| F-5 ダークモード | 現状 `globals.css` は `prefers-color-scheme` のみ。手動切り替えを持たせるか |
| F-6 レスポンシブ方針 | 将来 Flutter でスマホアプリを作る計画があるため、Web をどこまでモバイル対応させるか |

---

## バックエンドへの申し送り（フロント都合で発生しうる変更）

| 項目 | 内容 |
| --- | --- |
| enum 取得 API | C-4 で API 経由の同期を選んだ場合に必要 |
| OpenAPI 定義 | C-1 で型生成を選んだ場合に必要 |
| 一覧のページネーション・絞り込み | 記録が増えた場合に必要。MVP の範囲外 |

---

## 進める順序（合意済み）

E（認証と通信経路）は決着した。残りはその結論を前提に進める。

1. A-6・C・D
2. B（C・D で必要なファイル種別が出そろってから）
3. F（デザインの進捗に合わせる。F-2 〜 F-5 は先に決めてもよい）
4. A-5（Git hooks / CI。実装が始まってからの方が決めやすい）

Vitest と Cypress の導入は、テスト対象のコードができてから行う。
