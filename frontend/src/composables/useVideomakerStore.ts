import { ref } from 'vue'
import type { ViewMode, LeadItem } from '../types'

const STORAGE_LEADS_KEY = 'okayan_editorial_leads_v2'
const STORAGE_RESERVED_KEY = 'okayan_reserved_dates_v2'

// Sábados já ocupados previamente em 2026
const defaultReservedDates = [
  '2026-04-11',
  '2026-05-09',
  '2026-05-23',
  '2026-06-06',
  '2026-09-12',
  '2026-10-10',
  '2026-10-24',
  '2026-11-14'
]

const initialLeads: LeadItem[] = [
  {
    id: 'lead-1',
    coupleName: 'Camila & Leonardo',
    phone: '5511988776655',
    date: 'Sábado, 16 de Maio de 2026',
    packageName: 'Filme Completo (2 Cinegrafistas + Drone)',
    addons: ['Teaser em 48h'],
    totalValue: 6300,
    installmentsInfo: 'Entrada de R$ 1.575,00 + 4x de R$ 1.181,25',
    createdAt: 'Hoje às 15:20'
  },
  {
    id: 'lead-2',
    coupleName: 'Mariana & Lucas',
    phone: '5511977665544',
    date: 'Sábado, 19 de Setembro de 2026',
    packageName: 'Filme Essencial (1 Cinegrafista)',
    addons: ['Ensaio Pré-Wedding'],
    totalValue: 5100,
    installmentsInfo: 'Entrada de R$ 1.275,00 + 6x de R$ 637,50',
    createdAt: 'Ontem às 18:40'
  }
]

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

function saveStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Silencioso
  }
}

// Estado compartilhado
const currentView = ref<ViewMode>('client')
const reservedDates = ref<string[]>(loadStorage(STORAGE_RESERVED_KEY, defaultReservedDates))
const selectedDate = ref<string>('2026-05-16') // Sábado livre por padrão
const leads = ref<LeadItem[]>(loadStorage(STORAGE_LEADS_KEY, initialLeads))

export function useVideomakerStore() {
  const switchView = (mode: ViewMode) => {
    currentView.value = mode
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Verifica se uma data específica está reservada
  const isDateReserved = (dateStr: string) => {
    return reservedDates.value.includes(dateStr)
  }

  // Alterna o status da data no Painel do Videomaker
  const toggleDateStatus = (dateStr: string) => {
    const index = reservedDates.value.indexOf(dateStr)
    if (index > -1) {
      reservedDates.value.splice(index, 1)
    } else {
      reservedDates.value.push(dateStr)
    }
    saveStorage(STORAGE_RESERVED_KEY, reservedDates.value)
  }

  // Define a data selecionada pelo casal
  const selectDate = (dateStr: string) => {
    if (!isDateReserved(dateStr)) {
      selectedDate.value = dateStr
    }
  }

  // Adiciona nova proposta vinda do site
  const addLead = (lead: Omit<LeadItem, 'id' | 'createdAt'>) => {
    const newLead: LeadItem = {
      ...lead,
      id: `lead-${Date.now()}`,
      createdAt: 'Agora mesmo'
    }
    leads.value = [newLead, ...leads.value]
    saveStorage(STORAGE_LEADS_KEY, leads.value)
    return newLead
  }

  return {
    currentView,
    switchView,
    reservedDates,
    isDateReserved,
    toggleDateStatus,
    selectedDate,
    selectDate,
    leads,
    addLead
  }
}
