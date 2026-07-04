import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/status-badge";
import {
  clienti,
  fornitori,
  formatEuro,
  type Cliente,
  type Fornitore,
  type PrezzoPersonalizzato,
  type PrezzoLavorazione,
} from "@/lib/mock-data";
import { Plus, Search, X, Check, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
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


export const Route = createFileRoute("/anagrafica")({
  head: () => ({
    meta: [
      { title: "Anagrafica — Bottega 3D" },
      { name: "description", content: "Clienti e fornitori del laboratorio." },
    ],
  }),
  component: AnagraficaPage,
});

type Tab = "clienti" | "fornitori";
type Mode = { kind: "list" } | { kind: "detail"; id: string } | { kind: "new" };

function AnagraficaPage() {
  const [tab, setTab] = useState<Tab>("clienti");
  const [mode, setMode] = useState<Mode>({ kind: "list" });

  return (
    <PageShell
      title="Anagrafica"
      description="Gestione clienti, fornitori e referenti"
      actions={
        <button
          onClick={() => setMode({ kind: "new" })}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" />
          Nuovo {tab === "clienti" ? "cliente" : "fornitore"}
        </button>
      }
    >
      <div className="mb-4 flex items-center gap-1 border-b border-border">
        {(["clienti", "fornitori"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setMode({ kind: "list" });
            }}
            className={cn(
              "border-b-2 px-3 py-2 text-xs font-medium capitalize transition-colors",
              tab === t
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
            <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] tabular-nums text-muted-foreground">
              {t === "clienti" ? clienti.length : fornitori.length}
            </span>
          </button>
        ))}
      </div>

      {mode.kind === "new" && tab === "clienti" && (
        <NuovoClienteForm onClose={() => setMode({ kind: "list" })} />
      )}
      {mode.kind === "new" && tab === "fornitori" && (
        <NuovoFornitoreForm onClose={() => setMode({ kind: "list" })} />
      )}
      {mode.kind !== "new" && tab === "clienti" && (
        <ClientiView
          selectedId={mode.kind === "detail" ? mode.id : null}
          onSelect={(id) => setMode({ kind: "detail", id })}
          onClose={() => setMode({ kind: "list" })}
        />
      )}
      {mode.kind !== "new" && tab === "fornitori" && (
        <FornitoriView
          selectedId={mode.kind === "detail" ? mode.id : null}
          onSelect={(id) => setMode({ kind: "detail", id })}
          onClose={() => setMode({ kind: "list" })}
        />
      )}
    </PageShell>
  );
}

function SearchBar() {
  return (
    <div className="relative w-64">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        placeholder="Cerca..."
        className="w-full rounded-md border border-input bg-background py-1.5 pl-8 pr-3 text-xs outline-none focus:border-foreground/40"
      />
    </div>
  );
}

function ClientiView({
  selectedId,
  onSelect,
  onClose,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const selected = selectedId ? clienti.find((c) => c.id === selectedId) : null;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr,420px]">
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <span className="text-xs font-medium">{clienti.length} clienti</span>
          <SearchBar />
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2 font-medium">Denominazione</th>
              <th className="px-4 py-2 font-medium">Tipo</th>
              <th className="px-4 py-2 font-medium text-right">Referenti</th>
            </tr>
          </thead>
          <tbody>
            {clienti.map((c) => (
              <tr
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={cn(
                  "cursor-pointer border-b border-border last:border-0 hover:bg-muted/40",
                  selectedId === c.id && "bg-muted/60",
                )}
              >
                <td className="px-4 py-2.5 font-medium">{c.denominazione}</td>
                <td className="px-4 py-2.5">
                  <Badge variant={c.tipo}>{c.tipo}</Badge>
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                  {c.tipo === "B2C" ? "—" : c.referenti.length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && <ClienteDetail cliente={selected} onClose={onClose} />}
    </div>
  );
}

function ClienteDetail({ cliente, onClose }: { cliente: Cliente; onClose: () => void }) {
  return (
    <aside className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <div className="text-sm font-semibold">{cliente.denominazione}</div>
          <div className="mt-1">
            <Badge variant={cliente.tipo}>{cliente.tipo}</Badge>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded p-1 text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 px-4 py-4 text-sm">
        <section>
          <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Dati anagrafici
          </h3>
          <dl className="space-y-1.5 text-xs">
            {cliente.partitaIva && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Partita IVA</dt>
                <dd className="font-mono">{cliente.partitaIva}</dd>
              </div>
            )}
            {cliente.codiceFiscale && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Codice fiscale</dt>
                <dd className="font-mono">{cliente.codiceFiscale}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Indirizzo</dt>
              <dd className="text-right">{cliente.indirizzo}</dd>
            </div>
          </dl>
        </section>

        {cliente.tipo !== "B2C" && (
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Referenti ({cliente.referenti.length})
              </h3>
              <button className="text-[11px] font-medium text-foreground hover:underline">
                + Aggiungi
              </button>
            </div>
            {cliente.referenti.length === 0 ? (
              <div className="rounded-md border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                Nessun referente inserito
              </div>
            ) : (
              <ul className="space-y-2">
                {cliente.referenti.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-md border border-border bg-background p-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-medium">{r.nome}</div>
                        {r.ruolo && (
                          <div className="text-xs text-muted-foreground">{r.ruolo}</div>
                        )}
                      </div>
                    </div>
                    <dl className="mt-2 space-y-1 text-xs">
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">Email</dt>
                        <dd className="truncate">{r.email}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">Telefono</dt>
                        <dd className="tabular-nums">{r.telefono}</dd>
                      </div>
                    </dl>
                    <div className="mt-3 flex flex-col gap-1.5 border-t border-border pt-3">
                      <FlagRow
                        active={r.principale}
                        label="Referente principale"
                      />
                      <FlagRow
                        active={r.gestisceAmministrazione}
                        label="Gestisce amministrazione"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        <ListinoSection cliente={cliente} />
      </div>

    </aside>
  );
}

function FlagRow({ active, label }: { active: boolean; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-xs">
      <span
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded border transition-colors",
          active
            ? "border-foreground bg-foreground text-background"
            : "border-input bg-background",
        )}
      >
        {active && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      <span className={active ? "font-medium" : "text-muted-foreground"}>{label}</span>
    </label>
  );
}

function FornitoriView({
  selectedId,
  onSelect,
  onClose,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const selected = selectedId ? fornitori.find((f) => f.id === selectedId) : null;
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr,420px]">
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <span className="text-xs font-medium">{fornitori.length} fornitori</span>
          <SearchBar />
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2 font-medium">Denominazione</th>
              <th className="px-4 py-2 font-medium">Partita IVA</th>
              <th className="px-4 py-2 font-medium text-right">Referenti</th>
            </tr>
          </thead>
          <tbody>
            {fornitori.map((f) => (
              <tr
                key={f.id}
                onClick={() => onSelect(f.id)}
                className={cn(
                  "cursor-pointer border-b border-border last:border-0 hover:bg-muted/40",
                  selectedId === f.id && "bg-muted/60",
                )}
              >
                <td className="px-4 py-2.5 font-medium">{f.denominazione}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                  {f.partitaIva}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                  {f.referenti.length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && <FornitoreDetail fornitore={selected} onClose={onClose} />}
    </div>
  );
}

function FornitoreDetail({
  fornitore,
  onClose,
}: {
  fornitore: Fornitore;
  onClose: () => void;
}) {
  return (
    <aside className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="text-sm font-semibold">{fornitore.denominazione}</div>
        <button
          onClick={onClose}
          className="rounded p-1 text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-4 px-4 py-4 text-sm">
        <dl className="space-y-1.5 text-xs">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Partita IVA</dt>
            <dd className="font-mono">{fornitore.partitaIva}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Indirizzo</dt>
            <dd className="text-right">{fornitore.indirizzo}</dd>
          </div>
        </dl>
        <section>
          <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Referenti ({fornitore.referenti.length})
          </h3>
          {fornitore.referenti.length === 0 ? (
            <div className="rounded-md border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
              Nessun referente inserito
            </div>
          ) : (
            <ul className="space-y-2">
              {fornitore.referenti.map((r) => (
                <li
                  key={r.id}
                  className="rounded-md border border-border bg-background p-3 text-xs"
                >
                  <div className="text-sm font-medium">{r.nome}</div>
                  {r.ruolo && <div className="text-muted-foreground">{r.ruolo}</div>}
                  <div className="mt-1 text-muted-foreground">{r.email}</div>
                  <div className="text-muted-foreground tabular-nums">{r.telefono}</div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <LavorazioniSection fornitore={fornitore} />
      </div>
    </aside>
  );
}


function Field({
  label,
  children,
  required,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-medium text-foreground">
        {label} {required && <span className="text-red-600">*</span>}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "rounded-md border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:border-foreground/40";

function NuovoClienteForm({ onClose }: { onClose: () => void }) {
  const [tipo, setTipo] = useState<"B2C" | "B2B" | "Associazione" | "Volontariato">(
    "B2B",
  );
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <div className="text-sm font-semibold">Nuovo cliente</div>
          <div className="text-xs text-muted-foreground">
            Compila i dati anagrafici. I referenti potranno essere aggiunti dopo.
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
        <Field label="Denominazione" required>
          <input className={inputCls} placeholder="Es. Studio Rossi SRL" />
        </Field>

        <Field label="Tipo cliente" required>
          <div className="flex flex-wrap gap-1.5">
            {(["B2C", "B2B", "Associazione", "Volontariato"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTipo(t)}
                className={cn(
                  "rounded-md border px-2.5 py-1 text-xs transition-colors",
                  tipo === t
                    ? "border-foreground bg-foreground text-background"
                    : "border-input bg-background hover:bg-muted",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </Field>

        {tipo !== "B2C" ? (
          <Field label="Partita IVA" required>
            <input className={inputCls} placeholder="IT12345678901" />
          </Field>
        ) : (
          <Field label="Codice fiscale" required>
            <input className={inputCls} placeholder="RSSMRA80A01H501U" />
          </Field>
        )}

        <Field label="Email">
          <input className={inputCls} placeholder="contatto@esempio.it" />
        </Field>

        <Field label="Indirizzo">
          <input
            className={inputCls}
            placeholder="Via, numero, CAP, città (provincia)"
          />
        </Field>

        <Field label="Telefono">
          <input className={inputCls} placeholder="+39 …" />
        </Field>

        <div className="md:col-span-2">
          <Field label="Note interne">
            <textarea
              className={cn(inputCls, "min-h-20 resize-y")}
              placeholder="Es. preferenze contatto, storico rapporto, condizioni particolari…"
            />
          </Field>
        </div>

        {tipo === "B2C" && (
          <div className="md:col-span-2 rounded-md border border-dashed border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            Cliente B2C: il cliente stesso è l'unico contatto, non verranno gestiti
            referenti separati.
          </div>
        )}

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
            Salva cliente
          </button>
        </div>
      </form>
    </div>
  );
}

function NuovoFornitoreForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="text-sm font-semibold">Nuovo fornitore</div>
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
        <Field label="Denominazione" required>
          <input className={inputCls} />
        </Field>
        <Field label="Partita IVA" required>
          <input className={inputCls} />
        </Field>
        <Field label="Indirizzo">
          <input className={inputCls} />
        </Field>
        <Field label="Email">
          <input className={inputCls} />
        </Field>
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
            Salva fornitore
          </button>
        </div>
      </form>
    </div>
  );
}

// ============================================================
// LISTINO PERSONALIZZATO (Cliente)
// ============================================================

const MATERIALI_OPZIONI = ["PLA Nero", "PETG Trasparente", "ASA Bianco"];

type ListinoDraft = {
  materiale: string;
  prezzo: string;
  validoDal: string;
  validoAl: string;
};

const emptyListinoDraft: ListinoDraft = {
  materiale: MATERIALI_OPZIONI[0],
  prezzo: "",
  validoDal: "",
  validoAl: "",
};

function isoToIt(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}
function itToIso(it: string): string {
  if (!it) return "";
  const [d, m, y] = it.split("/");
  if (!y || !m || !d) return "";
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function ListinoSection({ cliente }: { cliente: Cliente }) {
  const [items, setItems] = useState<PrezzoPersonalizzato[]>(
    () => cliente.listino ?? [],
  );
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<ListinoDraft>(emptyListinoDraft);
  const [toDelete, setToDelete] = useState<PrezzoPersonalizzato | null>(null);

  function openNew() {
    setDraft(emptyListinoDraft);
    setEditing("new");
  }
  function openEdit(p: PrezzoPersonalizzato) {
    setDraft({
      materiale: p.materiale,
      prezzo: String(p.prezzo).replace(".", ","),
      validoDal: itToIso(p.validoDal),
      validoAl: p.validoAl ? itToIso(p.validoAl) : "",
    });
    setEditing(p.id);
  }
  function save(e: React.FormEvent) {
    e.preventDefault();
    const prezzoNum = parseFloat(draft.prezzo.replace(",", "."));
    if (!draft.materiale || Number.isNaN(prezzoNum) || !draft.validoDal) return;
    const record: PrezzoPersonalizzato = {
      id: editing === "new" ? `pp-${Date.now()}` : (editing as string),
      materiale: draft.materiale,
      prezzo: prezzoNum,
      validoDal: isoToIt(draft.validoDal),
      validoAl: draft.validoAl ? isoToIt(draft.validoAl) : undefined,
    };
    setItems((prev) =>
      editing === "new"
        ? [...prev, record]
        : prev.map((p) => (p.id === record.id ? record : p)),
    );
    setEditing(null);
  }
  function confirmDelete() {
    if (!toDelete) return;
    setItems((prev) => prev.filter((p) => p.id !== toDelete.id));
    setToDelete(null);
  }

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Listino personalizzato ({items.length})
        </h3>
        {editing === null && (
          <button
            onClick={openNew}
            className="text-[11px] font-medium text-foreground hover:underline"
          >
            + Aggiungi
          </button>
        )}
      </div>

      {editing !== null && (
        <form
          onSubmit={save}
          className="mb-2 space-y-2 rounded-md border border-border bg-background p-3"
        >
          <div className="grid grid-cols-2 gap-2">
            <label className="col-span-2 flex flex-col gap-1">
              <span className="text-[11px] font-medium">Materiale</span>
              <select
                value={draft.materiale}
                onChange={(e) => setDraft({ ...draft, materiale: e.target.value })}
                className={inputCls}
              >
                {MATERIALI_OPZIONI.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium">Prezzo (€)</span>
              <input
                type="text"
                inputMode="decimal"
                value={draft.prezzo}
                onChange={(e) => setDraft({ ...draft, prezzo: e.target.value })}
                className={inputCls}
                placeholder="18,50"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium">Valido dal</span>
              <input
                type="date"
                value={draft.validoDal}
                onChange={(e) => setDraft({ ...draft, validoDal: e.target.value })}
                className={inputCls}
              />
            </label>
            <label className="col-span-2 flex flex-col gap-1">
              <span className="text-[11px] font-medium">
                Valido al <span className="text-muted-foreground">(opzionale)</span>
              </span>
              <input
                type="date"
                value={draft.validoAl}
                onChange={(e) => setDraft({ ...draft, validoAl: e.target.value })}
                className={inputCls}
              />
            </label>
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-border pt-2">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-md border border-input bg-background px-2.5 py-1 text-xs font-medium hover:bg-muted"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              Salva
            </button>
          </div>
        </form>
      )}

      {items.length === 0 && editing === null ? (
        <div className="rounded-md border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
          Nessun prezzo personalizzato — si applica il listino base
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((p) => (
            <li
              key={p.id}
              className="rounded-md border border-border bg-background p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{p.materiale}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    {p.validoAl
                      ? `Valido dal ${p.validoDal} al ${p.validoAl}`
                      : `Valido dal ${p.validoDal} — senza scadenza`}
                  </div>
                </div>
                <div className="whitespace-nowrap text-sm font-semibold tabular-nums">
                  {formatEuro(p.prezzo)}
                </div>
              </div>
              <div className="mt-2 flex items-center justify-end gap-3 border-t border-border pt-2 text-[11px]">
                <button
                  onClick={() => openEdit(p)}
                  className="inline-flex items-center gap-1 text-foreground hover:underline"
                >
                  <Pencil className="h-3 w-3" /> Modifica
                </button>
                <button
                  onClick={() => setToDelete(p)}
                  className="inline-flex items-center gap-1 text-destructive hover:underline"
                >
                  <Trash2 className="h-3 w-3" /> Elimina
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <AlertDialog open={toDelete !== null} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare il prezzo personalizzato?</AlertDialogTitle>
            <AlertDialogDescription>
              Il prezzo personalizzato per{" "}
              <span className="font-medium text-foreground">
                {toDelete?.materiale}
              </span>{" "}
              verrà rimosso. Il cliente tornerà ad usare il listino base.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Elimina</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

// ============================================================
// PREZZI DI RIFERIMENTO LAVORAZIONI (Fornitore)
// ============================================================

const UNITA_OPZIONI = ["a pezzo", "al kg", "forfait", "all'ora"];

type LavorazioneDraft = {
  descrizione: string;
  prezzo: string;
  unita: string;
};

const emptyLavDraft: LavorazioneDraft = {
  descrizione: "",
  prezzo: "",
  unita: UNITA_OPZIONI[0],
};

function LavorazioniSection({ fornitore }: { fornitore: Fornitore }) {
  const [items, setItems] = useState<PrezzoLavorazione[]>(
    () => fornitore.lavorazioni ?? [],
  );
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<LavorazioneDraft>(emptyLavDraft);
  const [toDelete, setToDelete] = useState<PrezzoLavorazione | null>(null);

  function openNew() {
    setDraft(emptyLavDraft);
    setEditing("new");
  }
  function openEdit(l: PrezzoLavorazione) {
    setDraft({
      descrizione: l.descrizione,
      prezzo: l.prezzo !== undefined ? String(l.prezzo).replace(".", ",") : "",
      unita: l.unita,
    });
    setEditing(l.id);
  }
  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.descrizione.trim() || !draft.unita) return;
    const prezzoNum = draft.prezzo
      ? parseFloat(draft.prezzo.replace(",", "."))
      : undefined;
    const record: PrezzoLavorazione = {
      id: editing === "new" ? `lav-${Date.now()}` : (editing as string),
      descrizione: draft.descrizione.trim(),
      prezzo:
        prezzoNum !== undefined && !Number.isNaN(prezzoNum) ? prezzoNum : undefined,
      unita: draft.unita,
    };
    setItems((prev) =>
      editing === "new"
        ? [...prev, record]
        : prev.map((l) => (l.id === record.id ? record : l)),
    );
    setEditing(null);
  }
  function confirmDelete() {
    if (!toDelete) return;
    setItems((prev) => prev.filter((l) => l.id !== toDelete.id));
    setToDelete(null);
  }

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Prezzi di riferimento lavorazioni ({items.length})
        </h3>
        {editing === null && (
          <button
            onClick={openNew}
            className="text-[11px] font-medium text-foreground hover:underline"
          >
            + Aggiungi
          </button>
        )}
      </div>

      {editing !== null && (
        <form
          onSubmit={save}
          className="mb-2 space-y-2 rounded-md border border-border bg-background p-3"
        >
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-medium">Descrizione lavorazione</span>
            <input
              type="text"
              value={draft.descrizione}
              onChange={(e) => setDraft({ ...draft, descrizione: e.target.value })}
              className={inputCls}
              placeholder="Es. Verniciatura UV-resistant standard"
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium">
                Prezzo (€) <span className="text-muted-foreground">(opzionale)</span>
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={draft.prezzo}
                onChange={(e) => setDraft({ ...draft, prezzo: e.target.value })}
                className={inputCls}
                placeholder="—"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium">Unità di misura</span>
              <select
                value={draft.unita}
                onChange={(e) => setDraft({ ...draft, unita: e.target.value })}
                className={inputCls}
              >
                {UNITA_OPZIONI.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="text-[11px] italic text-muted-foreground">
            Il prezzo è indicativo, dall'ultimo preventivo ricevuto — non vincolante
            per il prossimo lavoro.
          </p>
          <div className="flex items-center justify-end gap-2 border-t border-border pt-2">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-md border border-input bg-background px-2.5 py-1 text-xs font-medium hover:bg-muted"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              Salva
            </button>
          </div>
        </form>
      )}

      {items.length === 0 && editing === null ? (
        <div className="rounded-md border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
          Nessun prezzo registrato — i costi reali arrivano da preventivi caso per
          caso
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((l) => (
            <li
              key={l.id}
              className="rounded-md border border-border bg-background p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{l.descrizione}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    {l.unita}
                  </div>
                </div>
                <div
                  className={cn(
                    "whitespace-nowrap text-sm tabular-nums",
                    l.prezzo !== undefined
                      ? "font-semibold"
                      : "italic text-muted-foreground",
                  )}
                >
                  {l.prezzo !== undefined ? formatEuro(l.prezzo) : "da definire"}
                </div>
              </div>
              <div className="mt-2 flex items-center justify-end gap-3 border-t border-border pt-2 text-[11px]">
                <button
                  onClick={() => openEdit(l)}
                  className="inline-flex items-center gap-1 text-foreground hover:underline"
                >
                  <Pencil className="h-3 w-3" /> Modifica
                </button>
                <button
                  onClick={() => setToDelete(l)}
                  className="inline-flex items-center gap-1 text-destructive hover:underline"
                >
                  <Trash2 className="h-3 w-3" /> Elimina
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <AlertDialog open={toDelete !== null} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare la lavorazione?</AlertDialogTitle>
            <AlertDialogDescription>
              La lavorazione{" "}
              <span className="font-medium text-foreground">
                {toDelete?.descrizione}
              </span>{" "}
              verrà rimossa dai prezzi di riferimento del fornitore.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Elimina</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

