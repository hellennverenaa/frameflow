<script setup lang="ts">
import { ref } from 'vue'
import { Play, Volume2, ArrowDown } from 'lucide-vue-next'

const isPlayingTrailer = ref(false)

const scrollToCalendar = () => {
  const el = document.getElementById('calendar-section')
  el?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section class="pt-12 sm:pt-16 pb-16 sm:pb-24 px-4 sm:px-6 bg-[#faf8f5]">
    <div class="max-w-4xl mx-auto text-center flex flex-col items-center">
      <!-- Tag Discreta -->
      <span class="text-xs uppercase tracking-[0.25em] font-semibold text-[#57534e] mb-4">
        Cinema de Casamento • 2026
      </span>

      <!-- Título Limpo e Sofisticado -->
      <h1 class="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1c1917] leading-[1.18] mb-5 sm:mb-6 max-w-3xl">
        O filme do seu casamento com a verdade de cada momento.
      </h1>

      <!-- Subtítulo Leve sobre Emoção e Discrição -->
      <p class="text-base sm:text-lg text-[#57534e] font-normal leading-relaxed max-w-2xl mb-8 sm:mb-10 text-balance">
        Sem poses ensaiadas ou interrupções na sua festa. Uma narrativa sensível e espontânea, construída com discrição para você reviver a emoção real do seu dia pelos próximos cinquenta anos.
      </p>

      <!-- Botão Sutil de Rolagem para o Calendário -->
      <button
        type="button"
        @click="scrollToCalendar"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#e7e5e4] hover:border-stone-400 text-xs font-semibold text-[#1c1917] transition-all shadow-xs mb-12 sm:mb-14 cursor-pointer"
      >
        <span>Consultar Disponibilidade de Data</span>
        <ArrowDown class="w-3.5 h-3.5 text-stone-500" />
      </button>

      <!-- PLAYER / VIEWPORT GRANDE E CINEMATOGRÁFICO (16:9) -->
      <div class="w-full max-w-4xl rounded-2xl sm:rounded-3xl overflow-hidden border border-[#e7e5e4] bg-white shadow-sm">
        <div class="relative aspect-video w-full bg-stone-100 overflow-hidden group">
          <!-- Imagem Fotográfica de Casamento em Alta Resolução -->
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop"
            alt="Trailer de Casamento Ókayan"
            class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 filter brightness-[0.92]"
          />

          <!-- Overlay Suave Cinematográfico -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

          <!-- Informações de Canto no Player -->
          <div class="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2 text-white text-xs">
            <span class="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-xs font-medium text-[11px] tracking-wide">
              Trailer Oficial • Isabela & Rafael
            </span>
          </div>

          <div class="absolute top-4 sm:top-6 right-4 sm:right-6">
            <span class="p-2 rounded-full bg-black/40 backdrop-blur-xs text-white/90 flex items-center justify-center">
              <Volume2 class="w-4 h-4" />
            </span>
          </div>

          <!-- Botão Central de Play Cinematográfico -->
          <div class="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              @click="isPlayingTrailer = !isPlayingTrailer"
              class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 hover:bg-white text-[#1c1917] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer group/btn"
              aria-label="Assistir ao trailer"
            >
              <Play class="w-6 h-6 sm:w-7 sm:h-7 fill-current translate-x-0.5 text-[#18181b]" />
            </button>
          </div>

          <!-- Rodapé do Player com Dados do Casal e Duração -->
          <div class="absolute bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-6 flex items-end justify-between text-white">
            <div class="text-left">
              <p class="text-sm sm:text-base font-semibold text-white drop-shadow-sm">
                Fazenda Vila Rica • Itatiba, SP
              </p>
              <p class="text-xs text-white/80 drop-shadow-sm font-light">
                Cinema em 4K • Captação de votos e recepção
              </p>
            </div>
            <span class="text-xs font-mono text-white/90 bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-xs">
              03:45 min
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
