const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");

const levelText = document.querySelector("#levelText");
const timeText = document.querySelector("#timeText");
const scoreText = document.querySelector("#scoreText");
const focusText = document.querySelector("#focusText");
const toast = document.querySelector("#toast");
const foundCard = document.querySelector("#foundCard");
const foundImage = document.querySelector("#foundImage");
const foundTitle = document.querySelector("#foundTitle");
const foundNote = document.querySelector("#foundNote");
const caseLabel = document.querySelector("#caseLabel");
const caseTitle = document.querySelector("#caseTitle");
const caseClue = document.querySelector("#caseClue");
const finalGallery = document.querySelector("#finalGallery");
const closeGalleryButton = document.querySelector("#closeGalleryButton");
const slideImage = document.querySelector("#slideImage");
const slideCaption = document.querySelector("#slideCaption");
const prevSlideButton = document.querySelector("#prevSlideButton");
const nextSlideButton = document.querySelector("#nextSlideButton");
const photoModal = document.querySelector("#photoModal");
const photoModalImage = document.querySelector("#photoModalImage");
const roundPhotoButton = document.querySelector("#roundPhotoButton");
const roundPhotoThumb = document.querySelector("#roundPhotoThumb");
const closePhotoButton = document.querySelector("#closePhotoButton");
const hintButton = document.querySelector("#hintButton");
const nextButton = document.querySelector("#nextButton");
const resetButton = document.querySelector("#resetButton");
const musicButton = document.querySelector("#musicButton");
const codexButton = document.querySelector("#codexButton");
const pieceRewardModal = document.querySelector("#pieceRewardModal");
const closePieceRewardButton = document.querySelector("#closePieceRewardButton");
const openCodexFromRewardButton = document.querySelector("#openCodexFromRewardButton");
const rewardPiecePreview = document.querySelector("#rewardPiecePreview");
const rewardPieceText = document.querySelector("#rewardPieceText");
const codexModal = document.querySelector("#codexModal");
const closeCodexButton = document.querySelector("#closeCodexButton");
const codexGrid = document.querySelector("#codexGrid");
const playerIdText = document.querySelector("#playerIdText");

const palette = {
  wall: "#52614f",
  wallDark: "#354039",
  floor: "#716a58",
  floorDark: "#514d43",
  floorLight: "#8a806a",
  ink: "#141710",
  white: "#f3eddc",
  grey: "#646b64",
  darkGrey: "#303631",
  gold: "#f6b84b",
  pink: "#ff8fa3",
  green: "#8bd46f",
  blue: "#73b7ff",
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

const PUZZLE_GRID = 3;
const PUZZLE_PIECES = PUZZLE_GRID * PUZZLE_GRID;
const PROFILE_KEY = "catty-puzzle-profile-v1";

const allCases = [
  makeCase("床边潜伏", "白色前爪、灰色耳朵，通常贴着软软的布料边缘。", "白爪爪从被边露出来了。", 50, { x: 146, y: 396, w: 182, h: 94, type: "blanket" }),
  makeCase("纸箱审讯", "纸箱口的阴影很深，里面可能有一双蜂蜜色眼睛。", "箱子开口里出现了猫猫脸。", 48, { x: 732, y: 392, w: 142, h: 104, type: "box" }),
  makeCase("玻璃桌下", "灰色地面上，有一块不像家具的暗影。", "玻璃反光里藏着一张小猫脸。", 45, { x: 682, y: 360, w: 150, h: 86, type: "table" }),
  makeCase("窗台冷案", "月光和眼睛都很亮，但只有一个亮点会看你。", "窗台记录员确认猫猫在岗。", 44, { x: 458, y: 170, w: 164, h: 112, type: "window" }),
  makeCase("终极猫窝", "越像猫窝的地方，越要看第二眼。", "猫窝终于承认它今天藏了一只猫。", 42, { x: 438, y: 360, w: 226, h: 136, type: "nest" }),
  makeCase("沙发底线", "沙发底部的阴影边缘，有一点不自然的圆。", "沙发底下传来轻轻呼噜。", 47, { x: 104, y: 382, w: 216, h: 108, type: "sofa" }),
  makeCase("植物假证", "叶子很会挡视线，猫可能躲在花盆后面。", "植物后面露出灰耳朵。", 46, { x: 562, y: 324, w: 138, h: 162, type: "plant" }),
  makeCase("地毯鼓包", "地毯边缘有一块弧度，像偷偷压着什么。", "地毯边缘出现了白色小爪。", 45, { x: 706, y: 392, w: 152, h: 86, type: "rug" }),
  makeCase("柜门缝隙", "柜门没有完全合上，缝里有一点暖色反光。", "柜门缝里露出小鼻子。", 44, { x: 662, y: 350, w: 132, h: 154, type: "cabinet" }),
  makeCase("灯下黑", "灯光越亮，旁边的阴影越值得怀疑。", "灯座旁边蹲着一团灰白。", 46, { x: 118, y: 272, w: 122, h: 170, type: "lamp" }),
  makeCase("篮子轻响", "篮子明明空着，却像被压低了一点。", "篮子里多了一只猫猫。", 43, { x: 350, y: 414, w: 154, h: 76, type: "basket" }),
  makeCase("枕头嫌疑", "枕头边角不够平整，像藏着圆圆的头。", "枕头后面有一双大眼睛。", 45, { x: 568, y: 394, w: 180, h: 94, type: "pillow" }),
  makeCase("电视柜巡逻", "屏幕附近的黑色边缘，也许不全是家具。", "电视柜旁边发现猫猫巡逻员。", 44, { x: 38, y: 92, w: 172, h: 126, type: "screen" }),
  makeCase("桌脚伏击", "桌脚旁边的阴影太厚，像有东西趴着。", "桌脚旁边伏击失败。", 43, { x: 760, y: 430, w: 120, h: 82, type: "table" }),
  makeCase("床尾软垫", "床尾的软垫边缘有一点白色，别被布纹骗了。", "床尾软垫交出猫猫。", 46, { x: 92, y: 432, w: 178, h: 78, type: "blanket" }),
];

const decoyPool = [
  { x: 580, y: 392, w: 176, h: 96, type: "pillow" },
  { x: 760, y: 392, w: 112, h: 104, type: "box" },
  { x: 410, y: 420, w: 150, h: 74, type: "rug" },
  { x: 116, y: 348, w: 186, h: 100, type: "sofa" },
  { x: 566, y: 392, w: 144, h: 82, type: "basket" },
  { x: 382, y: 172, w: 160, h: 118, type: "window" },
  { x: 338, y: 390, w: 150, h: 92, type: "plant" },
  { x: 648, y: 350, w: 126, h: 154, type: "cabinet" },
  { x: 118, y: 272, w: 120, h: 170, type: "lamp" },
  { x: 740, y: 386, w: 128, h: 110, type: "nest" },
];

const wallDecorPool = [
  { x: 54, y: 104, w: 168, h: 116, type: "screen" },
  { x: 286, y: 112, w: 136, h: 78, type: "shelf" },
  { x: 552, y: 112, w: 126, h: 86, type: "frame" },
  { x: 748, y: 118, w: 112, h: 118, type: "window" },
];

const floorDecorPool = [
  { x: 116, y: 348, w: 186, h: 100, type: "sofa" },
  { x: 356, y: 390, w: 142, h: 98, type: "plant" },
  { x: 802, y: 360, w: 74, h: 124, type: "scratcher" },
  { x: 250, y: 466, w: 114, h: 56, type: "toy" },
  { x: 536, y: 454, w: 112, h: 58, type: "bookpile" },
  { x: 72, y: 448, w: 112, h: 76, type: "food" },
];

let photos = fallbackPhotos;
let sessionCases = [];
let levelIndex = 0;
let found = 0;
let remaining = 45;
let focus = 100;
let isFound = false;
let hintLevel = 0;
let timerId = null;
let toastId = null;
let mouse = { x: 480, y: 320, active: false };
let audio = null;
let musicOn = false;
let musicTimer = null;
let slideIndex = 0;
let slideTimer = null;
let rewardGranted = false;
let profile = loadProfile();
saveProfile();

function makeCase(name, clue, reward, time, target) {
  return {
    name,
    clue,
    reward,
    time,
    target,
    hint: [
      "先看家具边缘，不要急着点。",
      "目标附近会有固定的小线索。",
      "现在出现的金色眼睛或白色爪印就是最后提示。",
    ],
  };
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function pickSessionCases() {
  sessionCases = shuffle(allCases).slice(0, 5).map((item) => {
    const decoys = shuffle(decoyPool)
      .filter((decoy) => !overlaps(decoy, item.target))
      .slice(0, 4);
    const occupied = [item.target, ...decoys];
    const wallDecor = shuffle(wallDecorPool)
      .filter((decor) => !occupied.some((area) => overlaps(decor, area)))
      .slice(0, 2);
    const floorDecor = shuffle(floorDecorPool)
      .filter((decor) => !occupied.some((area) => overlaps(decor, area)))
      .slice(0, 1);
    return { ...item, decoys, decorations: [...wallDecor, ...floorDecor] };
  });
}

function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function pixelRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function choosePhoto(index) {
  return photos[index % photos.length] || fallbackPhotos[0];
}

function loadProfile() {
  try {
    const stored = JSON.parse(localStorage.getItem(PROFILE_KEY));
    if (stored && stored.playerId && stored.collection) return stored;
  } catch {
    // Fall through and create a fresh local player.
  }
  const playerId = `CAT-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Date.now().toString(36).slice(-4).toUpperCase()}`;
  return { playerId, collection: {} };
}

function saveProfile() {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function getPieces(photo) {
  return Array.isArray(profile.collection[photo]) ? profile.collection[photo] : [];
}

function hasPiece(photo, piece) {
  return getPieces(photo).includes(piece);
}

function addPiece(photo, piece) {
  const pieces = new Set(getPieces(photo));
  pieces.add(piece);
  profile.collection[photo] = Array.from(pieces).sort((a, b) => a - b);
  saveProfile();
}

function piecePosition(piece) {
  return {
    col: piece % PUZZLE_GRID,
    row: Math.floor(piece / PUZZLE_GRID),
  };
}

function photoKey(photo) {
  return String(photo).split("/").pop().replace(/\.[^.]+$/, "").toLowerCase();
}

function migrateCollectionToCurrentPhotos() {
  const photoMap = new Map(photos.map((photo) => [photoKey(photo), photo]));
  const nextCollection = {};

  Object.entries(profile.collection || {}).forEach(([storedPhoto, pieces]) => {
    const normalized = photoMap.get(photoKey(storedPhoto)) || storedPhoto;
    const uniquePieces = Array.from(new Set(Array.isArray(pieces) ? pieces : [])).sort((a, b) => a - b);
    const current = new Set(Array.isArray(nextCollection[normalized]) ? nextCollection[normalized] : []);
    uniquePieces.forEach((piece) => current.add(piece));
    nextCollection[normalized] = Array.from(current).sort((a, b) => a - b);
  });

  profile.collection = nextCollection;
  saveProfile();
}

function renderPieceInto(element, photo, piece) {
  const { col, row } = piecePosition(piece);
  element.innerHTML = "";
  const img = document.createElement("img");
  img.className = "piece-face";
  img.src = photo;
  img.alt = "";
  img.draggable = false;
  img.style.width = `${PUZZLE_GRID * 100}%`;
  img.style.height = `${PUZZLE_GRID * 100}%`;
  img.style.left = `${col * -100}%`;
  img.style.top = `${row * -100}%`;
  element.appendChild(img);
}

function renderRewardPiece(photo, piece, complete = false) {
  rewardPiecePreview.innerHTML = "";
  rewardPiecePreview.classList.toggle("complete", complete);

  const full = document.createElement("img");
  full.className = "reward-piece-full";
  full.src = photo;
  full.alt = "";
  full.draggable = false;
  rewardPiecePreview.appendChild(full);

  if (!complete) {
    const spotlight = document.createElement("div");
    spotlight.className = "reward-piece-spotlight";
    renderPieceInto(spotlight, photo, piece);
    rewardPiecePreview.appendChild(spotlight);
  }
}

function openPhoto(src, alt = "猫猫照片") {
  photoModalImage.src = src;
  photoModalImage.alt = alt;
  photoModal.classList.add("show");
  photoModal.setAttribute("aria-hidden", "false");
}

async function loadPhotos() {
  try {
    const response = await fetch("api/photos");
    if (!response.ok) return;
    const data = await response.json();
    if (Array.isArray(data.photos) && data.photos.length) photos = data.photos;
    migrateCollectionToCurrentPhotos();
    if (sessionCases.length) {
      roundPhotoThumb.src = currentPhoto();
      roundPhotoThumb.alt = `${sessionCases[levelIndex].name} 的猫猫照片`;
    }
  } catch {
    photos = fallbackPhotos;
  }
}

async function recordFind(levelName) {
  try {
    await fetch("api/find", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level: levelName }),
    });
  } catch {
    // The game works offline; stats are optional.
  }
}

function drawRoom(current) {
  pixelRect(0, 0, 960, 640, palette.wall);
  for (let y = 36; y < 318; y += 42) pixelRect(0, y, 960, 4, y % 84 === 36 ? palette.wallDark : "#60705f");
  for (let x = 64; x < 920; x += 128) pixelRect(x, 0, 5, 330, "rgba(35, 42, 36, 0.24)");

  pixelRect(0, 330, 960, 310, palette.floor);
  for (let y = 354; y < 640; y += 46) {
    for (let x = y % 92 ? -24 : 22; x < 960; x += 112) {
      pixelRect(x, y, 54, 5, palette.floorDark);
      pixelRect(x + 60, y + 14, 28, 5, palette.floorLight);
    }
  }

  drawDecorations(current.decorations || []);
  pixelRect(36, 522, 888, 22, "#252b23");
  pixelRect(70, 544, 44, 58, "#131711");
  pixelRect(846, 544, 44, 58, "#131711");
}

function drawDecorations(decorations) {
  decorations.forEach((decor) => drawObject(decor, false));
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
  if (type === "screen") {
    pixelRect(x, y, w, h, "#384139");
    pixelRect(x + 14, y + 14, w - 28, h - 36, "#151c1d");
    pixelRect(x + 44, y + 40, 24, 24, palette.gold);
    pixelRect(x + 84, y + 62, 44, 9, palette.blue);
  }
  if (type === "shelf") {
    pixelRect(x, y + 16, w, h - 20, "#6a5138");
    pixelRect(x + 10, y + 32, w - 20, 8, "#3d2c21");
    pixelRect(x + 10, y + 62, w - 20, 8, "#3d2c21");
    pixelRect(x + 20, y + 4, 20, 30, "#d79b55");
    pixelRect(x + 48, y + 6, 16, 28, "#9acb76");
    pixelRect(x + 78, y + 10, 34, 22, "#6fa4c9");
  }
  if (type === "frame") {
    pixelRect(x, y, w, h, "#33413c");
    pixelRect(x + 10, y + 10, w - 20, h - 20, "#202a27");
    pixelRect(x + 24, y + 26, 28, 28, "#efb85b");
    pixelRect(x + 60, y + 42, 44, 10, "#8bd46f");
  }
  if (type === "toy") {
    pixelRect(x + 16, y + 38, 46, 24, "#d56d62");
    pixelRect(x + 56, y + 30, 28, 28, "#efb85b");
    pixelRect(x + 88, y + 42, 18, 18, "#73b7ff");
    pixelRect(x + 34, y + 18, 12, 26, "#f3eddc");
  }
  if (type === "food") {
    pixelRect(x + 10, y + 42, 46, 20, "#b7824f");
    pixelRect(x + 64, y + 42, 42, 20, "#d7d0bb");
    pixelRect(x + 22, y + 32, 20, 10, "#efb85b");
    pixelRect(x + 74, y + 32, 20, 10, "#8bd46f");
  }
  if (type === "scratcher") {
    pixelRect(x + 20, y + 10, 34, h - 20, "#b98a59");
    for (let yLine = y + 20; yLine < y + h - 12; yLine += 12) pixelRect(x + 16, yLine, 42, 4, "#755136");
    pixelRect(x + 4, y + h - 16, w - 8, 16, "#6d5a46");
  }
  if (type === "bookpile") {
    pixelRect(x + 8, y + 42, 92, 12, "#6fa4c9");
    pixelRect(x + 18, y + 28, 78, 12, "#d56d62");
    pixelRect(x + 30, y + 14, 62, 12, "#efb85b");
    pixelRect(x + 74, y + 2, 24, 18, "#9acb76");
  }

  if (isTarget && hintLevel > 0 && !isFound) drawClue(area);
}

function drawClue(area) {
  if (hintLevel >= 1) {
    pixelRect(area.x + area.w - 42, area.y + 34, 8, 8, "#d69b46");
    pixelRect(area.x + area.w - 25, area.y + 34, 5, 8, palette.ink);
  }
  if (hintLevel >= 2) {
    pixelRect(area.x + 24, area.y + area.h - 22, 24, 8, palette.white);
    pixelRect(area.x + 54, area.y + area.h - 18, 18, 6, palette.grey);
  }
}

function drawCat(area) {
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
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = palette.green;
  ctx.fillRect(mouse.x - size / 2, mouse.y - size / 2, size, size);
  ctx.globalAlpha = 0.48;
  ctx.strokeStyle = palette.green;
  ctx.lineWidth = 3;
  ctx.strokeRect(Math.round(mouse.x - size / 2), Math.round(mouse.y - size / 2), size, size);
  ctx.restore();
}

function render() {
  const current = sessionCases[levelIndex];
  if (!current) return requestAnimationFrame(render);
  drawRoom(current);
  current.decoys.forEach((item) => drawObject(item, false));
  drawObject(current.target, true);
  drawCat(current.target);
  drawScanner();
  requestAnimationFrame(render);
}

function currentPhoto() {
  return choosePhoto(levelIndex);
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

function updateHud() {
  levelText.textContent = `${levelIndex + 1} / ${sessionCases.length}`;
  timeText.textContent = String(Math.max(0, remaining));
  scoreText.textContent = String(found);
  focusText.textContent = String(Math.max(0, focus));
}

function revealCat(auto = false) {
  if (isFound) return;
  const current = sessionCases[levelIndex];
  isFound = true;
  found += 1;
  foundImage.src = currentPhoto();
  foundTitle.textContent = `${current.name} 找到啦`;
  foundNote.textContent = current.reward;
  foundCard.classList.add("show");
  foundCard.setAttribute("aria-hidden", "false");
  nextButton.disabled = false;
  nextButton.textContent = levelIndex === sessionCases.length - 1 ? "照片奖励" : "下一关";
  setToast(auto ? "时间到，猫猫自己露面了。" : "找到猫猫。");
  beep(true);
  updateHud();
  recordFind(current.name);
}

function wrongGuess(area) {
  const labels = {
    blanket: "只是布料皱褶。",
    pillow: "枕头过于无辜。",
    box: "纸箱暂时空着。",
    sofa: "沙发阴影误导了你。",
    plant: "植物保持沉默。",
    rug: "毯子没有呼噜声。",
    cabinet: "柜门线索不成立。",
    lamp: "灯下没有猫。",
    basket: "篮子里只有空气。",
    window: "窗户反光误导了你。",
    table: "桌下不是这里。",
    nest: "猫窝这次没藏猫。",
    screen: "屏幕旁边没有猫。",
  };
  focus = Math.max(0, focus - 10);
  setToast(labels[area.type] || "线索不成立。");
  beep(false);
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
  const current = sessionCases[levelIndex];
  remaining = current.time;
  focus = 100;
  hintLevel = 0;
  isFound = false;
  nextButton.disabled = true;
  nextButton.textContent = "下一关";
  foundCard.classList.remove("show");
  foundCard.setAttribute("aria-hidden", "true");
  hideFinalGallery();
  caseLabel.textContent = `Case ${String(levelIndex + 1).padStart(2, "0")}`;
  caseTitle.textContent = current.name;
  caseClue.textContent = current.clue;
  roundPhotoThumb.src = currentPhoto();
  roundPhotoThumb.alt = `${current.name} 的猫猫照片`;
  updateHud();
  setToast(current.name);
  startTimer();
}

function newGame() {
  pickSessionCases();
  found = 0;
  rewardGranted = false;
  loadLevel(0);
}

function renderSlide() {
  const src = photos[slideIndex % photos.length] || fallbackPhotos[0];
  slideImage.src = src;
  slideCaption.textContent = `No. ${String(slideIndex + 1).padStart(2, "0")} / ${photos.length}`;
}

function nextSlide(step = 1) {
  slideIndex = (slideIndex + step + photos.length) % photos.length;
  renderSlide();
}

function showFinalGallery() {
  slideIndex = 0;
  renderSlide();
  finalGallery.classList.add("show");
  finalGallery.setAttribute("aria-hidden", "false");
  rewardFanfare();
  if (!rewardGranted) {
    rewardGranted = true;
    grantPuzzlePiece();
  }
  clearInterval(slideTimer);
  slideTimer = setInterval(() => nextSlide(1), 2200);
}

function hideFinalGallery() {
  finalGallery.classList.remove("show");
  finalGallery.setAttribute("aria-hidden", "true");
  clearInterval(slideTimer);
}

function showRoundPhoto() {
  openPhoto(currentPhoto(), `${sessionCases[levelIndex].name} 的猫猫照片`);
}

function hideRoundPhoto() {
  photoModal.classList.remove("show");
  photoModal.setAttribute("aria-hidden", "true");
}

function grantPuzzlePiece() {
  const candidates = photos
    .map((photo) => ({
      photo,
      missing: Array.from({ length: PUZZLE_PIECES }, (_, piece) => piece).filter((piece) => !hasPiece(photo, piece)),
    }))
    .filter((item) => item.missing.length);

  if (!candidates.length) {
    renderRewardPiece(photos[0] || fallbackPhotos[0], 0, true);
    rewardPieceText.textContent = "你已经集齐全部猫猫拼图了。";
    showPieceReward();
    return;
  }

  const prize = candidates[Math.floor(Math.random() * candidates.length)];
  const piece = prize.missing[Math.floor(Math.random() * prize.missing.length)];
  addPiece(prize.photo, piece);
  renderRewardPiece(prize.photo, piece, false);
  rewardPieceText.textContent = `获得 ${piece + 1} / ${PUZZLE_PIECES} 号拼图，已加入你的猫猫图鉴。`;
  showPieceReward();
}

function showPieceReward() {
  pieceRewardModal.classList.add("show");
  pieceRewardModal.setAttribute("aria-hidden", "false");
}

function hidePieceReward() {
  pieceRewardModal.classList.remove("show");
  pieceRewardModal.setAttribute("aria-hidden", "true");
}

function renderCodex() {
  playerIdText.textContent = profile.playerId;
  codexGrid.innerHTML = "";
  const orderedPhotos = [...photos].sort((a, b) => getPieces(b).length - getPieces(a).length);

  orderedPhotos.forEach((photo, index) => {
    const pieces = getPieces(photo);
    const card = document.createElement("article");
    const frame = document.createElement("div");
    const preview = document.createElement("img");
    const grid = document.createElement("div");
    const meta = document.createElement("div");
    const heading = document.createElement("div");
    const title = document.createElement("strong");
    const progress = document.createElement("span");
    const status = document.createElement("p");
    const progressBar = document.createElement("div");
    const progressFill = document.createElement("i");
    const action = document.createElement("button");

    card.className = "codex-card";
    frame.className = "codex-frame";
    preview.className = "codex-photo";
    grid.className = "puzzle-grid";
    title.textContent = `Cat ${String(index + 1).padStart(2, "0")}`;
    progress.textContent = `${pieces.length} / ${PUZZLE_PIECES}`;
    status.textContent = pieces.length === PUZZLE_PIECES ? "已集齐" : pieces.length ? "收集中" : "未解锁";
    action.className = "codex-open";
    action.type = "button";
    action.textContent = pieces.length === PUZZLE_PIECES ? "查看大图" : "继续收集";
    action.disabled = pieces.length !== PUZZLE_PIECES;
    preview.src = photo;
    preview.alt = "";
    preview.draggable = false;
    progressBar.className = "codex-progress";
    progressFill.style.width = `${(pieces.length / PUZZLE_PIECES) * 100}%`;

    for (let piece = 0; piece < PUZZLE_PIECES; piece += 1) {
      const cell = document.createElement("div");
      cell.className = hasPiece(photo, piece) ? "puzzle-cell owned" : "puzzle-cell";
      if (hasPiece(photo, piece)) renderPieceInto(cell, photo, piece);
      grid.appendChild(cell);
    }

    meta.className = "codex-meta";
    heading.className = "codex-heading";
    heading.append(title, progress);
    progressBar.append(progressFill);
    meta.append(heading, status, progressBar, action);
    frame.append(preview, grid);
    card.append(frame, meta);
    if (pieces.length === PUZZLE_PIECES) {
      card.classList.add("complete");
      action.addEventListener("click", () => openPhoto(photo, `${title.textContent} 完整照片`));
    }
    codexGrid.appendChild(card);
  });
}

function showCodex() {
  renderCodex();
  codexModal.classList.add("show");
  codexModal.setAttribute("aria-hidden", "false");
}

function hideCodex() {
  codexModal.classList.remove("show");
  codexModal.setAttribute("aria-hidden", "true");
}

function ensureAudio() {
  if (audio) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const context = new AudioContext();
  const master = context.createGain();
  master.gain.value = 0.035;
  master.connect(context.destination);
  audio = { context, master, step: 0 };
}

function playTone(freq, start, duration, gainValue = 0.25) {
  if (!audio) return;
  const osc = audio.context.createOscillator();
  const gain = audio.context.createGain();
  osc.type = "triangle";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(gainValue, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.connect(gain).connect(audio.master);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function musicTick() {
  if (!audio || !musicOn) return;
  const now = audio.context.currentTime;
  const melody = [392, 523, 587, 659, 587, 523, 440, 494];
  const bass = [196, 196, 220, 247];
  playTone(melody[audio.step % melody.length], now, 0.22, 0.18);
  if (audio.step % 2 === 0) playTone(bass[(audio.step / 2) % bass.length], now, 0.32, 0.14);
  audio.step += 1;
}

function toggleMusic(forceOn = false) {
  ensureAudio();
  if (!audio) return;
  if (audio.context.state === "suspended") audio.context.resume();
  musicOn = forceOn ? true : !musicOn;
  musicButton.textContent = musicOn ? "♫" : "♪";
  clearInterval(musicTimer);
  if (musicOn) {
    musicTick();
    musicTimer = setInterval(musicTick, 360);
  }
}

function beep(success) {
  ensureAudio();
  if (!audio) return;
  if (audio.context.state === "suspended") audio.context.resume();
  playTone(success ? 880 : 220, audio.context.currentTime, 0.12, 0.32);
}

function rewardFanfare() {
  ensureAudio();
  if (!audio) return;
  if (audio.context.state === "suspended") audio.context.resume();
  const now = audio.context.currentTime;
  [523, 659, 784, 1046].forEach((freq, index) => playTone(freq, now + index * 0.11, 0.22, 0.26));
}

canvas.addEventListener("mousemove", (event) => {
  mouse = { ...canvasPoint(event), active: true };
});

canvas.addEventListener("mouseleave", () => {
  mouse.active = false;
});

canvas.addEventListener("click", (event) => {
  if (!musicOn) toggleMusic(true);
  if (isFound) return;
  const current = sessionCases[levelIndex];
  const point = canvasPoint(event);
  if (within(point, current.target)) return revealCat(false);
  const wrong = current.decoys.find((item) => within(point, item));
  if (wrong) return wrongGuess(wrong);
  focus = Math.max(0, focus - 4);
  setToast("这里没有猫猫。");
  beep(false);
  updateHud();
});

hintButton.addEventListener("click", () => {
  if (!musicOn) toggleMusic(true);
  const current = sessionCases[levelIndex];
  const text = current.hint[Math.min(hintLevel, current.hint.length - 1)];
  hintLevel = Math.min(hintLevel + 1, current.hint.length);
  focus = Math.max(10, focus - 8);
  remaining = Math.max(8, remaining - 4);
  setToast(text);
  updateHud();
});

nextButton.addEventListener("click", () => {
  if (levelIndex === sessionCases.length - 1) {
    setToast(`通关：找到 ${found} 次猫猫。`);
    showFinalGallery();
    nextButton.disabled = true;
    return;
  }
  loadLevel(levelIndex + 1);
});

resetButton.addEventListener("click", newGame);
musicButton.addEventListener("click", () => toggleMusic(false));
codexButton.addEventListener("click", showCodex);
closeGalleryButton.addEventListener("click", hideFinalGallery);
prevSlideButton.addEventListener("click", () => nextSlide(-1));
nextSlideButton.addEventListener("click", () => nextSlide(1));
roundPhotoButton.addEventListener("click", showRoundPhoto);
closePhotoButton.addEventListener("click", hideRoundPhoto);
closePieceRewardButton.addEventListener("click", hidePieceReward);
openCodexFromRewardButton.addEventListener("click", () => {
  hidePieceReward();
  showCodex();
});
closeCodexButton.addEventListener("click", hideCodex);
photoModal.addEventListener("click", (event) => {
  if (event.target === photoModal) hideRoundPhoto();
});
pieceRewardModal.addEventListener("click", (event) => {
  if (event.target === pieceRewardModal) hidePieceReward();
});
codexModal.addEventListener("click", (event) => {
  if (event.target === codexModal) hideCodex();
});

loadPhotos();
pickSessionCases();
loadLevel(0);
render();
