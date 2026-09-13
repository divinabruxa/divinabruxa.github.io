/* DIVINA BRUXA — ATIVAÇÃO PROGRESSIVA DA BIBLIOTECA PÚBLICA V544 */
import './tarot-meanings.js?v=544';
import { CardLibraryEngine } from './card-library-engine.js?v=544';

const root = document.querySelector('#universalLibraryApp');
if (root) {
  try {
    new CardLibraryEngine(root, { mode: 'standalone' });
    document.documentElement.classList.add('library-enhanced');
    root.dataset.ready = 'true';
  } catch (error) {
    root.hidden = true;
    console.error('[Divina] Biblioteca universal indisponível; índice estático preservado.', error);
  }
}
