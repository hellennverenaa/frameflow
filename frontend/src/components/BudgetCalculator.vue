<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Send,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles
} from 'lucide-vue-next'
import { useVideomakerStore } from '../composables/useVideomakerStore'

const { addLead } = useVideomakerStore()

// Etapa Atual do Simulador (1 a 3)
const currentStep = ref<1 | 2 | 3>(1)

// ETAPA 1: Data & Disponibilidade
const selectedSaturday = ref('2026-05-16')
const coupleNames = ref('')
const eventLocation = ref('')
const contactPhone = ref('')

const availableSaturdays = [
  { value: '2026-04-18', label: '18 de Abril de 2026 (Outono)', status: 'Disponível' },
  { value: '2026-05-16', label: '16 de Maio de 2026 (Mês das Noivas)', status: 'Disponível' },
  { value: '2026-06-20', label: '20 de Junho de 2026 (Inverno)', status: 'Disponível' },
  { value: '2026-09-19', label: '19 de Setembro de 2026 (Primavera)', status: 'Disponível' },
  { value: '2026-10-17', label: '17 de Outubro de 2026 (Primavera)', status: 'Disponível' },
  { value: '2026-11-21', label: '21 de Novembro de 2026 (Alta Temporada)', status: 'Disponível' }
]

// ETAPA 2: Estrutura do Evento
// Logística: 'same_venue' (R$ 0) ou 'separate_venues' (+ R$ 600)
const logisticsType = ref<'same_venue' | 'separate_venues'>('same_venue')

// Cobertura Base: '1camera' (R$ 4.200) ou '2cameras' (R$ 5.400)
const cameraPackage = ref<'1camera' | '2cameras'>('2cameras')

// Adicionais com checkboxes
const addons = ref({
  drone: true,
  teaser: true,
  preWedding: false
})

const addonPrices = {
  drone: 700,
  teaser: 500,
  preWedding: 900
}

// ETAPA 3: Condições de Pagamento
const paymentOption = ref<'avista' | 'parcelado'>('parcelado')

// Cálculos Dinâmicos
const cameraBasePrice = computed(() => (cameraPackage.value === '1camera' ? 4200 : 5400))
const logisticsPrice = computed(() => (logisticsType.value === 'separate_venues' ? 600 : 0))

const addonsTotalPrice = computed(() => {
  let sum = 0
  if (addons.value.drone) sum += addonPrices.drone
  if (addons.value.teaser) sum += addonPrices.teaser
  if (addons.value.preWedding) sum += addonPrices.preWedding
  return sum
})

// Subtotal bruto
const rawSubtotal = computed(() => {
  return cameraBasePrice.value + logisticsPrice.value + addonsTotalPrice.value
})

// Cálculo de Desconto à Vista (5% off)
const discountAvista = computed(() => rawSubtotal.value * 0.05)
const finalTotalAvista = computed(() => rawSubtotal.value - discountAvista.value)

// Cálculo da Entrada de 25% + Parcelas Mensais até o evento
const downPayment = computed(() => rawSubtotal.value * 0.25)
const remainingBalance = computed(() => rawSubtotal.value - downPayment.value)

// Quantidade de parcelas estimadas com base na data (mínimo 2, padrão 5)
const estimatedInstallmentsCount = computed(() => {
  if (selectedSaturday.value.includes('2026-04')) return 3
  if (selectedSaturday.value.includes('2026-05')) return 4
  if (selectedSaturday.value.includes('2026-06')) return 5
  if (selectedSaturday.value.includes('2026-09') || selectedSaturday.value.includes('2026-10') || selectedSaturday.value.includes('2026-11')) return 6
  return 4
})

const installmentMonthlyValue = computed(() => {
  return remainingBalance.value / estimatedInstallmentsCount.value
})

const finalDisplayTotal = computed(() => {
  return paymentOption.value === 'avista' ? finalTotalAvista.value : rawSubtotal.value
})

const formattedDisplayTotal = computed(() => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(finalDisplayTotal.value)
})

const selectedSaturdayFormatted = computed(() => {
  const found = availableSaturdays.find((s) => s.value === selectedSaturday.value)
  return found ? found.label : selectedSaturday.value
})

// Feedback de Proposta Criada
const leadSuccessNotice = ref(false)

// Submissão da Proposta: Adiciona ao Store + Gera link do WhatsApp
const handleGenerateProposal = () => {
  const coupleName = coupleNames.value.trim() || 'Noivos'
  const locationName = eventLocation.value.trim() || 'São Paulo - SP'
  const phone = contactPhone.value.trim() || '5511999999999'

  const activeAddonsList: string[] = []
  if (addons.value.drone) activeAddonsList.push('Drone 4K')
  if (addons.value.teaser) activeAddonsList.push('Teaser 60s em 48h')
  if (addons.value.preWedding) activeAddonsList.push('Ensaio Pré-Wedding')

  const installmentsText =
    paymentOption.value === 'avista'
      ? `À vista com 5% de desconto (${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(finalTotalAvista.value)})`
      : `Entrada de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(downPayment.value)} (25%) + ${estimatedInstallmentsCount.value}x de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(installmentMonthlyValue.value)} mensais`

  // 1. Adiciona o Lead ao estado compartilhado do Painel do Videomaker
  addLead({
    couple: coupleName,
    phone: phone,
    date: selectedSaturdayFormatted.value.split(' (')[0],
    location: locationName,
    logistics: logisticsType.value === 'same_venue' ? 'Tudo no mesmo local' : 'Igreja + Recepção separada',
    cameras: cameraPackage.value === '1camera' ? '1 Videomaker' : '2 Videomakers (Ângulos Simultâneos)',
    addons: activeAddonsList,
    paymentType: paymentOption.value,
    totalValue: finalDisplayTotal.value,
    installmentsInfo: installmentsText
  })

  leadSuccessNotice.value = true

  // 2. Monta a Mensagem Automatizada do WhatsApp
  let msg = `🎬 *PROPOSTA DE FILME • ÓKAYAN ESTÚDIO*\n\n`
  msg += `Olá! Preenchi o simulador no site e gostaria de verificar a reserva da minha data:\n\n`
  msg += `👤 *Casal:* ${coupleName}\n`
  msg += `📅 *Data:* ${selectedSaturdayFormatted.value}\n`
  msg += `📍 *Locação:* ${locationName}\n\n`
  msg += `🎥 *Estrutura Selecionada:*\n`
  msg += `• Equipe: ${cameraPackage.value === '1camera' ? '1 Videomaker' : '2 Videomakers com ângulos simultâneos'}\n`
  msg += `• Logística: ${logisticsType.value === 'same_venue' ? 'Tudo no mesmo local' : 'Igreja + Recepção separada (+ deslocamento)'}\n`

  if (activeAddonsList.length > 0) {
    msg += `\n➕ *Adicionais:*\n`
    activeAddonsList.forEach((ad) => {
      msg += `• ${ad}\n`
    })
  }

  msg += `\n💳 *Condição de Pagamento:*\n`
  if (paymentOption.value === 'avista') {
    msg += `• À vista com 5% de desconto: *${formattedDisplayTotal.value}*\n`
  } else {
    msg += `• Total: *${formattedDisplayTotal.value}*\n`
    msg += `• Entrada de 25%: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(downPayment.value)}\n`
    msg += `• Saldo: ${estimatedInstallmentsCount.value} parcelas mensais de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(installmentMonthlyValue.value)} até a data do evento\n`
  }

  msg += `\nPodemos confirmar a disponibilidade para esta data?`

  const url = `https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`
  window.open(url, '_blank')
}
</script>

<template>
  <section id="calculator" class="py-16 sm:py-24 px-4 sm:px-6 bg-[#0f1015]">
    <div class="max-w-5xl mx-auto">
      <!-- Cabeçalho Operacional -->
      <div class="mb-10 text-center sm:text-left">
        <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#17181f] border border-[#262833] text-xs font-mono font-medium text-amber-400 mb-3">
          <Sparkles class="w-3.5 h-3.5" />
          <span>SIMULADOR OPERACIONAL EM 3 ETAPAS</span>
        </div>
        <h2 class="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-2">
          Calcule a estrutura e o investimento do seu casamento.
        </h2>
        <p class="text-xs sm:text-sm text-zinc-400">
          Valores objetivos, verificação de data em tempo real e condições claras de parcelamento até o evento.
        </p>
      </div>

      <!-- Stepper Header (Navegação Direta) -->
      <div class="grid grid-cols-3 gap-2 mb-8">
        <button
          type="button"
          @click="currentStep = 1"
          class="flex items-center justify-center gap-2 py-3 px-2 rounded-lg border text-xs font-bold transition-colors cursor-pointer"
          :class="[
            currentStep === 1
              ? 'bg-[#17181f] border-amber-500 text-amber-400'
              : 'bg-[#12131a] border-[#262833] text-zinc-400 hover:text-zinc-200'
          ]"
        >
          <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono border border-current">
            1
          </span>
          <span class="hidden sm:inline">Data & Disponibilidade</span>
          <span class="sm:hidden">Data</span>
        </button>

        <button
          type="button"
          @click="currentStep = 2"
          class="flex items-center justify-center gap-2 py-3 px-2 rounded-lg border text-xs font-bold transition-colors cursor-pointer"
          :class="[
            currentStep === 2
              ? 'bg-[#17181f] border-amber-500 text-amber-400'
              : 'bg-[#12131a] border-[#262833] text-zinc-400 hover:text-zinc-200'
          ]"
        >
          <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono border border-current">
            2
          </span>
          <span class="hidden sm:inline">Estrutura & Pacote</span>
          <span class="sm:hidden">Estrutura</span>
        </button>

        <button
          type="button"
          @click="currentStep = 3"
          class="flex items-center justify-center gap-2 py-3 px-2 rounded-lg border text-xs font-bold transition-colors cursor-pointer"
          :class="[
            currentStep === 3
              ? 'bg-[#17181f] border-amber-500 text-amber-400'
              : 'bg-[#12131a] border-[#262833] text-zinc-400 hover:text-zinc-200'
          ]"
        >
          <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono border border-current">
            3
          </span>
          <span class="hidden sm:inline">Pagamento & Proposta</span>
          <span class="sm:hidden">Pagamento</span>
        </button>
      </div>

      <!-- Layout do Simulador: Formulário de Etapas + Resumo Sólido -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- ÁREA DE ETAPAS (7 Colunas) -->
        <div class="lg:col-span-7 bg-[#17181f] rounded-xl border border-[#262833] p-5 sm:p-7">
          <!-- ==================== ETAPA 1 ==================== -->
          <div v-if="currentStep === 1" class="flex flex-col gap-6">
            <div>
              <h3 class="text-lg font-bold text-white mb-1">
                Etapa 1: Data do Evento & Disponibilidade
              </h3>
              <p class="text-xs text-zinc-400">
                Selecione um dos sábados pretendidos em 2026 para validar a disponibilidade da equipe.
              </p>
            </div>

            <!-- Seleção de Sábado com Badge de Data Disponível -->
            <div class="flex flex-col gap-2">
              <label class="text-xs font-semibold text-zinc-300">
                Sábados de Alta Procura (2026):
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  v-for="sat in availableSaturdays"
                  :key="sat.value"
                  type="button"
                  @click="selectedSaturday = sat.value"
                  class="p-3 rounded-lg border text-left flex flex-col justify-between transition-colors cursor-pointer"
                  :class="[
                    selectedSaturday === sat.value
                      ? 'bg-[#262833] border-amber-400 text-white'
                      : 'bg-[#12131a] border-[#262833] text-zinc-300 hover:border-zinc-600'
                  ]"
                >
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-xs font-bold">{{ sat.label.split(' (')[0] }}</span>
                    <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle2 class="w-2.5 h-2.5" />
                      {{ sat.status }}
                    </span>
                  </div>
                  <span class="text-[10px] text-zinc-500">
                    ({{ sat.label.split(' (')[1] || 'Sábado' }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Campos Rápidos de Identificação -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#262833]">
              <div>
                <label class="block text-xs font-medium text-zinc-300 mb-1.5">
                  Nome dos Noivos:
                </label>
                <input
                  type="text"
                  v-model="coupleNames"
                  placeholder="Ex: Beatriz & Rodrigo"
                  class="w-full px-3 py-2 rounded-lg bg-[#12131a] border border-[#262833] text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-zinc-300 mb-1.5">
                  Cidade / Espaço:
                </label>
                <input
                  type="text"
                  v-model="eventLocation"
                  placeholder="Ex: Fazenda Vila Rica, Itatiba"
                  class="w-full px-3 py-2 rounded-lg bg-[#12131a] border border-[#262833] text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="button"
              @click="currentStep = 2"
              class="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-colors cursor-pointer mt-2"
            >
              <span>Continuar para Estrutura do Pacote</span>
              <ArrowRight class="w-4 h-4" />
            </button>
          </div>

          <!-- ==================== ETAPA 2 ==================== -->
          <div v-else-if="currentStep === 2" class="flex flex-col gap-6">
            <div>
              <h3 class="text-lg font-bold text-white mb-1">
                Etapa 2: Estrutura do Evento & Cobertura
              </h3>
              <p class="text-xs text-zinc-400">
                Defina o formato de equipe e a dinâmica de deslocamento do seu casamento.
              </p>
            </div>

            <!-- 1. Logística de Deslocamento -->
            <div class="flex flex-col gap-2">
              <label class="text-xs font-semibold text-zinc-300">
                1. Dinâmica da Locação:
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  @click="logisticsType = 'same_venue'"
                  class="p-3.5 rounded-lg border text-left transition-colors cursor-pointer"
                  :class="[
                    logisticsType === 'same_venue'
                      ? 'bg-[#262833] border-amber-400 text-white'
                      : 'bg-[#12131a] border-[#262833] text-zinc-300 hover:border-zinc-600'
                  ]"
                >
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-bold">Tudo no Mesmo Local</span>
                    <span class="text-[11px] font-mono text-emerald-400 font-bold">Incluso</span>
                  </div>
                  <p class="text-[11px] text-zinc-400">
                    Cerimônia, making of e recepção no mesmo espaço físico.
                  </p>
                </button>

                <button
                  type="button"
                  @click="logisticsType = 'separate_venues'"
                  class="p-3.5 rounded-lg border text-left transition-colors cursor-pointer"
                  :class="[
                    logisticsType === 'separate_venues'
                      ? 'bg-[#262833] border-amber-400 text-white'
                      : 'bg-[#12131a] border-[#262833] text-zinc-300 hover:border-zinc-600'
                  ]"
                >
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-bold">Igreja + Recepção Separada</span>
                    <span class="text-[11px] font-mono text-amber-400 font-bold">+ R$ 600</span>
                  </div>
                  <p class="text-[11px] text-zinc-400">
                    Inclui equipe de deslocamento prévio e áudio em dois endereços.
                  </p>
                </button>
              </div>
            </div>

            <!-- 2. Equipe de Câmeras -->
            <div class="flex flex-col gap-2">
              <label class="text-xs font-semibold text-zinc-300">
                2. Formação da Equipe de Cinema:
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  @click="cameraPackage = '1camera'"
                  class="p-3.5 rounded-lg border text-left transition-colors cursor-pointer"
                  :class="[
                    cameraPackage === '1camera'
                      ? 'bg-[#262833] border-amber-400 text-white'
                      : 'bg-[#12131a] border-[#262833] text-zinc-300 hover:border-zinc-600'
                  ]"
                >
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-bold">1 Videomaker Profissional</span>
                    <span class="text-xs font-mono font-bold text-amber-400">R$ 4.200</span>
                  </div>
                  <p class="text-[11px] text-zinc-400">
                    Ideal para mini weddings ou casamentos intimistas de até 90 convidados.
                  </p>
                </button>

                <button
                  type="button"
                  @click="cameraPackage = '2cameras'"
                  class="p-3.5 rounded-lg border text-left transition-colors cursor-pointer"
                  :class="[
                    cameraPackage === '2cameras'
                      ? 'bg-[#262833] border-amber-400 text-white'
                      : 'bg-[#12131a] border-[#262833] text-zinc-300 hover:border-zinc-600'
                  ]"
                >
                  <div class="flex items-center justify-between mb-1">
                    <div class="flex items-center gap-1.5">
                      <span class="text-xs font-bold">2 Videomakers</span>
                      <span class="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[9px] uppercase font-bold">Padrão</span>
                    </div>
                    <span class="text-xs font-mono font-bold text-amber-400">R$ 5.400</span>
                  </div>
                  <p class="text-[11px] text-zinc-400">
                    Cobertura com ângulos simultâneos: reação do noivo e entrada da noiva ao mesmo tempo.
                  </p>
                </button>
              </div>
            </div>

            <!-- 3. Adicionais com Checkboxes -->
            <div class="flex flex-col gap-2.5 pt-2 border-t border-[#262833]">
              <label class="text-xs font-semibold text-zinc-300">
                3. Módulos Adicionais:
              </label>

              <!-- Drone 4K -->
              <label class="flex items-center justify-between p-3 rounded-lg bg-[#12131a] border border-[#262833] cursor-pointer hover:border-zinc-600 transition-colors">
                <div class="flex items-center gap-3">
                  <input type="checkbox" v-model="addons.drone" class="w-4 h-4 rounded text-amber-500 focus:ring-0 focus:ring-offset-0 bg-[#262833] border-zinc-700" />
                  <div>
                    <span class="text-xs font-bold text-white block">Imagens Aéreas com Drone 4K</span>
                    <span class="text-[11px] text-zinc-400">Tomadas panorâmicas da locação, chegadas e pôr do sol.</span>
                  </div>
                </div>
                <span class="text-xs font-mono font-bold text-amber-400 shrink-0">+ R$ 700</span>
              </label>

              <!-- Teaser 60s -->
              <label class="flex items-center justify-between p-3 rounded-lg bg-[#12131a] border border-[#262833] cursor-pointer hover:border-zinc-600 transition-colors">
                <div class="flex items-center gap-3">
                  <input type="checkbox" v-model="addons.teaser" class="w-4 h-4 rounded text-amber-500 focus:ring-0 focus:ring-offset-0 bg-[#262833] border-zinc-700" />
                  <div>
                    <span class="text-xs font-bold text-white block">Teaser 60s em até 48 Horas</span>
                    <span class="text-[11px] text-zinc-400">Edição vertical de alto impacto para postar no Instagram enquanto o evento está quente.</span>
                  </div>
                </div>
                <span class="text-xs font-mono font-bold text-amber-400 shrink-0">+ R$ 500</span>
              </label>

              <!-- Pré-Wedding -->
              <label class="flex items-center justify-between p-3 rounded-lg bg-[#12131a] border border-[#262833] cursor-pointer hover:border-zinc-600 transition-colors">
                <div class="flex items-center gap-3">
                  <input type="checkbox" v-model="addons.preWedding" class="w-4 h-4 rounded text-amber-500 focus:ring-0 focus:ring-offset-0 bg-[#262833] border-zinc-700" />
                  <div>
                    <span class="text-xs font-bold text-white block">Ensaio Pré-Wedding Documental</span>
                    <span class="text-[11px] text-zinc-400">Ensaio externo em vídeo semanas antes para quebrar o gelo com a câmera.</span>
                  </div>
                </div>
                <span class="text-xs font-mono font-bold text-amber-400 shrink-0">+ R$ 900</span>
              </label>
            </div>

            <!-- Navegação entre Etapas -->
            <div class="flex items-center justify-between gap-3 pt-4 border-t border-[#262833]">
              <button
                type="button"
                @click="currentStep = 1"
                class="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-lg bg-[#12131a] hover:bg-[#262833] border border-[#262833] text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                <ArrowLeft class="w-4 h-4" />
                <span>Voltar</span>
              </button>

              <button
                type="button"
                @click="currentStep = 3"
                class="inline-flex items-center gap-2 py-2.5 px-5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Condições de Pagamento</span>
                <ArrowRight class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- ==================== ETAPA 3 ==================== -->
          <div v-else-if="currentStep === 3" class="flex flex-col gap-6">
            <div>
              <h3 class="text-lg font-bold text-white mb-1">
                Etapa 3: Condições de Pagamento Automatizadas
              </h3>
              <p class="text-xs text-zinc-400">
                Selecione a forma que melhor se encaixa no planejamento financeiro do casal.
              </p>
            </div>

            <!-- Seletor de Condição de Pagamento -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <!-- Opção À Vista -->
              <button
                type="button"
                @click="paymentOption = 'avista'"
                class="p-4 rounded-lg border text-left transition-colors cursor-pointer flex flex-col justify-between"
                :class="[
                  paymentOption === 'avista'
                    ? 'bg-[#262833] border-amber-400 text-white'
                    : 'bg-[#12131a] border-[#262833] text-zinc-300 hover:border-zinc-600'
                ]"
              >
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold uppercase tracking-wider text-amber-400">À Vista (PIX / Transferência)</span>
                    <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      5% OFF
                    </span>
                  </div>
                  <div class="text-xl font-bold font-mono text-white mb-1">
                    {{ new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(finalTotalAvista) }}
                  </div>
                  <p class="text-[11px] text-zinc-400">
                    Economia imediata de {{ new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(discountAvista) }} no fechamento do contrato.
                  </p>
                </div>
              </button>

              <!-- Opção Entrada + Parcelado -->
              <button
                type="button"
                @click="paymentOption = 'parcelado'"
                class="p-4 rounded-lg border text-left transition-colors cursor-pointer flex flex-col justify-between"
                :class="[
                  paymentOption === 'parcelado'
                    ? 'bg-[#262833] border-amber-400 text-white'
                    : 'bg-[#12131a] border-[#262833] text-zinc-300 hover:border-zinc-600'
                ]"
              >
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold uppercase tracking-wider text-amber-400">Entrada 25% + Mensalidades</span>
                    <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold">
                      Sem Juros
                    </span>
                  </div>
                  <div class="text-xl font-bold font-mono text-white mb-1">
                    {{ new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(rawSubtotal) }}
                  </div>
                  <p class="text-[11px] text-zinc-400 leading-normal">
                    Entrada de <strong>{{ new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(downPayment) }}</strong> +
                    <strong>{{ estimatedInstallmentsCount }}x de {{ new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(installmentMonthlyValue) }}</strong> mensais até a data do evento.
                  </p>
                </div>
              </button>
            </div>

            <!-- WhatsApp de Contato dos Noivos -->
            <div class="p-3.5 rounded-lg bg-[#12131a] border border-[#262833]">
              <label class="block text-xs font-medium text-zinc-300 mb-1.5">
                WhatsApp para envio da proposta oficial:
              </label>
              <input
                type="tel"
                v-model="contactPhone"
                placeholder="Ex: (11) 98888-7777"
                class="w-full px-3 py-2 rounded-lg bg-[#0f1015] border border-[#262833] text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            <!-- Notificação de Proposta Sincronizada -->
            <div v-if="leadSuccessNotice" class="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 shrink-0" />
              <span>Proposta gerada! Ela foi enviada para o WhatsApp e adicionada automaticamente ao <strong>Painel do Videomaker</strong>.</span>
            </div>

            <!-- Botão de Ação: Enviar WhatsApp + Salvar no Painel -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <button
                type="button"
                @click="currentStep = 2"
                class="inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-lg bg-[#12131a] hover:bg-[#262833] border border-[#262833] text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                <ArrowLeft class="w-4 h-4" />
                <span>Voltar à Estrutura</span>
              </button>

              <button
                type="button"
                @click="handleGenerateProposal"
                class="inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-bold transition-colors shadow-lg cursor-pointer"
              >
                <Send class="w-4 h-4" />
                <span>Enviar Proposta Detalhada no WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        <!-- RESUMO OPERACIONAL LATERAL (5 Colunas - Sólido e Rápido) -->
        <div class="lg:col-span-5 bg-[#17181f] rounded-xl border border-[#262833] p-5 sm:p-6 lg:sticky lg:top-24 flex flex-col gap-5">
          <div class="flex items-center justify-between pb-3 border-b border-[#262833]">
            <span class="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400">
              Resumo da Estrutura
            </span>
            <span class="text-[10px] text-zinc-500 font-mono">
              Agenda 2026
            </span>
          </div>

          <!-- Itens do Resumo -->
          <div class="flex flex-col gap-2.5 text-xs">
            <div class="flex items-center justify-between text-zinc-300">
              <span>Data Selecionada:</span>
              <span class="font-bold text-white font-mono text-[11px]">{{ selectedSaturdayFormatted.split(' (')[0] }}</span>
            </div>

            <div class="flex items-center justify-between text-zinc-300">
              <span>Equipe Base:</span>
              <span class="font-mono text-zinc-200">
                {{ cameraPackage === '1camera' ? '1 Videomaker' : '2 Videomakers' }}
                ({{ new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(cameraBasePrice) }})
              </span>
            </div>

            <div class="flex items-center justify-between text-zinc-300">
              <span>Logística:</span>
              <span class="font-mono text-zinc-200">
                {{ logisticsType === 'same_venue' ? 'Mesmo Local (R$ 0)' : '+ R$ 600 (2 Locais)' }}
              </span>
            </div>

            <div v-if="addons.drone" class="flex items-center justify-between text-zinc-300">
              <span>Drone 4K:</span>
              <span class="font-mono text-amber-400">+ R$ 700</span>
            </div>

            <div v-if="addons.teaser" class="flex items-center justify-between text-zinc-300">
              <span>Teaser 60s em 48h:</span>
              <span class="font-mono text-amber-400">+ R$ 500</span>
            </div>

            <div v-if="addons.preWedding" class="flex items-center justify-between text-zinc-300">
              <span>Ensaio Pré-Wedding:</span>
              <span class="font-mono text-amber-400">+ R$ 900</span>
            </div>
          </div>

          <!-- Destaque do Total -->
          <div class="pt-4 border-t border-[#262833]">
            <div class="flex items-baseline justify-between mb-1">
              <span class="text-xs uppercase tracking-wider font-semibold text-zinc-400">
                Investimento Total
              </span>
              <span v-if="paymentOption === 'avista'" class="text-[10px] font-bold text-emerald-400">
                5% de Desconto Aplicado
              </span>
              <span v-else class="text-[10px] font-mono text-amber-400">
                Até {{ estimatedInstallmentsCount }}x sem juros
              </span>
            </div>

            <div class="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
              {{ formattedDisplayTotal }}
            </div>

            <div v-if="paymentOption === 'parcelado'" class="text-[11px] text-zinc-400 mt-2">
              Entrada de <strong>{{ new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(downPayment) }}</strong> +
              {{ estimatedInstallmentsCount }} parcelas de <strong>{{ new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(installmentMonthlyValue) }}</strong> mensais.
            </div>
          </div>

          <div class="p-3 rounded-lg bg-[#12131a] border border-[#262833] text-[11px] text-zinc-400 flex items-start gap-2">
            <CheckCircle2 class="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>Reserva garantida apenas mediante assinatura do contrato digital e pagamento do sinal de 25%.</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
