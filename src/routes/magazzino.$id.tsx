import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/status-badge";
import {
  materiali,
  lotti as lottiSeed,
  movimenti as movimentiSeed,
  commesse,
  formatEuro,
  type Lotto,
  type Movimento,
  type TipoMovimento,
} from "@/lib/mock-data";
import {
  ArrowLeft,
  Pencil,
  Plus,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/magazzino/$id")({
  loader: ({ params }) => {
    const materiale = materiali.find((m) => m.id === params.id);
    if (!materiale) throw notFound();
    return { materiale };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.materiale.nome} — Magazzino`
          : "Materiale — Magazzino",
      },
    ],
  }),
  component: DettaglioMateriale,
  notFoundComponent: () => (
    <PageShell title="Materiale non trovato">
      <Link to="/magazzino" className="text-sm underline">
        Torna al magazzino
      </Link>
    </PageShell>
  ),
});

const TIPI_MOVIMENTO: TipoMovimento[] = ["carico", "scarico", "rettifica"];

function DettaglioMateriale() {
  const { materiale } = Route.useLoaderData();

  const [lotti, setLotti] = useState<Lotto[]>(
    lottiSeed.filter((l) => l.materialeId === materiale.id),
  );
  const [movimenti, setMovimenti] = useState<Movimento[]>(
    movimentiSeed.filter((m) => m.materialeId === materiale.id),
  );

  const isConsumabile = materiale.categoria !== "attrezzatura";
  const critico =
    materiale.giacenzaAttuale !== null &&
    materiale.scortaMinima !== null &&
    materiale.giacenzaAttuale < materiale.scortaMinima;

  return (
    <PageShell
      title={materiale.nome}
      description={`${materiale.marca} · ${materiale.colore}`}
      actions={
        <>
          <Link
            to="/magazzino"
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
      {/* Riepilogo */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryTile label="Categoria">
          <Badge variant={materiale.categoria}>{materiale.categoria}</Badge>
        </SummaryTile>
        <SummaryTile label="Tipo materiale">
          {materiale.tipoMateriale ? (
            <Badge variant={materiale.tipoMateriale}>{materiale.tipoMateriale}</Badge>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </SummaryTile>
        <SummaryTile label="Costo unitario">
          <span className="text-lg font-semibold tabular-nums">
            {formatEuro(materiale.costoUnitario)}
          </span>
          <span className="ml-1 text-xs text-muted-foreground">
            / {materiale.unitaMisura}
          </span>
        </SummaryTile>
        <SummaryTile label="Giacenza attuale">
          {materiale.giacenzaAttuale === null ? (
            <span className="text-sm text-muted-foreground">non tracciata</span>
          ) : (
            <div className="flex items-baseline gap-2">
              <span
                className={cn(
                  "text-lg font-semibold tabular-nums",
                  critico && "text-red-700",
                )}
              >
                {materiale.giacenzaAttuale} {materiale.unitaMisura}
              </span>
              {critico && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-red-700">
                  <AlertTriangle className="h-3 w-3" />
                  sotto scorta
                </span>
              )}
              {materiale.scortaMinima !== null && (
                <span className="text-xs text-muted-foreground">
                  min {materiale.scortaMinima}
                </span>
              )}
            </div>
          )}
        </SummaryTile>
      </div>

      {materiale.note && (
        <div className="mb-6 rounded-md border border-border bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Note: </span>
          {materiale.note}
        </div>
      )}

      {isConsumabile ? (
        <div className="space-y-6">
          <LottiSection
            lotti={lotti}
            unita={materiale.unitaMisura}
            onAdd={(l) => setLotti((prev) => [...prev, l])}
            onDelete={(id) => setLotti((prev) => prev.filter((l) => l.id !== id))}
            materialeId={materiale.id}
          />
          <MovimentiSection
            movimenti={movimenti}
            lotti={lotti}
            unita={materiale.unitaMisura}
            onAdd={(m) => setMovimenti((prev) => [m, ...prev])}
            onDelete={(id) =>
              setMovimenti((prev) => prev.filter((m) => m.id !== id))
            }
            materialeId={materiale.id}
          />
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-8 text-center text-xs text-muted-foreground">
          L'attrezzatura non prevede lotti o movimenti — vengono tracciati solo i
          dati anagrafici.
        </div>
      )}
    </PageShell>
  );
}

/* ============================================================
 *  LOTTI
 * ============================================================ */
function LottiSection({
  lotti,
  unita,
  onAdd,
  onDelete,
  materialeId,
}: {
  lotti: Lotto[];
  unita: string;
  onAdd: (l: Lotto) => void;
  onDelete: (id: string) => void;
  materialeId: string;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [toDelete, setToDelete] = useState<string | null>(null);

  return (
    <section>
      <SectionHeader
        title={`Lotti (${lotti.length})`}
        hint="Ogni acquisto genera un lotto tracciato singolarmente"
        action={
          <button
            onClick={() => setFormOpen(true)}
            className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-2.5 py-1 text-xs font-medium hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" />
            Aggiungi lotto
          </button>
        }
      />

      {formOpen && (
        <LottoForm
          unita={unita}
          onCancel={() => setFormOpen(false)}
          onSave={(l) => {
            onAdd({ ...l, materialeId });
            setFormOpen(false);
          }}
        />
      )}

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2 font-medium">N° lotto</th>
              <th className="px-4 py-2 font-medium">Fornitore</th>
              <th className="px-4 py-2 font-medium text-right">Q.tà iniziale</th>
              <th className="px-4 py-2 font-medium text-right">Giacenza</th>
              <th className="px-4 py-2 font-medium text-right">Costo lotto</th>
              <th className="px-4 py-2 font-medium">Acquisto</th>
              <th className="px-4 py-2 font-medium">Scadenza</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {lotti.map((l) => (
              <tr key={l.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                <td className="px-4 py-2.5 font-medium">
                  {l.numeroLotto || <span className="text-muted-foreground">—</span>}
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">{l.fornitore}</td>
                <td className="px-4 py-2.5 text-right tabular-nums">
                  {l.quantitaIniziale} {unita}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums font-medium">
                  {l.giacenzaAttuale} {unita}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums">
                  {formatEuro(l.costoLotto)}
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">{l.dataAcquisto}</td>
                <td className="px-4 py-2.5">
                  <ScadenzaCell data={l.dataScadenza} />
                </td>
                <td className="px-2 py-2.5 text-right">
                  <button
                    onClick={() => setToDelete(l.id)}
                    className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-red-700"
                    aria-label="Elimina lotto"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            {lotti.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-xs text-muted-foreground">
                  Nessun lotto registrato per questo materiale.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AlertDialog open={toDelete !== null} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare il lotto?</AlertDialogTitle>
            <AlertDialogDescription>
              I movimenti collegati resteranno registrati, ma perderanno il
              riferimento al lotto.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toDelete) onDelete(toDelete);
                setToDelete(null);
              }}
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

function ScadenzaCell({ data }: { data?: string }) {
  if (!data) return <span className="text-muted-foreground">—</span>;
  const [g, m, y] = data.split("/").map(Number);
  const scad = new Date(y, m - 1, g).getTime();
  const now = Date.now();
  const scaduta = scad < now;
  const vicina = !scaduta && scad - now < 60 * 24 * 3600 * 1000; // 60gg
  return (
    <span
      className={cn(
        "text-xs tabular-nums",
        scaduta && "font-medium text-red-700",
        vicina && "font-medium text-amber-700",
        !scaduta && !vicina && "text-muted-foreground",
      )}
    >
      {data}
    </span>
  );
}

function LottoForm({
  unita,
  onCancel,
  onSave,
}: {
  unita: string;
  onCancel: () => void;
  onSave: (l: Lotto) => void;
}) {
  const [numeroLotto, setNumeroLotto] = useState("");
  const [fornitore, setFornitore] = useState("");
  const [quantitaIniziale, setQuantitaIniziale] = useState("");
  const [costoLotto, setCostoLotto] = useState("");
  const [dataAcquisto, setDataAcquisto] = useState("");
  const [dataScadenza, setDataScadenza] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const q = Number(quantitaIniziale) || 0;
        onSave({
          id: `lot-${Date.now()}`,
          materialeId: "",
          numeroLotto,
          fornitore: fornitore || "—",
          quantitaIniziale: q,
          giacenzaAttuale: q,
          costoLotto: Number(costoLotto) || 0,
          dataAcquisto: dataAcquisto || "—",
          dataScadenza: dataScadenza || undefined,
        });
      }}
      className="mb-3 rounded-lg border border-border bg-muted/30 p-4"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold">Nuovo lotto</h3>
        <button
          type="button"
          onClick={onCancel}
          className="rounded p-1 text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Field label="N° lotto (opzionale)">
          <input value={numeroLotto} onChange={(e) => setNumeroLotto(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Fornitore">
          <input value={fornitore} onChange={(e) => setFornitore(e.target.value)} className={inputCls} />
        </Field>
        <Field label={`Quantità iniziale (${unita})`}>
          <input type="number" step="0.01" value={quantitaIniziale} onChange={(e) => setQuantitaIniziale(e.target.value)} required className={inputCls} />
        </Field>
        <Field label="Costo lotto totale (€)">
          <input type="number" step="0.01" value={costoLotto} onChange={(e) => setCostoLotto(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Data acquisto (gg/mm/aaaa)">
          <input value={dataAcquisto} onChange={(e) => setDataAcquisto(e.target.value)} placeholder="01/07/2026" className={inputCls} />
        </Field>
        <Field label="Data scadenza (opzionale)">
          <input value={dataScadenza} onChange={(e) => setDataScadenza(e.target.value)} placeholder="gg/mm/aaaa" className={inputCls} />
        </Field>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted">
          Annulla
        </button>
        <button type="submit" className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
          Salva lotto
        </button>
      </div>
    </form>
  );
}

/* ============================================================
 *  MOVIMENTI
 * ============================================================ */
function MovimentiSection({
  movimenti,
  lotti,
  unita,
  onAdd,
  onDelete,
  materialeId,
}: {
  movimenti: Movimento[];
  lotti: Lotto[];
  unita: string;
  onAdd: (m: Movimento) => void;
  onDelete: (id: string) => void;
  materialeId: string;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [toDelete, setToDelete] = useState<string | null>(null);

  const ordinati = useMemo(
    () =>
      [...movimenti].sort((a, b) => {
        const [ga, ma, ya] = a.data.split("/").map(Number);
        const [gb, mb, yb] = b.data.split("/").map(Number);
        return new Date(yb, mb - 1, gb).getTime() - new Date(ya, ma - 1, ga).getTime();
      }),
    [movimenti],
  );

  return (
    <section>
      <SectionHeader
        title={`Movimenti (${movimenti.length})`}
        hint="Storico cronologico — i movimenti non sono modificabili"
        action={
          <button
            onClick={() => setFormOpen(true)}
            className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-2.5 py-1 text-xs font-medium hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" />
            Registra movimento
          </button>
        }
      />

      {formOpen && (
        <MovimentoForm
          lotti={lotti}
          unita={unita}
          onCancel={() => setFormOpen(false)}
          onSave={(m) => {
            onAdd({ ...m, materialeId });
            setFormOpen(false);
          }}
        />
      )}

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2 font-medium">Data</th>
              <th className="px-4 py-2 font-medium">Tipo</th>
              <th className="px-4 py-2 font-medium text-right">Quantità</th>
              <th className="px-4 py-2 font-medium">Lotto</th>
              <th className="px-4 py-2 font-medium">Commessa</th>
              <th className="px-4 py-2 font-medium">Note</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {ordinati.map((m) => {
              const lotto = lotti.find((l) => l.id === m.lottoId);
              const commessa = commesse.find((c) => c.id === m.commessaId);
              const segno =
                m.tipo === "carico" ? "+" : m.tipo === "scarico" ? "−" : m.quantita >= 0 ? "+" : "−";
              const q = Math.abs(m.quantita);
              return (
                <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                  <td className="px-4 py-2.5 text-muted-foreground tabular-nums">{m.data}</td>
                  <td className="px-4 py-2.5">
                    <Badge variant={m.tipo}>{m.tipo}</Badge>
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums font-medium">
                    {segno} {q} {unita}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {lotto ? lotto.numeroLotto || lotto.fornitore : "—"}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {commessa ? (
                      <Link to="/commesse/$id" params={{ id: commessa.id }} className="hover:underline">
                        {commessa.codice}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{m.note || "—"}</td>
                  <td className="px-2 py-2.5 text-right">
                    <button
                      onClick={() => setToDelete(m.id)}
                      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-red-700"
                      aria-label="Elimina movimento"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {ordinati.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-xs text-muted-foreground">
                  Nessun movimento registrato.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AlertDialog open={toDelete !== null} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare il movimento?</AlertDialogTitle>
            <AlertDialogDescription>
              L'eliminazione ricalcola la giacenza del lotto collegato.
              I movimenti non sono modificabili: se serve correggere una
              quantità, registra una rettifica.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toDelete) onDelete(toDelete);
                setToDelete(null);
              }}
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

function MovimentoForm({
  lotti,
  unita,
  onCancel,
  onSave,
}: {
  lotti: Lotto[];
  unita: string;
  onCancel: () => void;
  onSave: (m: Movimento) => void;
}) {
  const [tipo, setTipo] = useState<TipoMovimento>("scarico");
  const [quantita, setQuantita] = useState("");
  const [lottoId, setLottoId] = useState<string>("");
  const [note, setNote] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          id: `mov-${Date.now()}`,
          materialeId: "",
          tipo,
          quantita: Number(quantita) || 0,
          lottoId: lottoId || null,
          commessaId: null,
          data: new Date().toLocaleDateString("it-IT"),
          note: note || undefined,
        });
      }}
      className="mb-3 rounded-lg border border-border bg-muted/30 p-4"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold">Nuovo movimento</h3>
        <button
          type="button"
          onClick={onCancel}
          className="rounded p-1 text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <Field label="Tipo">
          <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoMovimento)} className={inputCls}>
            {TIPI_MOVIMENTO.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label={`Quantità (${unita})`}>
          <input
            type="number"
            step="0.01"
            value={quantita}
            onChange={(e) => setQuantita(e.target.value)}
            required
            placeholder={tipo === "rettifica" ? "es. -0.1" : ""}
            className={inputCls}
          />
        </Field>
        <Field label="Lotto (opzionale)">
          <select value={lottoId} onChange={(e) => setLottoId(e.target.value)} className={inputCls}>
            <option value="">— nessuno —</option>
            {lotti.map((l) => (
              <option key={l.id} value={l.id}>
                {l.numeroLotto || l.fornitore}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Note">
          <input value={note} onChange={(e) => setNote(e.target.value)} className={inputCls} />
        </Field>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted">
          Annulla
        </button>
        <button type="submit" className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
          Registra
        </button>
      </div>
    </form>
  );
}

/* ============================================================
 *  UI HELPERS
 * ============================================================ */
const inputCls =
  "rounded-md border border-input bg-background px-2 py-1.5 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function SummaryTile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function SectionHeader({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-2 flex items-baseline justify-between gap-3">
      <div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {action}
    </div>
  );
}
