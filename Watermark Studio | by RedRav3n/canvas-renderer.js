(() => {
  "use strict";

  function getOutputSize(image, config) {
    const sourceWidth = image.naturalWidth || image.width;
    const sourceHeight = image.naturalHeight || image.height;
    const ratio = Math.min(
      config.maxWidth / sourceWidth,
      config.maxHeight / sourceHeight,
    );
    const finalRatio = config.allowUpscale ? ratio : Math.min(1, ratio);
    return {
      width: Math.max(1, Math.round(sourceWidth * finalRatio)),
      height: Math.max(1, Math.round(sourceHeight * finalRatio)),
    };
  }
  
  function drawWatermark(context, size, config, image) {
    const hasText =
      (config.watermarkType === "text" || config.watermarkType === "both") &&
      config.watermarkText.trim();
    const hasImage =
      (config.watermarkType === "image" || config.watermarkType === "both") &&
      image;
    if ((!hasText && !hasImage) || config.opacity === 0) return;
  
    if (hasImage) drawImageWatermark(context, size, config, image);
    if (hasText) drawTextWatermark(context, size, config);
  }
  
  function drawTextWatermark(context, size, config) {
    const text = config.watermarkText.trim();
    if (!text || config.opacity === 0) return;
  
    context.save();
    context.globalAlpha = config.opacity / 100;
    context.fillStyle = config.color;
    context.strokeStyle = "rgba(0, 0, 0, 0.38)";
    context.lineWidth = Math.max(2, Math.round(config.fontSize / 12));
    context.font = `900 ${config.fontSize}px Inter, Arial, sans-serif`;
    context.textBaseline = "middle";
    context.textAlign = "center";
  
    if (config.position === "tile") {
      drawTiledWatermark(context, size, config, text);
    } else {
      const point = getWatermarkPoint(context, size, config, text);
      drawWatermarkText(context, text, point.x, point.y, config.rotation);
    }
    context.restore();
  }
  
  function drawImageWatermark(context, size, config, image) {
    if (!image || config.opacity === 0) return;
  
    const sourceWidth = image.naturalWidth || image.width;
    const sourceHeight = image.naturalHeight || image.height;
    const ratio = config.imageSize / Math.max(sourceWidth, sourceHeight);
    const drawWidth = Math.max(1, Math.round(sourceWidth * ratio));
    const drawHeight = Math.max(1, Math.round(sourceHeight * ratio));
  
    context.save();
    context.globalAlpha = config.opacity / 100;
    if (config.position === "tile") {
      const stepX = drawWidth + config.margin * 3;
      const stepY = drawHeight + config.margin * 3;
      for (let y = -stepY; y < size.height + stepY; y += stepY) {
        for (let x = -stepX; x < size.width + stepX; x += stepX) {
          drawWatermarkImage(
            image,
            context,
            x,
            y,
            drawWidth,
            drawHeight,
            config.rotation || -22,
          );
        }
      }
    } else {
      const point = getBoxPoint(size, config, drawWidth, drawHeight);
      drawWatermarkImage(
        image,
        context,
        point.x,
        point.y,
        drawWidth,
        drawHeight,
        config.rotation,
      );
    }
    context.restore();
  }
  
  function drawWatermarkImage(image, context, x, y, width, height, rotation) {
    context.save();
    context.translate(x + width / 2, y + height / 2);
    context.rotate((rotation * Math.PI) / 180);
    context.drawImage(image, -width / 2, -height / 2, width, height);
    context.restore();
  }
  
  function getBoxPoint(size, config, width, height) {
    const margin = config.margin;
    const points = {
      "bottom-right": {
        x: size.width - width - margin,
        y: size.height - height - margin,
      },
      "bottom-left": { x: margin, y: size.height - height - margin },
      "top-right": { x: size.width - width - margin, y: margin },
      "top-left": { x: margin, y: margin },
      center: { x: (size.width - width) / 2, y: (size.height - height) / 2 },
    };
    return points[config.position] || points["bottom-right"];
  }
  
  function drawTiledWatermark(context, size, config, text) {
    const metrics = context.measureText(text);
    const stepX = Math.max(
      metrics.width + config.margin * 3,
      config.fontSize * 6,
    );
    const stepY = Math.max(config.fontSize * 3.2, config.margin * 3);
    for (let y = -stepY; y < size.height + stepY; y += stepY) {
      for (let x = -stepX; x < size.width + stepX; x += stepX) {
        drawWatermarkText(context, text, x, y, config.rotation || -22);
      }
    }
  }
  
  function getWatermarkPoint(context, size, config, text) {
    const width = context.measureText(text).width;
    const halfWidth = width / 2;
    const halfHeight = config.fontSize / 2;
    const margin = config.margin;
    const points = {
      "bottom-right": {
        x: size.width - halfWidth - margin,
        y: size.height - halfHeight - margin,
      },
      "bottom-left": {
        x: halfWidth + margin,
        y: size.height - halfHeight - margin,
      },
      "top-right": {
        x: size.width - halfWidth - margin,
        y: halfHeight + margin,
      },
      "top-left": {
        x: halfWidth + margin,
        y: halfHeight + margin,
      },
      center: {
        x: size.width / 2,
        y: size.height / 2,
      },
    };
    return points[config.position] || points["bottom-right"];
  }
  
  function drawWatermarkText(context, text, x, y, rotation) {
    context.save();
    context.translate(x, y);
    context.rotate((rotation * Math.PI) / 180);
    context.strokeText(text, 0, 0);
    context.fillText(text, 0, 0);
    context.restore();
  }

  globalThis.WatermarkRenderer = Object.freeze({ drawWatermark, getOutputSize });
})();

