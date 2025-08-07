import Link from "next/link";

interface BrandLinkProps {
    brandName: string | null;
    brandSlug: string | null;
    className?: string;
}

export function BrandLink({ brandName, brandSlug, className = "" }: BrandLinkProps) {
    if (!brandName) {
        return null;
    }

    if (brandSlug) {
        return (
            <Link
                href={`/brands/${brandSlug}`}
                className={`hover:text-foreground transition-colors ${className}`}
            >
                {brandName}
            </Link>
        );
    }

    return <span className={className}>{brandName}</span>;
} 