/* DIVINA BRUXA — identidade textual da Orbe principal.
   Não altera o motor WebGL, eventos de toque, menu ou sistema de skins. */
(() => {
  const mountSacredVoice = () => {
    const orb = document.getElementById('orb');
    if (!orb || orb.querySelector('.orb-sacred-voice')) return;

    const voice = document.createElement('span');
    const spirit = document.createElement('strong');
    const name = document.createElement('small');

    voice.className = 'orb-sacred-voice';
    voice.setAttribute('aria-hidden', 'true');
    spirit.textContent = 'ESPÍRITO';
    name.textContent = 'ORBE DAS REALIDADES';
    voice.append(spirit, name);
    orb.append(voice);

    orb.setAttribute(
      'aria-label',
      'Espírito, Orbe das Realidades. Toque, segure, arraste ou gire; toque duplo abre o Tarot Livre'
    );
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountSacredVoice, { once: true });
  } else {
    mountSacredVoice();
  }
})();
