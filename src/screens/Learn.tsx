import { Page } from "../components/ui";
import { ARTICLES, type Article } from "../i18n/articles";
import { useStore } from "../store";

export function Learn({ onOpen }: { onOpen: (a: Article) => void }) {
  const { data, t } = useStore();
  const lang = data.settings.lang;
  return (
    <main className="screen">
      <div className="screen-title"><h1>{t("tabLearn")}</h1></div>
      <p className="muted small">{t("learnIntro")}</p>
      {ARTICLES.map((a) => (
        <button key={a.id} className="list-item" onClick={() => onOpen(a)}>
          <span className="emoji" aria-hidden>{a.icon}</span>
          <span className="stack" style={{ gap: 2 }}>
            <strong>{a.text[lang].title}</strong>
            <span className="muted small">{a.text[lang].summary}</span>
          </span>
        </button>
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
