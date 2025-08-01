function getWidthdWithPadding(ctx, text) {
  const canvas = document.getElementById("canvas-image");
  const textWidth = ctx.measureText(text).width;

  return canvas.width - textWidth - 5;
}

export function addTextToCanvas(ctx, textArray, textPadding, textPosition) {
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
