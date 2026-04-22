const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");

const levelText = document.querySelector("#levelText");
const timeText = document.querySelector("#timeText");
const scoreText = document.querySelector("#scoreText");
const toast = document.querySelector("#toast");
const foundCard = document.querySelector("#foundCard");
const foundImage = document.querySelector("#foundImage");
const foundTitle = document.querySelector("#foundTitle");
const foundNote = document.querySelector("#foundNote");
const hintButton = document.querySelector("#hintButton");
const nextButton = document.querySelector("#nextButton");
const resetButton = document.querySelector("#resetButton");
const soundButton = document.querySelector("#soundButton");

const palette = {
  wall: "#56624f",
  wallDark: "#3d4638",
  floor: "#747060",
  floorDark: "#5d5b4f",
  floorLight: "#88836f",
  ink: "#161812",
  white: "#f5f0df",
  grey: "#5f6560",
  darkGrey: "#363b37",
  gold: "#f6b84b",
  pink: "#ff8fa3",
  green: "#8bd46f",
  blue: "#73b7ff",
  red: "#d65d55",
};

const levels = [
  {
    name: "枕头堡",
    time: 45,
    cat: { x: 665, y: 372, w: 84, h: 66, facing: -1 },
    hides: [
      { x: 600, y: 318, w: 196, h: 110, type: "blanket", label: "被角动了一下" },
      { x: 116, y: 348, w: 156, h: 94, type: "pillow", label: "这里只有软软的枕头" },
      { x: 782, y: 164, w: 86, h: 118, type: "box", label: "纸箱响了一声" },
    ],
    photo: "assets/cat-1.jpg",
    note: "白爪爪露出来了。",
  },
  {
    name: "沙发阴影",
    time: 42,
    cat: { x: 170, y: 415, w: 92, h: 58, facing: 1 },
    hides: [
      { x: 104, y: 386, w: 218, h: 104, type: "sofa", label: "沙发底下有金色眼睛" },
      { x: 538, y: 338, w: 116, h: 142, type: "plant", label: "叶子在摇" },
      { x: 732, y: 376, w: 128, h: 94, type: "rug", label: "毯子鼓起来了" },
    ],
    photo: "assets/cat-2.jpg",
    note: "灰脑袋从阴影里探出来。",
  },
  {
    name: "零食柜",
    time: 39,
    cat: { x: 742, y: 268, w: 78, h: 76, facing: -1 },
    hides: [
      { x: 690, y: 224, w: 174, h: 136, type: "cabinet", label: "柜门缝里有胡须" },
      { x: 98, y: 238, w: 134, h: 142, type: "lamp", label: "灯罩下面空空的" },
      { x: 362, y: 412, w: 154, h: 72, type: "basket", label: "篮子里很安静" },
    ],
    photo: "assets/cat-1.jpg",
    note: "小鼻子锁定零食柜。",
  },
  {
    name: "月亮窗台",
    time: 36,
    cat: { x: 390, y: 206, w: 98, h: 70, facing: 1 },
    hides: [
      { x: 338, y: 172, w: 210, h: 118, type: "window", label: "窗台上有一团灰白" },
      { x: 676, y: 372, w: 142, h: 92, type: "box", label: "纸箱还没入住" },
      { x: 138, y: 408, w: 138, h: 72, type: "blanket", label: "被子只是被子" },
    ],
    photo: "assets/cat-2.jpg",
    note: "月光把眼睛照成蜂蜜色。",
  },
  {
    name: "终极猫窝",
    time: 34,
    cat: { x: 478, y: 392, w: 118, h: 82, facing: -1 },
    hides: [
      { x: 420, y: 346, w: 240, h: 136, type: "nest", label: "猫窝里传来呼噜声" },
      { x: 96, y: 320, w: 132, h: 132, type: "plant", label: "植物很正经" },
      { x: 744, y: 230, w: 116, h: 146, type: "cabinet", label: "柜子今天没藏猫" },
    ],
    photo: "assets/cat-1.jpg",
    note: "今天的猫猫冠军诞生。",
  },
];

let levelIndex = 0;
let found = 0;
let remaining = levels[0].time;
let isFound = false;
let muted = false;
let timerId = null;
let toastId = null;
let pulse = 0;

function pixelRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function drawRoom(level) {
  pixelRect(0, 0, 960, 640, palette.wall);
  for (let y = 0; y < 330; y += 32) {
    pixelRect(0, y, 960, 4, y % 64 === 0 ? palette.wallDark : "#64715b");
  }

  pixelRect(0, 330, 960, 310, palette.floor);
  for (let y = 344; y < 640; y += 34) {
    for (let x = (y / 34) % 2 ? -42 : 0; x < 960; x += 84) {
      pixelRect(x, y, 56, 5, palette.floorDark);
      pixelRect(x + 58, y + 12, 28, 5, palette.floorLight);
    }
  }

  pixelRect(36, 92, 166, 126, "#3b4237");
  pixelRect(48, 104, 142, 90, "#171c1b");
  pixelRect(76, 130, 24, 24, palette.gold);
  pixelRect(108, 154, 48, 10, palette.blue);

  pixelRect(756, 66, 128, 136, "#6f583e");
  pixelRect(772, 82, 96, 96, "#e77e34");
  pixelRect(790, 102, 14, 14, palette.green);
  pixelRect(838, 130, 14, 14, palette.blue);

  pixelRect(36, 522, 888, 22, "#272e25");
  pixelRect(70, 544, 44, 58, "#151812");
  pixelRect(846, 544, 44, 58, "#151812");

  level.hides.forEach(drawHide);
}

function drawHide(hide) {
  const { x, y, w, h } = hide;
  if (hide.type === "blanket") {
    pixelRect(x, y + 42, w, h - 28, "#233047");
    pixelRect(x + 12, y + 26, w - 24, 34, "#31405f");
    for (let i = 0; i < w; i += 28) pixelRect(x + i, y + 50, 16, 7, "#1b2538");
  }
  if (hide.type === "pillow") {
    pixelRect(x, y + 18, w, h - 26, "#ece9db");
    pixelRect(x + 14, y, w - 28, h - 30, "#fff8e8");
    pixelRect(x + w - 34, y + h - 40, 20, 10, "#d8d4c7");
  }
  if (hide.type === "box") {
    pixelRect(x, y + 18, w, h - 18, "#b06d36");
    pixelRect(x + 12, y, w - 24, 32, "#d9823b");
    pixelRect(x + 22, y + 42, w - 44, 12, "#6b3d23");
  }
  if (hide.type === "sofa") {
    pixelRect(x, y + 26, w, h - 26, "#35423a");
    pixelRect(x + 18, y, w - 36, 54, "#435246");
    pixelRect(x + 18, y + h - 20, 28, 38, "#191d17");
    pixelRect(x + w - 48, y + h - 20, 28, 38, "#191d17");
  }
  if (hide.type === "plant") {
    pixelRect(x + w * 0.35, y + h - 52, w * 0.3, 52, "#7b5136");
    pixelRect(x + w * 0.3, y + h - 22, w * 0.4, 22, "#a15f3e");
    pixelRect(x + 22, y + 36, 42, 52, "#5c9b54");
    pixelRect(x + w - 70, y + 12, 48, 78, "#6fb55f");
    pixelRect(x + w * 0.45, y, 36, 92, "#7ecf6f");
  }
  if (hide.type === "rug") {
    pixelRect(x, y + 26, w, h - 30, "#9a4c5f");
    pixelRect(x + 18, y + 8, w - 36, h - 24, "#c15f72");
    pixelRect(x + 36, y + 34, w - 72, 10, "#ffd27a");
  }
  if (hide.type === "cabinet") {
    pixelRect(x, y, w, h, "#6b5137");
    pixelRect(x + 12, y + 14, w / 2 - 18, h - 28, "#806244");
    pixelRect(x + w / 2 + 6, y + 14, w / 2 - 18, h - 28, "#806244");
    pixelRect(x + w / 2 - 8, y + h / 2, 8, 8, palette.gold);
    pixelRect(x + w / 2 + 8, y + h / 2, 8, 8, palette.gold);
  }
  if (hide.type === "lamp") {
    pixelRect(x + w / 2 - 8, y + 48, 16, h - 48, "#403a34");
    pixelRect(x + 22, y, w - 44, 62, "#ffcf72");
    pixelRect(x + 10, y + 50, w - 20, 16, "#d09045");
  }
  if (hide.type === "basket") {
    pixelRect(x, y + 26, w, h - 26, "#9f7248");
    for (let i = 8; i < w; i += 22) pixelRect(x + i, y + 32, 8, h - 34, "#6d4c33");
    pixelRect(x + 26, y, w - 52, 28, "#c08b5c");
  }
  if (hide.type === "window") {
    pixelRect(x, y, w, h, "#26313c");
    pixelRect(x + 10, y + 10, w - 20, h - 28, "#111820");
    pixelRect(x + w / 2 - 3, y + 10, 6, h - 28, "#4d6274");
    pixelRect(x + 10, y + h / 2, w - 20, 5, "#4d6274");
    pixelRect(x + 22, y + 24, 28, 28, palette.gold);
  }
  if (hide.type === "nest") {
    pixelRect(x + 24, y + 38, w - 48, h - 34, "#6d5a46");
    pixelRect(x, y + 64, w, h - 58, "#9c7954");
    pixelRect(x + 48, y + 24, w - 96, 56, "#d5b06d");
  }
}

function drawCat(cat, reveal = false) {
  const { x, y, w, h, facing } = cat;
  const bob = Math.sin(pulse / 18) * 2;
  const headX = x + (facing > 0 ? 0 : w - 54);
  const bodyX = x + (facing > 0 ? 36 : 0);

  if (!reveal) {
    pixelRect(headX + 14, y + 22 + bob, 36, 26, palette.darkGrey);
    pixelRect(headX + 20, y + 32 + bob, 14, 10, palette.gold);
    pixelRect(headX + 37, y + 32 + bob, 6, 10, palette.ink);
    return;
  }

  pixelRect(bodyX, y + 24 + bob, w - 32, h - 26, palette.grey);
  pixelRect(bodyX + 8, y + h - 18 + bob, 28, 18, palette.white);
  pixelRect(bodyX + w - 70, y + h - 18 + bob, 30, 18, palette.white);
  pixelRect(headX, y + 8 + bob, 58, 46, palette.grey);
  pixelRect(headX + 6, y + 2 + bob, 14, 18, palette.grey);
  pixelRect(headX + 38, y + 2 + bob, 14, 18, palette.grey);
  pixelRect(headX + 16, y + 26 + bob, 30, 24, palette.white);
  pixelRect(headX + 10, y + 25 + bob, 12, 12, palette.gold);
  pixelRect(headX + 38, y + 25 + bob, 12, 12, palette.gold);
  pixelRect(headX + 16, y + 28 + bob, 6, 10, palette.ink);
  pixelRect(headX + 44, y + 28 + bob, 6, 10, palette.ink);
  pixelRect(headX + 28, y + 38 + bob, 10, 8, palette.pink);
  pixelRect(headX + 4, y + 42 + bob, 22, 3, palette.white);
  pixelRect(headX + 38, y + 42 + bob, 22, 3, palette.white);
}

function drawCursorHint(level) {
  if (!isFound) return;
  const cat = level.cat;
  pixelRect(cat.x - 12, cat.y - 16, cat.w + 24, 4, palette.green);
  pixelRect(cat.x - 12, cat.y - 16, 4, 22, palette.green);
  pixelRect(cat.x + cat.w + 8, cat.y - 16, 4, 22, palette.green);
}

function render() {
  const level = levels[levelIndex];
  drawRoom(level);
  drawCat(level.cat, isFound);
  drawCursorHint(level);
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
  toastId = setTimeout(() => toast.classList.remove("show"), 1700);
}

function chirp(success = false) {
  if (muted) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const audio = new AudioContext();
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "square";
  osc.frequency.value = success ? 740 : 260;
  gain.gain.setValueAtTime(0.05, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.14);
  osc.connect(gain).connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + 0.15);
}

function updateHud() {
  levelText.textContent = `${levelIndex + 1} / ${levels.length}`;
  timeText.textContent = String(Math.max(0, remaining));
  scoreText.textContent = String(found);
}

function revealCat() {
  if (isFound) return;
  const level = levels[levelIndex];
  isFound = true;
  found += 1;
  foundImage.src = level.photo;
  foundTitle.textContent = `${level.name} 找到啦`;
  foundNote.textContent = level.note;
  foundCard.classList.add("show");
  foundCard.setAttribute("aria-hidden", "false");
  nextButton.disabled = false;
  setToast("喵！抓到这只灰白小猫了。");
  chirp(true);
  updateHud();
}

function startTimer() {
  clearInterval(timerId);
  timerId = setInterval(() => {
    if (isFound) return;
    remaining -= 1;
    if (remaining <= 0) {
      remaining = 0;
      revealCat();
      setToast("猫猫等不及，自己出现了。");
    }
    updateHud();
  }, 1000);
}

function loadLevel(index) {
  levelIndex = index;
  remaining = levels[levelIndex].time;
  isFound = false;
  nextButton.disabled = true;
  foundCard.classList.remove("show");
  foundCard.setAttribute("aria-hidden", "true");
  updateHud();
  setToast(levels[levelIndex].name);
  startTimer();
}

canvas.addEventListener("click", (event) => {
  if (isFound) return;
  const level = levels[levelIndex];
  const point = canvasPoint(event);
  const target = level.hides.find((hide) => within(point, hide));
  if (!target) {
    setToast("这里没有猫猫，只有空气。");
    chirp(false);
    return;
  }
  setToast(target.label);
  chirp(target === level.hides[0]);
  if (target === level.hides[0]) revealCat();
});

hintButton.addEventListener("click", () => {
  const level = levels[levelIndex];
  const target = level.hides[0];
  setToast(`提示：${target.label}`);
  remaining = Math.max(5, remaining - 5);
  updateHud();
});

nextButton.addEventListener("click", () => {
  if (levelIndex === levels.length - 1) {
    setToast(`通关！一共找到 ${found} 次猫猫。`);
    nextButton.disabled = true;
    return;
  }
  loadLevel(levelIndex + 1);
});

resetButton.addEventListener("click", () => {
  found = 0;
  loadLevel(0);
});

soundButton.addEventListener("click", () => {
  muted = !muted;
  soundButton.textContent = muted ? "×" : "♪";
  setToast(muted ? "静音" : "声音打开");
});

loadLevel(0);
render();
