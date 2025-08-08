import { productVariantTable } from "@/db/schema";
import Image from "next/image";
import Link from "next/link";

interface VariantSelectorProps {
  selectedVariantSlug: string;
  variants: (typeof productVariantTable.$inferSelect)[];
}

const VariantSelector = ({
  variants,
  selectedVariantSlug,
}: VariantSelectorProps) => {
  return (
    <>
      <div className="flex items-center gap-4">
        {variants.map((variant) => (
          <Link
            href={`/product-variant/${variant.slug}`}
            key={variant.id}
            className={
              selectedVariantSlug === variant.slug
                ? "border-primary rounded-xl border-2"
                : ""
            }
          >
            <Image
              src={variant.imageUrl}
              alt={variant.name}
              width={68}
              height={68}
              className="cursor-pointer rounded-xl transition-opacity hover:opacity-80"
            />
          </Link>
        ))}
      </div>
    </>
  );
};

export default VariantSelector;
