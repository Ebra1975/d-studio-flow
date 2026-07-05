import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/status-badge";
import {
  materiali as materialiSeed,
  formatEuro,
  type Materiale,
  type CategoriaMateriale,
  type TipoMateriale,
} from "@/lib/mock-data";
import { Plus, AlertTriangle, Search, X, ChevronRight } from "lucide-react";
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

const CATEGORIE: Array<{ value: CategoriaMateriale | "tutti"; label: string }> = [
  { value: "tutti", label: "Tutti" },
  { value: "primario", label: "Primario" },
  { value: "secondario", label: "Secondario" },
  { value: "attrezzatura", label: "Attrezzatura" },
];

const TIPI_MATERIALE: TipoMateriale[] = ["filamento", "resina", "polvere", "altro"];

function isSottoScorta(m: Materiale) {
  return (
    m.giacenzaAttuale !== null &&
    m.scortaMinima !== null &&
    m.giacenzaAttuale < m.scortaMinima
  );
}

function MagazzinoPage() {
  const [materiali, setMateriali] = useState<Materiale[]>(materialiSeed);
  const [categoria, setCategoria] = useState<CategoriaMateriale | "tutti">("tutti");
  const [query, setQuery] = useState("");
  const [nuovoOpen, setNuovoOpen] = useState(false);

  const filtrati = useMemo(() => {
    const q = query.trim().toLowerCase();
    return materiali.filter((m) => {
      if (categoria !== "tutti" && m.categoria !== categoria) return false;
      if (q && !m.nome.toLowerCase().includes(q) && !m.marca.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [materiali, categoria, query]);

  const critici = materiali.filter(isSottoScorta).length;

  return (
    <PageShell
      title="Magazzino"
      description={`${materiali.length} voci · ${critici} sotto scorta`}
      actions={
        <button
          onClick={() => setNuovoOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" />
          Nuovo materiale
        </button>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-md border border-border bg-card p-0.5">
          {CATEGORIE.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategoria(c.value)}
              className={cn(
                "rounded px-2.5 py-1 text-xs font-medium transition-colors",
                categoria === c.value
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="relative min-w-[220px] flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca per nome o marca…"
            className="w-full rounded-md border border-input bg-background py-1.5 pl-8 pr-3 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {nuovoOpen && (
        <NuovoMaterialeForm
          onCancel={() => setNuovoOpen(false)}
          onSave={(m) => {
            setMateriali((prev) => [...prev, m]);
            setNuovoOpen(false);
          }}
        />
      )}

      <div className="rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2 font-medium">Nome</th>
              <th className="px-4 py-2 font-medium">Categoria</th>
              <th className="px-4 py-2 font-medium">Tipo</th>
              <th className="px-4 py-2 font-medium">Marca</th>
              <th className="px-4 py-2 font-medium">Colore</th>
              <th className="px-4 py-2 font-medium text-right">Costo unit.</th>
              <th className="px-4 py-2 font-medium text-right">Giacenza</th>
              <th className="px-4 py-2 font-medium text-right">Scorta min.</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {filtrati.map((m) => {
              const critico = isSottoScorta(m);
              return (
                <tr
                  key={m.id}
                  className={cn(
                    "border-b border-border last:border-0 hover:bg-muted/40",
                    critico && "bg-red-50/40",
                  )}
                >
                  <td className="px-4 py-2.5">
                    <Link
                      to="/magazzino/$id"
                      params={{ id: m.id }}
                      className="font-medium hover:underline"
                    >
                      {m.nome}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge variant={m.categoria}>{m.categoria}</Badge>
                  </td>
                  <td className="px-4 py-2.5">
                    {m.tipoMateriale ? (
                      <Badge variant={m.tipoMateriale}>{m.tipoMateriale}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{m.marca}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{m.colore}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    {formatEuro(m.costoUnitario)}
                    <span className="text-muted-foreground"> / {m.unitaMisura}</span>
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    {m.giacenzaAttuale === null ? (
                      <span className="text-muted-foreground">—</span>
                    ) : critico ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-red-700">
                        <AlertTriangle className="h-3 w-3" />
                        {m.giacenzaAttuale} {m.unitaMisura}
                      </span>
                    ) : (
                      <span>
                        {m.giacenzaAttuale} {m.unitaMisura}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                    {m.scortaMinima === null
                      ? "—"
                      : `${m.scortaMinima} ${m.unitaMisura}`}
                  </td>
                  <td className="px-2 py-2.5 text-right">
                    <Link
                      to="/magazzino/$id"
                      params={{ id: m.id }}
                      className="inline-flex items-center rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
            {filtrati.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-xs text-muted-foreground">
                  Nessun materiale corrisponde al filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}

function NuovoMaterialeForm({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (m: Materiale) => void;
}) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState<CategoriaMateriale>("primario");
  const [tipoMateriale, setTipoMateriale] = useState<TipoMateriale>("filamento");
  const [marca, setMarca] = useState("");
  const [colore, setColore] = useState("");
  const [unitaMisura, setUnitaMisura] = useState("kg");
  const [costoUnitario, setCostoUnitario] = useState("");
  const [scortaMinima, setScortaMinima] = useState("");
  const [note, setNote] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: `mat-${Date.now()}`,
      nome: nome || "Senza nome",
      categoria,
      tipoMateriale: categoria === "primario" ? tipoMateriale : null,
      marca,
      colore: colore || "—",
      unitaMisura,
      costoUnitario: Number(costoUnitario) || 0,
      scortaMinima: scortaMinima ? Number(scortaMinima) : null,
      giacenzaAttuale: 0,
      note: note || undefined,
    });
  };

  return (
    <form
      onSubmit={submit}
      className="mb-4 rounded-lg border border-border bg-muted/30 p-4"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Nuovo materiale</h3>
        <button
          type="button"
          onClick={onCancel}
          className="rounded p-1 text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Field label="Nome">
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="input-b3d"
          />
        </Field>
        <Field label="Categoria">
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value as CategoriaMateriale)}
            className="input-b3d"
          >
            <option value="primario">primario</option>
            <option value="secondario">secondario</option>
            <option value="attrezzatura">attrezzatura</option>
          </select>
        </Field>
        {categoria === "primario" && (
          <Field label="Tipo materiale">
            <select
              value={tipoMateriale}
              onChange={(e) => setTipoMateriale(e.target.value as TipoMateriale)}
              className="input-b3d"
            >
              {TIPI_MATERIALE.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field label="Marca">
          <input
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            className="input-b3d"
          />
        </Field>
        <Field label="Colore">
          <input
            value={colore}
            onChange={(e) => setColore(e.target.value)}
            className="input-b3d"
          />
        </Field>
        <Field label="Unità di misura">
          <input
            value={unitaMisura}
            onChange={(e) => setUnitaMisura(e.target.value)}
            className="input-b3d"
          />
        </Field>
        <Field label="Costo unitario (€)">
          <input
            type="number"
            step="0.01"
            value={costoUnitario}
            onChange={(e) => setCostoUnitario(e.target.value)}
            className="input-b3d"
          />
        </Field>
        <Field label="Scorta minima">
          <input
            type="number"
            step="0.01"
            value={scortaMinima}
            onChange={(e) => setScortaMinima(e.target.value)}
            className="input-b3d"
          />
        </Field>
        <div className="md:col-span-3">
          <Field label="Note">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="input-b3d resize-none"
            />
          </Field>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted"
        >
          Annulla
        </button>
        <button
          type="submit"
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        >
          Salva
        </button>
      </div>
    </form>
  );
}

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
