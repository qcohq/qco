interface BrandsPageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function BrandsPageHeader({
  title,
  description,
  className = "",
}: BrandsPageHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1>
      {description && (
        <p className="text-muted-foreground text-lg">{description}</p>
      )}
    </div>
  );
}
