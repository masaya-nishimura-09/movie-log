# 映画記録アプリ フロントエンド ステータス

最終更新: 2026-08-22

このドキュメントは、フロントエンド基盤の決定事項と未決事項を管理する作業用ドキュメント。
書くのは未決のものと、決めたがまだ反映されていないものだけ。済んだものは削除する。

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
  トークンは httpOnly Cookie に入れる。`httpOnly` / `Secure` / `SameSite` を両方の Cookie に付ける。
  `refresh_token` の `path` は限定せず `/` にする。当初は `/api/auth` に絞る案だったが、
  それだと通常のページ遷移で Cookie が送られず、Proxy がトークンを読めないため成立しない。
- ログアウトは Next.js 側で Cookie から `refresh_token` を読んで Go の `/auth/logout` に渡し、両方の Cookie を削除する。
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
- データ取得は Server Component（`page.tsx`）から行う。取得関数は `src/api/` に置く。
- キャッシュ対策は何もしない。`revalidatePath` も入れない。Next.js 16 では `fetch` が既定でキャッシュされず、
  クライアント側の動的セグメントのキャッシュも既定 0 秒（v15.0.0 で 30 秒から変更）のため、古い内容が残らない。
  例外は `<Link prefetch={true}>` を明示した場合（5分）と、ブラウザの戻る・進む操作のみ。必要になったら1行足せば済む。
- 変更操作（作成・更新・削除・ログイン・ログアウト）はすべて Server Action で書く。Route Handler は作らない。
  フォームの `action` に直接渡せて通信のコードが不要になり、`useActionState` で戻り値をそのまま受け取れるため。
  C-7 で決めた「変更系はエラーを戻り値で返す」がそのまま実現でき、`error.flatten().fieldErrors` を入力欄ごとに表示できる。
  Cookie は Server Action でも書けるので、ログインのために Route Handler を用意する必要はない。
- フォームはライブラリを入れず、`useActionState` と `useState` で組む。
  可変長のクレジット行は `useState` で配列を持ち、追加・削除を自前で書く。20〜30行程度で済む。
  React Hook Form は `useFieldArray` を持つが、Server Action との繋ぎ方を別途決める必要があり、動機が可変長行1点では弱い。
  kitchen-log が同等の要件（材料・手順の可変長）をフォームライブラリ無しで組めている。
- 状態管理ライブラリ（TanStack Query / Zustand 等）は入れない。離れたコンポーネント間で共有したい状態が無いため。
  サーバのデータは Server Component が取得して props で渡し、フォームの入力値はそのフォーム内で完結し、
  ログイン状態は Proxy が判定する。手に負えなくなった時点で導入を検討する。
- TMDB による入力補助は Go 側に API を追加して呼ぶ。スマホアプリ（Flutter）を作る前提があり、再利用できるため。
  追加ホップの遅延は数ミリ秒で、支配的なのは TMDB への外部通信（100〜300ms）。打鍵ごとに検索する形でも差は出ない。
  ジャンルは要件の19種類が TMDB のジャンル一覧と一致するため、変換は機械的に書ける。
  入力補助は付加機能として作る。タイトル入力欄の下に候補を出す形にし、検索が失敗したら候補を出さないだけにする。
  エラーは表示せず握りつぶす。手入力という代替手段が常にあり、候補が出ないことでユーザーが困らないため。
  これは「取得系は throw して `error.tsx` に拾わせる」という方針の例外にあたる。
  接続できるかの事前判定は行わない。検索して結果が返れば出す、返らなければ出さない、だけにする。
- ポスター画像はブラウザから TMDB へ直接読みに行く。Go は画像のパスを返し、
  ブラウザが `https://image.tmdb.org/t/p/{size}/{path}` を組み立てて読む。TMDB の画像 URL は認証不要。
  自分のサーバで中継はしない。CDN の速さを失う割に得るものが無いため。
- 記録に保存するポスターは完全な URL のまま（現在の要件どおり）。TMDB 以外の URL も入りうるため、パスだけの保存にはしない。
- ポスター画像は自分でアップロードできるようにする。TMDB に無い作品や、自分で用意した画像を登録するため。
  TMDB から選んだ場合は TMDB の URL をそのまま保存し、画像を自分のストレージへコピーはしない（再配布にあたるため）。
  どちらの場合も記録に入るのは完全な URL で、出所が違うだけ。記録側の仕様は変わらない。
- ディレクトリは種類で分けてから、その中をドメインで分ける。

  ```
  src/
    app/          ルーティング
    components/   atoms / molecules / organisms
    actions/      Server Action。中をドメインで分割
    api/          Go API との通信。中をドメインで分割
    schemas/      zod スキーマと導出した型。中をドメインで分割
    lib/          純粋な関数。中を用途で分割
    i18n/         辞書
    styles/
  ```

- コンポーネントは Atomic Design を3層（atoms / molecules / organisms）で使う。
  templates と pages は App Router の `layout.tsx` と `page.tsx` が担うため作らない。
  Atomic Design を選んだのは、分類の基準が「粒度」の一つだけで済むため。
  FSD は規則が多いものの層への分類自体が主観的で、かえって無秩序になると判断した。
- `types/` は作らない。型は zod スキーマから導出するため `schemas/` に同居させる。
- `lib/` の直下にファイルを置かない。必ず用途名のフォルダを作り、その中に置く。
  kitchen-log では `lib/` 直下に雑多なファイルが置かれ、他に置き場が無いものの受け皿になっていたため。
- export は named export を使う。名前が一意に決まり、別名で読み込まれないため。
  ただし `app/` の規約ファイル（`page.tsx`、`layout.tsx`、`error.tsx` など）は Next.js の仕様で default export になる。
  例外はこの範囲に限られ、境界が明確なので規則として成立する。
- import は常に `@/` エイリアスを使い、相対パスは使わない。書き方が一つに決まり、ファイル移動時の修正も不要になるため。
- shadcn の部品は粒度に応じて `atoms/` / `molecules/` / `organisms/` に振り分ける。
  CLI の出力先は1箇所なので、部品を追加するたびに手で移動する。Atomic Design の基準に例外を作らないことを優先した。
- レスポンシブは PC とスマホの両方に対応する。CSS はスマホ向けを既定にし、`md:` などで広い画面向けを追加で書く。
  Tailwind がその前提で設計されているため。書き方を片方に統一し、`max-md:` のような逆向きの指定は使わない。

---

## バックエンドへの申し送り（フロント都合で発生しうる変更）

| 項目 | 内容 |
| --- | --- |
| 一覧のページネーション・絞り込み | 記録が増えた場合に必要。MVP の範囲外 |
| TMDB 入力補助の API | D-7 の結論により Go 側に追加する。タイトル検索と詳細取得、および記録項目への変換 |
| 画像アップロードの API とストレージ | ポスターを自分で登録できるようにするために必要。保存先は未選定 |

