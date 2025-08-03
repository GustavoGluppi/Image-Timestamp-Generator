import { reduce, formatDate, showNotification } from "./utils.js";
import { addTextToCanvas } from "./canvas.js";

function getAddress() {
  let cep = document.getElementById("cep")?.value;
  cep = cep.replace(/\D/g, "");

  if (!cep) return;

  fetch(`https://viacep.com.br/ws/${cep}/json/`).then((resp) => {
    resp.json().then((data) => {
      document.getElementById("street").value = data.logradouro;
      document.getElementById("district").value = data.bairro;
      document.getElementById("city").value = data.localidade;
      document.getElementById("state").value = data.estado;
    });
  });
}

function createImage() {
  const canvas = document.getElementById("canvas-image");
  const ctx = canvas.getContext("2d");

  const fileInput = document.getElementById("fileSelector");

  if (fileInput.files[0]) {
    const file = fileInput.files[0];

    const reader = new FileReader();

    reader.onload = function (e) {
      const img = new Image(/* canvas.width, canvas.height */);

      img.onload = function () {
        const proporsion = reduce(img.width, img.height);

        const proportionalWidth =
          Math.fround(800 / proporsion[1]) * proporsion[0];

        canvas.width = proportionalWidth;
        canvas.height = 800;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        ctx.fillStyle =
          document.getElementById("textColorSelector").value || "white";

        ctx.font = `${
          document.getElementById("fontSizeInput").value || 12
        }px Arial`;

        ctx.strokeStyle =
          document.getElementById("textBorderColorSelector").value || "black";

        ctx.lineWidth =
          document.getElementById("textBorderSizeInput").value || 1.5;

        const date = formatDate(document.getElementById("datetimeInput").value);
        const street = document.getElementById("street").value;
        const district = document.getElementById("district").value;
        const city = document.getElementById("city").value;
        const state = document.getElementById("state").value;

        const textPosition = document.getElementById("textPosition").value;

        addTextToCanvas(
          ctx,
          [date, street, district, city, state],
          document.getElementById("textPaddingInput").value || 15,
          textPosition
        );
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);

    document.getElementById("downloadLink").style.display = "inline";
  }
}

function downloadCanvas() {
  const canvas = document.getElementById("canvas-image");
  const imgData = canvas.toDataURL("image/png", 1);

  const link = document.getElementById("imageData");
  link.href = imgData;
  link.download = "result.png";
  link.click();
}

function saveFormCookies() {
  const settingsForm = document
    .getElementById("timestampSettings")
    .querySelector(".section-content");

  const colorDivChildren = settingsForm.querySelector(".colorDiv").children;
  const textDivChildren = settingsForm.querySelector(".textDiv").children;

  const cookiesJson = {};

  for (const child of colorDivChildren) {
    const input = child.querySelector("input") || child.querySelector("select");

    if (input.nodeName !== "INPUT" && input.nodeName !== "SELECT") continue;
    if (!input.value) continue;

    cookiesJson[input.id] = input.value;
  }

  for (const child of textDivChildren) {
    const input = child.querySelector("input") || child.querySelector("select");

    if (input.nodeName !== "INPUT" && input.nodeName !== "SELECT") continue;
    if (!input.value) continue;

    cookiesJson[input.id] = input.value;
  }

  for (const [key, value] of Object.entries(cookiesJson)) {
    document.cookie =
      key + "=" + value + ";expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/";
  }

  showNotification("Estilo salvo!");
}

function prepareStyleString() {
  const styleString = document.getElementById("importStyleText").value;
  fillFormWithValuesString(styleString);
  showNotification("Importado com sucesso!");
}

function copyStyleString() {
  const settingsForm = document
    .getElementById("timestampSettings")
    .querySelector(".section-content");

  const colorDivChildren = settingsForm.querySelector(".colorDiv").children;
  const textDivChildren = settingsForm.querySelector(".textDiv").children;

  let valuesArray = [];

  for (const child of colorDivChildren) {
    const input = child.querySelector("input") || child.querySelector("select");

    if (input.nodeName !== "INPUT" && input.nodeName !== "SELECT") continue;
    if (!input.value) continue;

    valuesArray.push(input.id + "=" + input.value);
  }

  for (const child of textDivChildren) {
    const input = child.querySelector("input") || child.querySelector("select");

    if (input.nodeName !== "INPUT" && input.nodeName !== "SELECT") continue;
    if (!input.value) continue;

    valuesArray.push(input.id + "=" + input.value);
  }

  const valuesString = valuesArray.join(";");

  const clipboardItem = new ClipboardItem({
    "text/plain": valuesString,
  });
  navigator.clipboard.write([clipboardItem]);

  showNotification("Estilo copiado!");
}

function toggleSearchByView(e) {
  const value = e.target.value;

  if (value == "cep") {
    document.getElementById("mapDisplay").style.display = "none";
    document.getElementById("cepDisplay").style.display = "block";
  } else if (value == "map") {
    document.getElementById("cepDisplay").style.display = "none";
    document.getElementById("mapDisplay").style.display = "block";
  }
}

function fillFormWithValuesString(valuesString) {
  const valuesArray = valuesString.split(";");

  let valuesJson = {};

  valuesArray.forEach((valueString) => {
    const key = valueString.split("=")[0].trim();
    const value = valueString.split("=")[1];

    valuesJson[key] = value;
  });

  for (const [key, value] of Object.entries(valuesJson)) {
    const field = document.querySelector(`#${key}`);
    field.value = value;
  }
}

function toggleInputSpamValue(e) {
  if (e.target.files[0]) {
    document.getElementById("selectedText").style.display = "inline";
  } else {
    document.getElementById("selectedText").style.display = "none";
  }
}

document
  .getElementById("importStyleButton")
  .addEventListener("click", prepareStyleString);
document
  .getElementById("saveFormCookiesButton")
  .addEventListener("click", saveFormCookies);
document
  .getElementById("copyStyleButton")
  .addEventListener("click", copyStyleString);
document
  .getElementById("searchCepButton")
  .addEventListener("click", getAddress);
document
  .getElementById("generateImageButton")
  .addEventListener("click", createImage);
document
  .getElementById("downloadLink")
  .addEventListener("click", downloadCanvas);
document
  .getElementById("searchBy")
  .addEventListener("change", toggleSearchByView);
document
  .getElementById("fileSelector")
  .addEventListener("change", toggleInputSpamValue);

window.onload = fillFormWithValuesString(document.cookie);
