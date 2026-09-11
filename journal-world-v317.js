/* DIVINA BRUXA 2.0 — REBIRTH R018 · DIÁRIO & ESPELHO V317
   Mundo vivo construído SOBRE o JournalEngine V187 real.
   Não duplica armazenamento, editor, calendário, timeline, Espelho ou consentimento da IA. */

import { JournalEngine } from './journal-engine.js?v=187';
import { RhythmEngine } from './rhythm-v6.js';
import {
  entriesForJournalPeriod,
  localMirrorData,
  journalDateKey
} from './journal-policy.js?v=187';

const RELEASE = 'V317';
const WORLD_ID = 'journalWorldV317';

const safe = value => String(value ?? '')
  .replace(/[&<>"']/g, char => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));

const todayKey = () => journalDateKey(new Date());

const dayWindow = (entries, amount = 7) => {
  const counts = Object.create(null);
  for (const entry of entries) {
    const key = journalDateKey(entry.createdAt);
    counts[key] = (counts[key] || 0) + 1;
  }
  return Array.from({ length:amount }, (_, index) => {
    const date = new Date();
    date.setHours(12,0,0,0);
    date.setDate(date.getDate() - (amount - 1 - index));
    const key = journalDateKey(date);
    return Object.freeze({
      key,
      count:counts[key] || 0,
      label:new Intl.DateTimeFormat('pt-BR', { weekday:'narrow' }).format(date)
    });
  });
};

const relativeDate = value => {
  if (!value) return 'ainda sem memórias';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'tempo preservado';
  const key = journalDateKey(date);
  if (key === todayKey()) return 'hoje';
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (key === journalDateKey(yesterday)) return 'ontem';
  return new Intl.DateTimeFormat('pt-BR', { day:'2-digit', month:'short' }).format(date);
};

export class JournalWorldV317 {
  constructor(root) {
    this.root = root?.id === 'journalApp' ? root : document.querySelector('#journalApp');
    if (!this.root) return;

    this.engine = new JournalEngine(this.root);
    this.rhythm = new RhythmEngine(this.root.querySelector('#journalRhythm'));
    this.destroyed = false;
    this.lastSignature = '';
    this.originalRender = this.engine.render.bind(this.engine);
    this.originalAdd = this.engine.add.bind(this.engine);

    this.engine.render = (...args) => {
      const result = this.originalRender(...args);
      queueMicrotask(() => this.enhance());
      return result;
    };

    this.engine.add = input => {
      const result = this.originalAdd(input);
      queueMicrotask(() => this.enhance(true));
      return result;
    };

    this.root.dataset.journalWorld = 'v317';
    this.enhance(true);

    document.dispatchEvent(new CustomEvent('divina:journal-world-ready', {
      detail:Object.freeze({
        release:RELEASE,
        private:true,
        mirror:'aggregate-only',
        bodyShared:false
      })
    }));
  }

  entries() {
    try { return this.engine?.all?.() || []; }
    catch { return []; }
  }

  metrics() {
    const entries = this.entries();
    const selected = entriesForJournalPeriod(entries, this.engine?.period || '30');
    const aggregate = localMirrorData(selected);
    const recent = dayWindow(entries, 7);
    const last = entries[0] || null;

    return Object.freeze({
      total:entries.length,
      selectedTotal:aggregate.total,
      favorites:aggregate.favorites,
      reviewsDue:aggregate.reviewsDue,
      linked:aggregate.linked,
      activeDays7:recent.filter(day => day.count > 0).length,
      weekTotal:recent.reduce((sum, day) => sum + day.count, 0),
      recent,
      lastAt:last?.createdAt || ''
    });
  }

  signature(metrics) {
    return [
      metrics.total,
      metrics.selectedTotal,
      metrics.favorites,
      metrics.reviewsDue,
      metrics.linked,
      metrics.weekTotal,
      metrics.lastAt,
      this.engine?.period || '30',
      this.engine?.view || 'timeline'
    ].join('|');
  }

  enhance(force = false) {
    if (this.destroyed || !this.root) return;
    const metrics = this.metrics();
    const signature = this.signature(metrics);
    if (!force && signature === this.lastSignature && document.getElementById(WORLD_ID)) return;
    this.lastSignature = signature;

    let world = document.getElementById(WORLD_ID);
    if (!world) {
      world = document.createElement('section');
      world.id = WORLD_ID;
      world.className = 'journal-world-v317';
      world.setAttribute('aria-labelledby', 'journalWorldV317Title');

      const command = this.root.querySelector('.journal-command');
      if (command?.nextSibling) this.root.insertBefore(world, command.nextSibling);
      else this.root.prepend(world);
    }

    const max = Math.max(1, ...metrics.recent.map(day => day.count));
    const constellation = metrics.recent.map((day, index) => {
      const strength = day.count ? Math.max(.28, day.count / max) : .12;
      return `<span class="jwv317__star ${day.count ? 'is-lit' : ''}" style="--jwv-star:${strength};--jwv-delay:${index * 90}ms" title="${safe(day.key)} · ${day.count} ${day.count === 1 ? 'memória' : 'memórias'}"><i></i><small>${safe(day.label)}</small></span>`;
    }).join('');

    world.innerHTML = `
      <div class="jwv317__cosmos" aria-hidden="true"><i></i><i></i><i></i></div>
      <header class="jwv317__head">
        <div class="jwv317__copy">
          <p class="eyebrow">DIÁRIO & ESPELHO · MUNDO VIVO</p>
          <h3 id="journalWorldV317Title">Um lugar para guardar sem ser observado.</h3>
          <p>Escreva, retorne e perceba relações no seu próprio ritmo. O Espelho descreve padrões de registro — nunca define quem você é.</p>
        </div>
        <span class="jwv317__seal" aria-label="Cofre privado">◇</span>
      </header>

      <div class="jwv317__pulse">
        <section class="jwv317__constellation" aria-label="Presença nos últimos sete dias">
          <header><b>CONSTELAÇÃO DE RETORNO</b><small>${metrics.weekTotal} ${metrics.weekTotal === 1 ? 'memória' : 'memórias'} em 7 dias</small></header>
          <div>${constellation}</div>
        </section>

        <section class="jwv317__stats" aria-label="Resumo privado do Diário">
          <article><strong>${metrics.total}</strong><span>memórias</span></article>
          <article><strong>${metrics.activeDays7}</strong><span>dias ativos</span></article>
          <article><strong>${metrics.favorites}</strong><span>favoritas</span></article>
          <article><strong>${metrics.reviewsDue}</strong><span>para rever</span></article>
        </section>
      </div>

      <div class="jwv317__passages">
        <button type="button" data-jwv-write><span>✦</span><b>ESCREVER AGORA</b><small>abrir uma nova memória</small></button>
        <button type="button" data-jwv-mirror><span>☾</span><b>ABRIR O ESPELHO</b><small>ver padrões agregados</small></button>
        <p><b>Último encontro: ${safe(relativeDate(metrics.lastAt))}.</b><small>Admin, analytics e Whit não recebem o corpo das suas memórias automaticamente.</small></p>
      </div>`;

    world.querySelector('[data-jwv-write]')?.addEventListener('click', () => {
      const field = this.root.querySelector('#journalForm [name="title"]');
      this.root.querySelector('#journalForm')?.scrollIntoView({
        behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block:'start'
      });
      setTimeout(() => field?.focus({ preventScroll:true }), 260);
    });

    world.querySelector('[data-jwv-mirror]')?.addEventListener('click', () => {
      this.root.querySelector('.journal-mirror')?.scrollIntoView({
        behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block:'start'
      });
    });

    // Performance: conteúdo longo fora da viewport não custa pintura constante.
    this.root.querySelectorAll('.journal-timeline > article, .journal-mirror, .journal-explorer')
      .forEach(node => node.classList.add('jwv317__deferred'));

    document.dispatchEvent(new CustomEvent('divina:journal-world-updated', {
      detail:Object.freeze({
        release:RELEASE,
        total:metrics.total,
        activeDays7:metrics.activeDays7,
        reviewsDue:metrics.reviewsDue,
        privateBodyIncluded:false,
        analyticsTextIncluded:false
      })
    }));
  }

  add(entry) {
    return this.engine?.add?.(entry);
  }

  status() {
    const metrics = this.metrics();
    return Object.freeze({
      release:RELEASE,
      total:metrics.total,
      activeDays7:metrics.activeDays7,
      privateByDefault:true,
      mirrorAggregateOnly:true,
      adminBodyAccess:false,
      analyticsText:false,
      whitSilentRead:false,
      baseEngine:'V187',
      rhythmEngine:'V6'
    });
  }

  destroy() {
    this.destroyed = true;
    document.getElementById(WORLD_ID)?.remove();
    delete this.root?.dataset?.journalWorld;
  }
}
