import { createElement } from "react";
import { cn } from "@/lib/utils";

type ContainerProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/** Centered max-width content wrapper (~1200px) with comfortable gutters. */
export function Container<T extends React.ElementType = "div">({
  as,
  className,
  children,
  ...props
}: ContainerProps<T>) {
  const Tag = (as ?? "div") as React.ElementType;
  return createElement(
    Tag,
    {
      className: cn("mx-auto w-full max-w-site px-5 sm:px-6 lg:px-8", className),
      ...props,
    },
    children,
  );
}
