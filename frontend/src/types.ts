export type ViewMode = 'client' | 'dashboard'

export type EventStatus = 'Confirmado' | 'Sinal Pago' | 'Em Edição' | 'Entregue'

export interface EventItem {
  id: string
  couple: string
  date: string
  location: string
  packageDetails: string
  totalValue: number
  status: EventStatus
}

export interface LeadItem {
  id: string
  couple: string
  phone: string
  date: string
  location: string
  logistics: string
  cameras: string
  addons: string[]
  paymentType: 'avista' | 'parcelado'
  totalValue: number
  installmentsInfo: string
  createdAt: string
  status: 'Novo Lead' | 'Aprovado' | 'Em Negociação'
}
