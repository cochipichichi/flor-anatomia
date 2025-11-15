
(function() {
  const root = document.documentElement;

  function setTheme(mode) {
    if (mode === 'light') {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  }

  function applyStoredPrefs() {
    const theme = localStorage.getItem('theme');
    if (theme) setTheme(theme);
    const scale = parseFloat(localStorage.getItem('fontScale') || '1');
    if (!isNaN(scale)) {
      root.style.setProperty('--font-scale', scale.toString());
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    applyStoredPrefs();

    const btnHome = document.querySelector('[data-action="home"]');
    if (btnHome) btnHome.addEventListener('click', () => { window.location.href = 'index.html'; });

    const btnTheme = document.querySelector('[data-action="toggle-theme"]');
    if (btnTheme) btnTheme.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });

    const btnInc = document.querySelector('[data-action="font-inc"]');
    const btnDec = document.querySelector('[data-action="font-dec"]');
    function adjustFont(delta) {
      const current = parseFloat(getComputedStyle(root).getPropertyValue('--font-scale') || '1') || 1;
      let next = current + delta;
      next = Math.min(Math.max(next, 0.8), 1.4);
      root.style.setProperty('--font-scale', next.toString());
      localStorage.setItem('fontScale', next.toString());
    }
    if (btnInc) btnInc.addEventListener('click', () => adjustFont(0.05));
    if (btnDec) btnDec.addEventListener('click', () => adjustFont(-0.05));

    const btnSpeaker = document.querySelector('[data-action="speak"]');
    if (btnSpeaker && 'speechSynthesis' in window) {
      btnSpeaker.addEventListener('click', function() {
        const selection = window.getSelection().toString().trim();
        const text = selection || document.querySelector('main')?.innerText || '';
        if (!text) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text.slice(0, 800));
        utterance.lang = 'es-CL';
        window.speechSynthesis.speak(utterance);
      });
    }

    const searchInput = document.querySelector('[data-role="search-input"]');
    const searchStatus = document.querySelector('[data-role="search-status"]');
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        const q = this.value.trim().toLowerCase();
        let hits = 0;
        document.querySelectorAll('[data-searchable]').forEach(section => {
          if (!q) {
            section.style.outline = 'none';
            section.style.backgroundImage = 'none';
            return;
          }
          const text = section.innerText.toLowerCase();
          if (text.includes(q)) {
            hits += 1;
            section.style.outline = '1px solid rgba(56, 189, 248, 0.65)';
            section.style.backgroundImage = 'radial-gradient(circle at top left, rgba(56, 189, 248, 0.16), transparent)';
          } else {
            section.style.outline = 'none';
            section.style.backgroundImage = 'none';
          }
        });
        if (searchStatus) {
          if (!q) searchStatus.textContent = 'Escribe un término para resaltar secciones relacionadas.';
          else searchStatus.textContent = hits ? `Secciones relacionadas: ${hits}` : 'Sin coincidencias visibles.';
        }
      });
    }
  });

  const btnEasy = document.querySelector('[data-action="easy-read"]');
  function setEasyRead(on) {
    const val = on ? 'on' : 'off';
    document.documentElement.setAttribute('data-easy-read', val);
    localStorage.setItem('easyRead', val);
  }
  if (btnEasy) {
    const storedER = localStorage.getItem('easyRead');
    if (storedER === 'on') setEasyRead(true);
    btnEasy.addEventListener('click', function() {
      const current = document.documentElement.getAttribute('data-easy-read') === 'on';
      setEasyRead(!current);
    });
  }

  // Hotspot info panel (viewer3D)
  const hotspotPanel = document.getElementById('hotspotInfo');
  if (hotspotPanel) {
    const mensajes = {
      "Sépalos": "Sépalos: piezas verdes que protegen al botón floral antes de abrirse.",
      "Pétalos": "Pétalos: estructuras de colores que atraen polinizadores con su forma y olor.",
      "Estambres": "Estambres: parte masculina de la flor; producen y liberan el polen.",
      "Pistilo": "Pistilo o carpelo: parte femenina; contiene el ovario con los óvulos."
    };
    document.querySelectorAll('.hotspot[data-part]').forEach(btn => {
      btn.addEventListener('click', () => {
        const part = btn.getAttribute('data-part');
        hotspotPanel.textContent = mensajes[part] || part;
      });
    });
  }

  // Aplicar preferencia de lectura fácil al cargar
  (function() {
    const storedER = localStorage.getItem('easyRead');
    if (storedER === 'on') {
      document.documentElement.setAttribute('data-easy-read', 'on');
    }
  })();

})();
