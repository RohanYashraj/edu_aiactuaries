import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  title: string;
  description: string;
  as?: "h1" | "h2";
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export function SectionHeader({
  title,
  description,
  as = "h2",
  className,
  titleClassName,
  descriptionClassName,
}: SectionHeaderProps) {
  const HeadingTag = as;

  return (
    <div className={cn("mb-14 text-center", className)}>
      <HeadingTag
        className={cn(
          "font-display text-3xl tracking-tight sm:text-4xl",
          titleClassName,
        )}
      >
        {title}
      </HeadingTag>
      <p className={cn("mt-3 text-muted-foreground", descriptionClassName)}>
        {description}
      </p>
    </div>
  );
}
