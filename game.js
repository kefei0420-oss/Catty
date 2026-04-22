const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");

const levelText = document.querySelector("#levelText");
const timeText = document.querySelector("#timeText");
const scoreText = document.querySelector("#scoreText");
const globalText = document.querySelector("#globalText");
const focusText = document.querySelector("#focusText");
const streakText = document.querySelector("#streakText");
const toast = document.querySelector("#toast");
const foundCard = document.querySelector("#foundCard");
const foundImage = document.querySelector("#foundImage");
const foundTitle = document.querySelector("#foundTitle");
const foundNote = document.querySelector("#foundNote");
const caseLabel = document.querySelector("#caseLabel");
const caseTitle = document.querySelector("#caseTitle");
const caseClue = document.querySelector("#caseClue");
const photoStrip = document.querySelector("#photoStrip");
const finalGallery = document.querySelector("#finalGallery");
const galleryGrid = document.querySelector("#galleryGrid");
const closeGalleryButton = document.querySelector("#closeGalleryButton");
const hintButton = document.querySelector("#hintButton");
const nextButton = document.querySelector("#nextButton");
const resetButton = document.querySelector("#resetButton");
const soundButton = document.querySelector("#soundButton");

const palette = {
  wall: "#4f5d50",
  wallDark: "#323b34",
  floor: "#6f6858",
  floorDark: "#514d43",
  floorLight: "#837c69",
  ink: "#141710",
  white: "#f3eddc",
  grey: "#646b64",
  darkGrey: "#303631",
  gold: "#f6b84b",
  pink: "#ff8fa3",
  green: "#8bd46f",
  blue: "#73b7ff",
  red: "#d65d55",
};

const fallbackPhotos = [
  "assets/20260422-225036.jpeg",
  "assets/20260422-225040.jpeg",
  "assets/20260422-225044.jpeg",
  "assets/20260422-225047.jpeg",
  "assets/20260422-225050.jpeg",
  "assets/20260422-225053.jpeg",
  "assets/20260422-225056.jpeg",
  "assets/20260422-225100.jpeg",
  "assets/20260422-225104.jpeg",
  "assets/20260422-225108.jpeg",
  "assets/20260422-225112.jpeg",
  "assets/20260422-225115.jpeg",
];

const cases = [
  {
    name: "床边潜伏",
    time: 50,
    clue: "白色前爪、灰色耳朵、靠近柔软边缘。",
    hint: ["留意床边阴影。", "有一只眼睛在布料下面反光。", "左下角的被子不是完全平的。"],
    target: { x: 146, y: 396, w: 182, h: 94, type: "blanket" },
    decoys: [
      { x: 602, y: 338, w: 176, h: 106, type: "pillow" },
      { x: 778, y: 166, w: 92, h: 132, type: "box" },
      { x: 440, y: 402, w: 130, h: 82, type: "rug" },
    ],
    reward: "白爪爪从被边露出来了。",
  },
  {
    name: "纸箱审讯",
    time: 48,
    clue: "橘色纸箱附近，灰白轮廓藏在开口背后。",
    hint: ["纸箱边缘有细小白线。", "右上方的阴影太圆了。", "猫在纸箱，不在箱子旁边。"],
    target: { x: 742, y: 118, w: 136, h: 126, type: "box" },
    decoys: [
      { x: 116, y: 348, w: 186, h: 100, type: "sofa" },
      { x: 566, y: 392, w: 144, h: 82, type: "basket" },
      { x: 382, y: 172, w: 160, h: 118, type: "window" },
    ],
    reward: "箱子开口里出现了蜂蜜色眼睛。",
  },
  {
    name: "玻璃桌下",
    time: 44,
    clue: "黑色桌面、灰色地面，猫会把自己伪装成一团阴影。",
    hint: ["找一块不对称的暗影。", "它离桌腿很近。", "右侧玻璃桌下面有胡须。"],
    target: { x: 682, y: 360, w: 150, h: 86, type: "table" },
    decoys: [
      { x: 94, y: 388, w: 168, h: 82, type: "blanket" },
      { x: 338, y: 390, w: 150, h: 92, type: "plant" },
      { x: 530, y: 210, w: 118, h: 140, type: "cabinet" },
    ],
    reward: "玻璃反光里藏着一张小猫脸。",
  },
  {
    name: "窗台冷案",
    time: 42,
    clue: "金色眼睛会先被月光发现。",
    hint: ["窗户里的亮点有两个。", "窗台边缘比其他地方厚。", "猫趴在窗台右侧。"],
    target: { x: 458, y: 170, w: 164, h: 112, type: "window" },
    decoys: [
      { x: 118, y: 392, w: 184, h: 94, type: "sofa" },
      { x: 702, y: 362, w: 138, h: 104, type: "box" },
      { x: 336, y: 416, w: 150, h: 70, type: "rug" },
    ],
    reward: "窗台记录员确认猫猫在岗。",
  },
  {
    name: "终极猫窝",
    time: 38,
    clue: "最像猫窝的地方，反而要看第二眼。",
    hint: ["圆形轮廓里有灰色缺口。", "猫窝中央的白块不是垫子。", "点猫窝靠右的阴影。"],
    target: { x: 438, y: 360, w: 226, h: 136, type: "nest" },
    decoys: [
      { x: 116, y: 220, w: 120, h: 150, type: "lamp" },
      { x: 740, y: 210, w: 124, h: 142, type: "cabinet" },
      { x: 108, y: 410, w: 140, h: 74, type: "basket" },
    ],
    reward: "猫窝终于承认它今天藏了一只猫。",
  },
];

let photos = fallbackPhotos;
let levelIndex = 0;
let found = 0;
let remaining = cases[0].time;
let focus = 100;
let streak = 0;
let globalFinds = 0;
let isFound = false;
let muted = false;
let hintLevel = 0;
let timerId = null;
let toastId = null;
let pulse = 0;
let mouse = { x: 480, y: 320, active: false };

function pixelRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function choosePhoto(index) {
  return photos[index % photos.length] || fallbackPhotos[0];
}

async function loadPhotos() {
  try {
    const response = await fetch("api/photos");
    if (!response.ok) return;
    const data = await response.json();
    if (Array.isArray(data.photos) && data.photos.length) {
      photos = data.photos;
    }
  } catch {
    photos = fallbackPhotos;
  }
  renderPhotoStrip();
  updateCasePanel();
}

async function loadStats() {
  try {
    const response = await fetch("api/stats");
    if (!response.ok) return;
    const stats = await response.json();
    globalFinds = Number(stats.totalFinds || 0);
    updateHud();
  } catch {
    globalText.textContent = "-";
  }
}

async function recordFind(levelName) {
  try {
    const response = await fetch("api/find", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level: levelName }),
    });
    if (!response.ok) return;
    const stats = await response.json();
    globalFinds = Number(stats.totalFinds || 0);
    updateHud();
  } catch {
    globalText.textContent = "-";
  }
}

function renderPhotoStrip() {
  photoStrip.innerHTML = "";
  photos.slice(0, 12).forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `猫猫照片 ${index + 1}`;
    if (index === levelIndex % photos.length) img.classList.add("active");
    photoStrip.appendChild(img);
  });
}

function renderGallery() {
  galleryGrid.innerHTML = "";
  photos.forEach((src, index) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const caption = document.createElement("figcaption");
    img.src = src;
    img.alt = `猫猫奖励照片 ${index + 1}`;
    caption.textContent = `No. ${String(index + 1).padStart(2, "0")}`;
    figure.append(img, caption);
    galleryGrid.appendChild(figure);
  });
}

function showFinalGallery() {
  renderGallery();
  finalGallery.classList.add("show");
  finalGallery.setAttribute("aria-hidden", "false");
}

function hideFinalGallery() {
  finalGallery.classList.remove("show");
  finalGallery.setAttribute("aria-hidden", "true");
}

function updateCasePanel() {
  const current = cases[levelIndex];
  caseLabel.textContent = `Case ${String(levelIndex + 1).padStart(2, "0")}`;
  caseTitle.textContent = current.name;
  caseClue.textContent = current.clue;

  Array.from(photoStrip.children).forEach((img, index) => {
    img.classList.toggle("active", index === levelIndex % photos.length);
  });
}

function drawRoom() {
  pixelRect(0, 0, 960, 640, palette.wall);
  for (let y = 26; y < 330; y += 30) {
    pixelRect(0, y, 960, 4, y % 60 === 26 ? palette.wallDark : "#60705f");
  }
  for (let x = 48; x < 920; x += 96) {
    pixelRect(x, 0, 5, 330, "rgba(35, 42, 36, 0.34)");
  }

  pixelRect(0, 330, 960, 310, palette.floor);
  for (let y = 348; y < 640; y += 34) {
    for (let x = y % 68 ? -30 : 18; x < 960; x += 86) {
      pixelRect(x, y, 54, 5, palette.floorDark);
      pixelRect(x + 58, y + 12, 28, 5, palette.floorLight);
    }
  }

  pixelRect(36, 92, 172, 126, "#384139");
  pixelRect(50, 106, 144, 90, "#151c1d");
  pixelRect(82, 132, 24, 24, palette.gold);
  pixelRect(122, 154, 44, 9, palette.blue);
  pixelRect(36, 522, 888, 22, "#252b23");
  pixelRect(70, 544, 44, 58, "#131711");
  pixelRect(846, 544, 44, 58, "#131711");
}

function drawObject(area, isTarget) {
  const { x, y, w, h, type } = area;
  if (type === "blanket") {
    pixelRect(x, y + 42, w, h - 28, "#22304a");
    pixelRect(x + 14, y + 24, w - 28, 36, "#344567");
    for (let i = 0; i < w; i += 30) pixelRect(x + i, y + 53, 16, 7, "#1a263d");
  }
  if (type === "pillow") {
    pixelRect(x, y + 18, w, h - 26, "#e9e4d6");
    pixelRect(x + 14, y, w - 28, h - 32, "#fff8ea");
    pixelRect(x + w - 38, y + h - 42, 22, 10, "#d3cec0");
  }
  if (type === "box") {
    pixelRect(x, y + 18, w, h - 18, "#ae6c35");
    pixelRect(x + 12, y, w - 24, 32, "#e08037");
    pixelRect(x + 22, y + 42, w - 44, 12, "#663a22");
  }
  if (type === "sofa") {
    pixelRect(x, y + 26, w, h - 26, "#33443d");
    pixelRect(x + 18, y, w - 36, 54, "#41564b");
    pixelRect(x + 18, y + h - 18, 28, 34, "#171b15");
    pixelRect(x + w - 46, y + h - 18, 28, 34, "#171b15");
  }
  if (type === "plant") {
    pixelRect(x + w * 0.35, y + h - 52, w * 0.3, 52, "#7b5136");
    pixelRect(x + w * 0.3, y + h - 22, w * 0.4, 22, "#a15f3e");
    pixelRect(x + 18, y + 38, 46, 54, "#5f9f56");
    pixelRect(x + w - 72, y + 12, 50, 78, "#72b963");
    pixelRect(x + w * 0.45, y, 36, 92, "#82d072");
  }
  if (type === "rug") {
    pixelRect(x, y + 24, w, h - 28, "#8f4e63");
    pixelRect(x + 18, y + 8, w - 36, h - 24, "#bd6276");
    pixelRect(x + 36, y + 34, w - 72, 10, "#ffd27a");
  }
  if (type === "cabinet") {
    pixelRect(x, y, w, h, "#6a5138");
    pixelRect(x + 12, y + 14, w / 2 - 18, h - 28, "#826546");
    pixelRect(x + w / 2 + 6, y + 14, w / 2 - 18, h - 28, "#826546");
    pixelRect(x + w / 2 - 8, y + h / 2, 8, 8, palette.gold);
    pixelRect(x + w / 2 + 8, y + h / 2, 8, 8, palette.gold);
  }
  if (type === "lamp") {
    pixelRect(x + w / 2 - 8, y + 50, 16, h - 50, "#403a34");
    pixelRect(x + 22, y, w - 44, 62, "#ffcf72");
    pixelRect(x + 10, y + 50, w - 20, 16, "#d09045");
  }
  if (type === "basket") {
    pixelRect(x, y + 26, w, h - 26, "#a4774c");
    for (let i = 8; i < w; i += 22) pixelRect(x + i, y + 32, 8, h - 34, "#6d4c33");
    pixelRect(x + 26, y, w - 52, 28, "#c08b5c");
  }
  if (type === "window") {
    pixelRect(x, y, w, h, "#273440");
    pixelRect(x + 10, y + 10, w - 20, h - 28, "#111820");
    pixelRect(x + w / 2 - 3, y + 10, 6, h - 28, "#4d6274");
    pixelRect(x + 10, y + h / 2, w - 20, 5, "#4d6274");
    pixelRect(x + 22, y + 24, 28, 28, palette.gold);
  }
  if (type === "table") {
    pixelRect(x, y + 20, w, 26, "#202826");
    pixelRect(x + 18, y + 46, 18, h - 34, "#121713");
    pixelRect(x + w - 36, y + 46, 18, h - 34, "#121713");
    pixelRect(x + 10, y, w - 20, 22, "rgba(125, 161, 160, 0.55)");
  }
  if (type === "nest") {
    pixelRect(x + 24, y + 38, w - 48, h - 34, "#6d5a46");
    pixelRect(x, y + 64, w, h - 58, "#9c7954");
    pixelRect(x + 48, y + 24, w - 96, 56, "#d5b06d");
  }

  if (isTarget && hintLevel > 0 && !isFound) {
    drawSubtleClue(area);
  }
}

function drawSubtleClue(area) {
  if (hintLevel >= 1) {
    pixelRect(area.x + area.w - 42, area.y + 34, 8, 8, "#d69b46");
    pixelRect(area.x + area.w - 25, area.y + 34, 5, 8, palette.ink);
  }
  if (hintLevel >= 2) {
    pixelRect(area.x + 24, area.y + area.h - 22, 24, 8, palette.white);
    pixelRect(area.x + 54, area.y + area.h - 18, 18, 6, palette.grey);
  }
}

function drawHiddenCat(area) {
  if (!isFound) return;
  const x = area.x + Math.round(area.w * 0.46);
  const y = area.y + Math.round(area.h * 0.32);
  pixelRect(x - 36, y + 18, 86, 42, palette.grey);
  pixelRect(x - 52, y, 62, 48, palette.grey);
  pixelRect(x - 46, y - 8, 14, 18, palette.grey);
  pixelRect(x - 8, y - 8, 14, 18, palette.grey);
  pixelRect(x - 34, y + 24, 34, 22, palette.white);
  pixelRect(x - 40, y + 20, 12, 12, palette.gold);
  pixelRect(x - 14, y + 20, 12, 12, palette.gold);
  pixelRect(x - 35, y + 23, 5, 9, palette.ink);
  pixelRect(x - 9, y + 23, 5, 9, palette.ink);
  pixelRect(x - 24, y + 34, 10, 8, palette.pink);
}

function drawScanner() {
  if (!mouse.active || isFound) return;
  const size = 72;
  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.fillStyle = palette.green;
  ctx.fillRect(mouse.x - size / 2, mouse.y - size / 2, size, size);
  ctx.globalAlpha = 0.6;
  ctx.strokeStyle = palette.green;
  ctx.lineWidth = 3;
  ctx.strokeRect(Math.round(mouse.x - size / 2), Math.round(mouse.y - size / 2), Math.round(size), Math.round(size));
  ctx.restore();
}

function render() {
  const current = cases[levelIndex];
  drawRoom();
  current.decoys.forEach((item) => drawObject(item, false));
  drawObject(current.target, true);
  drawHiddenCat(current.target);
  drawScanner();
  pulse += 1;
  requestAnimationFrame(render);
}

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height,
  };
}

function within(point, area) {
  return point.x >= area.x && point.x <= area.x + area.w && point.y >= area.y && point.y <= area.y + area.h;
}

function setToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(toastId);
  toastId = setTimeout(() => toast.classList.remove("show"), 1800);
}

function chirp(success = false) {
  if (muted) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const audio = new AudioContext();
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "square";
  osc.frequency.value = success ? 820 : 210;
  gain.gain.setValueAtTime(0.045, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.14);
  osc.connect(gain).connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + 0.15);
}

function updateHud() {
  levelText.textContent = `${levelIndex + 1} / ${cases.length}`;
  timeText.textContent = String(Math.max(0, remaining));
  scoreText.textContent = String(found);
  globalText.textContent = String(globalFinds);
  focusText.textContent = String(Math.max(0, focus));
  streakText.textContent = String(streak);
}

function revealCat(auto = false) {
  if (isFound) return;
  const current = cases[levelIndex];
  isFound = true;
  found += 1;
  streak = auto ? 0 : streak + 1;
  foundImage.src = choosePhoto(levelIndex + 1);
  foundTitle.textContent = `${current.name} 结案`;
  foundNote.textContent = current.reward;
  foundCard.classList.add("show");
  foundCard.setAttribute("aria-hidden", "false");
  nextButton.disabled = false;
  nextButton.textContent = levelIndex === cases.length - 1 ? "照片奖励" : "下一案";
  setToast(auto ? "时间到，猫猫自己露面了。" : "结案。猫猫照片已入档。");
  chirp(true);
  updateHud();
  recordFind(current.name);
}

function wrongGuess(area) {
  const labels = {
    blanket: "布料皱褶，暂未发现猫。",
    pillow: "枕头过于无辜。",
    box: "纸箱空置。",
    sofa: "沙发阴影干扰判断。",
    plant: "植物保持沉默。",
    rug: "毯子没有呼噜声。",
    cabinet: "柜门线索不成立。",
    lamp: "灯光太亮，猫不在这里。",
    basket: "篮子里只有空气。",
    window: "窗户反光误导了你。",
    table: "桌下没有目标。",
    nest: "猫窝伪装失败，但这里不是。",
  };
  focus = Math.max(0, focus - 12);
  streak = 0;
  setToast(labels[area.type] || "线索不成立。");
  chirp(false);
  updateHud();
}

function startTimer() {
  clearInterval(timerId);
  timerId = setInterval(() => {
    if (isFound) return;
    remaining -= 1;
    if (remaining <= 0) {
      remaining = 0;
      revealCat(true);
    }
    updateHud();
  }, 1000);
}

function loadLevel(index) {
  levelIndex = index;
  remaining = cases[levelIndex].time;
  focus = 100;
  hintLevel = 0;
  isFound = false;
  nextButton.disabled = true;
  nextButton.textContent = "下一案";
  foundCard.classList.remove("show");
  foundCard.setAttribute("aria-hidden", "true");
  hideFinalGallery();
  updateCasePanel();
  updateHud();
  setToast(cases[levelIndex].name);
  startTimer();
}

canvas.addEventListener("mousemove", (event) => {
  mouse = { ...canvasPoint(event), active: true };
});

canvas.addEventListener("mouseleave", () => {
  mouse.active = false;
});

canvas.addEventListener("click", (event) => {
  if (isFound) return;
  const current = cases[levelIndex];
  const point = canvasPoint(event);
  if (within(point, current.target)) {
    revealCat(false);
    return;
  }
  const wrong = current.decoys.find((item) => within(point, item));
  if (wrong) {
    wrongGuess(wrong);
    return;
  }
  focus = Math.max(0, focus - 5);
  setToast("空白区域，没有有效线索。");
  chirp(false);
  updateHud();
});

hintButton.addEventListener("click", () => {
  const current = cases[levelIndex];
  const hints = current.hint;
  const text = hints[Math.min(hintLevel, hints.length - 1)];
  hintLevel = Math.min(hintLevel + 1, hints.length);
  focus = Math.max(10, focus - 8);
  remaining = Math.max(8, remaining - 4);
  setToast(text);
  updateHud();
});

nextButton.addEventListener("click", () => {
  if (levelIndex === cases.length - 1) {
    setToast(`全部结案：找到 ${found} 次猫猫。`);
    showFinalGallery();
    nextButton.disabled = true;
    return;
  }
  loadLevel(levelIndex + 1);
});

resetButton.addEventListener("click", () => {
  found = 0;
  streak = 0;
  hideFinalGallery();
  loadLevel(0);
});

closeGalleryButton.addEventListener("click", hideFinalGallery);

soundButton.addEventListener("click", () => {
  muted = !muted;
  soundButton.textContent = muted ? "×" : "♪";
  setToast(muted ? "静音" : "声音打开");
});

loadStats();
loadPhotos();
loadLevel(0);
render();
