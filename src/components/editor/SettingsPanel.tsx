"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  EyeOff,
  ImagePlus,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { blockDef, blockIcon, blockLabel, type FieldDef, type HomeSection, type MediaRef } from "@/lib/homeBlocks";
import { getDeep, newRowId } from "./deep";
import { MediaPicker } from "./MediaPicker";

export type FieldScope = "ar" | "en" | "shared";

export type ArrayOp =
  | { kind: "move"; from: number; to: number }
  | { kind: "remove"; at: number }
  | { kind: "add"; row: Record<string, unknown> };

/**
 * Left panel, settings view — every field of the selected section.
 * Localized text fields show BOTH languages side by side (Arabic + English),
 * each saved to its own translation. Shared fields (links, images, numbers,
 * toggles) apply to both languages at once.
 * Schema-driven from homeBlocks.ts, so new block types need no UI work.
 */
export function SettingsPanel({
  sectionAr,
  sectionEn,
  index,
  total,
  onField,
  onArrayOp,
  onAction,
  onBack,
}: {
  sectionAr: HomeSection;
  sectionEn: HomeSection;
  index: number;
  total: number;
  onField: (index: number, path: string, value: unknown, scope: FieldScope) => void;
  onArrayOp: (index: number, path: string, op: ArrayOp) => void;
  onAction: (index: number, action: string) => void;
  onBack: () => void;
}) {
  const def = blockDef(sectionAr.type);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to sections"
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-base" aria-hidden>
          {blockIcon(sectionAr.type)}
        </span>
        <div className="min-w-0 flex-1 text-sm font-semibold text-zinc-100">{blockLabel(sectionAr.type)}</div>
        <div className="flex items-center gap-0.5">
          <HeaderButton title="Move up" disabled={index === 0} onClick={() => onAction(index, "up")}>
            <ArrowUp className="h-3.5 w-3.5" />
          </HeaderButton>
          <HeaderButton title="Move down" disabled={index === total - 1} onClick={() => onAction(index, "down")}>
            <ArrowDown className="h-3.5 w-3.5" />
          </HeaderButton>
          <HeaderButton title={sectionAr.hidden ? "Show" : "Hide"} onClick={() => onAction(index, "hide")}>
            {sectionAr.hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </HeaderButton>
          <HeaderButton title="Duplicate" onClick={() => onAction(index, "duplicate")}>
            <Copy className="h-3.5 w-3.5" />
          </HeaderButton>
          <HeaderButton title="Delete" danger onClick={() => onAction(index, "delete")}>
            <Trash2 className="h-3.5 w-3.5" />
          </HeaderButton>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3">
        {sectionAr.hidden && (
          <div className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-300">
            This section is hidden — visitors don&apos;t see it.
          </div>
        )}
        <p className="text-xs leading-relaxed text-zinc-500">
          💡 Text fields have two boxes: <span className="font-semibold text-zinc-300">عربي</span> and{" "}
          <span className="font-semibold text-zinc-300">EN</span> — each language is saved separately. You can
          also click text directly in the preview to edit the previewed language.
        </p>
        {def?.note && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-800/50 px-3 py-2 text-xs text-zinc-400">
            {def.note.text}{" "}
            <a
              href={def.note.manageHref}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-cyan-400 hover:underline"
            >
              {def.note.manageLabel} →
            </a>
          </div>
        )}
        {def?.fields.map((f) => (
          <FieldInput
            key={f.name}
            field={f}
            basePath=""
            ar={sectionAr}
            en={sectionEn}
            onField={(path, value, scope) => onField(index, path, value, scope)}
            onArrayOp={(path, op) => onArrayOp(index, path, op)}
          />
        ))}
      </div>
    </div>
  );
}

/* --------------------------------- fields --------------------------------- */

type FieldCtx = {
  field: FieldDef;
  basePath: string;
  ar: HomeSection;
  en: HomeSection;
  onField: (path: string, value: unknown, scope: FieldScope) => void;
  onArrayOp: (path: string, op: ArrayOp) => void;
};

const inputClasses =
  "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-cyan-400";

function LangTag({ lang }: { lang: "ar" | "en" }) {
  return (
    <span
      className="pointer-events-none absolute top-1/2 -translate-y-1/2 rounded bg-zinc-700 px-1 py-0.5 text-[9px] font-bold uppercase leading-none text-zinc-300"
      style={lang === "ar" ? { left: 8 } : { right: 8 }}
    >
      {lang === "ar" ? "ع" : "EN"}
    </span>
  );
}

function DualText({
  label,
  path,
  ar,
  en,
  onField,
  textarea,
  placeholder,
}: {
  label: string;
  path: string;
  ar: HomeSection;
  en: HomeSection;
  onField: FieldCtx["onField"];
  textarea?: boolean;
  placeholder?: string;
}) {
  const va = (getDeep(ar, path) as string) ?? "";
  const ve = (getDeep(en, path) as string) ?? "";
  const Render = (lang: "ar" | "en", value: string) => {
    const common = {
      value,
      placeholder: placeholder ?? (lang === "ar" ? "النص بالعربية" : "Text in English"),
      dir: lang === "ar" ? ("rtl" as const) : ("ltr" as const),
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        onField(path, e.target.value, lang),
      className: `${inputClasses} ${lang === "ar" ? "pe-8" : "pe-9"}`,
    };
    return (
      <div className="relative">
        {textarea ? <textarea rows={3} {...common} className={`${common.className} resize-y`} /> : <input type="text" {...common} />}
        <LangTag lang={lang} />
      </div>
    );
  };
  return (
    <Labeled label={label}>
      <div className="space-y-1.5">
        {Render("ar", va)}
        {Render("en", ve)}
      </div>
    </Labeled>
  );
}

function FieldInput(ctx: FieldCtx) {
  const { field, basePath, ar, en, onField, onArrayOp } = ctx;
  const path = basePath ? `${basePath}.${field.name}` : field.name;
  const shared = getDeep(ar, path);

  switch (field.kind) {
    case "text":
    case "textarea": {
      if (field.localized) {
        return (
          <DualText
            label={field.label}
            path={path}
            ar={ar}
            en={en}
            onField={onField}
            textarea={field.kind === "textarea"}
            placeholder={field.kind === "text" ? field.placeholder : undefined}
          />
        );
      }
      const value = typeof shared === "string" ? shared : "";
      return (
        <Labeled label={field.label}>
          {field.kind === "textarea" ? (
            <textarea
              value={value}
              rows={3}
              onChange={(e) => onField(path, e.target.value, "shared")}
              className={`${inputClasses} resize-y`}
            />
          ) : (
            <input
              type="text"
              value={value}
              placeholder={field.placeholder}
              onChange={(e) => onField(path, e.target.value, "shared")}
              className={inputClasses}
            />
          )}
        </Labeled>
      );
    }
    case "toggle":
      return (
        <label className="flex cursor-pointer items-center justify-between gap-3 py-1">
          <span className="text-xs font-medium text-zinc-400">{field.label}</span>
          <button
            type="button"
            role="switch"
            aria-checked={shared !== false}
            onClick={() => onField(path, shared === false, "shared")}
            className={`relative h-5 w-9 rounded-full transition-colors ${
              shared !== false ? "bg-cyan-400" : "bg-zinc-700"
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
                shared !== false ? "start-[18px]" : "start-0.5"
              }`}
            />
          </button>
        </label>
      );
    case "select":
      return (
        <Labeled label={field.label}>
          <select
            value={typeof shared === "string" ? shared : field.options[0]?.value}
            onChange={(e) => onField(path, e.target.value, "shared")}
            className={inputClasses}
          >
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Labeled>
      );
    case "image":
      return (
        <ImageField
          label={field.label}
          media={(shared as MediaRef) ?? null}
          fallbackUrl={
            field.urlName
              ? (getDeep(ar, basePath ? `${basePath}.${field.urlName}` : field.urlName) as string)
              : undefined
          }
          onChangeMedia={(m) => onField(path, m, "shared")}
        />
      );
    case "group":
      return (
        <div className="rounded-lg border border-zinc-800 p-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">{field.label}</div>
          <div className="space-y-3">
            {field.fields.map((f) => (
              <FieldInput key={f.name} {...ctx} field={f} basePath={path} />
            ))}
          </div>
        </div>
      );
    case "array":
      return <ArrayField {...ctx} field={field} path={path} onArrayOp={onArrayOp} />;
    default:
      return null;
  }
}

function ArrayField({
  field,
  path,
  ar,
  en,
  onField,
  onArrayOp,
}: FieldCtx & { field: Extract<FieldDef, { kind: "array" }>; path: string }) {
  const rows = (getDeep(ar, path) as Record<string, unknown>[]) || [];
  const rowsEn = (getDeep(en, path) as Record<string, unknown>[]) || [];
  const [open, setOpen] = useState<number | null>(null);

  const emptyRow = (): Record<string, unknown> => {
    const row: Record<string, unknown> = { id: newRowId() };
    for (const f of field.fields) {
      if (f.kind === "image") row[f.name] = null;
      else if (f.kind === "toggle") row[f.name] = true;
      else row[f.name] = "";
    }
    return row;
  };

  return (
    <div>
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500">{field.label}</div>
      <div className="space-y-1.5">
        {rows.map((row, i) => {
          const title =
            (row[field.titleField] as string) ||
            (rowsEn[i]?.[field.titleField] as string) ||
            `${field.itemLabel} ${i + 1}`;
          const isOpen = open === i;
          return (
            <div key={(row.id as string) ?? i} className="overflow-hidden rounded-lg border border-zinc-800">
              <div
                className="flex cursor-pointer items-center gap-2 bg-zinc-800/60 px-2.5 py-2"
                onClick={() => setOpen(isOpen ? null : i)}
              >
                {isOpen ? (
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                )}
                <span className="min-w-0 flex-1 truncate text-xs font-medium text-zinc-300">{title}</span>
                <span className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                  <RowButton
                    title="Move up"
                    onClick={() => {
                      onArrayOp(path, { kind: "move", from: i, to: i - 1 });
                      setOpen(null);
                    }}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </RowButton>
                  <RowButton
                    title="Move down"
                    onClick={() => {
                      onArrayOp(path, { kind: "move", from: i, to: i + 1 });
                      setOpen(null);
                    }}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </RowButton>
                  <RowButton title="Remove" danger onClick={() => onArrayOp(path, { kind: "remove", at: i })}>
                    <X className="h-3 w-3" />
                  </RowButton>
                </span>
              </div>
              {isOpen && (
                <div className="space-y-3 p-2.5">
                  {field.fields.map((f) => (
                    <FieldInput
                      key={f.name}
                      field={f}
                      basePath={`${path}.${i}`}
                      ar={ar}
                      en={en}
                      onField={onField}
                      onArrayOp={onArrayOp}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {(!field.max || rows.length < field.max) && (
        <button
          type="button"
          onClick={() => {
            onArrayOp(path, { kind: "add", row: emptyRow() });
            setOpen(rows.length);
          }}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-400 transition-colors hover:border-cyan-400/60 hover:text-cyan-300"
        >
          <Plus className="h-3.5 w-3.5" /> Add {field.itemLabel}
        </button>
      )}
    </div>
  );
}

function ImageField({
  label,
  media,
  fallbackUrl,
  onChangeMedia,
}: {
  label: string;
  media: MediaRef;
  fallbackUrl?: string;
  onChangeMedia: (m: MediaRef) => void;
}) {
  const [picking, setPicking] = useState(false);
  const preview = media?.url || fallbackUrl;

  return (
    <Labeled label={label}>
      <div className="overflow-hidden rounded-lg border border-zinc-700">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-28 w-full object-cover" />
        ) : (
          <div className="flex h-20 items-center justify-center bg-zinc-800 text-xs text-zinc-500">No image</div>
        )}
        <div className="flex divide-x divide-zinc-700 border-t border-zinc-700 bg-zinc-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setPicking(true)}
            className="flex flex-1 items-center justify-center gap-1.5 py-2 text-cyan-300 transition-colors hover:bg-zinc-700"
          >
            <ImagePlus className="h-3.5 w-3.5" /> {media?.url ? "Change" : "Choose image"}
          </button>
          {media?.url && (
            <button
              type="button"
              onClick={() => onChangeMedia(null)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-red-400"
            >
              <X className="h-3.5 w-3.5" /> Remove
            </button>
          )}
        </div>
      </div>
      {picking && (
        <MediaPicker
          onClose={() => setPicking(false)}
          onSelect={(m) => {
            onChangeMedia(m);
            setPicking(false);
          }}
        />
      )}
    </Labeled>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-medium text-zinc-400">{label}</div>
      {children}
    </div>
  );
}

function HeaderButton({
  title,
  onClick,
  disabled,
  danger,
  children,
}: {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-6 w-6 items-center justify-center rounded-md transition-colors disabled:opacity-30 ${
        danger ? "text-zinc-400 hover:bg-red-500/20 hover:text-red-400" : "text-zinc-400 hover:bg-zinc-700 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function RowButton({
  title,
  onClick,
  danger,
  children,
}: {
  title: string;
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`flex h-5 w-5 items-center justify-center rounded transition-colors ${
        danger ? "text-zinc-500 hover:bg-red-500/20 hover:text-red-400" : "text-zinc-500 hover:bg-zinc-700 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
