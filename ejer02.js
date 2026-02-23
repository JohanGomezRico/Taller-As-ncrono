const url1 = "https://api.open-meteo.com/v1/forecast?latitude=4.53&longitude=-75.68&current_weather=true";
const url2 = "https://wttr.in/armenia?format=j1";
const url3 = "https://api.open-meteo.com/v1/forecast?latitude=4.53&longitude=-75.68&current=temperature_2m";

async function clima() {
  try {
    const resultado = await Promise.any([
      fetch(url1).then(res => res.json()).then(d => d.current_weather.temperature),
      fetch(url2).then(res => res.json()).then(d => d.current_condition[0].temp_C),
      fetch(url3).then(res => res.json()).then(d => d.current.temperature_2m)
    ]);

    console.log(`La Temperatura en Armenia Quindio es de: ${resultado}°C`);
  } catch (error) {
    console.log("No se pudo obtener la temperatura de ninguna fuente.");
  }
}

clima();
