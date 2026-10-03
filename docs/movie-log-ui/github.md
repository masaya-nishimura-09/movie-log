repo: masaya-nishimura-09/movie-log-api
branch: main

## Last sync

date: 2026-08-18T10:40:34Z

### Updated in this project

- バックエンドの要件・Enum・APIレスポンス形を読み込み、フロントUI設計の前提として整理
- 記録項目14個・選択肢一覧（ジャンル19/雰囲気タグ18/プラットフォーム30/役割5）を確認
- 入力制約（タイトル255字・公開年1888〜+5・上映時間0〜1440・メモ1000字・スコア1〜5・パスワード8〜72）を確認

## Screen map

| 画面 | 参照した repo ファイル |
| --- | --- |
| ログイン | internal/handler/auth/handler.go, internal/domain/user/email.go, internal/domain/user/password.go |
| 新規登録 | internal/handler/user/handler.go, internal/domain/user/username.go, email.go, password.go |
| 記録一覧 | internal/handler/record/handler.go (ListRecords/toResponse), scripts/create_tables.sql |
| 記録の詳細 | internal/handler/record/handler.go (GetRecord/toResponse), internal/domain/record/record.go |
| 記録の作成/編集フォーム | internal/domain/record/{title,release_year,runtime,genre,country,language,credit,poster_url,watched_at,platform,score,mood_tag,memo}.go, docs/requirements.md |
| アカウント設定 | internal/handler/user/handler.go, internal/usecase/user/usecase.go |
| エラー表示全般 | internal/handler/response/response.go |
