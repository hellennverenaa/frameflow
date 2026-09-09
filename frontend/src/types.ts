export type ViewMode = 'client' | 'dashboard'

export interface CoveragePackage {
  id: 'essencial' | 'completo'
  name: string
  subtitle: string
  features: string[]
  price: number
  highlight?: boolean
}

export interface LeadItem {
  id: string
  coupleName: string
  phone: string
  date: string
  packageName: string
  addons: string[]
  totalValue: number
  installmentsInfo: string
  createdAt: string
}
