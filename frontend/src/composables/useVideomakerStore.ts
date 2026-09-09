import { ref, computed } from 'vue'
import type { ViewMode, EventItem, LeadItem } from '../types'

const STORAGE_LEADS_KEY = 'okayan_leads_v1'
const STORAGE_EVENTS_KEY = 'okayan_events_v1'

const initialEvents: EventItem[] = [
  {
    id: 'evt-1',
    couple: 'Juliana & Matheus',
    date: '14/03/2026',
    location: 'Fazenda Vila Rica, Itatiba - SP',
    packageDetails: '2 Câmeras + Drone 4K + Teaser 60s',
    totalValue: 6600,
    status: 'Confirmado'
  },
  {
    id: 'evt-2',
    couple: 'Beatriz & Rodrigo',
    date: '28/03/2026',
    location: 'Igreja São José + Espaço Lamartine, RJ',
    packageDetails: '2 Câmeras + Pré-Wedding',
    totalValue: 6300,
    status: 'Sinal Pago'
  },
  {
    id: 'evt-3',
    couple: 'Camila & Felipe',
    date: '11/04/2026',
    location: 'Espaço Serra do Mar, SBC - SP',
    packageDetails: '1 Câmera + Drone 4K + Teaser',
    totalValue: 5400,
    status: 'Confirmado'
  },
  {
    id: 'evt-4',
    couple: 'Marina & Lucas',
    date: '17/01/2026',
    location: 'Destination Wedding, Trancoso - BA',
    packageDetails: '2 Câmeras + Drone 4K + Teaser + Pré-Wedding',
    totalValue: 7500,
    status: 'Em Edição'
  },
  {
    id: 'evt-5',
    couple: 'Fernanda & Thiago',
    date: '06/12/2025',
    location: 'Villa Bisutti, São Paulo - SP',
    packageDetails: '2 Câmeras + Teaser 60s',
    totalValue: 5900,
    status: 'Entregue'
  }
]

const initialLeads: LeadItem[] = [
  {
    id: 'lead-1',
    couple: 'Larissa & Gabriel',
    phone: '5511988776655',
    date: '16/05/2026',
    location: 'Haras Vila Real, SP',
    logistics: 'Mesmo Local',
    cameras: '2 Câmeras (Ângulos Simultâneos)',
    addons: ['Drone 4K', 'Teaser 60s'],
    paymentType: 'parcelado',
    totalValue: 6600,
    installmentsInfo: 'Entrada de R$ 1.650,00 + 4x de R$ 1.237,50',
    createdAt: 'Hoje às 14:30',
    status: 'Novo Lead'
  },
  {
    id: 'lead-2',
    couple: 'Natália & Eduardo',
    phone: '5511977665544',
    date: '20/06/2026',
    location: 'Igreja Santa Teresinha + Buffet Tulipas',
    logistics: 'Igreja + Recepção Separada',
    cameras: '2 Câmeras (Ângulos Simultâneos)',
    addons: ['Drone 4K', 'Pré-Wedding'],
    paymentType: 'avista',
    totalValue: 7220,
    installmentsInfo: 'À vista com 5% de desconto (R$ 7.220,00)',
    createdAt: 'Ontem às 19:15',
    status: 'Em Negociação'
  }
]

// Carregamento resiliente do localStorage
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Silencioso caso storage esteja restrito
  }
}

// Estado Global Compartilhado Reativo Puro
const currentView = ref<ViewMode>('client')
const events = ref<EventItem[]>(loadFromStorage(STORAGE_EVENTS_KEY, initialEvents))
const leads = ref<LeadItem[]>(loadFromStorage(STORAGE_LEADS_KEY, initialLeads))
const recentLeadNotification = ref<string | null>(null)

export function useVideomakerStore() {
  const switchView = (mode: ViewMode) => {
    currentView.value = mode
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const addLead = (leadData: Omit<LeadItem, 'id' | 'createdAt' | 'status'>) => {
    const newLead: LeadItem = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: 'Agora mesmo',
      status: 'Novo Lead'
    }

    leads.value = [newLead, ...leads.value]
    saveToStorage(STORAGE_LEADS_KEY, leads.value)

    recentLeadNotification.value = `${newLead.couple} foi adicionado à lista de Leads!`
    setTimeout(() => {
      recentLeadNotification.value = null
    }, 5000)

    return newLead
  }

  const approveLead = (leadId: string) => {
    const targetLead = leads.value.find((l) => l.id === leadId)
    if (!targetLead) return

    targetLead.status = 'Aprovado'
    saveToStorage(STORAGE_LEADS_KEY, leads.value)

    // Adiciona aos eventos confirmados/sinal pago
    const newEvent: EventItem = {
      id: `evt-${Date.now()}`,
      couple: targetLead.couple,
      date: targetLead.date,
      location: targetLead.location,
      packageDetails: `${targetLead.cameras} + ${targetLead.addons.join(', ')}`,
      totalValue: targetLead.totalValue,
      status: 'Sinal Pago'
    }

    events.value = [newEvent, ...events.value]
    saveToStorage(STORAGE_EVENTS_KEY, events.value)
  }

  // KPIs Calculados em Tempo Real
  const confirmedRevenue = computed(() => {
    return events.value
      .filter((e) => e.status === 'Confirmado' || e.status === 'Sinal Pago' || e.status === 'Em Edição')
      .reduce((acc, curr) => acc + curr.totalValue, 0)
  })

  const confirmedEventsCount = computed(() => {
    return events.value.filter((e) => e.status === 'Confirmado' || e.status === 'Sinal Pago').length
  })

  const pendingLeadsCount = computed(() => {
    return leads.value.filter((l) => l.status === 'Novo Lead' || l.status === 'Em Negociação').length
  })

  const pendingLeadsTotalValue = computed(() => {
    return leads.value
      .filter((l) => l.status === 'Novo Lead' || l.status === 'Em Negociação')
      .reduce((acc, curr) => acc + curr.totalValue, 0)
  })

  const formattedConfirmedRevenue = computed(() => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(confirmedRevenue.value)
  })

  const formattedPendingLeadsValue = computed(() => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(pendingLeadsTotalValue.value)
  })

  return {
    currentView,
    switchView,
    events,
    leads,
    addLead,
    approveLead,
    recentLeadNotification,
    confirmedRevenue,
    confirmedEventsCount,
    pendingLeadsCount,
    pendingLeadsTotalValue,
    formattedConfirmedRevenue,
    formattedPendingLeadsValue
  }
}
