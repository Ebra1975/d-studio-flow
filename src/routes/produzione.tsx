import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/status-badge";
import { stampanti, jobs, commesse, formatEuro } from "@/lib/mock-data";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/produzione")({
  head: () => ({
    meta: [
      { title: "Produzione — Bottega 3D" },
      {
        name: "description",
        content: "Macchine e job di stampa in coda o in corso.",
      },
    ],
  }),
  component: ProduzionePage,
});

function ProduzionePage() {
  return (
    <PageShell
      title="Produzione"
      description={`${stampanti.length} macchine · ${jobs.filter((j) => j.stato !== "completato").length} job attivi`}
      actions={
        <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-3.5 w-3.5" />
          Nuovo job
        </button>
      }
    >
      <section className="mb-6">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold">Macchine</h2>
          <span className="text-xs text-muted-foreground">
            Costo orario stimato include elettricità e ammortamento
          </span>
        </div>
        <div className="rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-2 font-medium">Nome</th>
                <th className="px-4 py-2 font-medium">Modello</th>
                <th className="px-4 py-2 font-medium">Tecnologia</th>
                <th className="px-4 py-2 font-medium">Proprietà</th>
                <th className="px-4 py-2 font-medium">Stato</th>
                <th className="px-4 py-2 font-medium text-right">Costo orario</th>
              </tr>
            </thead>
            <tbody>
              {stampanti.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-border last:border-0 hover:bg-muted/40"
                >
                  <td className="px-4 py-2.5 font-medium">{s.nome}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{s.modello}</td>
                  <td className="px-4 py-2.5">
                    <span className="rounded-md border border-border bg-muted/60 px-1.5 py-0.5 text-[11px] font-medium">
                      {s.tecnologia}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">
                    {s.proprieta === "comodato" ? (
                      <span className="rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 font-medium text-amber-800">
                        in comodato
                      </span>
                    ) : (
                      "proprietà"
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge variant={s.stato}>{s.stato}</Badge>
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium tabular-nums">
                    {formatEuro(s.costoOrario)} / h
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold">Job di produzione</h2>
          <span className="text-xs text-muted-foreground">
            {jobs.filter((j) => j.stato === "in corso").length} in corso ·{" "}
            {jobs.filter((j) => j.stato === "pianificato").length} pianificati
          </span>
        </div>
        <div className="rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-2 font-medium">Descrizione</th>
                <th className="px-4 py-2 font-medium">Macchina</th>
                <th className="px-4 py-2 font-medium">Commessa</th>
                <th className="px-4 py-2 font-medium text-right">Ore stimate</th>
                <th className="px-4 py-2 font-medium">Inizio</th>
                <th className="px-4 py-2 font-medium">Stato</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => {
                const macchina = stampanti.find((s) => s.id === j.stampanteId);
                const commessa = commesse.find((c) => c.id === j.commessaId);
                return (
                  <tr
                    key={j.id}
                    className="border-b border-border last:border-0 hover:bg-muted/40"
                  >
                    <td className="px-4 py-2.5 font-medium">{j.descrizione}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {macchina?.nome ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                      {commessa?.codice ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {j.oreStimate} h
                    </td>
                    <td className="px-4 py-2.5 tabular-nums text-muted-foreground">
                      {j.dataInizio ?? "—"}
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge variant={j.stato}>{j.stato}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  );
}
