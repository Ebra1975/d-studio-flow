import { cn } from "@/lib/utils";
import type { StatoCommessa, TipoCliente, CategoriaMateriale } from "@/lib/mock-data";

const commessaStyles: Record<StatoCommessa, string> = {
  "preventivo inviato": "bg-slate-100 text-slate-700 border-slate-200",
  "in trattativa": "bg-amber-50 text-amber-800 border-amber-200",
  confermata: "bg-blue-50 text-blue-700 border-blue-200",
  "in produzione": "bg-indigo-50 text-indigo-700 border-indigo-200",
  consegnata: "bg-teal-50 text-teal-700 border-teal-200",
  fatturata: "bg-emerald-50 text-emerald-700 border-emerald-200",
  chiusa: "bg-neutral-100 text-neutral-600 border-neutral-200",
  annullata: "bg-red-50 text-red-700 border-red-200",
};

const clienteStyles: Record<TipoCliente, string> = {
  B2C: "bg-sky-50 text-sky-700 border-sky-200",
  B2B: "bg-violet-50 text-violet-700 border-violet-200",
  Associazione: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Volontariato: "bg-orange-50 text-orange-700 border-orange-200",
};

const materialeStyles: Record<CategoriaMateriale, string> = {
  primario: "bg-blue-50 text-blue-700 border-blue-200",
  secondario: "bg-slate-100 text-slate-700 border-slate-200",
  attrezzatura: "bg-purple-50 text-purple-700 border-purple-200",
};

const fatturaStyles: Record<string, string> = {
  "in attesa": "bg-amber-50 text-amber-800 border-amber-200",
  scaduta: "bg-red-50 text-red-700 border-red-300",
  pagata: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const jobStyles: Record<string, string> = {
  pianificato: "bg-slate-100 text-slate-700 border-slate-200",
  "in corso": "bg-indigo-50 text-indigo-700 border-indigo-200",
  completato: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const stampanteStyles: Record<string, string> = {
  attiva: "bg-emerald-50 text-emerald-700 border-emerald-200",
  manutenzione: "bg-amber-50 text-amber-800 border-amber-200",
  dismessa: "bg-neutral-100 text-neutral-500 border-neutral-200",
};

const firmaStyles: Record<string, string> = {
  "non richiesta": "bg-slate-100 text-slate-600 border-slate-200",
  "in attesa": "bg-amber-50 text-amber-800 border-amber-200",
  confermata: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const allStyles: Record<string, string> = {
  ...commessaStyles,
  ...clienteStyles,
  ...materialeStyles,
  ...fatturaStyles,
  ...jobStyles,
  ...stampanteStyles,
  ...firmaStyles,
};

export function Badge({
  children,
  variant,
  className,
}: {
  children: React.ReactNode;
  variant?: string;
  className?: string;
}) {
  const style = variant ? allStyles[variant] : "bg-muted text-foreground border-border";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-medium leading-tight whitespace-nowrap",
        style,
        className,
      )}
    >
      {children}
    </span>
  );
}
