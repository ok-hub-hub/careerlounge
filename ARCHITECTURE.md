# Architecture — careerlounge

本ドキュメントは AI 会社内部の Codex 設計案（`02_部門アウトプット/P-027_P-028_UGC共通基盤_設計案_Codex_v1.md`）の要約です。詳細・差分は同設計案を一次ソースとしてください。

兄弟プロジェクト [kokolabo](https://github.com/ok-hub-hub/kokolabo) と **同じ Supabase スキーマ・共通コンポーネント**を利用し、`site_code = careerlounge` で識別します。

## 1. 採用構成

- **フロント**：Astro v5（`output: "server"` + `@astrojs/cloudflare`）
- **データ**：Supabase（PostgreSQL + RLS + Auth + Edge Functions、kokolabo と共通プロジェクト）
- **公開**：Cloudflare Pages（Pages Functions 利用）
- **再デプロイ**：承認時に Cloudflare Pages Deploy Hook を叩く

## 2. データモデル要旨

`reviews` / `target_entities` / `users` / `moderation_logs` の共通スキーマ。

careerlounge 側の `target_entities.entity_type` は以下を想定：
- `agent`（転職エージェント：ビズリーチ、JAC、リクルートダイレクトスカウト、Forkwell、レバテック等）
- `company`（口コミ対象企業）
- `job_category`（業界・職種カテゴリ）

`reviews.attributes` JSONB の careerlounge 拡張：
- `applicant_age_band`（20s_early / 20s_late / 30s_early / 30s_late / 40s_early / 40s_late）
- `industry`（IT / 金融 / コンサル / 製造 / 営業 / etc）
- `salary_band_before` / `salary_band_after`（400-500 / 500-600 / 600-800 / 800-1000 / 1000-1500 / 1500+）
- `transition_year`（YYYY）
- `transition_type`（同業 / 異業 / 異職種 / フリーランス転換）

## 3. 投稿フロー

1. ユーザーが Astro の SubmitForm に入力
2. Astro API Route / Pages Functions が POST を受ける
3. Supabase に `status = pending` で挿入
4. モデレーターが審査（個人情報・誹謗中傷・年収誇張・ステマチェック）
5. 承認時に `status = approved` 更新
6. Cloudflare Pages Deploy Hook で再ビルド → 静的ページに反映

## 4. ディレクトリ構造（予定）

```
src/
  pages/
    index.astro                  # トップ：新着UGC、エージェント別、ピックアップ
    reviews/[id].astro           # 個別口コミ
    reviews/submit.astro         # 投稿フォーム
    agents/[id].astro            # エージェント個別（口コミ集約）
    agents/categories/           # ハイクラス / IT / 営業 / 第二新卒 / 外資 / etc
    compare/                     # 横断比較記事
      it-engineer-30s-2026.astro # ← 旧 IT 特化柱記事（リレゲーション後）
    by-stack/                    # 技術スタック別（IT エンジニア向け）
    by-industry/                 # 業界別
    by-age/                      # 年代別
    guides/                      # 編集記事（ピラー）
    tools/resume-optimizer.astro # AI 職務経歴書最適化（ResumeMatch JP 統合候補）
    admin/moderation.astro       # 管理画面（後期）
    about.astro
    privacy.astro
    disclaimer.astro
  components/
    ReviewCard.astro
    SubmitForm.astro
    AgentCard.astro
    ComparisonTable.astro
    DisclosureBadge.astro
    ModerationStatusBadge.astro
  lib/supabase.ts
  data/agents.ts
```

## 5. 環境変数（実装時に設定）

```
PUBLIC_SITE_CODE=careerlounge
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MODERATION_WEBHOOK_SECRET=
CLOUDFLARE_DEPLOY_HOOK_URL=
```

## 6. 次の実装ステップ

- [ ] `npm create astro@latest .` で Astro v5 + TypeScript + Tailwind 雛形を生成
- [ ] kokolabo（兄弟プロジェクト）の共通コンポーネントを反映
- [ ] AI Maker Lab（[github.com/ok-hub-hub/ai-maker-lab](https://github.com/ok-hub-hub/ai-maker-lab)）から設定流用
- [ ] Cloudflare Pages プロジェクト作成、`PUBLIC_SITE_CODE=careerlounge` を設定
- [ ] 既存 IT エンジニア 30 代柱記事（`02_部門アウトプット/P-028_記事1_*.md`）をサブピラーとして移植、`relegation_adjustments_required` 反映
- [ ] トップピラー（転職市場全般入口）の新規執筆
- [ ] 法務ページの雛形作成
- [ ] SubmitForm（v0: Google Form → v1: Supabase）

## 7. ResumeMatch JP との関係

旧 P-024 ResumeMatch JP（`~/Desktop/Development/resumematch-jp/`）の AI 職務経歴書最適化機能を、careerlounge の集客フックとして無料ツール化する計画。サブドメイン（`tool.careerlounge.jp` 等）でデプロイするか、`/tools/resume-optimizer` で iframe 統合するかは Phase 2 で決定。
