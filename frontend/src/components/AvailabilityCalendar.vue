<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronLeft, ChevronRight, CheckCircle2, Calendar as CalendarIcon } from 'lucide-vue-next'
import { useVideomakerStore } from '../composables/useVideomakerStore'

const { isDateReserved, selectedDate, selectDate } = useVideomakerStore()

// Mês e Ano de Navegação (Foco na temporada de casamentos de 2026)
const currentYear = ref(2026)
const currentMonth = ref(4) // 4 = Maio (0-indexed)

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

// Geração da Grade Mensal Real (Segunda a Domingo)
interface CalendarDay {
  dayNumber: number
  dateStr: string
  isSaturday: boolean
  isReserved: boolean
  isSelected: boolean
  isCurrentMonth: boolean
}

const calendarDays = computed<CalendarDay[]>(() => {
  const days: CalendarDay[] = []
  const year = currentYear.value
  const month = currentMonth.value

  const firstDayOfMonth = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Dia da semana do 1º dia (0=Dom, 1=Seg... -> convertendo para 0=Seg, 5=Sáb, 6=Dom)
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7

  // Dias em branco antes do início do mês
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push({
      dayNumber: 0,
      dateStr: '',
      isSaturday: false,
      isReserved: false,
      isSelected: false,
      isCurrentMonth: false
    })
  }

  // Dias reais do mês
  for (let d = 1; d <= daysInMonth; d++) {
    const dayDate = new Date(year, month, d)
    const dayOfWeek = (dayDate.getDay() + 6) % 7 // 5 = Sábado
    const isSaturday = dayOfWeek === 5

    // Formato YYYY-MM-DD
    const monthStr = String(month + 1).padStart(2, '0')
    const dayStr = String(d).padStart(2, '0')
    const dateStr = `${year}-${monthStr}-${dayStr}`

    const isReserved = isSaturday && isDateReserved(dateStr)
    const isSelected = selectedDate.value === dateStr

    days.push({
      dayNumber: d,
      dateStr,
      isSaturday,
      isReserved,
      isSelected,
      isCurrentMonth: true
    })
  }

  return days
})

// Formatação amigável da data selecionada
const selectedDateFormatted = computed(() => {
  if (!selectedDate.value) return ''
  const [y, m, d] = selectedDate.value.split('-').map(Number)
  const dateObj = new Date(y, m - 1, d)
  const dayName = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' })
  const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1)
  const monthName = monthNames[m - 1]
  return `${capitalizedDay}, ${d} de ${monthName} de ${y}`
})
</script>

<template>
  <div id="calendar-section" class="w-full max-w-4xl mx-auto px-4 sm:px-6">
    <!-- Cabeçalho da Seção de Disponibilidade -->
    <div class="text-center mb-8">
      <span class="text-xs uppercase tracking-[0.2em] font-semibold text-[#57534e] mb-2 block">
        Disponibilidade em Tempo Real
      </span>
      <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-[#1c1917] mb-3">
        Escolha a data do seu casamento
      </h2>
      <p class="text-sm text-[#57534e] max-w-lg mx-auto">
        Trabalhamos com um número limitado de celebrações por ano para garantir máxima dedicação a cada filme.
      </p>
    </div>

    <!-- CALENDÁRIO MENSAL REAL -->
    <div class="bg-white rounded-2xl border border-[#e7e5e4] p-5 sm:p-8 shadow-xs">
      <!-- Barra Superior do Calendário (Mês e Navegação) -->
      <div class="flex items-center justify-between pb-5 mb-5 border-b border-[#e7e5e4]">
        <div class="flex items-center gap-2.5">
          <CalendarIcon class="w-4 h-4 text-stone-700" />
          <h3 class="text-base sm:text-lg font-bold text-[#1c1917]">
            {{ currentMonthLabel }}
          </h3>
        </div>

        <div class="flex items-center gap-1">
          <button
            type="button"
            @click="prevMonth"
            class="p-2 rounded-lg border border-[#e7e5e4] hover:bg-stone-50 text-[#1c1917] transition-colors cursor-pointer"
            aria-label="Mês anterior"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <button
            type="button"
            @click="nextMonth"
            class="p-2 rounded-lg border border-[#e7e5e4] hover:bg-stone-50 text-[#1c1917] transition-colors cursor-pointer"
            aria-label="Próximo mês"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Legenda Rápida -->
      <div class="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#57534e] mb-5">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-400"></span>
          <span>Sábado Disponível</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-stone-100 border border-stone-300"></span>
          <span class="line-through text-stone-400">Sábado Reservado</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-[#18181b]"></span>
          <span class="font-medium text-[#1c1917]">Data Selecionada</span>
        </div>
      </div>

      <!-- Grade dos Dias da Semana (Seg a Dom) -->
      <div class="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-xs font-semibold text-[#57534e] mb-2 font-mono">
        <div>Seg</div>
        <div>Ter</div>
        <div>Qua</div>
        <div>Qui</div>
        <div>Sex</div>
        <div class="text-[#1c1917] font-bold">Sáb</div>
        <div>Dom</div>
      </div>

      <!-- Grade dos Dias do Mês -->
      <div class="grid grid-cols-7 gap-1.5 sm:gap-2">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          class="aspect-square flex flex-col items-center justify-center rounded-xl text-xs transition-all relative"
        >
          <!-- Espaço vazio fora do mês -->
          <template v-if="!day.isCurrentMonth">
            <span class="opacity-0">.</span>
          </template>

          <!-- Dia de Sábado Reservado (Ocupado) -->
          <template v-else-if="day.isSaturday && day.isReserved">
            <div
              class="w-full h-full rounded-xl bg-stone-100 border border-stone-200 text-stone-400 flex flex-col items-center justify-center cursor-not-allowed select-none opacity-80"
              title="Esta data já possui um casamento confirmado"
            >
              <span class="font-mono text-xs line-through">{{ day.dayNumber }}</span>
              <span class="text-[9px] uppercase tracking-tighter text-stone-400 font-bold -mt-0.5">
                Reservado
              </span>
            </div>
          </template>

          <!-- Dia de Sábado Livre (Clicável) -->
          <template v-else-if="day.isSaturday">
            <button
              type="button"
              @click="selectDate(day.dateStr)"
              class="w-full h-full rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer border"
              :class="[
                day.isSelected
                  ? 'bg-[#18181b] text-white border-[#18181b] shadow-sm scale-102 font-bold'
                  : 'bg-emerald-50/60 hover:bg-emerald-100/80 border-emerald-300/80 text-emerald-950 font-bold hover:border-emerald-500'
              ]"
            >
              <span class="font-mono text-sm leading-none">{{ day.dayNumber }}</span>
              <span
                class="text-[9px] uppercase tracking-tighter font-semibold mt-0.5"
                :class="day.isSelected ? 'text-stone-300' : 'text-emerald-700'"
              >
                Livre
              </span>
            </button>
          </template>

          <!-- Dias Comuns da Semana (Seg a Sex, e Dom) -->
          <template v-else>
            <div
              class="w-full h-full rounded-xl text-stone-400 font-mono text-xs flex items-center justify-center"
            >
              {{ day.dayNumber }}
            </div>
          </template>
        </div>
      </div>

      <!-- CARD SUTIL DE CONFIRMAÇÃO DA DATA SELECIONADA -->
      <div
        v-if="selectedDateFormatted"
        class="mt-6 p-4 rounded-xl bg-[#faf8f5] border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in"
      >
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 class="w-4 h-4" />
          </div>
          <div>
            <span class="text-xs font-bold text-[#1c1917] block">
              ✨ {{ selectedDateFormatted }} — Data Disponível para Reserva!
            </span>
            <span class="text-xs text-[#57534e]">
              A equipe principal da Ókayan está livre para a sua celebração neste sábado.
            </span>
          </div>
        </div>

        <span class="px-3 py-1 rounded-full bg-white border border-emerald-300 text-emerald-800 text-xs font-semibold self-start sm:self-auto shrink-0">
          Agenda Aberta
        </span>
      </div>
    </div>
  </div>
</template>
