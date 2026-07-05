import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/status-badge";
import {
  TrendingUp,
  Briefcase,
  AlertTriangle,
  Receipt,
  ArrowUpRight,
} from "lucide-react";
import {
  formatEuro,
  kpiCommesseAttive,
  kpiFattureScadute,
  kpiMargineMedio,
  kpiMaterialiSottoScorta,
  prossimeScadenze,
} from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Bottega 3D" },
      {
        name: "description",
        content:
          "Panoramica del laboratorio: margini, commesse attive, scorte e scadenze.",
      },
    ],
  }),
  component: Dashboard,
});

function KpiCard({
  label,
  value,
  hint,
  tone,
  icon: Icon,
  href,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "warning" | "danger" | "positive";
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
}) {
  const toneClasses = {
    default: "text-muted-foreground",
    warning: "text-amber-700",
    danger: "text-red-700",
    positive: "text-emerald-700",
  }[tone ?? "default"];

  const body = (
    <div className="group relative flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-foreground/20">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </span>
      </div>
      {hint && <span className={`text-xs ${toneClasses}`}>{hint}</span>}
      {href && (
        <ArrowUpRight className="absolute right-3 top-3 h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="block">
        {body}
      </Link>
    );
  }
  return body;
}

function Dashboard() {
  const margine = kpiMargineMedio();
  const attive = kpiCommesseAttive();
  const sottoScorta = kpiMaterialiSottoScorta();
  const scadute = kpiFattureScadute();
  const scadenze = prossimeScadenze();

  return (
    <PageShell
      title="Dashboard"
      description="Panoramica del laboratorio · aggiornata al 15/06/2026"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Margine medio commesse chiuse"
          value={`${Math.round(margine * 100)}%`}
          hint="+4 pp rispetto al trimestre precedente"
          tone="positive"
          icon={TrendingUp}
        />
        <KpiCard
          label="Commesse attive"
          value={String(attive)}
          hint="Confermate, in trattativa o in produzione"
          icon={Briefcase}
          href="/commesse"
        />
        <KpiCard
          label="Materiali sotto scorta"
          value={String(sottoScorta.length)}
          hint={sottoScorta.length > 0 ? "Serve attenzione" : "Tutto in ordine"}
          tone={sottoScorta.length > 0 ? "warning" : "positive"}
          icon={AlertTriangle}
          href="/magazzino"
        />
        <KpiCard
          label="Fatture scadute"
          value={String(scadute.length)}
          hint={
            scadute.length > 0
              ? `${formatEuro(scadute.reduce((s, f) => s + f.importo, 0))} da incassare · urgente`
              : "Nessun insoluto"
          }
          tone={scadute.length > 0 ? "danger" : "positive"}
          icon={Receipt}
          href="/amministrazione"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold">Prossime scadenze</h2>
              <p className="text-xs text-muted-foreground">
                Fatture in scadenza o scadute
              </p>
            </div>
            <Link
              to="/amministrazione"
              className="text-xs font-medium text-foreground hover:underline"
            >
              Vedi tutte →
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-2 font-medium">Fattura</th>
                <th className="px-4 py-2 font-medium">Cliente</th>
                <th className="px-4 py-2 font-medium text-right">Importo</th>
                <th className="px-4 py-2 font-medium">Scadenza</th>
                <th className="px-4 py-2 font-medium">Stato</th>
              </tr>
            </thead>
            <tbody>
              {scadenze.map((f) => (
                <tr
                  key={f.id}
                  className="border-b border-border last:border-0 hover:bg-muted/40"
                >
                  <td className="px-4 py-2.5 font-mono text-xs">{f.numero}</td>
                  <td className="px-4 py-2.5">{f.cliente}</td>
                  <td className="px-4 py-2.5 text-right font-medium tabular-nums">
                    {formatEuro(f.importo)}
                  </td>
                  <td className="px-4 py-2.5 tabular-nums text-muted-foreground">
                    {f.dataScadenza}
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge variant={f.stato}>{f.stato}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold">Materiali critici</h2>
            <p className="text-xs text-muted-foreground">
              Sotto la soglia minima di riordino
            </p>
          </div>
          <ul className="divide-y divide-border">
            {sottoScorta.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <div>
                  <div className="font-medium">{m.nome}</div>
                  <div className="text-xs text-muted-foreground">
                    {m.giacenzaAttuale} {m.unitaMisura} · minima {m.scortaMinima}{" "}
                    {m.unitaMisura}
                  </div>

                </div>
                <Badge variant="scaduta">sotto scorta</Badge>
              </li>
            ))}
            {sottoScorta.length === 0 && (
              <li className="px-4 py-6 text-center text-xs text-muted-foreground">
                Nessun materiale sotto soglia.
              </li>
            )}
          </ul>
        </div>
      </div>
    </PageShell>
  );
}
