/**
 * CiberGanxets.cat - Aplicació principal
 * Implementació de xifratge/desxifratge de fitxers al navegador
 */

import { 
    initTheme, 
    mostrarMissatgeNavegador, 
    mostrarError, 
    showLoader,
    toggleCollapse,
    openModal,
    closeModal
  } from './utils.js';
  
  // Constants per a l'algoritme de xifratge
  const DEC = {
    signature: "RW5jcnlwdGVkIFVzaW5nIEhhdC5zaA",
    hash: "SHA-256",
    algoName1: "PBKDF2",
    algoName2: "AES-GCM",
    algoLength: 256,
    itr: 100000, // 1e5
    perms1: ["deriveKey"],
    perms2: ["encrypt", "decrypt"]
  };
  
  // Variables globals
  let fileName;
  
  // Importació de la biblioteca zxcvbn per a la força de contrasenyes
  import zxcvbn from './zxcvbn.js';
  
  /**
   * Inicialitza l'aplicació
   */
  function init() {
    // Inicialitza el tema
    initTheme();
    
    // Mostra el missatge del navegador
    mostrarMissatgeNavegador();
    
    // Gestió dels esdeveniments
    setupEventListeners();
    
    // Amaga el botó de restabliment inicialment
    hideResetBtn();
  }
  
  /**
   * Actualitza el nom i la mida del fitxer seleccionat
   */
  function updateNameAndSize() {
    showResetBtn();
    
    const inputFile = document.getElementById("customFile");
    if (!inputFile) return;
    
    let nBytes = 0;
    const oFiles = inputFile.files;
    const nFiles = oFiles.length;
    const placeHolder = document.getElementById("file-placeholder");
    
    if (!placeHolder) return;
    
    for (let nFileId = 0; nFileId < nFiles; nFileId++) {
      nBytes += oFiles[nFileId].size;
      fileName = oFiles[nFileId].name;
    }
    
    let sOutput = nBytes + " bytes";
    for (const [i, unit] of ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"].entries()) {
      const nApprox = nBytes / Math.pow(1024, i + 1);
      if (nApprox < 1) break;
      sOutput = nApprox.toFixed(2) + " " + unit;
    }
    
    if (!inputFile.value) {
      placeHolder.innerHTML = "Trieu un fitxer per xifrar/desxifrar";
    } else {
      placeHolder.innerHTML = fileName + '  <span class="text-success">' + sOutput + "</span>";
    }
  }
  
  /**
   * Mostra el botó de restabliment
   */
  function showResetBtn() {
    const resetBtn = document.getElementById("resetBtn");
    if (resetBtn) {
      resetBtn.style.display = "";
    }
  }
  
  /**
   * Amaga el botó de restabliment
   */
  function hideResetBtn() {
    const resetBtn = document.getElementById("resetBtn");
    if (resetBtn) {
      resetBtn.style.display = "none";
    }
  }
  
  /**
   * Restableix els inputs
   */
  function resetInputs() {
    const inputFile = document.getElementById("customFile");
    const password = document.getElementById("inputPassword");
    
    if (inputFile && password && (inputFile.value != 0 || password.value != 0)) {
      inputFile.value = "";
      password.value = "";
      updateNameAndSize();
      hideResetBtn();
      keyCheckMeter();
    }
  }
  
  /**
   * Comprova i mostra la força de la clau
   */
  function keyCheckMeter() {
    const strength = {
      0: "Molt dolenta", 
      1: "dolenta", 
      2: "feble", 
      3: "Bé", 
      4: "forta"
    };
    
    const password = document.getElementById("inputPassword");
    const meter = document.getElementById("strength-meter");
    const text = document.getElementById("strength-text");
    
    if (!password || !meter || !text) return;
    
    const val = password.value;
    const result = zxcvbn(val);
    
    // Actualitza el medidor de força
    meter.style.width = result.score * 25 + "%";
    
    // Canvia els colors del medidor segons la força
    meter.className = "progress-bar";
    if (result.score < 2) {
      meter.classList.add("bg-danger");
    } else if (result.score < 4) {
      meter.classList.add("bg-warning");
    } else {
      meter.classList.add("bg-success");
    }
    
    // Actualitza el text de força
    if (val !== "") {
      text.innerHTML = strength[result.score];
      showResetBtn();
    } else {
      text.innerHTML = "Cap, per definir";
    }
  }
  
  /**
   * Genera una clau segura aleatòria
   */
  function generateKey() {
    const usedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#_+=";
    let keyArray = new Uint8Array(24);
    window.crypto.getRandomValues(keyArray);
    keyArray = keyArray.map(x => usedChars.charCodeAt(x % usedChars.length));
    const randomizedKey = String.fromCharCode.apply(null, keyArray);
    
    const password = document.getElementById("inputPassword");
    if (password) {
      password.value = randomizedKey;
      keyCheckMeter();
    }
  }
  
  /**
   * Converteix una cadena a ArrayBuffer
   * @param {string} str - Cadena a convertir
   * @returns {ArrayBuffer} - ArrayBuffer resultant
   */
  function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
  
  /**
   * Importa la clau secreta
   * @returns {Promise<CryptoKey>} - Promesa amb la clau secreta
   */
  function importSecretKey() {
    const password = document.getElementById("inputPassword");
    if (!password) {
      return Promise.reject(new Error("No s'ha trobat l'element d'entrada de contrasenya"));
    }
    
    const rawPassword = str2ab(password.value);
    return window.crypto.subtle.importKey(
      "raw", 
      rawPassword, 
      {
        length: DEC.algoLength,
        name: DEC.algoName1
      }, 
      false, 
      DEC.perms1
    );
  }
  
  /**
   * Deriva la clau secreta
   * @returns {Promise<CryptoKey>} - Promesa amb la clau derivada
   */
  async function deriveSecretKey() {
    try {
      const getSecretKey = await importSecretKey();
      const password = document.getElementById("inputPassword");
      if (!password) {
        throw new Error("No s'ha trobat l'element d'entrada de contrasenya");
      }
      
      const rawPassword = str2ab(password.value);
      return window.crypto.subtle.deriveKey(
        {
          name: DEC.algoName1,
          salt: rawPassword,
          iterations: DEC.itr,
          hash: {
            name: DEC.hash
          }
        }, 
        getSecretKey, 
        {
          name: DEC.algoName2,
          length: DEC.algoLength
        }, 
        false, 
        DEC.perms2
      );
    } catch (error) {
      mostrarError("Error en derivar la clau: " + error.message);
      throw error;
    }
  }
  
  /**
   * Encripta un fitxer
   */
  async function encryptFile() {
    const inputFile = document.getElementById("customFile");
    const password = document.getElementById("inputPassword");
    
    if (!inputFile || !password) {
      mostrarError("No s'han trobat els elements necessaris");
      return;
    }
    
    if (!inputFile.value || !password.value) {
      mostrarError("Navegueu per cercar un fitxer i introduïu una clau");
      return;
    }
    
    try {
      const derivedKey = await deriveSecretKey();
      const file = inputFile.files[0];
      
      // Utilitza FileReader per llegir el fitxer
      const fr = new FileReader();
      
      showLoader(true);
      
      fr.onload = async () => {
        try {
          const iv = window.crypto.getRandomValues(new Uint8Array(16));
          const content = new Uint8Array(fr.result);
          
          const encrypted = await window.crypto.subtle.encrypt(
            {
              iv: iv,
              name: DEC.algoName2
            }, 
            derivedKey, 
            content
          );
          
          // Processar el fitxer encriptat
          processFinished("Xifrat-" + file.name, [window.atob(DEC.signature), iv, new Uint8Array(encrypted)], 1, password.value);
          resetInputs();
        } catch (error) {
          mostrarError("S'ha produït un error al xifrar el fitxer, torna-ho a provar! " + error.message);
        } finally {
          showLoader(false);
        }
      };
      
      fr.onerror = () => {
        mostrarError("Error en llegir el fitxer");
        showLoader(false);
      };
      
      fr.readAsArrayBuffer(file);
    } catch (error) {
      mostrarError("Error al preparar l'encriptació: " + error.message);
    }
  }
  
  /**
   * Desencripta un fitxer
   */
  async function decryptFile() {
    const inputFile = document.getElementById("customFile");
    const password = document.getElementById("inputPassword");
    
    if (!inputFile || !password) {
      mostrarError("No s'han trobat els elements necessaris");
      return;
    }
    
    if (!inputFile.value || !password.value) {
      mostrarError("Navegueu per cercar un fitxer i introduïu una clau");
      return;
    }
    
    try {
      const derivedKey = await deriveSecretKey();
      const file = inputFile.files[0];
      
      // Utilitza FileReader per llegir el fitxer
      const fr = new FileReader();
      
      showLoader(true);
      
      fr.onload = async () => {
        try {
          const iv = new Uint8Array(fr.result.slice(22, 38));
          const content = new Uint8Array(fr.result.slice(38));
          
          const decrypted = await window.crypto.subtle.decrypt(
            {
              iv: iv,
              name: DEC.algoName2
            }, 
            derivedKey, 
            content
          );
          
          // Processar el fitxer desencriptat
          processFinished(file.name.replace("Xifrat-", ""), [new Uint8Array(decrypted)], 2, password.value);
          resetInputs();
        } catch (error) {
          mostrarError("Heu introduït una clau de desxifratge incorrecta!");
        } finally {
          showLoader(false);
        }
      };
      
      fr.onerror = () => {
        mostrarError("Error en llegir el fitxer");
        showLoader(false);
      };
      
      fr.readAsArrayBuffer(file);
    } catch (error) {
      mostrarError("Error al preparar la desencriptació: " + error.message);
    }
  }
  
  /**
   * Processa un fitxer després de l'encriptació/desencriptació
   * @param {string} name - Nom del fitxer resultant
   * @param {Array} data - Dades del fitxer
   * @param {number} method - Mètode utilitzat (1: encriptació, 2: desencriptació)
   * @param {string} dKey - Clau utilitzada
   */
  function processFinished(name, data, method, dKey) {
    let msg;
    let status;
    let keyBtn;
    const randomId = Math.floor(Math.random() * 100 + 1);
    
    if (method === 1) {
      msg = "Xifrat correctament";
      status = "encrypted";
      keyBtn = `
        <button type="button" class="btn btn-outline-secondary btn-sm" data-modal-target="modal${randomId}">
          <i class="fas fa-key"></i> Clau de desxifrat
        </button>`;
    } else {
      msg = "Desxifrat correctament";
      status = "decrypted";
      keyBtn = "";
    }
    
    const blob = new Blob(data, {
      type: "application/octet-stream"
    });
    const url = URL.createObjectURL(blob);
    
    const htmlTag = `
      <div class="result"> 
        <div class="modal" id="modal${randomId}">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Clau de desxifrat</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              ${dKey}
            </div>
          </div>
        </div>
        
        <div class="alert alert-outline ${status}" role="alert">
          <i class="fas fa-check"></i> ${name.replace("Xifrat-", "")} s'ha <strong>${msg}</strong>
          <hr>
          <div class="btn-group">
            <a class="btn btn-outline-secondary btn-sm" href="${url}" download="${name}" role="button">
              <i class="fas fa-download"></i> ${status} file
            </a>
            ${keyBtn}
          </div>
        </div>
      </div>`;
    
    const resultsContainer = document.getElementById("results");
    if (resultsContainer) {
      resultsContainer.insertAdjacentHTML("afterbegin", htmlTag);
      
      // Configura el botó del modal si existeix
      const modalButton = resultsContainer.querySelector(`button[data-modal-target="modal${randomId}"]`);
      if (modalButton) {
        modalButton.addEventListener('click', function() {
          openModal(`modal${randomId}`);
        });
      }
      
      // Configura el botó de tancament del modal
      const closeButton = resultsContainer.querySelector(`#modal${randomId} .close`);
      if (closeButton) {
        closeButton.addEventListener('click', function() {
          closeModal(`modal${randomId}`);
        });
      }
    }
  }
  
  // Inicialitzem l'aplicació quan es carrega la pàgina
  document.addEventListener('DOMContentLoaded', init);
  
  /**
   * Configura els escoltadors d'esdeveniments
   */
  function setupEventListeners() {
    // Input de fitxer
    const inputFile = document.getElementById("customFile");
    if (inputFile) {
      inputFile.addEventListener("change", updateNameAndSize);
    }
    
    // Botó de generació de clau
    const genBtn = document.getElementById("generateButton");
    if (genBtn) {
      genBtn.addEventListener("click", generateKey);
    }
    
    // Input de contrasenya
    const password = document.getElementById("inputPassword");
    if (password) {
      password.addEventListener("input", keyCheckMeter);
    }
    
    // Botó d'encriptació
    const encryptBtn = document.getElementById("encryptBtn");
    if (encryptBtn) {
      encryptBtn.addEventListener("click", encryptFile);
    }
    
    // Botó de desencriptació
    const decryptBtn = document.getElementById("decryptBtn");
    if (decryptBtn) {
      decryptBtn.addEventListener("click", decryptFile);
    }
    
    // Botó de restabliment
    const resetBtn = document.getElementById("resetBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", resetInputs);
    }
    
    // Botó de col·lapse "Més informació"
    const collapseBtn = document.querySelector('a[href="#mesinfo"]');
    if (collapseBtn) {
      collapseBtn.addEventListener("click", function(e) {
        e.preventDefault();
        toggleCollapse("mesinfo");
      });
    }
    
    // Botons per tancar modals
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
      button.addEventListener('click', function() {
        const modal = this.closest('.modal');
        if (modal) {
          closeModal(modal.id);
        }
      });
    });
  }