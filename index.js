window.onload = fillFormWithValuesString(document.cookie);

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

function reduce(numerator, denominator) {
  var gcd = function gcd(a, b) {
    return b ? gcd(b, a % b) : a;
  };
  gcd = gcd(numerator, denominator);
  return [numerator / gcd, denominator / gcd];
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
  }
}

function formatDate(dateString) {
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

function getWidthdWithPadding(ctx, text) {
  const canvas = document.getElementById("canvas-image");
  const textWidth = ctx.measureText(text).width;

  return canvas.width - textWidth - 5;
}

function addTextToCanvas(ctx, textArray, textPadding, textPosition) {
  const canvas = document.getElementById("canvas-image");

  let fontSize = ctx.font.split(" ")[0].replace(/\D/g, "");
  fontSize = parseInt(fontSize);

  //textArray.reverse();

  for (let i = 0; i < textArray.length; i++) {
    switch (textPosition) {
      case "bottomRight":
        ctx.strokeText(
          textArray[i].trim(),
          getWidthdWithPadding(ctx, textArray[i].trim()),
          canvas.height - fontSize - textPadding * (textArray.length - i - 1)
        );

        ctx.fillText(
          textArray[i].trim(),
          getWidthdWithPadding(ctx, textArray[i].trim()),
          canvas.height - fontSize - textPadding * (textArray.length - i - 1)
        );

        break;
      case "bottomLeft":
        ctx.strokeText(
          textArray[i].trim(),
          5,
          canvas.height - fontSize - textPadding * (textArray.length - i - 1)
        );

        ctx.fillText(
          textArray[i].trim(),
          5,
          canvas.height - fontSize - textPadding * (textArray.length - i - 1)
        );

        break;
      case "topRight":
        ctx.strokeText(
          textArray[i].trim(),
          getWidthdWithPadding(ctx, textArray[i].trim()),
          fontSize + textPadding * i
        );

        ctx.fillText(
          textArray[i].trim(),
          getWidthdWithPadding(ctx, textArray[i].trim()),
          fontSize + textPadding * i
        );

        break;
      case "topLeft":
        ctx.strokeText(textArray[i].trim(), 5, fontSize + textPadding * i);

        ctx.fillText(textArray[i].trim(), 5, fontSize + textPadding * i);

        break;
    }
  }
}

function downloadCanvas() {
  const canvas = document.getElementById("canvas-image");

  const imgData = canvas.toDataURL("image/png", 1);
  window.location.href = imgData;
  document.getElementById("link").href = imgData;
}

function saveFormCookies() {
  const settingsForm = document.getElementById("timestampSettings");

  for (const child of settingsForm.children) {
    if (child.nodeName !== "INPUT" && child.nodeName !== "SELECT") continue;
    if (!child.value) continue;

    document.cookie =
      child.id +
      "=" +
      child.value +
      "; " +
      "expires=Fri, 31 Dec 9999 23:59:59 GMT" +
      "; " +
      "path=/";
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

  const settingsForm = document.getElementById("timestampSettings");
  for (const child of settingsForm.children) {
    if (child.nodeName !== "INPUT" && child.nodeName !== "SELECT") continue;
    if (!child.value) continue;

    child.value = valuesJson[child.id];
  }
}

function prepareStyleString() {
  const styleString = document.getElementById("importStyleText").value;
  fillFormWithValuesString(styleString);
}

function copyStyleString() {
  const settingsForm = document.getElementById("timestampSettings");

  let valuesArray = [];
  for (const child of settingsForm.children) {
    if (child.nodeName !== "INPUT") continue;
    if (!child.value) continue;

    valuesArray.push(child.id + "=" + child.value);
  }

  const valuesString = valuesArray.join(";");

  const clipboardItem = new ClipboardItem({
    "text/plain": valuesString,
  });
  navigator.clipboard.write([clipboardItem]);
}
