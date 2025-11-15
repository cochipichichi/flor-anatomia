
(function() {
  const body = document.body;
  let currentLang = 'es';
  let baseFontSize = 16;

  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = currentLang === 'es' ? 'es-ES' : 'en-US';
    window.speechSynthesis.speak(utter);
  }

  document.addEventListener('click', (e) => {
    const target = e.target;

    if (target.id === 'btn-home') {
      window.location.href = 'index.html';
    }

    if (target.id === 'btn-theme') {
      body.classList.toggle('dark-theme');
      body.classList.toggle('light-theme');
    }

    if (target.id === 'btn-font-inc') {
      baseFontSize = Math.min(baseFontSize + 1, 22);
      body.style.fontSize = baseFontSize + 'px';
    }

    if (target.id === 'btn-font-dec') {
      baseFontSize = Math.max(baseFontSize - 1, 12);
      body.style.fontSize = baseFontSize + 'px';
    }

    if (target.id === 'btn-tts') {
      const main = document.querySelector('main');
      if (main) speak(main.innerText.slice(0, 1200));
    }

    if (target.id === 'btn-lang') {
      currentLang = currentLang === 'es' ? 'en' : 'es';
      alert('Conmutador de idioma (ES/EN) listo. En esta versión de demo, el contenido principal está en español.');
    }

    if (target.id === 'btn-focus') {
      document.body.classList.toggle('focus-mode');
    }

    if (target.id === 'btn-search') {
      const q = prompt('Buscar en la página:');
      if (!q) return;
      const range = document.body.createTextRange ? document.body.createTextRange() : null;
      if (range) {
        if (range.findText(q)) {
          range.select();
        }
      } else {
        // Simple fallback
        alert('Busca esta palabra: ' + q);
      }
    }
  });
})();
