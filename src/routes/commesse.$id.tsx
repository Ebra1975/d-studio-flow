import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/status-badge";
import { commesse, formatEuro, formatNumber, type OpzionePreventivo, type RigaCosto, type Allegato } from "@/lib/mock-data";
import {
  ArrowLeft,
  Check,
  FileText,
  Paperclip,
  Pencil,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/commesse/$id")({
  loader: ({ params }) => {
    const commessa = commesse.find((c) => c.id === params.id);
    if (!commessa) throw notFound();
    return { commessa };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.commessa.codice} — Bottega 3D`
          : "Commessa — Bottega 3D",
      },
    ],
  }),
  component: DettaglioCommessa,
  notFoundComponent: () => (
    <PageShell title="Commessa non trovata">
      <Link to="/commesse" className="text-sm underline">
        Torna all'elenco
      </Link>
    </PageShell>
  ),
});

function DettaglioCommessa() {
  const { commessa } = Route.useLoaderData();

  const opzioneScelta = commessa.opzioni.find((o: OpzionePreventivo) => o.scelta);
  const totaleCosti = commessa.righeCosto.reduce((s: number, r: RigaCosto) => s + r.costoTotale, 0);

  const margine = commessa.prezzoPattuito - totaleCosti;
  const marginePerc = margine / commessa.prezzoPattuito;

  return (
    <PageShell
      title={commessa.titolo}
      description={`${commessa.codice} · ${commessa.cliente}`}

      actions={
        <>
          <Link
            to="/commesse"
            className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Elenco
          </Link>
          <button className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted">
            <Pencil className="h-3.5 w-3.5" />
            Modifica
          </button>
        </>
      }
    >
      {/* Intestazione riepilogo */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryTile label="Stato">
          <Badge variant={commessa.stato}>{commessa.stato}</Badge>
        </SummaryTile>
        <SummaryTile label="Prezzo pattuito">
          <span className="text-lg font-semibold tabular-nums">
            {formatEuro(commessa.prezzoPattuito)}
          </span>
        </SummaryTile>
        <SummaryTile label="Costi interni stimati">
          <span className="text-lg font-semibold tabular-nums">
            {formatEuro(totaleCosti)}
          </span>
        </SummaryTile>
        <SummaryTile label="Margine">
          <div className="flex items-baseline gap-2">
            <span
              className={cn(
                "text-lg font-semibold tabular-nums",
                margine >= 0 ? "text-emerald-700" : "text-red-700",
              )}
            >
              {formatEuro(margine)}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {formatNumber(marginePerc * 100, 1)}%
            </span>
          </div>
        </SummaryTile>
      </div>

      {/* OPZIONI DI PREVENTIVO */}
      <section className="mb-6">
        <SectionHeader
          title="Opzioni di preventivo"
          hint="Scenari alternativi proposti al cliente. L'opzione evidenziata è quella scelta."
        />
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Opzione</th>
                <th className="px-4 py-2.5 font-medium">Materiale</th>
                <th className="px-4 py-2.5 font-medium">Stampante</th>
                <th className="px-4 py-2.5 font-medium">Durata UV</th>
                <th className="px-4 py-2.5 font-medium text-right">Q.tà</th>
                <th className="px-4 py-2.5 font-medium text-right">Prezzo unit.</th>
                <th className="px-4 py-2.5 font-medium text-right">Totale</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {commessa.opzioni.map((o: OpzionePreventivo) => (
                <tr
                  key={o.id}
                  className={cn(
                    "border-b border-border last:border-0",
                    o.scelta
                      ? "bg-emerald-50/60 hover:bg-emerald-50"
                      : "hover:bg-muted/40",
                  )}
                >
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center gap-2">
                      {o.scelta && (
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                          <Check className="h-2.5 w-2.5" strokeWidth={4} />
                        </span>
                      )}
                      <div>
                        <div className="font-medium">{o.nome}</div>
                        {o.note && (
                          <div className="text-[11px] text-muted-foreground">
                            {o.note}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top text-muted-foreground">
                    {o.materiale}
                  </td>
                  <td className="px-4 py-3 align-top text-muted-foreground">
                    {o.stampante}
                  </td>
                  <td className="px-4 py-3 align-top text-muted-foreground">
                    {o.durataUV}
                  </td>
                  <td className="px-4 py-3 text-right align-top tabular-nums">
                    {o.quantita}
                  </td>
                  <td className="px-4 py-3 text-right align-top tabular-nums">
                    {formatEuro(o.prezzoUnitario)}
                  </td>
                  <td className="px-4 py-3 text-right align-top font-medium tabular-nums">
                    {formatEuro(o.totale)}
                  </td>
                  <td className="px-4 py-3 align-top">
                    {o.scelta ? (
                      <Badge variant="confermata">scelta</Badge>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            {opzioneScelta && (
              <tfoot>
                <tr className="border-t-2 border-border bg-muted/30 text-xs">
                  <td colSpan={6} className="px-4 py-2.5 text-muted-foreground">
                    Totale opzione scelta ({opzioneScelta.nome})
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium tabular-nums">
                    {formatEuro(opzioneScelta.totale)}
                  </td>
                  <td></td>
                </tr>
                <tr className="bg-muted/60 text-xs">
                  <td colSpan={6} className="px-4 py-2.5 font-medium">
                    Prezzo pattuito finale (dopo trattativa)
                  </td>
                  <td className="px-4 py-2.5 text-right text-sm font-semibold tabular-nums">
                    {formatEuro(commessa.prezzoPattuito)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* RIGHE DI COSTO */}
        <section className="lg:col-span-2">
          <SectionHeader
            title="Righe di costo (opzione scelta)"
            hint="Vista interna — non condivisa con il cliente"
          />
          <div className="rounded-lg border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Categoria</th>
                  <th className="px-4 py-2 font-medium">Descrizione</th>
                  <th className="px-4 py-2 font-medium text-right">Quantità</th>
                  <th className="px-4 py-2 font-medium text-right">Costo unit.</th>
                  <th className="px-4 py-2 font-medium text-right">Totale</th>
                </tr>
              </thead>
              <tbody>
                {commessa.righeCosto.map((r: RigaCosto) => (
                  <tr
                    key={r.id}
                    className="border-b border-border last:border-0 hover:bg-muted/40"
                  >
                    <td className="px-4 py-2.5">
                      <span className="rounded-md border border-border bg-muted/60 px-1.5 py-0.5 text-[11px] font-medium capitalize">
                        {r.categoria}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">{r.descrizione}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                      {r.quantita}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                      {formatEuro(r.costoUnitario)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium tabular-nums">
                      {formatEuro(r.costoTotale)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-muted/40 text-xs">
                  <td colSpan={4} className="px-4 py-2.5 font-medium">
                    Totale costi interni
                  </td>
                  <td className="px-4 py-2.5 text-right text-sm font-semibold tabular-nums">
                    {formatEuro(totaleCosti)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* ALLEGATI */}
        <section>
          <SectionHeader
            title="Documenti allegati"
            hint={`${commessa.allegati.length} file`}
          />
          <div className="rounded-lg border border-border bg-card">
            <ul className="divide-y divide-border">
              {commessa.allegati.map((a: Allegato) => (
                <li
                  key={a.id}
                  className="flex items-start gap-3 px-4 py-3 text-sm hover:bg-muted/40"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium">{a.nome}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-md border border-border bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium capitalize">
                        {a.tipo}
                      </span>
                      <Badge variant={a.statoFirma}>firma: {a.statoFirma}</Badge>
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      Caricato il {a.dataCaricamento}
                    </div>
                  </div>
                  <button className="rounded p-1 text-muted-foreground hover:bg-muted">
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
            <button className="flex w-full items-center justify-center gap-1.5 border-t border-border py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted/40 hover:text-foreground">
              <Paperclip className="h-3.5 w-3.5" />
              Aggiungi allegato
            </button>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

function SummaryTile({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-2 flex items-baseline justify-between">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  );
}
