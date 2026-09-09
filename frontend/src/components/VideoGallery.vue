<script setup lang="ts">
import { Instagram, Play, Clock, ArrowUpRight } from 'lucide-vue-next'

interface ReelFilm {
  id: number
  couple: string
  venue: string
  duration: string
  ratio: string
  thumbnailUrl: string
  instagramUrl: string
  tag: string
}

const reels: ReelFilm[] = [
  {
    id: 1,
    couple: 'Isabela & Rafael',
    venue: 'Fazenda Vila Rica, Itatiba - SP',
    duration: '04:18 min',
    ratio: '16:9 Cinema 4K',
    tag: 'Teaser Oficial',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    instagramUrl: 'https://instagram.com'
  },
  {
    id: 2,
    couple: 'Mariana & Guilherme',
    venue: 'Destination Wedding, Ilhabela - SP',
    duration: '01:00 min',
    ratio: '9:16 Reel Vertical',
    tag: 'Reel em 48h',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
    instagramUrl: 'https://instagram.com'
  },
  {
    id: 3,
    couple: 'Carolina & Bernardo',
    venue: 'N. Sra. do Brasil, Jardins - SP',
    duration: '05:30 min',
    ratio: '16:9 Full Narrative',
    tag: 'Documentário',
    thumbnailUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
    instagramUrl: 'https://instagram.com'
  }
]
</script>

<template>
  <section id="gallery" class="py-16 sm:py-20 px-4 sm:px-6 bg-[#0f1015] border-b border-[#262833]">
    <div class="max-w-6xl mx-auto">
      <!-- Cabeçalho Direto -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <div class="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400 mb-2">
            Portfólio Recente
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Filmes & Reels em Destaque
          </h2>
        </div>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <Instagram class="w-3.5 h-3.5 text-amber-400" />
          <span>Ver mais trabalhos no Instagram</span>
          <ArrowUpRight class="w-3.5 h-3.5" />
        </a>
      </div>

      <!-- Grid com 3 Cards Sólidos (Estilo Reels/Widescreen) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article
          v-for="reel in reels"
          :key="reel.id"
          class="flex flex-col bg-[#17181f] rounded-xl border border-[#262833] overflow-hidden hover:border-zinc-700 transition-colors group"
        >
          <!-- Thumbnail com Badge de Duração -->
          <div class="relative aspect-[16/10] bg-zinc-900 overflow-hidden">
            <img
              :src="reel.thumbnailUrl"
              :alt="`Filme de ${reel.couple}`"
              loading="lazy"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[#17181f] via-transparent to-black/40"></div>

            <!-- Tag de Formato -->
            <div class="absolute top-3 left-3">
              <span class="px-2 py-0.5 rounded bg-[#0f1015] border border-[#262833] text-[10px] font-mono font-medium text-zinc-300">
                {{ reel.tag }}
              </span>
            </div>

            <!-- Duração -->
            <div class="absolute top-3 right-3">
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0f1015] border border-[#262833] text-[11px] font-mono font-medium text-zinc-300">
                <Clock class="w-3 h-3 text-amber-400" />
                <span>{{ reel.duration }}</span>
              </span>
            </div>

            <!-- Play Overlay -->
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="w-10 h-10 rounded-full bg-[#0f1015]/90 border border-[#262833] text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-zinc-950 group-hover:border-transparent transition-colors">
                <Play class="w-4 h-4 fill-current translate-x-0.5" />
              </div>
            </div>
          </div>

          <!-- Informações e Botão Direto do Instagram -->
          <div class="p-5 flex flex-col justify-between flex-grow gap-4">
            <div>
              <div class="text-xs font-mono text-amber-400 mb-1">
                {{ reel.ratio }}
              </div>
              <h3 class="text-base sm:text-lg font-bold text-white mb-1">
                {{ reel.couple }}
              </h3>
              <p class="text-xs text-zinc-400">
                {{ reel.venue }}
              </p>
            </div>

            <!-- Botão Direto 'Ver no Instagram' -->
            <a
              :href="reel.instagramUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-[#262833] hover:bg-amber-500 text-zinc-200 hover:text-zinc-950 text-xs font-bold transition-colors cursor-pointer"
            >
              <Instagram class="w-3.5 h-3.5" />
              <span>Ver no Instagram</span>
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
