import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/status-badge";
import { commesse, clienti, formatEuro } from "@/lib/mock-data";
import { Plus, Search, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/commesse/")({
  head: () => ({
    meta: [
      { title: "Commesse — Bottega 3D" },
      {
        name: "description",
        content:
          "Preventivi, opzioni comparative, righe di costo e stato avanzamento delle commesse.",
      },
    ],
  }),
  component: CommessePage,
});

function CommessePage() {
  const [showNew, setShowNew] = useState(false);

  return (
    <PageShell
      title="Commesse"
      description={`${commesse.length} commesse totali · gestione preventivi, produzione e fatturazione`}
      actions={
        <button
          onClick={() => setShowNew(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" />
          Nuova commessa
        </button>
      }
    >
      {showNew && <NuovaCommessaForm onClose={() => setShowNew(false)} />}

      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">{commesse.length} commesse</span>
            <span className="text-xs text-muted-foreground">
              · Totale pattuito {formatEuro(commesse.reduce((s, c) => s + c.prezzoPattuito, 0))}
            </span>
          </div>
          <div className="relative w-64">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Cerca codice, cliente, titolo..."
              className="w-full rounded-md border border-input bg-background py-1.5 pl-8 pr-3 text-xs outline-none focus:border-foreground/40"
            />
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2 font-medium">Codice</th>
              <th className="px-4 py-2 font-medium">Titolo</th>
              <th className="px-4 py-2 font-medium">Cliente</th>
              <th className="px-4 py-2 font-medium">Stato</th>
              <th className="px-4 py-2 font-medium text-right">Prezzo pattuito</th>
              <th className="px-4 py-2 font-medium">Aperta il</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {commesse.map((c) => (
              <tr
                key={c.id}
                className="group border-b border-border last:border-0 hover:bg-muted/40"
              >
                <td className="px-4 py-2.5 font-mono text-xs">
                  <Link
                    to="/commesse/$id"
                    params={{ id: c.id }}
                    className="hover:underline"
                  >
                    {c.codice}
                  </Link>
                </td>
                <td className="px-4 py-2.5">
                  <Link
                    to="/commesse/$id"
                    params={{ id: c.id }}
                    className="font-medium hover:underline"
                  >
                    {c.titolo}
                  </Link>
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">{c.cliente}</td>
                <td className="px-4 py-2.5">
                  <Badge variant={c.stato}>{c.stato}</Badge>
                </td>
                <td className="px-4 py-2.5 text-right font-medium tabular-nums">
                  {formatEuro(c.prezzoPattuito)}
                </td>
                <td className="px-4 py-2.5 tabular-nums text-muted-foreground">
                  {c.dataApertura}
                </td>
                <td className="px-2">
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}

const inputCls =
  "rounded-md border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:border-foreground/40";

function NuovaCommessaForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="mb-4 rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <div className="text-sm font-semibold">Nuova commessa</div>
          <div className="text-xs text-muted-foreground">
            Le opzioni di preventivo e le righe di costo si aggiungono dal dettaglio.
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded p-1 text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onClose();
        }}
        className="grid gap-4 px-4 py-4 md:grid-cols-2"
      >
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-medium">
            Codice <span className="text-red-600">*</span>
          </span>
          <input
            className={cn(inputCls, "font-mono text-xs")}
            defaultValue="B3D-COM-2026-0004"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-medium">
            Cliente <span className="text-red-600">*</span>
          </span>
          <select className={inputCls} defaultValue="">
            <option value="" disabled>
              Seleziona cliente…
            </option>
            {clienti.map((c) => (
              <option key={c.id} value={c.id}>
                {c.denominazione}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="text-[11px] font-medium">
            Titolo <span className="text-red-600">*</span>
          </span>
          <input className={inputCls} placeholder="Es. Prototipo custodia sensori" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-medium">Data apertura</span>
          <input className={inputCls} defaultValue="15/06/2026" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-medium">Consegna prevista</span>
          <input className={inputCls} placeholder="gg/mm/aaaa" />
        </label>
        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="text-[11px] font-medium">Note iniziali</span>
          <textarea
            className={cn(inputCls, "min-h-20 resize-y")}
            placeholder="Requisiti, materiali richiesti, riferimenti conversazione…"
          />
        </label>
        <div className="md:col-span-2 mt-2 flex items-center justify-end gap-2 border-t border-border pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted"
          >
            Annulla
          </button>
          <button
            type="submit"
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            Crea commessa
          </button>
        </div>
      </form>
    </div>
  );
}
