import type { Metadata } from "next";
import { Suspense } from "react";
import ProductsPageClient from "../components/products/ProductsPageClient";

export const metadata: Metadata = {
  title: "Products | LabPro Scientific Supplies",
  description: "Browse our wide range of laboratory equipment, chemicals, glassware, and office supplies. Find quality products for your lab.",
};

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="py-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    }>
      <ProductsPageClient />
    </Suspense>
  )
}