<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  DollarSign,
  CalendarCheck,
  FileSpreadsheet,
  Check,
  MessageCircle,
  Clock,
  MapPin,
  Camera,
  Users,
  Film,
  TrendingUp
} from 'lucide-vue-next'
import { useVideomakerStore } from '../composables/useVideomakerStore'
import type { EventStatus } from '../types'

const {
  events,
  leads,
  approveLead,
  switchView,
  formattedConfirmedRevenue,
  confirmedEventsCount,
  formattedPendingLeadsValue
} = useVideomakerStore()

const statusFilter = ref<'all' | 'confirmados' | 'edicao'>('all')

const filteredEvents = computed(() => {
  if (statusFilter.value === 'confirmados') {
    return events.value.filter((e) => e.status === 'Confirmado' || e.status === 'Sinal Pago')
  }
  if (statusFilter.value === 'edicao') {
    return events.value.filter((e) => e.status === 'Em Edição')
  }
  return events.value
})

const getStatusBadgeClass = (status: EventStatus) => {
  switch (status) {
    case 'Confirmado':
      return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
    case 'Sinal Pago':
      return 'bg-amber-500/10 border-amber-500/30 text-amber-400'
    case 'Em Edição':
      return 'bg-blue-500/10 border-blue-500/30 text-blue-400'
    case 'Entregue':
      return 'bg-zinc-800 border-zinc-700 text-zinc-400'
    default:
      return 'bg-zinc-800 border-zinc-700 text-zinc-300'
  }
}

const openWhatsAppLead = (lead: any) => {
  const msg = `Olá, ${lead.couple}! Aqui é o videomaker da Ókayan. Recebi a sua simulação para a data de ${lead.date} e gostaria de agendar uma breve chamada de alinhamento!`
  const url = `https://wa.me/${lead.phone}?text=${encodeURIComponent(msg)}`
  window.open(url, '_blank')
}
</script>

<template>
  <div class="py-8 sm:py-12 px-4 sm:px-6 bg-[#0f1015] min-h-screen text-zinc-100">
    <div class="max-w-7xl mx-auto flex flex-col gap-8">
      <!-- Cabeçalho do Painel do Videomaker -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#17181f] border border-[#262833]">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Film class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-lg sm:text-xl font-bold text-white">
                Painel Operacional do Videomaker
              </h1>
              <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold">
                ESTÚDIO PRO
              </span>
            </div>
            <p class="text-xs text-zinc-400">
              Controle de faturamento, cronograma de pós-produção e leads automatizados do simulador.
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="switchView('client')"
          class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#262833] hover:bg-zinc-700 text-xs font-bold text-zinc-200 hover:text-white transition-colors cursor-pointer shrink-0"
        >
          <Users class="w-3.5 h-3.5 text-amber-400" />
          <span>Ver Como os Noivos Enxergam (Site)</span>
        </button>
      </div>

      <!-- 3 MÉTRICAS NO TOPO (KPIs Operacionais) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- KPI 1: Faturamento Confirmado -->
        <div class="p-5 rounded-xl bg-[#17181f] border border-[#262833] flex flex-col justify-between gap-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Faturamento Confirmado
            </span>
            <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign class="w-4 h-4" />
            </div>
          </div>

          <div>
            <div class="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
              {{ formattedConfirmedRevenue }}
            </div>
            <div class="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium mt-1">
              <TrendingUp class="w-3.5 h-3.5" />
              <span>Contratos assinados e sinais recebidos em 2026</span>
            </div>
          </div>
        </div>

        <!-- KPI 2: Eventos Fechados no Ano -->
        <div class="p-5 rounded-xl bg-[#17181f] border border-[#262833] flex flex-col justify-between gap-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Eventos Fechados no Ano
            </span>
            <div class="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <CalendarCheck class="w-4 h-4" />
            </div>
          </div>

          <div>
            <div class="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
              {{ confirmedEventsCount }} <span class="text-base text-zinc-500 font-normal">casamentos</span>
            </div>
            <div class="text-[11px] text-zinc-400 mt-1">
              Meta anual: 24 eventos (<span class="text-amber-400 font-semibold">{{ Math.round((confirmedEventsCount / 24) * 100) }}%</span> concluída)
            </div>
          </div>
        </div>

        <!-- KPI 3: Propostas em Negociação -->
        <div class="p-5 rounded-xl bg-[#17181f] border border-[#262833] flex flex-col justify-between gap-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Propostas em Negociação
            </span>
            <div class="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <FileSpreadsheet class="w-4 h-4" />
            </div>
          </div>

          <div>
            <div class="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
              {{ formattedPendingLeadsValue }}
            </div>
            <div class="text-[11px] text-zinc-400 mt-1">
              <strong class="text-blue-400">{{ leads.length }}</strong> propostas geradas recentemente no simulador
            </div>
          </div>
        </div>
      </div>

      <!-- SEÇÃO 1: FUNIL DE LEADS RECEBIDOS PELO SITE (Simulador Integrado) -->
      <div class="p-5 sm:p-6 rounded-xl bg-[#17181f] border border-[#262833] flex flex-col gap-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#262833]">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
            <h2 class="text-base font-bold text-white">
              Leads Recebidos pelo Simulador do Site
            </h2>
            <span class="text-xs text-zinc-400">
              (Sincronizado em tempo real com a tela dos noivos)
            </span>
          </div>
          <span class="text-xs font-mono text-zinc-400">
            Total: {{ leads.length }} propostas
          </span>
        </div>

        <!-- Lista de Leads -->
        <div class="flex flex-col gap-3">
          <div
            v-for="lead in leads"
            :key="lead.id"
            class="p-4 rounded-lg bg-[#12131a] border border-[#262833] hover:border-zinc-700 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <!-- Detalhes do Lead -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-[#17181f] border border-[#262833] flex items-center justify-center text-amber-400 shrink-0">
                <Users class="w-5 h-5" />
              </div>

              <div>
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="text-sm font-bold text-white">
                    {{ lead.couple }}
                  </h3>
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-semibold border font-mono"
                    :class="[
                      lead.status === 'Novo Lead'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : lead.status === 'Aprovado'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                    ]"
                  >
                    {{ lead.status }}
                  </span>
                  <span class="text-[10px] text-zinc-500 font-mono">
                    {{ lead.createdAt }}
                  </span>
                </div>

                <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                  <span class="flex items-center gap-1 text-zinc-300">
                    <Clock class="w-3 h-3 text-amber-400" />
                    {{ lead.date }}
                  </span>
                  <span class="flex items-center gap-1">
                    <MapPin class="w-3 h-3 text-zinc-500" />
                    {{ lead.location }}
                  </span>
                  <span class="flex items-center gap-1">
                    <Camera class="w-3 h-3 text-zinc-500" />
                    {{ lead.cameras }}
                  </span>
                  <span v-if="lead.addons.length > 0" class="text-amber-400/90 text-[11px] font-medium">
                    + {{ lead.addons.join(', ') }}
                  </span>
                </div>

                <div class="text-[11px] text-zinc-500 mt-1 font-mono">
                  Condição: {{ lead.installmentsInfo }}
                </div>
              </div>
            </div>

            <!-- Preço e Ações Rápidas -->
            <div class="flex items-center justify-between lg:justify-end gap-4 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#262833]">
              <div class="text-left lg:text-right">
                <span class="text-[10px] text-zinc-500 uppercase tracking-wider block">Valor da Proposta</span>
                <span class="text-base font-extrabold font-mono text-white">
                  {{ new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(lead.totalValue) }}
                </span>
              </div>

              <div class="flex items-center gap-2">
                <!-- Botão de Aprovar Data -->
                <button
                  v-if="lead.status !== 'Aprovado'"
                  type="button"
                  @click="approveLead(lead.id)"
                  class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-colors cursor-pointer"
                  title="Reservar data e mover para eventos confirmados"
                >
                  <Check class="w-3.5 h-3.5 stroke-[3]" />
                  <span>Aprovar Data</span>
                </button>

                <!-- Botão de Chamar no WhatsApp -->
                <button
                  type="button"
                  @click="openWhatsAppLead(lead)"
                  class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#262833] hover:bg-amber-500 text-zinc-200 hover:text-zinc-950 text-xs font-bold transition-colors cursor-pointer"
                  title="Abrir WhatsApp com mensagem de retorno"
                >
                  <MessageCircle class="w-3.5 h-3.5" />
                  <span class="hidden sm:inline">Chamar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SEÇÃO 2: CALENDÁRIO / PRÓXIMOS EVENTOS (Operacional) -->
      <div class="p-5 sm:p-6 rounded-xl bg-[#17181f] border border-[#262833] flex flex-col gap-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#262833]">
          <div>
            <h2 class="text-base font-bold text-white">
              Cronograma & Próximos Eventos
            </h2>
            <p class="text-xs text-zinc-400">
              Acompanhamento de status da equipe e pós-produção.
            </p>
          </div>

          <!-- Filtros de Status -->
          <div class="flex items-center gap-1.5 bg-[#12131a] p-1 rounded-lg border border-[#262833] text-xs">
            <button
              type="button"
              @click="statusFilter = 'all'"
              class="px-2.5 py-1 rounded font-medium transition-colors cursor-pointer"
              :class="statusFilter === 'all' ? 'bg-[#262833] text-white' : 'text-zinc-400 hover:text-zinc-200'"
            >
              Todos ({{ events.length }})
            </button>
            <button
              type="button"
              @click="statusFilter = 'confirmados'"
              class="px-2.5 py-1 rounded font-medium transition-colors cursor-pointer"
              :class="statusFilter === 'confirmados' ? 'bg-[#262833] text-white' : 'text-zinc-400 hover:text-zinc-200'"
            >
              Confirmados
            </button>
            <button
              type="button"
              @click="statusFilter = 'edicao'"
              class="px-2.5 py-1 rounded font-medium transition-colors cursor-pointer"
              :class="statusFilter === 'edicao' ? 'bg-[#262833] text-white' : 'text-zinc-400 hover:text-zinc-200'"
            >
              Em Edição
            </button>
          </div>
        </div>

        <!-- Tabela / Lista de Eventos -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#12131a] text-zinc-400 uppercase font-mono text-[10px] border-b border-[#262833]">
              <tr>
                <th class="py-3 px-4 font-semibold">Data</th>
                <th class="py-3 px-4 font-semibold">Casal</th>
                <th class="py-3 px-4 font-semibold">Locação</th>
                <th class="py-3 px-4 font-semibold">Pacote Operacional</th>
                <th class="py-3 px-4 font-semibold">Valor</th>
                <th class="py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#262833]">
              <tr
                v-for="event in filteredEvents"
                :key="event.id"
                class="hover:bg-[#12131a] transition-colors"
              >
                <td class="py-3.5 px-4 font-mono font-bold text-amber-400 whitespace-nowrap">
                  {{ event.date }}
                </td>
                <td class="py-3.5 px-4 font-semibold text-white whitespace-nowrap">
                  {{ event.couple }}
                </td>
                <td class="py-3.5 px-4 text-zinc-400 whitespace-nowrap">
                  {{ event.location }}
                </td>
                <td class="py-3.5 px-4 text-zinc-300">
                  {{ event.packageDetails }}
                </td>
                <td class="py-3.5 px-4 font-mono font-semibold text-white whitespace-nowrap">
                  {{ new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(event.totalValue) }}
                </td>
                <td class="py-3.5 px-4 whitespace-nowrap">
                  <span
                    class="px-2.5 py-1 rounded text-[10px] font-semibold border"
                    :class="getStatusBadgeClass(event.status)"
                  >
                    {{ event.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
