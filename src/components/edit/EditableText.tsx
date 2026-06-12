"use client";

import { useVE, vePost } from "./EditProvider";

/**
 * Inline-editable text node for the Visual Editor.
 *
 * For normal visitors (and in plain ?edit=1 pencil mode) it renders the text
 * with zero extra markup. Inside the /editor preview it becomes a
 * contentEditable span: click the text on the page, type, and every keystroke
 * is reported to the editor window as { type: "text", path, value } where
 * `path` addresses the field in the sections state, e.g. "sections.2.title".
 *
 * The value prop only changes after a server refresh (which the editor
 * triggers when it already holds the same text), so typing is never clobbered.
 */
export function EditableText({
  path,
  value,
  className = "",
}: {
  path: string;
  value?: string | null;
  className?: string;
}) {
  const { active } = useVE();
  if (!active) return <>{value}</>;
  return (
    <span
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      data-ve-text={path}
      className={`-mx-1 cursor-text rounded-sm px-1 outline-none transition-shadow duration-150 hover:ring-2 hover:ring-cyan-400/50 focus:bg-cyan-400/10 focus:ring-2 focus:ring-cyan-400 ${className}`}
      onInput={(e) => vePost({ type: "text", path, value: (e.currentTarget as HTMLElement).innerText })}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
        if (e.key === "Escape") (e.currentTarget as HTMLElement).blur();
      }}
    >
      {value}
    </span>
  );
}
