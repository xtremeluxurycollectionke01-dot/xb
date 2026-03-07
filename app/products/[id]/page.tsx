import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProductById } from '@/app/lib/products-data'
import ProductDetailClient from '@/app/components/product-detail/ProductDetailClient'


interface ProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = getProductById(id)
  
  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} | LabPro Scientific Supplies`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.map((url: any) => ({ url })),
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = getProductById(id)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}