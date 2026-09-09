<script setup lang="ts">
import { ref, computed } from 'vue'
import { Check, MessageCircle } from 'lucide-vue-next'
import { useVideomakerStore } from '../composables/useVideomakerStore'

const { selectedDate, addLead } = useVideomakerStore()

// Pacotes de Cobertura
type PackageType = 'essencial' | 'completo'
const selectedPackage = ref<PackageType>('completo')

const packages = {
  essencial: {
    name: 'Filme Essencial',
    subtitle: '1 Cinegrafista • Cobertura Cerimônia + Festa',
    price: 4200,
    features: [
      '1 Cinegrafista principal',
      'Cobertura completa da cerimônia e recepção',
      'Filme oficial de 12 a 15 minutos em 4K',
      'Áudio direto captado com máxima clareza'
    ]
  },
  completo: {
    name: 'Filme Completo',
    subtitle: '2 Cinegrafistas • Ângulos Simultâneos • Drone Incluso',
    price: 5800,
    highlight: true,
    features: [
      '2 Cinegrafistas (reações e momentos simultâneos)',
      'Imagens aéreas com Drone em 4K inclusas',
      'Cobertura do making of dos noivos até o fim da festa',
      'Filme estendido autoral + todas as íntegras dos votos'
    ]
  }
}

// Opcionais Rápidos (Checkboxes)
const addonPreWedding = ref(false)
const addonTeaser = ref(true)

const addonPrices = {
  preWedding: 900,
  teaser: 500
}

// Dados do Casal para a Proposta
const coupleName = ref('')
const couplePhone = ref('')

// Cálculos de Investimento
const totalPrice = computed(() => {
  let sum = packages[selectedPackage.value].price
  if (addonPreWedding.value) sum += addonPrices.preWedding
  if (addonTeaser.value) sum += addonPrices.teaser
  return sum
})

const formattedTotalPrice = computed(() => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(totalPrice.value)
})

// Estimativa de Parcelamento até a Data do Evento
const installmentsEstimate = computed(() => {
  // Quantidade estimada de meses até o evento (baseado no mês selecionado ou padrão 5)
  let count = 5
  if (selectedDate.value) {
    const [, m] = selectedDate.value.split('-').map(Number)
    if (m === 4) count = 3
    if (m === 5) count = 4
    if (m >= 9) count = 6
  }

  const downPayment = totalPrice.value * 0.25
  const remaining = totalPrice.value - downPayment
  const monthly = remaining / count

  return {
    count,
    downPaymentFormatted: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(downPayment),
    monthlyFormatted: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(monthly)
  }
})

// Formatação amigável da data selecionada
const displayDate = computed(() => {
  if (!selectedDate.value) return 'A definir'
  const [y, m, d] = selectedDate.value.split('-').map(Number)
  const dateObj = new Date(y, m - 1, d)
  const dayName = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' })
  const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1)
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]
  return `${capitalizedDay}, ${d} de ${monthNames[m - 1]} de ${y}`
})

// Feedback de envio
const proposalSent = ref(false)

// Envio para WhatsApp + Sincronização com o Painel do Videomaker
const handleSendToWhatsApp = () => {
  const name = coupleName.value.trim() || 'Noivos'
  const phone = couplePhone.value.trim() || '5511999999999'

  const activeAddonsList: string[] = []
  if (addonPreWedding.value) activeAddonsList.push('Ensaio Pré-Wedding')
  if (addonTeaser.value) activeAddonsList.push('Teaser em 48h')

  const installmentsText = `Entrada de ${installmentsEstimate.value.downPaymentFormatted} + ${installmentsEstimate.value.count}x de ${installmentsEstimate.value.monthlyFormatted}`

  // 1. Salva a proposta no store (aparece no Painel do Videomaker)
  addLead({
    coupleName: name,
    phone: phone,
    date: displayDate.value,
    packageName: packages[selectedPackage.value].name,
    addons: activeAddonsList,
    totalValue: totalPrice.value,
    installmentsInfo: installmentsText
  })

  proposalSent.value = true

  // 2. Monta texto elegante para o WhatsApp
  let msg = `Olá! Estive no site da Ókayan Filmes e consultei a data:\n\n`
  msg += `✨ *Data pretendida:* ${displayDate.value}\n`
  msg += `👤 *Casal:* ${name}\n`
  msg += `🎥 *Pacote escolhido:* ${packages[selectedPackage.value].name} (${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(packages[selectedPackage.value].price)})\n`

  if (activeAddonsList.length > 0) {
    msg += `➕ *Opcionais:* ${activeAddonsList.join(', ')}\n`
  }

  msg += `\n💰 *Investimento estimado:* ${formattedTotalPrice.value}\n`
  msg += `(${installmentsText} mensais)\n\n`
  msg += `Gostaria de conversar sobre a reserva desta data!`

  const url = `https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`
  window.open(url, '_blank')
}
</script>

<template>
  <div class="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-20 sm:pb-28">
    <div class="flex flex-col gap-10">
      <!-- 1. ESCOLHA DA COBERTURA (2 CARDS CLAROS) -->
      <div>
        <div class="text-center sm:text-left mb-6">
          <span class="text-xs uppercase tracking-[0.2em] font-semibold text-[#57534e] mb-1 block">
            Formato de Filme
          </span>
          <h3 class="text-xl sm:text-2xl font-bold text-[#1c1917]">
            Selecione a cobertura ideal para o seu dia
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <!-- CARD 1: FILME ESSENCIAL -->
          <div
            @click="selectedPackage = 'essencial'"
            class="p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between"
            :class="[
              selectedPackage === 'essencial'
                ? 'bg-white border-[#18181b] shadow-sm ring-1 ring-[#18181b]'
                : 'bg-white border-[#e7e5e4] hover:border-stone-400'
            ]"
          >
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-lg font-bold text-[#1c1917]">
                  {{ packages.essencial.name }}
                </span>
                <div
                  class="w-5 h-5 rounded-full border flex items-center justify-center transition-colors"
                  :class="selectedPackage === 'essencial' ? 'bg-[#18181b] border-[#18181b] text-white' : 'border-stone-300'"
                >
                  <Check v-if="selectedPackage === 'essencial'" class="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              <p class="text-xs text-[#57534e] mb-5">
                {{ packages.essencial.subtitle }}
              </p>

              <ul class="space-y-2.5 text-xs text-[#57534e] mb-6">
                <li v-for="item in packages.essencial.features" :key="item" class="flex items-start gap-2">
                  <Check class="w-3.5 h-3.5 text-stone-700 shrink-0 mt-0.5" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>

            <div class="pt-4 border-t border-[#e7e5e4] flex items-baseline justify-between">
              <span class="text-xs text-[#57534e]">Investimento</span>
              <span class="text-xl font-bold text-[#1c1917] font-mono">
                R$ 4.200
              </span>
            </div>
          </div>

          <!-- CARD 2: FILME COMPLETO (DESTAQUE ELEGANTE) -->
          <div
            @click="selectedPackage = 'completo'"
            class="p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative"
            :class="[
              selectedPackage === 'completo'
                ? 'bg-white border-[#18181b] shadow-sm ring-1 ring-[#18181b]'
                : 'bg-white border-[#e7e5e4] hover:border-stone-400'
            ]"
          >
            <!-- Badge de Destaque Elegante -->
            <div class="absolute -top-3 right-6">
              <span class="px-3 py-0.5 rounded-full bg-[#18181b] text-white text-[10px] uppercase font-bold tracking-wider">
                Mais Escolhido
              </span>
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-lg font-bold text-[#1c1917]">
                  {{ packages.completo.name }}
                </span>
                <div
                  class="w-5 h-5 rounded-full border flex items-center justify-center transition-colors"
                  :class="selectedPackage === 'completo' ? 'bg-[#18181b] border-[#18181b] text-white' : 'border-stone-300'"
                >
                  <Check v-if="selectedPackage === 'completo'" class="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              <p class="text-xs text-[#57534e] mb-5">
                {{ packages.completo.subtitle }}
              </p>

              <ul class="space-y-2.5 text-xs text-[#57534e] mb-6">
                <li v-for="item in packages.completo.features" :key="item" class="flex items-start gap-2">
                  <Check class="w-3.5 h-3.5 text-stone-700 shrink-0 mt-0.5" />
                  <span :class="item.includes('Drone') ? 'font-semibold text-[#1c1917]' : ''">{{ item }}</span>
                </li>
              </ul>
            </div>

            <div class="pt-4 border-t border-[#e7e5e4] flex items-baseline justify-between">
              <span class="text-xs text-[#57534e]">Investimento</span>
              <span class="text-xl font-bold text-[#1c1917] font-mono">
                R$ 5.800
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. OPCIONAIS RÁPIDOS (CHECKBOXES SIMPLES) -->
      <div class="p-6 rounded-2xl bg-white border border-[#e7e5e4] shadow-xs">
        <h4 class="text-sm font-bold text-[#1c1917] mb-4">
          Deseja adicionar algum momento especial?
        </h4>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Opcional Pré-Wedding -->
          <label class="flex items-center justify-between p-3.5 rounded-xl border border-[#e7e5e4] hover:bg-stone-50 cursor-pointer transition-colors">
            <div class="flex items-center gap-3">
              <input
                type="checkbox"
                v-model="addonPreWedding"
                class="w-4 h-4 rounded text-stone-900 focus:ring-0 focus:ring-offset-0 border-stone-300 cursor-pointer"
              />
              <div>
                <span class="text-xs font-semibold text-[#1c1917] block">Ensaio Pré-Wedding</span>
                <span class="text-[11px] text-[#57534e]">Sessão documental em vídeo semanas antes</span>
              </div>
            </div>
            <span class="text-xs font-mono font-semibold text-[#1c1917] shrink-0 ml-2">+ R$ 900</span>
          </label>

          <!-- Opcional Teaser em 48h -->
          <label class="flex items-center justify-between p-3.5 rounded-xl border border-[#e7e5e4] hover:bg-stone-50 cursor-pointer transition-colors">
            <div class="flex items-center gap-3">
              <input
                type="checkbox"
                v-model="addonTeaser"
                class="w-4 h-4 rounded text-stone-900 focus:ring-0 focus:ring-offset-0 border-stone-300 cursor-pointer"
              />
              <div>
                <span class="text-xs font-semibold text-[#1c1917] block">Teaser em até 48 horas</span>
                <span class="text-[11px] text-[#57534e]">Edição curta em formato vertical para redes</span>
              </div>
            </div>
            <span class="text-xs font-mono font-semibold text-[#1c1917] shrink-0 ml-2">+ R$ 500</span>
          </label>
        </div>
      </div>

      <!-- 3. RESUMO CLARO & BOTÃO LARGO PRETO FOSCO -->
      <div class="p-6 sm:p-8 rounded-2xl bg-white border border-[#e7e5e4] shadow-xs flex flex-col gap-6">
        <!-- Identificação do Casal -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-[#e7e5e4]">
          <div>
            <label class="block text-xs font-medium text-[#57534e] mb-1.5">
              Nome dos noivos:
            </label>
            <input
              type="text"
              v-model="coupleName"
              placeholder="Ex: Amanda & Matheus"
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#e7e5e4] bg-[#faf8f5] text-xs text-[#1c1917] placeholder:text-stone-400 focus:outline-none focus:border-stone-600"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-[#57534e] mb-1.5">
              WhatsApp para retorno:
            </label>
            <input
              type="tel"
              v-model="couplePhone"
              placeholder="Ex: (11) 98888-7777"
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#e7e5e4] bg-[#faf8f5] text-xs text-[#1c1917] placeholder:text-stone-400 focus:outline-none focus:border-stone-600"
            />
          </div>
        </div>

        <!-- Total e Parcelamento Estimado -->
        <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <span class="text-xs uppercase tracking-wider font-semibold text-[#57534e] block mb-1">
              Investimento Total
            </span>
            <div class="text-3xl sm:text-4xl font-extrabold text-[#1c1917] font-mono tracking-tight">
              {{ formattedTotalPrice }}
            </div>
          </div>

          <div class="text-left sm:text-right">
            <span class="text-xs text-[#57534e] block">
              Entrada de 25% ({{ installmentsEstimate.downPaymentFormatted }})
            </span>
            <span class="text-xs font-semibold text-[#1c1917]">
              + {{ installmentsEstimate.count }} parcelas mensais de {{ installmentsEstimate.monthlyFormatted }} sem juros até a festa
            </span>
          </div>
        </div>

        <!-- CTA Principal: Botão Largo Preto Fosco (#18181b) -->
        <button
          type="button"
          @click="handleSendToWhatsApp"
          class="w-full py-4 px-6 rounded-xl bg-[#18181b] hover:bg-black text-white text-sm sm:text-base font-bold transition-all shadow-sm hover:shadow flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99]"
        >
          <MessageCircle class="w-4 h-4" />
          <span>Falar com o Videomaker sobre esta Data</span>
        </button>

        <p class="text-center text-[11px] text-[#57534e]">
          Ao clicar, uma mensagem pronta com a data e os itens selecionados será aberta diretamente no WhatsApp da Ókayan.
        </p>
      </div>
    </div>
  </div>
</template>
