# Explicació de la nova versió de CiberGanxets

Aquest document explica les millores implementades i com s'ha estructurat el nou codi.

## Estructura de fitxers

- `index.html`: Nova versió HTML sense Bootstrap
- `style.css`: CSS modern amb suport per a tema fosc/clar
- `utils.js`: Funcions d'utilitat generals
- `app.js`: Aplicació principal amb lògica de xifratge/desxifratge
- `zxcvbn.js`: Versió simplificada i modularitzada de l'avaluador de contrasenyes
- `README.md`: Documentació del projecte

## Millores implementades

### 1. Eliminació de Bootstrap

He reemplaçat totes les classes i components de Bootstrap per CSS propi:

- Grid basat en Flexbox/Grid
- Components (botons, alertes, formularis) redesenyats amb CSS pur
- Variables CSS per a temes i reutilització

### 2. Implementació de tema fosc/clar

- Utilitzant variables CSS per a tots els colors
- Commutador interactiu a la part superior
- Detecció de preferències del sistema
- Persistència de la selecció via localStorage

### 3. JavaScript modernitzat

- Mòduls ES en lloc de codi monolític
- Funcions modernes i netes
- Errors controlats més elegantment
- Sense jQuery ni altres dependències

### 4. Millores d'usabilitat

- Millor feedback visual durant les operacions
- Indicadors de càrrega
- Gestió d'errors més clara
- Disminució del temps de càrrega (menys dependències)

## Com funciona

### Sistema de temes

El tema es gestiona amb l'atribut `data-theme` a l'element `html` i un conjunt de variables CSS:

```css
:root {
  /* Colors - Light theme (default) */
  --color-background: #f8f9fa;
  --color-text: #212529;
  /* ... més variables ... */
}

[data-theme="dark"] {
  --color-background: #121212;
  --color-text: #f8f9fa;
  /* ... més variables ... */
}
```

### Modularització

El codi s'ha dividit en mòduls funcionals:

- `utils.js`: Funcions utilitàries que poden ser reutilitzades
- `app.js`: Lògica de l'aplicació principal
- `zxcvbn.js`: Avaluació de contrasenyes

### Procés de xifratge/desxifratge

El procés utilitza la WebCrypto API:
1. Importació de la clau
2. Derivació de la clau amb PBKDF2
3. Xifratge/desxifratge amb AES-GCM
4. Processament del fitxer resultant

## Recomanacions per a futures millores

1. **Implementació de Service Workers**: Per a un millor suport fora de línia
2. **Millores d'accessibilitat**: ARIA labels i millor contrast
3. **Suport per a múltiples fitxers**: Permetre xifrar/desxifrar diversos fitxers a la vegada
4. **Compressió de fitxers**: Afegir opció per comprimir abans de xifrar
5. **Més opcions de xifratge**: Implementar altres algoritmes o permetre ajustaments
6. **Tests automatitzats**: Afegir tests unitaris i d'integració

## Notes d'implementació

- La versió de zxcvbn s'ha simplificat però manté la funcionalitat principal
- El codi s'ha refactoritzat per millorar la claredat i mantenibilitat
- S'han eliminat els console.log de depuració
- S'ha millorat la detecció de navegadors
- Tots els estils s'han reescrit des de zero