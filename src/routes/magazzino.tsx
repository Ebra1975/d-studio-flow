import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/status-badge";
import { materiali, formatEuro, type Materiale } from "@/lib/mock-data";
import { Plus, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/magazzino")({
  head: () => ({
    meta: [
      { title: "Magazzino — Bottega 3D" },
      {
        name: "description",
        content: "Materiali primari, secondari e attrezzatura del laboratorio.",
      },
    ],
  }),
  component: MagazzinoPage,
});

function isSottoScorta(m: Materiale) {
  return (
    m.scortaAttuale !== null &&
    m.scortaMinima !== null &&
    m.scortaAttuale < m.scortaMinima
  );
}

function MagazzinoPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId ? materiali.find((m) => m.id === selectedId) : null;

  const critici = materiali.filter(isSottoScorta).length;

  return (
    <PageShell
      title="Magazzino"
      description={`${materiali.length} voci · ${critici} sotto scorta`}
      actions={
        <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-3.5 w-3.5" />
          Nuovo materiale
        </button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1fr,420px]">
        <div className="rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-2 font-medium">Nome</th>
                <th className="px-4 py-2 font-medium">Categoria</th>
                <th className="px-4 py-2 font-medium">Brand</th>
                <th className="px-4 py-2 font-medium text-right">Scorta</th>
                <th className="px-4 py-2 font-medium">Stato</th>
              </tr>
            </thead>
            <tbody>
              {materiali.map((m) => {
                const critico = isSottoScorta(m);
                return (
                  <tr
                    key={m.id}
                    onClick={() => setSelectedId(m.id)}
                    className={cn(
                      "cursor-pointer border-b border-border last:border-0 hover:bg-muted/40",
                      selectedId === m.id && "bg-muted/60",
                    )}
                  >
                    <td className="px-4 py-2.5 font-medium">{m.nome}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant={m.categoria}>{m.categoria}</Badge>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {m.brand ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {m.scortaAttuale === null ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <span className={critico ? "font-semibold text-red-700" : ""}>
                          {m.scortaAttuale} {m.unitaMisura}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {critico ? (
                        <span className="inline-flex items-center gap-1 rounded-md border border-red-300 bg-red-50 px-1.5 py-0.5 text-[11px] font-medium text-red-700">
                          <AlertTriangle className="h-3 w-3" />
                          sotto scorta
                        </span>
                      ) : m.scortaAttuale === null ? (
                        <span className="text-[11px] text-muted-foreground">
                          non tracciata
                        </span>
                      ) : (
                        <Badge variant="pagata">disponibile</Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {selected && (
          <aside className="rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <div className="text-sm font-semibold">{selected.nome}</div>
                <div className="mt-1">
                  <Badge variant={selected.categoria}>{selected.categoria}</Badge>
                </div>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="rounded p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4 px-4 py-4">
              <dl className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <dt className="text-muted-foreground">Brand</dt>
                  <dd className="mt-0.5 font-medium">{selected.brand ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Prezzo standard</dt>
                  <dd className="mt-0.5 font-medium tabular-nums">
                    {selected.prezzoStandard
                      ? `${formatEuro(selected.prezzoStandard)} / ${selected.unitaAcquisto}`
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Unità acquisto</dt>
                  <dd className="mt-0.5 font-medium">{selected.unitaAcquisto ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Unità consumo</dt>
                  <dd className="mt-0.5 font-medium">{selected.unitaConsumo ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Scorta attuale</dt>
                  <dd className="mt-0.5 font-medium tabular-nums">
                    {selected.scortaAttuale === null
                      ? "—"
                      : `${selected.scortaAttuale} ${selected.unitaMisura}`}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Scorta minima</dt>
                  <dd className="mt-0.5 font-medium tabular-nums">
                    {selected.scortaMinima === null
                      ? "—"
                      : `${selected.scortaMinima} ${selected.unitaMisura}`}
                  </dd>
                </div>
              </dl>

              <section>
                <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Specifiche tecniche
                </h3>
                <dl className="divide-y divide-border rounded-md border border-border text-xs">
                  {Object.entries(selected.specifiche).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 px-3 py-2">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="text-right font-medium">{v}</dd>
                    </div>
                  ))}
                  {Object.keys(selected.specifiche).length === 0 && (
                    <div className="px-3 py-3 text-center text-muted-foreground">
                      Nessuna specifica
                    </div>
                  )}
                </dl>
              </section>
            </div>
          </aside>
        )}
      </div>
    </PageShell>
  );
}
