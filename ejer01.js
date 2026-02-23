const TOTAL = 100;
const URL = 'https://jsonplaceholder.typicode.com/posts/1';

const listaDeLlamadas = Array.from({ length: TOTAL }, () => fetch(URL));

Promise.all(listaDeLlamadas)
  .then(() => {
    console.log(`¡Éxito! Se completaron las ${TOTAL} peticiones.`);
  })
  .catch(error => {
    console.error(" Algo falló en la red:", error);
  });