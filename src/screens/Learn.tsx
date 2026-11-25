import { Page } from "../components/ui";
import { ARTICLES, CATEGORY_LABEL, type Article, type ArticleCategory } from "../i18n/articles";
import { PHASE_GUIDES, type GuidePhase } from "../i18n/phases";
import { REMEDIES, type RemedyId } from "../i18n/remedies";
import type { StringKey } from "../i18n";
import { useStore } from "../store";

const CATEGORIES: ArticleCategory[] = ["body", "conditions", "sexual", "wellbeing"];

export function Learn({ onOpen, onPhase, onRemedy }: {
  onOpen: (a: Article) => void; onPhase: (p: GuidePhase) => void; onRemedy: (r: RemedyId) => void;
}) {
  const { data, t } = useStore();
  const lang = data.settings.lang;
  return (
    <main className="screen">
      <div className="screen-title"><h1>{t("tabLearn")}</h1></div>
      <p className="muted small">{t("learnIntro")}</p>

      <section className="stack">
        <h2>{t("learnPhases")}</h2>
        <div className="tiles">
          {PHASE_GUIDES.map((g) => (
            <button key={g.id} className="tile tile-btn" onClick={() => onPhase(g.id)}>
              <span style={{ fontSize: 26 }} aria-hidden>{g.icon}</span>
              <strong className="small">{t(`phase_${g.id}` as StringKey)}</strong>
              <span className="muted tiny">{g.days[lang]}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="stack">
        <h2>{t("learnRemedies")}</h2>
        <p className="muted small">{t("learnRemediesHint")}</p>
        <div className="chips">
          {REMEDIES.map((r) => (
            <button key={r.id} className="chip" onClick={() => onRemedy(r.id)}>
              <span aria-hidden>{r.icon}</span> {r.title[lang]}
            </button>
          ))}
        </div>
      </section>

      {CATEGORIES.map((c) => (
        <section key={c} className="stack">
          <h2>{CATEGORY_LABEL[c][lang]}</h2>
          {ARTICLES.filter((a) => a.category === c).map((a) => (
            <button key={a.id} className="list-item" onClick={() => onOpen(a)}>
              <span className="emoji" aria-hidden>{a.icon}</span>
              <span className="stack" style={{ gap: 2 }}>
                <strong>{a.text[lang].title}</strong>
                <span className="muted small">{a.text[lang].summary}</span>
              </span>
            </button>
          ))}
        </section>
      ))}
    </main>
  );
}

export function ArticleView({ article, onBack }: { article: Article; onBack: () => void }) {
  const { data, t } = useStore();
  const text = article.text[data.settings.lang];
  return (
    <Page title={text.title} onBack={onBack}>
      <article className="card article">
        <div style={{ fontSize: 40 }} aria-hidden>{article.icon}</div>
        {text.body.map((p, i) => <p key={i}>{p}</p>)}
      </article>
      <p className="muted tiny">{t("learnIntro")}</p>
    </Page>
  );
}
