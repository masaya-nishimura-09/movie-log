# 映画記録アプリ フロントエンド ステータス

最終更新: 2026-10-03

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
| GET | `/users/` | 必要 | ログイン中のユーザーの取得 |
| PUT | `/users/` | 必要 | ユーザー更新 |
| DELETE | `/users/` | 必要 | ユーザー削除 |
| POST | `/records/` | 必要 | 視聴記録の作成 |
| GET | `/records/` | 必要 | 視聴記録の一覧 |
| GET | `/records/:id` | 必要 | 視聴記録の取得 |
| PUT | `/records/:id` | 必要 | 視聴記録の更新 |
| DELETE | `/records/:id` | 必要 | 視聴記録の削除 |
| GET | `/movies/search` | 必要 | TMDB タイトル検索 |
| GET | `/movies/:id` | 必要 | TMDB 詳細取得 |
| POST | `/media/` | 必要 | ポスター画像アップロード |

### 契約

- 認証は `Authorization` ヘッダの Bearer トークン
- ログイン・リフレッシュは `{ access_token, refresh_token }` を **JSON ボディで返す**（Cookie ではない）
- レスポンスのフィールドは **snake_case**
- 記録 ID は `record_id` として **文字列** で返る（Go 側で `strconv.FormatUint` している）
- 日時は UTC の RFC3339
- 一覧は `{ records, filtered_count, total_count }` で返る。クエリパラメータで絞り込み（`scores` / `platforms` / `mood_tags` / `genres`）、タイトル検索（`title`）、並び替え（`sort_field` / `sort_order`）、ページネーション（`page` / `per_page`）ができる
- エラーは `{ code, message }` の固定形式。`code` は `INVALID_INPUT` / `INVALID_ACCESS_TOKEN` / `INVALID_REFRESH_TOKEN` / `INVALID_CREDENTIALS` / `UNAUTHENTICATED` / `NOT_FOUND` / `USER_NOT_FOUND` / `RECORD_NOT_FOUND` / `MOVIE_NOT_FOUND` / `USER_ALREADY_EXISTS` / `TOO_MANY_REQUESTS` / `INTERNAL_SERVER_ERROR`

### enum（バックエンドに定義済み。取得用 API は無い）

| 種別 | 個数 |
| --- | --- |
| Genre | 19 |
| MoodTag | 18 |
| Platform | 30 |
| CreditRole | 5（監督 / 脚本 / 撮影 / 音楽 / キャスト） |

---

## 決定済み・未実装

なし
