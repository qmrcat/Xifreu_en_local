# CiberGanxets

Una aplicació web per a xifrar i desxifrar fitxers de forma segura al navegador utilitzant l'algoritme AES-256.

## Característiques

- Xifratge/desxifratge de fitxers directament al navegador
- Cap informació s'envia al servidor
- Utilitza WebCrypto API per a operacions criptogràfiques segures
- Avaluació de la força de la contrasenya
- Mode fosc/clar
- Disseny responsiu sense dependències de Bootstrap
- Funciona completament fora de línia

## Tecnologies

- JavaScript modern (ES6+)
- Mòduls ES
- WebCrypto API
- CSS modern amb variables i Flexbox/Grid
- Sense dependències externes de frameworks

## Nova versió vs. versió anterior

### Millores en CSS
- S'ha eliminat la dependència de Bootstrap 
- S'ha implementat un sistema de temes fosc/clar
- S'utilitzen variables CSS per a colors i estils
- Disseny responsiu fet a mà amb Flexbox i Grid

### Millores en JavaScript
- Codi modularitzat utilitzant mòduls ES
- Simplificació i modernització de la biblioteca zxcvbn
- Eliminació de jQuery com a dependència
- Millor gestió d'errors i de l'estat
- Millores en l'accessibilitat

### Millores generals
- Codi més net i mantenible
- Millor rendiment sense biblioteques externes
- Millor experiència d'usuari amb feedback visual
- Més accessible

## Com fer-ho servir

1. Obre l'arxiu `index.html` en un navegador web modern
2. Selecciona un fitxer per xifrar o desxifrar
3. Introdueix una clau de xifratge o utilitza el botó per generar-ne una
4. Fes clic en "Xifrar" o "Desxifrar" segons el que necessitis
5. Descarrega el fitxer resultant

## Ús recomanat

Per a màxima seguretat, es recomana utilitzar Firefox, ja que alguns altres navegadors poden limitar certes operacions criptogràfiques.

## Llicència

Aquest projecte és programari lliure.