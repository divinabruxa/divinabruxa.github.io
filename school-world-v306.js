/* DIVINA BRUXA 2.0 — REBIRTH R007 · ESCOLA DO TAROT V306
   Camada de jornada sobre a Escola V186: preserva 17 módulos, 124 aulas, notas privadas,
   favoritos, revisão, quizzes, backup local e consentimento do Tutor opcional. */

import { SchoolEngine } from './school-engine.js?v=186';
import {
  SCHOOL_MODULES,
  SCHOOL_LESSON_TOTAL,
  SCHOOL_CARD_TOTAL,
  SCHOOL_THEORY_TOTAL
} from './school-policy.js?v=186';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

function progressSnapshot(engine) {
  const completed = Array.isArray(engine?.state?.completed) ? new Set(engine.state.completed) : new Set();
  const modules = SCHOOL_MODULES.map(module => {
    let lessons = [];
    try { lessons = engine.lessonsFor?.(module) || []; } catch { lessons = []; }
    const total = lessons.length;
    const done = lessons.reduce((sum, lesson) => sum + (completed.has(lesson.id) ? 1 : 0), 0);
    return { module, total, done, percent: total ? Math.round(done / total * 100) : 0 };
  });
  const done = clamp(completed.size, 0, SCHOOL_LESSON_TOTAL);
  return {
    done,
    total:SCHOOL_LESSON_TOTAL,
    percent:Math.round(done / SCHOOL_LESSON_TOTAL * 100),
    modules
  };
}

function nextCopy(engine) {
  try {
    const target = engine.resumeTarget?.();
    if (!target?.lesson || !target?.module) return 'Escolha um módulo para começar sua jornada.';
    return `Próxima passagem: ${target.module.title} · ${target.lesson.title || target.lesson.card?.name || 'aula'}`;
  } catch {
    return 'Continue exatamente de onde você parou.';
  }
}

export class SchoolWorldV306 {
  constructor(root) {
    if (!root) throw new Error('Escola V306 precisa de #schoolApp.');
    this.root = root;
    this.destroyed = false;
    this.enhanceQueued = false;
    this.engine = new SchoolEngine(root);

    const originalRender = this.engine.render?.bind(this.engine);
    if (originalRender) {
      this.engine.render = (...args) => {
        const result = originalRender(...args);
        this.queueEnhance();
        return result;
      };
    }

    const originalRenderLessons = this.engine.renderLessons?.bind(this.engine);
    if (originalRenderLessons) {
      this.engine.renderLessons = (...args) => {
        const result = originalRenderLessons(...args);
        this.queueEnhance();
        return result;
      };
    }

    this.observer = new MutationObserver(() => this.queueEnhance());
    this.observer.observe(root, { childList:true, subtree:true });
    this.enhance();
    root.dataset.schoolWorld = 'v306';
    document.dispatchEvent(new CustomEvent('divina:school-world-ready', {
      detail:{ version:306, modules:SCHOOL_MODULES.length, lessons:SCHOOL_LESSON_TOTAL }
    }));
  }

  queueEnhance() {
    if (this.destroyed || this.enhanceQueued) return;
    this.enhanceQueued = true;
    requestAnimationFrame(() => {
      this.enhanceQueued = false;
      this.enhance();
    });
  }

  enhance() {
    if (this.destroyed || !this.root.isConnected) return;
    const snapshot = progressSnapshot(this.engine);
    this.installJourney(snapshot);
    this.decorateModules(snapshot);
    this.decorateLessons();
  }

  installJourney(snapshot) {
    let altar = this.root.querySelector(':scope > .school-rebirth-journey');
    if (!altar) {
      altar = document.createElement('section');
      altar.className = 'school-rebirth-journey';
      altar.setAttribute('aria-label', 'Jornada da Escola do Tarot');
      this.root.prepend(altar);
    }

    const signature = [
      snapshot.done,
      this.engine?.state?.lastModule || '',
      this.engine?.state?.lastLesson || '',
      ...snapshot.modules.map(item => `${item.module.id}:${item.done}`)
    ].join('|');
    if (altar.dataset.signature === signature) return;
    altar.dataset.signature = signature;

    altar.innerHTML = `
      <div class="school-rebirth-sky" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <header class="school-rebirth-head">
        <div>
          <p class="eyebrow">ESCOLA DO TAROT · JORNADA VIVA</p>
          <h3>Do primeiro símbolo à leitura inteira.</h3>
          <p>${nextCopy(this.engine)}</p>
        </div>
        <div class="school-rebirth-orbit" style="--school-progress:${snapshot.percent * 3.6}deg" aria-label="${snapshot.percent}% da Escola concluída">
          <span><b>${snapshot.percent}%</b><small>${snapshot.done}/${snapshot.total}</small></span>
        </div>
      </header>
      <div class="school-rebirth-metrics" aria-label="Conteúdo da Escola">
        <span><b>17</b><small>módulos</small></span>
        <span><b>${SCHOOL_CARD_TOTAL}</b><small>cartas estudadas</small></span>
        <span><b>${SCHOOL_THEORY_TOTAL}</b><small>aulas teóricas</small></span>
        <span><b>${SCHOOL_LESSON_TOTAL}</b><small>aulas reais</small></span>
      </div>
      <div class="school-rebirth-path" role="list" aria-label="Os 17 módulos da jornada">
        ${snapshot.modules.map(({ module, percent, done, total }) => `
          <button type="button" role="listitem" data-rebirth-school-module="${module.id}" aria-label="Módulo ${module.order}: ${module.title}. ${done} de ${total} concluídas.">
            <span>${String(module.order).padStart(2,'0')}</span>
            <i><u style="--module-progress:${percent}%"></u></i>
            <b>${module.title}</b>
          </button>`).join('')}
      </div>
      <div class="school-rebirth-actions">
        <button type="button" class="primary" data-rebirth-school-continue>CONTINUAR JORNADA</button>
        <small>Seu progresso, suas notas e seus favoritos continuam privados neste aparelho.</small>
      </div>`;

    altar.querySelector('[data-rebirth-school-continue]')?.addEventListener('click', () => {
      this.engine.continuePath?.();
      this.queueEnhance();
    });
    altar.querySelectorAll('[data-rebirth-school-module]').forEach(button => button.addEventListener('click', () => {
      const target = this.root.querySelector(`[data-school-module="${button.dataset.rebirthSchoolModule}"]`);
      target?.click();
      if (!reducedMotion()) {
        this.root.querySelector('[data-school-lessons]')?.scrollIntoView({ behavior:'smooth', block:'start' });
      }
    }));
  }

  decorateModules(snapshot) {
    const map = new Map(snapshot.modules.map(item => [item.module.id, item]));
    this.root.querySelectorAll('[data-school-module]').forEach(button => {
      const item = map.get(button.dataset.schoolModule);
      if (!item) return;
      button.dataset.rebirthProgress = item.percent === 100 ? 'complete' : item.done ? 'started' : 'new';
      button.style.setProperty('--rebirth-module-progress', `${item.percent}%`);
    });
  }

  decorateLessons() {
    this.root.querySelectorAll('.school-lesson').forEach((lesson, index) => {
      lesson.style.setProperty('--school-lesson-order', index);
      if (!lesson.dataset.rebirthLesson) lesson.dataset.rebirthLesson = 'v306';
    });
  }

  destroy() {
    this.destroyed = true;
    this.observer?.disconnect();
    this.root?.removeAttribute('data-school-world');
  }
}
