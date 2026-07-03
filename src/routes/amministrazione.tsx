import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/status-badge";
import { fatture, formatEuro } from "@/lib/mock-data";
import { AlertTriangle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/amministrazione")({
  head: () => ({
    meta: [
      { title: "Amministrazione — Bottega 3D" },
      {
        name: "description",
        content: "Fatture emesse, scadenze e stato dei pagamenti.",
      },
    ],
  }),
  component: AmministrazionePage,
});

function AmministrazionePage() {
  const scadute = fatture.filter((f) => f.stato === "scaduta");
  const inAttesa = fatture.filter((f) => f.stato === "in attesa");
  const pagate = fatture.filter((f) => f.stato === "pagata");

  const totaleScaduto = scadute.reduce((s, f) => s + f.importo, 0);
  const totaleInAttesa = inAttesa.reduce((s, f) => s + f.importo, 0);

  return (
    <PageShell
      title="Amministrazione"
      description="Fatture emesse, scadenze e stato pagamenti"
      actions={
        <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-3.5 w-3.5" />
          Nuova fattura
        </button>
      }
    >
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatTile
          label="Scaduto — da sollecitare"
          value={formatEuro(totaleScaduto)}
          hint={`${scadute.length} ${scadute.length === 1 ? "fattura" : "fatture"}`}
          tone="danger"
        />
        <StatTile
          label="In attesa di scadenza"
          value={formatEuro(totaleInAttesa)}
          hint={`${inAttesa.length} ${inAttesa.length === 1 ? "fattura" : "fatture"}`}
          tone="warning"
        />
        <StatTile
          label="Incassato (12 mesi)"
          value={formatEuro(pagate.reduce((s, f) => s + f.importo, 0))}
          hint={`${pagate.length} pagate`}
          tone="positive"
        />
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <span className="text-xs font-medium">Fatture ({fatture.length})</span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Ordina:</span>
            <select className="rounded-md border border-input bg-background px-2 py-1 text-xs outline-none">
              <option>Scadenza (crescente)</option>
              <option>Importo (decrescente)</option>
              <option>Data emissione</option>
            </select>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2 font-medium">Numero</th>
              <th className="px-4 py-2 font-medium">Cliente</th>
              <th className="px-4 py-2 font-medium text-right">Importo</th>
              <th className="px-4 py-2 font-medium">Emessa</th>
              <th className="px-4 py-2 font-medium">Scadenza</th>
              <th className="px-4 py-2 font-medium">Stato</th>
            </tr>
          </thead>
          <tbody>
            {fatture.map((f) => {
              const scaduta = f.stato === "scaduta";
              return (
                <tr
                  key={f.id}
                  className={cn(
                    "border-b border-border last:border-0 hover:bg-muted/40",
                    scaduta && "bg-red-50/40 hover:bg-red-50/70",
                  )}
                >
                  <td className="px-4 py-2.5 font-mono text-xs">
                    <div className="flex items-center gap-1.5">
                      {scaduta && (
                        <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                      )}
                      {f.numero}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 font-medium">{f.cliente}</td>
                  <td className="px-4 py-2.5 text-right font-medium tabular-nums">
                    {formatEuro(f.importo)}
                  </td>
                  <td className="px-4 py-2.5 tabular-nums text-muted-foreground">
                    {f.dataEmissione}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-2.5 tabular-nums",
                      scaduta
                        ? "font-semibold text-red-700"
                        : "text-muted-foreground",
                    )}
                  >
                    {f.dataScadenza}
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge variant={f.stato}>{f.stato}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}

function StatTile({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  tone: "danger" | "warning" | "positive";
}) {
  const borderCls = {
    danger: "border-red-200 bg-red-50/50",
    warning: "border-amber-200 bg-amber-50/50",
    positive: "border-emerald-200 bg-emerald-50/50",
  }[tone];
  const valueCls = {
    danger: "text-red-700",
    warning: "text-amber-800",
    positive: "text-emerald-700",
  }[tone];
  return (
    <div className={cn("rounded-lg border p-4", borderCls)}>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className={cn("mt-1.5 text-xl font-semibold tabular-nums", valueCls)}>
        {value}
      </div>
      <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}
