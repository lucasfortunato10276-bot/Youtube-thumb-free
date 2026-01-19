document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("youtubeLink");
  const btnBuscar = document.getElementById("btnBuscar");
  const btnDownload = document.getElementById("btnDownload");
  const thumb = document.getElementById("thumb");
  const erro = document.getElementById("erro");

  let thumbAtual = "";
  btnDownload.disabled = true;

  function extrairVideoId(url) {
    // tenta vários formatos
    const regex = /(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|$)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  btnBuscar.addEventListener("click", async () => {
    erro.textContent = "";
    thumb.src = "";
    thumbAtual = "";
    btnDownload.disabled = true;

    const link = input.value.trim();
    const videoId = extrairVideoId(link);

    if (!videoId) {
      erro.textContent = "Cole um link válido de vídeo do YouTube";
      return;
    }

    const qualidades = [
      "maxresdefault.jpg",
      "hqdefault.jpg",
      "mqdefault.jpg",
      "sddefault.jpg",
      "default.jpg",
    ];

    for (let q of qualidades) {
      const url = `https://img.youtube.com/vi/${videoId}/${q}`;

      const img = new Image();
      img.src = url;

      await new Promise((resolve) => {
        img.onload = () => {
          thumb.src = url;
          thumbAtual = url;
          btnDownload.disabled = false;
          resolve();
        };
        img.onerror = () => resolve();
      });

      if (thumbAtual) break;
    }

    if (!thumbAtual) {
      erro.textContent = "Thumbnail não encontrada";
    }
  });

  btnDownload.addEventListener("click", () => {
    if (!thumbAtual) return;

    const a = document.createElement("a");
    a.href = thumbAtual;
    a.download = "thumbnail-youtube.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
});
