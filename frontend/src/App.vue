<script setup lang="ts">
import TheHeader from './components/TheHeader.vue'
import HeroSection from './components/HeroSection.vue'
import VideoGallery from './components/VideoGallery.vue'
import BudgetCalculator from './components/BudgetCalculator.vue'
import VideomakerDashboard from './components/VideomakerDashboard.vue'
import { useVideomakerStore } from './composables/useVideomakerStore'
import { CheckCircle2, ArrowRight } from 'lucide-vue-next'

const { currentView, switchView, recentLeadNotification } = useVideomakerStore()
</script>

<template>
  <div class="min-h-screen bg-[#0f1015] text-zinc-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
    <!-- Notificação Flutuante de Lead Adicionado (Aparece ao preencher o simulador) -->
    <div
      v-if="recentLeadNotification"
      class="fixed bottom-6 right-6 z-50 p-4 rounded-lg bg-[#17181f] border border-amber-500/50 shadow-2xl text-xs flex items-center gap-3 animate-fade-in"
    >
      <div class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
        <CheckCircle2 class="w-4 h-4" />
      </div>
      <div class="flex flex-col">
        <span class="font-bold text-white">Nova Proposta Gerada!</span>
        <span class="text-zinc-400">{{ recentLeadNotification }}</span>
      </div>
      <button
        v-if="currentView === 'client'"
        type="button"
        @click="switchView('dashboard')"
        class="ml-2 inline-flex items-center gap-1 px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold transition-colors cursor-pointer"
      >
        <span>Ver no Painel</span>
        <ArrowRight class="w-3 h-3" />
      </button>
    </div>

    <!-- 1. Barra Superior Fixa com Seletor de Modo (Cliente vs Videomaker) -->
    <TheHeader />

    <!-- 2. Conteúdo Dinâmico Baseado no Modo Ativo -->
    <main class="flex-grow">
      <!-- MODO 1: VISÃO DOS NOIVOS / CLIENTE -->
      <div v-if="currentView === 'client'">
        <HeroSection />
        <VideoGallery />
        <BudgetCalculator />
      </div>

      <!-- MODO 2: PAINEL DO VIDEOMAKER -->
      <div v-else>
        <VideomakerDashboard />
      </div>
    </main>

    <!-- Rodapé Técnico Sólido e Discreto -->
    <footer class="border-t border-[#262833] bg-[#0c0d12] py-8 px-4 sm:px-6">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-zinc-500">
        <div class="flex items-center gap-2">
          <span class="font-bold text-zinc-300 tracking-wider">ÓKAYAN</span>
          <span>• Cinema de Casamento & Estúdio Operacional</span>
        </div>

        <div class="flex items-center gap-4 font-mono text-[11px]">
          <span>Interface Otimizada (60 FPS)</span>
          <span>•</span>
          <span>Sincronização em Tempo Real</span>
        </div>
      </div>
    </footer>
  </div>
</template>
