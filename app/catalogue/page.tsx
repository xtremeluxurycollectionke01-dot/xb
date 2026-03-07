import { Metadata } from 'next'
import CataloguePageClient from '../components/catalogue/CataloguePageClient'

export const metadata: Metadata = {
  title: 'Product Catalogue | LabPro Scientific Supplies',
  description: 'Browse our comprehensive catalogue of laboratory equipment, chemicals, glassware, and office supplies. Request quotes for bulk orders.',
}

export default function CataloguePage() {
  return <CataloguePageClient />
}