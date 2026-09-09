<script setup lang="ts">
import TheHeader from './components/TheHeader.vue'
import HeroSection from './components/HeroSection.vue'
import AvailabilityCalendar from './components/AvailabilityCalendar.vue'
import BudgetCalculator from './components/BudgetCalculator.vue'
import VideomakerDashboard from './components/VideomakerDashboard.vue'
import { useVideomakerStore } from './composables/useVideomakerStore'
import { Lock } from 'lucide-vue-next'

const { currentView, switchView } = useVideomakerStore()
</script>

<template>
  <div class="min-h-screen bg-[#faf8f5] text-[#1c1917] flex flex-col font-sans selection:bg-stone-200 selection:text-stone-900">
    <!-- VISÃO DOS NOIVOS / CLIENTE -->
    <template v-if="currentView === 'client'">
      <!-- 1. Header Minimalista Editorial -->
      <TheHeader />

      <main class="flex-grow flex flex-col">
        <!-- 2. Hero Section com Player 16:9 em Destaque -->
        <HeroSection />

        <!-- 3. Calendário Mensal Real de Disponibilidade -->
        <AvailabilityCalendar />

        <!-- 4. Simulador Simples em Cards com Botão Preto Fosco -->
        <BudgetCalculator />
      </main>

      <!-- Rodapé Discreto com Link para Acesso do Estúdio -->
      <footer class="border-t border-[#e7e5e4] bg-[#faf8f5] py-12 px-4 sm:px-6 mt-auto">
        <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#57534e]">
          <div class="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span class="font-bold tracking-wider text-[#1c1917] uppercase">ÓKAYAN FILMES</span>
            <span class="hidden sm:inline">•</span>
            <span>Cinema autoral e documental de casamento</span>
          </div>

          <!-- Link Sutil para o Painel do Videomaker (Acesso do Estúdio) -->
          <div class="flex items-center gap-4">
            <button
              type="button"
              @click="switchView('dashboard')"
              class="inline-flex items-center gap-1.5 text-[11px] text-stone-400 hover:text-stone-700 transition-colors cursor-pointer py-1 px-2.5 rounded-lg border border-transparent hover:border-[#e7e5e4]"
            >
              <Lock class="w-3 h-3" />
              <span>Acesso do Estúdio</span>
            </button>
            <span>© {{ new Date().getFullYear() }}</span>
          </div>
        </div>
      </footer>
    </template>

    <!-- VISÃO INTERNA: PAINEL DO VIDEOMAKER -->
    <template v-else>
      <VideomakerDashboard />
    </template>
  </div>
</template>
