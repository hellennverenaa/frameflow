<script setup lang="ts">
import { ArrowDown, CheckCircle2, ShieldCheck, Film } from 'lucide-vue-next'

const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <section id="hero" class="relative py-16 sm:py-24 px-4 sm:px-6 bg-[#0f1015] border-b border-[#262833]">
    <div class="max-w-5xl mx-auto flex flex-col items-start">
      <!-- Tag Técnica Superior -->
      <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#17181f] border border-[#262833] text-xs font-mono font-medium text-zinc-300 mb-6">
        <Film class="w-3.5 h-3.5 text-amber-400" />
        <span>CINEMA DOCUMENTAL • SÃO PAULO & DESTINATION</span>
      </div>

      <!-- Título Direto e Sem Clichês -->
      <h1 class="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.15] max-w-4xl mb-6">
        Filmes de casamento com estética de cinema documental.
      </h1>

      <!-- Subtítulo Operacional e Claro -->
      <p class="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed max-w-2xl mb-8">
        Sem poses forçadas e sem holofotes invasivos. Nossa equipe atua de forma discreta para registrar os votos autênticos, as reações espontâneas e a atmosfera real da sua celebração, com captação 4K nativa e entrega de teaser em até 48 horas.
      </p>

      <!-- Ações Diretas -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-12">
        <button
          type="button"
          @click="scrollToSection('calculator')"
          class="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-colors cursor-pointer"
        >
          <span>Simular Data & Estrutura do Pacote</span>
          <ArrowDown class="w-4 h-4 text-zinc-950" />
        </button>

        <button
          type="button"
          @click="scrollToSection('gallery')"
          class="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-[#17181f] hover:bg-[#262833] border border-[#262833] text-zinc-200 hover:text-white text-sm font-semibold transition-colors cursor-pointer"
        >
          <span>Ver Filmes e Reels</span>
        </button>
      </div>

      <!-- Dores Operacionais Resolvidas (Grid de 3 Benefícios Práticos) -->
      <div class="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-[#262833]">
        <div class="p-4 rounded-lg bg-[#17181f] border border-[#262833]">
          <div class="flex items-center gap-2 text-zinc-200 font-semibold text-sm mb-1">
            <CheckCircle2 class="w-4 h-4 text-amber-400" />
            <span>Presença Invisível</span>
          </div>
          <p class="text-xs text-zinc-400 leading-normal">
            Lentes teleobjetivas e iluminação natural. Os noivos e convidados esquecem que estão sendo filmados.
          </p>
        </div>

        <div class="p-4 rounded-lg bg-[#17181f] border border-[#262833]">
          <div class="flex items-center gap-2 text-zinc-200 font-semibold text-sm mb-1">
            <CheckCircle2 class="w-4 h-4 text-amber-400" />
            <span>Áudio Direto Cristalino</span>
          </div>
          <p class="text-xs text-zinc-400 leading-normal">
            Microfones de lapela ultradiscretos e captação direta da mesa de som para votos nítidos sem ruído de salão.
          </p>
        </div>

        <div class="p-4 rounded-lg bg-[#17181f] border border-[#262833]">
          <div class="flex items-center gap-2 text-zinc-200 font-semibold text-sm mb-1">
            <ShieldCheck class="w-4 h-4 text-amber-400" />
            <span>Backup Duplo em Tempo Real</span>
          </div>
          <p class="text-xs text-zinc-400 leading-normal">
            Gravação simultânea em dois cartões por câmera e cópia imediata em SSD seguro no local do evento.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
