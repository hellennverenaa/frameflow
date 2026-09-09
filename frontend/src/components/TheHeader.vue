<script setup lang="ts">
import { MessageCircle } from 'lucide-vue-next'
</script>

<template>
  <header class="sticky top-0 z-40 w-full bg-[#faf8f5]/90 backdrop-blur-sm border-b border-[#e7e5e4]">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
      <!-- Logotipo Minimalista 'ÓKAYAN FILMES' -->
      <a href="#" class="flex items-center gap-2 text-[#1c1917] hover:opacity-80 transition-opacity">
        <span class="text-sm sm:text-base font-bold tracking-[0.25em] uppercase text-[#1c1917]">
          ÓKAYAN FILMES
        </span>
      </a>

      <!-- Link Rápido WhatsApp -->
      <div class="flex items-center gap-4">
        <a
          href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20gostaria%20de%20conversar%20sobre%20o%20filme%20do%20nosso%20casamento!"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full border border-[#e7e5e4] bg-white hover:bg-stone-50 text-xs font-semibold text-[#1c1917] transition-all shadow-xs"
        >
          <MessageCircle class="w-3.5 h-3.5 text-stone-600" />
          <span>Conversar no WhatsApp</span>
        </a>
      </div>
    </div>
  </header>
</template>
