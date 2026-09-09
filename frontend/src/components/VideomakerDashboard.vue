<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  MessageCircle,
  Users
} from 'lucide-vue-next'
import { useVideomakerStore } from '../composables/useVideomakerStore'

const {
  leads,
  reservedDates,
  isDateReserved,
  toggleDateStatus,
  switchView
} = useVideomakerStore()

// Mês e Ano de Navegação
const currentYear = ref(2026)
const currentMonth = ref(4) // Maio

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const currentMonthLabel = computed(() => {
  return `${monthNames[currentMonth.value]} de ${currentYear.value}`
})

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

// Dias do Mês para o Calendário do Videomaker
const calendarDays = computed(() => {
  const days = []
  const year = currentYear.value
  const month = currentMonth.value

  const firstDay = new Date(year, month, 1)
  const totalDays = new Date(year, month + 1, 0).getDate()
  const startDay = (firstDay.getDay() + 6) % 7 // 0=Seg, 5=Sáb

  for (let i = 0; i < startDay; i++) {
    days.push({ dayNumber: 0, dateStr: '', isSaturday: false, isCurrentMonth: false })
  }

  for (let d = 1; d <= totalDays; d++) {
    const dayDate = new Date(year, month, d)
    const isSaturday = (dayDate.getDay() + 6) % 7 === 5
    const monthStr = String(month + 1).padStart(2, '0')
    const dayStr = String(d).padStart(2, '0')
    const dateStr = `${year}-${monthStr}-${dayStr}`

    days.push({
      dayNumber: d,
      dateStr,
      isSaturday,
      isCurrentMonth: true
    })
  }

  return days
})

const openWhatsApp = (phone: string, couple: string, date: string) => {
  const text = `Olá, ${couple}! Sou o videomaker da Ókayan Filmes. Recebi seu interesse para ${date} e gostaria de tirar suas dúvidas!`
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
}
</script>

<template>
  <div class="py-8 sm:py-12 px-4 sm:px-6 bg-[#faf8f5] min-h-screen text-[#1c1917]">
    <div class="max-w-5xl mx-auto flex flex-col gap-8">
      <!-- Barra Superior do Painel -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-[#e7e5e4] shadow-xs">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs uppercase tracking-[0.2em] font-mono font-bold text-stone-600">
              Área Administrativa
            </span>
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold text-[#1c1917]">
            Painel do Estúdio • Ókayan
          </h1>
          <p class="text-xs text-[#57534e]">
            Gerenciamento de datas do calendário e propostas simuladas pelos clientes.
          </p>
        </div>

        <button
          type="button"
          @click="switchView('client')"
          class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#18181b] hover:bg-black text-white text-xs font-bold transition-all cursor-pointer shrink-0"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>Voltar ao Site dos Noivos</span>
        </button>
      </div>

      <!-- SEÇÃO 1: CALENDÁRIO COM TOGGLE DE DATAS (CLIQUE PARA ALTERNAR) -->
      <div class="p-6 sm:p-8 rounded-2xl bg-white border border-[#e7e5e4] shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-[#e7e5e4]">
          <div>
            <h2 class="text-base font-bold text-[#1c1917]">
              Gestão de Datas do Calendário (2026)
            </h2>
            <p class="text-xs text-[#57534e]">
              Clique em qualquer sábado para alternar entre <strong>Livre</strong> e <strong>Reservado</strong>. As alterações são imediatas para os noivos!
            </p>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-xs font-bold text-[#1c1917] font-mono">
              {{ currentMonthLabel }}
            </span>
            <div class="flex items-center gap-1">
              <button
                type="button"
                @click="prevMonth"
                class="p-2 rounded-lg border border-[#e7e5e4] hover:bg-stone-50 transition-colors cursor-pointer"
              >
                <ChevronLeft class="w-4 h-4 text-stone-700" />
              </button>
              <button
                type="button"
                @click="nextMonth"
                class="p-2 rounded-lg border border-[#e7e5e4] hover:bg-stone-50 transition-colors cursor-pointer"
              >
                <ChevronRight class="w-4 h-4 text-stone-700" />
              </button>
            </div>
          </div>
        </div>

        <!-- Grade Semanal -->
        <div class="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#57534e] mb-2 font-mono">
          <div>Seg</div>
          <div>Ter</div>
          <div>Qua</div>
          <div>Qui</div>
          <div>Sex</div>
          <div class="text-[#1c1917] font-bold">Sáb</div>
          <div>Dom</div>
        </div>

        <!-- Grade de Dias com Botão de Toggle nos Sábados -->
        <div class="grid grid-cols-7 gap-2">
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            class="aspect-square flex flex-col items-center justify-center rounded-xl text-xs transition-all relative border"
            :class="day.isCurrentMonth ? 'bg-[#faf8f5] border-[#e7e5e4]' : 'opacity-0 border-transparent'"
          >
            <template v-if="day.isCurrentMonth">
              <!-- Sábado: Clicável para Alternar Status -->
              <template v-if="day.isSaturday">
                <button
                  type="button"
                  @click="toggleDateStatus(day.dateStr)"
                  class="w-full h-full p-1 rounded-xl flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-transform hover:scale-103"
                  :class="[
                    isDateReserved(day.dateStr)
                      ? 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  ]"
                  title="Clique para alternar o status desta data"
                >
                  <span class="font-mono text-sm font-bold">{{ day.dayNumber }}</span>
                  <span
                    class="text-[9px] uppercase font-bold tracking-tighter px-1.5 py-0.2 rounded"
                    :class="isDateReserved(day.dateStr) ? 'bg-stone-300 text-stone-700' : 'bg-emerald-200 text-emerald-900'"
                  >
                    {{ isDateReserved(day.dateStr) ? 'Reservado' : 'Livre' }}
                  </span>
                </button>
              </template>

              <!-- Dias Comuns -->
              <template v-else>
                <span class="font-mono text-stone-400 text-xs">{{ day.dayNumber }}</span>
              </template>
            </template>
          </div>
        </div>

        <!-- Resumo de Reservas -->
        <div class="mt-5 pt-4 border-t border-[#e7e5e4] flex flex-wrap items-center justify-between text-xs text-[#57534e]">
          <span>Total de sábados bloqueados em 2026: <strong>{{ reservedDates.length }}</strong></span>
          <span class="text-stone-400 text-[11px]">Dica: os sábados marcados como "Livre" aparecem em verde para os casais no site.</span>
        </div>
      </div>

      <!-- SEÇÃO 2: LEADS E PROPOSTAS RECEBIDAS PELO SITE -->
      <div class="p-6 sm:p-8 rounded-2xl bg-white border border-[#e7e5e4] shadow-xs">
        <div class="flex items-center justify-between pb-4 mb-5 border-b border-[#e7e5e4]">
          <div class="flex items-center gap-2">
            <Users class="w-4 h-4 text-stone-700" />
            <h2 class="text-base font-bold text-[#1c1917]">
              Propostas Simuladas pelos Casais
            </h2>
          </div>
          <span class="text-xs font-mono text-stone-500">
            {{ leads.length }} propostas salvas
          </span>
        </div>

        <div class="flex flex-col gap-3">
          <div
            v-for="lead in leads"
            :key="lead.id"
            class="p-4 sm:p-5 rounded-xl border border-[#e7e5e4] hover:border-stone-400 bg-[#faf8f5] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
          >
            <div>
              <div class="flex items-center gap-2.5 mb-1">
                <span class="font-bold text-sm sm:text-base text-[#1c1917]">
                  {{ lead.coupleName }}
                </span>
                <span class="text-[10px] text-stone-500 font-mono">
                  {{ lead.createdAt }}
                </span>
              </div>

              <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#57534e] mb-1">
                <span class="font-semibold text-stone-900">
                  📅 {{ lead.date }}
                </span>
                <span>
                  🎥 {{ lead.packageName }}
                </span>
                <span v-if="lead.addons.length > 0" class="text-stone-700">
                  + {{ lead.addons.join(', ') }}
                </span>
              </div>

              <div class="text-[11px] text-stone-500 font-mono">
                {{ lead.installmentsInfo }}
              </div>
            </div>

            <div class="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#e7e5e4]">
              <div class="text-left md:text-right">
                <span class="text-[10px] text-stone-400 uppercase tracking-wider block">Valor Estimado</span>
                <span class="text-base font-extrabold font-mono text-[#1c1917]">
                  {{ new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(lead.totalValue) }}
                </span>
              </div>

              <button
                type="button"
                @click="openWhatsApp(lead.phone, lead.coupleName, lead.date)"
                class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#18181b] hover:bg-black text-white text-xs font-bold transition-all cursor-pointer"
              >
                <MessageCircle class="w-3.5 h-3.5" />
                <span>Conversar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
