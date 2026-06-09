import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "solid" | "ghost" | "soft" | "link";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-[var(--radius-sm)] " +
  "transition-[transform,background-color,color,box-shadow] duration-[var(--dur-fast)] ease-soft " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent " +
  "disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99] whitespace-nowrap";

const variants: Record<Variant, string> = {
  solid:
    "bg-accent text-accent-contrast shadow-sm hover:bg-accent-hover hover:shadow",
  ghost:
    "border border-border bg-transparent text-ink hover:border-accent hover:text-accent",
  soft:
    "bg-accent-soft text-accent hover:bg-[color-mix(in_srgb,var(--accent)_16%,transparent)]",
  link: "text-accent underline-offset-4 hover:underline px-0 h-auto",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-13 px-7 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  Omit<React.ComponentPropsWithoutRef<typeof Link>, "className"> & {
    href: string;
  };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "solid", size = "md", className, children, ...rest } = props;
  const classes = cn(
    base,
    variants[variant],
    variant !== "link" && sizes[size],
    className,
  );

  if ("href" in props && props.href !== undefined) {
    return (
      <Link className={classes} {...(rest as Omit<ButtonAsLink, "variant" | "size" | "className" | "children">)}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      {...(rest as Omit<ButtonAsButton, "variant" | "size" | "className" | "children">)}
    >
      {children}
    </button>
  );
}
