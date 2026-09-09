<script setup lang="ts">
import { Film, LayoutDashboard, Users, Sparkles } from 'lucide-vue-next'
import { useVideomakerStore } from '../composables/useVideomakerStore'

const { currentView, switchView, leads } = useVideomakerStore()

const scrollToSection = (id: string) => {
  if (currentView.value !== 'client') {
    switchView('client')
    setTimeout(() => {
      const el = document.getElementById(id)
      el?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
    return
  }
  const el = document.getElementById(id)
  el?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <header class="sticky top-0 z-50 w-full bg-[#0f1015] border-b border-[#262833]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-4">
      <!-- Logo da Produtora & Status da Agenda -->
      <div class="flex items-center gap-3 sm:gap-4 shrink-0">
        <a
          href="#"
          @click.prevent="switchView('client')"
          class="flex items-center gap-2 text-zinc-100 hover:text-white transition-colors"
        >
          <div class="w-8 h-8 rounded bg-[#17181f] border border-[#262833] flex items-center justify-center">
            <Film class="w-4 h-4 text-amber-400" />
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-1.5 font-bold tracking-wider text-sm sm:text-base text-zinc-100">
              <span>ÓKAYAN</span>
              <span class="text-zinc-500 font-normal text-xs">• Estúdio de Cinema</span>
            </div>
          </div>
        </a>

        <!-- Status Pill: Agenda 2026 Aberta -->
        <div class="hidden md:inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#17181f] border border-[#262833] text-[11px] font-medium text-zinc-300">
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Agenda 2026 Aberta</span>
        </div>
      </div>

      <!-- SELETOR DE MODO NO TOPO (Cliente vs Painel do Videomaker) -->
      <div class="flex items-center bg-[#17181f] p-1 rounded-lg border border-[#262833] shrink-0">
        <button
          type="button"
          @click="switchView('client')"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer"
          :class="[
            currentView === 'client'
              ? 'bg-[#262833] text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          ]"
        >
          <Users class="w-3.5 h-3.5" :class="currentView === 'client' ? 'text-amber-400' : 'text-zinc-500'" />
          <span class="hidden sm:inline">Visão dos</span> Noivos
        </button>

        <button
          type="button"
          @click="switchView('dashboard')"
          class="relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer"
          :class="[
            currentView === 'dashboard'
              ? 'bg-amber-500 text-zinc-950 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          ]"
        >
          <LayoutDashboard class="w-3.5 h-3.5" :class="currentView === 'dashboard' ? 'text-zinc-950' : 'text-zinc-500'" />
          <span>Painel do Videomaker</span>
          <!-- Badge de novos leads no painel -->
          <span
            v-if="leads.length > 0"
            class="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold"
            :class="currentView === 'dashboard' ? 'bg-zinc-950 text-amber-400' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'"
          >
            {{ leads.length }}
          </span>
        </button>
      </div>

      <!-- Ações Rápidas no Modo Cliente -->
      <div v-if="currentView === 'client'" class="hidden lg:flex items-center gap-3">
        <button
          type="button"
          @click="scrollToSection('calculator')"
          class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#17181f] hover:bg-[#262833] border border-[#262833] text-xs font-medium text-zinc-200 hover:text-white transition-colors cursor-pointer"
        >
          <Sparkles class="w-3.5 h-3.5 text-amber-400" />
          <span>Simular Data & Pacote</span>
        </button>
      </div>
    </div>
  </header>
</template>
