/**
 * CiberGanxets.cat - Utilitats
 * Funcions utilitàries per a l'aplicació de xifratge/desxifratge
 */

/**
 * Detecta si el text conté una paraula específica
 * @param {string} text - Text a analitzar
 * @param {string} paraula - Paraula a cercar
 * @returns {boolean} - Cert si la paraula existeix al text
 */
function existeixParaula(text, paraula) {
    return text.indexOf(paraula) !== -1;
  }
  
  /**
   * Detecta si el navegador és Firefox
   * @returns {string} - Nom del navegador en minúscules
   */
  function detectarNavegador() {
    const ua = navigator.userAgent;
    const matches = ua.match(/(opera|chrome|safari|firefox|focus|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    
    // Firefox Focus té un cas especial
    if (existeixParaula("Focus", ua)) {
      return "firefox";
    }
    
    return matches[1] ? matches[1].toLowerCase() : "desconegut";
  }
  
  /**
   * Configura el tema de l'aplicació (fosc o clar)
   * @param {string} theme - 'dark' o 'light'
   */
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
  
  /**
   * Recupera el tema guardat o usa el tema predeterminat del sistema
   * @returns {string} - 'dark' o 'light'
   */
  function getTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    
    // Detecta la preferència del sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  }
  
  /**
   * Commuta entre el tema fosc i clar
   */
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Actualitza l'estat del botó
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.checked = newTheme === 'dark';
    }
    
    // Actualitza les icones
    updateThemeIcons(newTheme);
  }
  
  /**
   * Actualitza les icones del tema
   * @param {string} theme - 'dark' o 'light'
   */
  function updateThemeIcons(theme) {
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
      themeIcon.title = theme === 'dark' ? 'Canviar a tema clar' : 'Canviar a tema fosc';
    }
  }
  
  /**
   * Inicialitza el tema de l'aplicació
   */
  function initTheme() {
    const theme = getTheme();
    setTheme(theme);
    
    // Configura l'estat del botó d'alternança
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.checked = theme === 'dark';
      themeToggle.addEventListener('change', toggleTheme);
    }
    
    // Configura les icones
    updateThemeIcons(theme);
  }
  
  /**
   * Mostra un missatge sobre la compatibilitat del navegador
   */
  function mostrarMissatgeNavegador() {
    const nomNavegador = detectarNavegador();
    const esFirefox = nomNavegador === "firefox" || nomNavegador === "focus";
    
    let msgNavInfo = "";
    const msqInfoNavUs = `<br>(navegador que esteu utilitzant: ${nomNavegador})`;
    
    if (!esFirefox) {
      msgNavInfo = `
        <div class="alert alert-danger">
          <strong>Avis! </strong>És preferible que utilitzeu el navegador <a href="http://www.mozilla.org/ca/" class="text-dark"><b class="text-black">Firefox</b></a> 
          ${msqInfoNavUs}
        </div>`;
    } else {
      msgNavInfo = `
        <div class="alert alert-info">
          <strong>Informació! </strong>Excel·lent, esteu utilitzant el navegador <a href="http://www.mozilla.org/ca/" class="text-dark"><b class="text-black">Firefox</b></a> 
        </div>`;
    }
    
    const contenidor = document.getElementById("msg-navegador");
    if (contenidor) {
      contenidor.innerHTML = msgNavInfo;
    }
  }
  
  /**
   * Mostra un missatge de carregament
   * @param {boolean} show - Cert per mostrar, fals per amagar
   */
  function showLoader(show) {
    const loader = document.querySelector('.loader');
    if (loader) {
      loader.style.display = show ? 'flex' : 'none';
    }
  }
  
  /**
   * Mostra missatges d'error
   * @param {string} msg - Missatge d'error a mostrar
   */
  function mostrarError(msg) {
    const errorTag = `
      <div class="alert alert-danger alert-error" role="alert"> 
        <button type="button" class="close" aria-label="Close"> <span aria-hidden="true">&times;</span></button> 
        <strong>Error! </strong>${msg}
      </div>`;
    
    const errorContainer = document.getElementById("error");
    if (errorContainer) {
      errorContainer.insertAdjacentHTML("beforeEnd", errorTag);
      
      // Configura el botó de tancament
      const closeButtons = errorContainer.querySelectorAll('.close');
      closeButtons.forEach(button => {
        button.addEventListener('click', function() {
          const alertElement = this.closest('.alert-error');
          if (alertElement) {
            // Primer fem fade out, després eliminem
            alertElement.style.opacity = '0';
            setTimeout(() => {
              alertElement.remove();
            }, 500);
          }
        });
      });
      
      // Auto-desaparició després de 4 segons
      setTimeout(() => {
        const alerts = errorContainer.querySelectorAll('.alert-error');
        alerts.forEach(alert => {
          alert.style.opacity = '0';
          setTimeout(() => {
            alert.remove();
          }, 500);
        });
      }, 4000);
    }
  }
  
  /**
   * Gestiona el col·lapse d'elements
   * @param {string} targetId - ID de l'element a col·lapsar/expandir
   */
  function toggleCollapse(targetId) {
    const element = document.getElementById(targetId);
    if (element) {
      if (element.classList.contains('show')) {
        element.classList.remove('show');
      } else {
        element.classList.add('show');
      }
    }
  }
  
  /**
   * Obre un modal
   * @param {string} modalId - ID del modal a obrir
   */
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'block';
    }
  }
  
  /**
   * Tanca un modal
   * @param {string} modalId - ID del modal a tancar
   */
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
    }
  }
  
  // Exporta les funcions per al seu ús
  export {
    existeixParaula,
    detectarNavegador,
    setTheme,
    getTheme,
    toggleTheme,
    initTheme,
    mostrarMissatgeNavegador,
    showLoader,
    mostrarError,
    toggleCollapse,
    openModal,
    closeModal
  };