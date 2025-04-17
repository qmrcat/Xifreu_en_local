/**
 * Versió simplificada i modularitzada de zxcvbn
 * Adaptat del original: https://github.com/dropbox/zxcvbn
 */

// Constants i models per a l'avaluació de contrasenyes
const FREQUENCY_LISTS = {
    passwords: "123456,password,12345678,qwerty,123456789,12345,1234,111111,1234567,dragon,123123,baseball,abc123,football,".split(","),
    female_names: "mary,patricia,linda,barbara,elizabeth,jennifer,maria,susan,margaret,dorothy,lisa,nancy,karen,betty,helen,sandra,donna,".split(","),
    surnames: "smith,johnson,williams,jones,brown,davis,miller,wilson,moore,taylor,anderson,jackson,white,harris,martin,thompson,garcia,martinez".split(","),
    us_tv_and_film: "you,i,to,that,it,me,what,this,know,i'm,no,have,my,don't,just,not,do,be,your,we,it's,so,but,all,well,oh,about,right,".split(","),
    male_names: "james,john,robert,michael,william,david,richard,charles,joseph,thomas,christopher,daniel,paul,mark,donald,george,kenneth".split(",")
  };
  
  // Models de patrons per a detectar contrasenyes febles
  const PATTERNS = {
    digits: /\d+/,
    upperCase: /[A-Z]+/,
    lowerCase: /[a-z]+/,
    special: /[^a-zA-Z0-9]+/,
    repeats: /(.)(\1+)/,
    sequences: /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789|890)/i,
    years: /(19\d\d|20\d\d)/
  };
  
  /**
   * Valora la força d'una contrasenya
   * @param {string} password - Contrasenya a avaluar
   * @returns {Object} - Informació sobre la força de la contrasenya
   */
  function zxcvbn(password) {
    if (!password) {
      return { score: 0, guesses: 1, warning: "Introduïu una contrasenya" };
    }
    
    // Longitud
    const lengthScore = Math.min(password.length * 0.5, 2);
    
    // Varietat de caràcters
    let varietyScore = 0;
    if (PATTERNS.digits.test(password)) varietyScore += 0.5;
    if (PATTERNS.upperCase.test(password)) varietyScore += 0.5;
    if (PATTERNS.lowerCase.test(password)) varietyScore += 0.5;
    if (PATTERNS.special.test(password)) varietyScore += 0.5;
    
    // Penalitzacions
    let penaltyScore = 0;
    
    // Verificació en llistes comunes
    const lowerPassword = password.toLowerCase();
    for (const list in FREQUENCY_LISTS) {
      if (FREQUENCY_LISTS[list].includes(lowerPassword)) {
        penaltyScore -= 2;
        break;
      }
    }
    
    // Repeticions
    if (PATTERNS.repeats.test(password)) {
      penaltyScore -= 0.5;
    }
    
    // Seqüències
    if (PATTERNS.sequences.test(password)) {
      penaltyScore -= 0.5;
    }
    
    // Anys comuns
    if (PATTERNS.years.test(password)) {
      penaltyScore -= 0.5;
    }
    
    // Càlcul final
    let finalScore = Math.max(0, Math.min(4, lengthScore + varietyScore + penaltyScore));
    
    // Convertir a un nombre enter per mantenir la compatibilitat
    const score = Math.round(finalScore);
    
    // Càlcul aproximat de les conjectures
    const baseGuesses = Math.pow(10, score + 1);
    const guesses = Math.max(10, baseGuesses * password.length);
    
    // Missatge de retroalimentació
    let warning = "";
    let suggestions = [];
    
    if (score < 2) {
      warning = "Aquesta contrasenya és fàcil d'endevinar";
      suggestions = [
        "Afegiu més caràcters",
        "Utilitzeu una combinació de majúscules, minúscules, números i símbols",
        "Eviteu patrons i seqüències comunes"
      ];
    } else if (score < 3) {
      warning = "Aquesta contrasenya podria ser més forta";
      suggestions = [
        "Afegiu més caràcters o símbols",
        "Eviteu paraules del diccionari"
      ];
    }
    
    return {
      password: password,
      score: score,
      guesses: guesses,
      warning: warning,
      suggestions: suggestions
    };
  }
  
  export default zxcvbn;