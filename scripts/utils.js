function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

export const statesAcronyms = {
  piaui: "PI",
  maranhao: "MA",
  "espirito santo": "ES",
  rondonia: "RO",
  acre: "AC",
  amazonas: "AM",
  roraima: "RR",
  para: "PA",
  amapa: "AP",
  tocantins: "TO",
  alagoas: "AL",
  parana: "PR",
  "santa catarina": "SC",
  "mato grosso do sul": "MS",
  sergipe: "SE",
  "mato grosso": "MT",
  "rio grande do sul": "RS",
  "rio de janeiro": "RJ",
  "minas gerais": "MG",
  "rio grande do norte": "RN",
  "distrito federal": "DF",
  paraiba: "PB",
  pernambuco: "PE",
  bahia: "BA",
  goias: "GO",
  "sao paulo": "SP",
  ceara: "CE",
};

export function getStateAcronym(state) {
  const formatedState = state
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  return statesAcronyms[formatedState] || state;
}

export async function showNotification(string) {
  const popup = document.getElementById("notificationText");

  if (popup.classList.contains("show")) {
    popup.classList.remove("show");
  }

  popup.innerText = string;

  popup.classList.add("show");

  await sleep(3000);

  popup.classList.remove("show");
}
