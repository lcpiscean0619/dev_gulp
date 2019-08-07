// updated to ES6 <3
// check GLITCH.raf ;)

// magic demo(ns) config
const CARD_IMAGE_URL = "//i.ibb.co/5sDww0g/vader-man.jpg";

const GLITCH = {
  delay: 100, // glitch interval delay (ignored if RAF=true)
  maxErrors: 130, // max 'glitch' errors ?
  raf: true, // make it fast ?! :O (use requestAnimationFrame)

  cache: new Map(), // cant't touch this! :D
  timer: null // tracker for fx updater
};

// glitch helpers
const decodeImage = (imageData, encoder = "data:image/jpeg;base64,") =>
  imageData.replace(encoder, "");
const encodeImage = (imageData, encoder = "data:image/jpeg;base64,") =>
  `${encoder}${imageData}`;

const corruptImage = (imageData, maxErrors = 130) => {
  let corrupted = imageData;

  if (Math.random() > 0.8) {
    const errors = Math.round(Math.random() * maxErrors);

    for (let i = 0; i < errors; i++) {
      const l = 1000 + Math.round(Math.random() * (corrupted.length - 1002));
      corrupted =
        corrupted.substr(0, l) +
        corrupted.charAt(l + 1) +
        corrupted.charAt(l) +
        corrupted.substr(l + 2);
    }
  }

  return encodeImage(corrupted);
};

// fetch image URL as base 64
const fetchImageBase64 = (
  url = "",
  outputFormat = "image/jpeg",
  outputQuality = 0.8
) => {
  return new Promise((resolve, reject) => {
    if (!url) reject("Need img URL bro!");

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onerror = () => reject("Image err bro!");
    img.onload = () => {
      let canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.height = img.height;
      canvas.width = img.width;

      ctx.drawImage(img, 0, 0);

      const dataURL = canvas.toDataURL(outputFormat, outputQuality);
      resolve(dataURL);

      canvas = null;
    };

    img.src = url;
  });
};

// glitch FX helpers
const glitchImage = (imgURL, cb) => {
  const imgData = GLITCH.cache.get(imgURL);
  const corrupted = corruptImage(imgData, GLITCH.maxErrors);
  cb(corrupted);
};

const cancelGlitch = ticker => {
  if (ticker) {
    if (GLITCH.raf) {
      cancelAnimationFrame(ticker);
    } else {
      clearInterval(ticker);
    }

    ticker = null;
  }
};

// 3d transform helpers
const setBackground = (el, bg) => (el.style.backgroundImage = `url(${bg})`);
const resetTransform = (el, perspective = 800) =>
  (el.style.transform = `translate3d(0%, 0%, -${perspective /
    2}px) rotateX(0deg) rotateY(0deg)`);

const onMove = (ev, el) => {
  const { pageX, pageY } = ev;
  const { offsetWidth, offsetHeight } = el;
  const { left, top } = el.getBoundingClientRect();

  const cardX = left + offsetWidth / 2;
  const cardY = top + offsetHeight / 2;

  const angle = 25;
  const rotX = (cardY - pageY) / angle;
  const rotY = (cardX - pageX) / -angle;

  el.style.transform = `translate3d(0%, 0%, 0) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
};

// GLITCHY glitch!
(async () => {
  let base64;

  try {
    // fetch & cache image data
    base64 = await fetchImageBase64(CARD_IMAGE_URL);
    GLITCH.cache.set(CARD_IMAGE_URL, decodeImage(base64));
  } catch (err) {
    throw new Error(err);
  }

  let ticker; // animation tracker

  // get card container & perspective
  const card = document.querySelector(".glitch-card");
  const perspective =
    getComputedStyle(card.parentElement)
      .getPropertyValue("perspective")
      .replace("px", "") || 800;

  // create helper binds for current card
  const updateBackground = bg => setBackground(card, bg);
  const onCardMove = ev => onMove(ev, card);

  const startGlitch = (url, cb) => {
    if (GLITCH.raf) {
      ticker = requestAnimationFrame(() => startGlitch(url, cb));
      glitchImage(url, cb);
    } else {
      ticker = setInterval(() => glitchImage(url, cb), GLITCH.delay);
    }
  };

  const onHover = () => {
    startGlitch(CARD_IMAGE_URL, updateBackground);
    card.addEventListener("mousemove", onCardMove);
  };

  const onOut = () => {
    cancelGlitch(ticker);
    card.removeEventListener("mousemove", onCardMove);

    resetTransform(card, perspective); // reset card
  };

  // set current card background texture
  setBackground(card, base64);

  // add mouse interaction
  card.addEventListener("mouseover", onHover);
  card.addEventListener("mouseout", onOut);
})(); // just do it...
