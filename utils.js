export function reduce(numerator, denominator) {
  var gcd = function gcd(a, b) {
    return b ? gcd(b, a % b) : a;
  };
  gcd = gcd(numerator, denominator);
  return [numerator / gcd, denominator / gcd];
}

export function formatDate(dateString) {
  const numToDateWeek = [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado",
  ];

  const numToMonth = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  const date = new Date(dateString);

  const dayOfWeek = numToDateWeek[date.getDay()];
  const day = date.getDate();
  const month = numToMonth[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const finalString = `${
    dayOfWeek.charAt(0).toLocaleUpperCase() + dayOfWeek.slice(1)
  }, ${day} de ${month} de ${year}, ${hours}:${minutes}`;
  return finalString;
}

export function fillFormWithValuesString(valuesString) {
  const valuesArray = valuesString.split(";");

  let valuesJson = {};

  valuesArray.forEach((valueString) => {
    const key = valueString.split("=")[0].trim();
    const value = valueString.split("=")[1];

    valuesJson[key] = value;
  });

  const settingsForm = document.getElementById("timestampSettings");
  for (const child of settingsForm.children) {
    if (child.nodeName !== "INPUT" && child.nodeName !== "SELECT") continue;

    child.value = valuesJson[child.id];
  }
}
