import { Page } from "../components/ui";
import { PHASE_GUIDES, PHASE_NOTE, type GuidePhase } from "../i18n/phases";
import { EVIDENCE_LABEL, REMEDY_DISCLAIMER, remedyById, type Evidence, type RemedyId } from "../i18n/remedies";
import type { StringKey } from "../i18n";
import { useStore } from "../store";

export function EvidenceTag({ evidence }: { evidence: Evidence }) {
  const { data } = useStore();
  return <span className={`evidence ${evidence}`}>{EVIDENCE_LABEL[evidence][data.settings.lang]}</span>;
}

export function RemedyView({ id, onBack }: { id: RemedyId; onBack: () => void }) {
  const { data, t } = useStore();
  const lang = data.settings.lang;
  const r = remedyById(id);
  return (
    <Page title={r.title[lang]} onBack={onBack}>
      <section className="card">
        <div style={{ fontSize: 36 }} aria-hidden>{r.icon}</div>
        <p>{r.intro[lang]}</p>
      </section>
      <section className="stack">
        <h3>{t("remTips")}</h3>
        {r.tips.map((tip, i) => (
          <div key={i} className="card tip">
            <EvidenceTag evidence={tip.evidence} />
            <p className="small">{tip.text[lang]}</p>
          </div>
        ))}
      </section>
      {r.caution && (
        <div className="banner info">
          <span className="level">{t("remCaution")}</span>
          <p className="small">{r.caution[lang]}</p>
        </div>
      )}
      <div className="banner doctor">
        <span className="level">{t("remDoctor")}</span>
        <p className="small">{r.doctor[lang]}</p>
      </div>
      <p className="muted tiny">{REMEDY_DISCLAIMER[lang]}</p>
    </Page>
  );
}

export function PhaseView({ phase, current, onBack }: { phase: GuidePhase; current: boolean; onBack: () => void }) {
  const { data, t } = useStore();
  const lang = data.settings.lang;
  const g = PHASE_GUIDES.find((p) => p.id === phase)!;
  const list = (title: StringKey, items: Record<string, string>[]) => (
    <section className="card">
      <h3>{t(title)}</h3>
      <ul className="tips-list">{items.map((it, i) => <li key={i} className="small">{it[lang]}</li>)}</ul>
    </section>
  );
  return (
    <Page title={t(`phase_${phase}` as StringKey)} onBack={onBack}>
      <section className="card">
        <div className="row between">
          <span style={{ fontSize: 36 }} aria-hidden>{g.icon}</span>
          {current && <span className="phase-pill">{t("phaseNow")}</span>}
        </div>
        <p className="muted small">{g.days[lang]}</p>
        <p className="small"><strong>{t("phaseHormones")}:</strong> {g.hormones[lang]}</p>
        <p className="small"><strong>{t("phaseBody")}:</strong> {g.body[lang]}</p>
      </section>
      {list("phaseFood", g.food)}
      {list("phaseMove", g.move)}
      {list("phaseCare", g.care)}
      <p className="muted tiny">{PHASE_NOTE[lang]}</p>
    </Page>
  );
}
