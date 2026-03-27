// ── Decoration config ──
// src: 图片路径
// top/left: 相对于头像容器的位置（百分比，可以是负数）
// width: 贴纸宽度（相对于头像容器）
// behind: true = 在头像后面，false/省略 = 在头像前面
const DECORATIONS = [
  { src: 'public/badges/1.png',  top: '-50%', left: '0%',   width: '100%', behind: true },
  { src: 'public/badges/2.png',  top: '-53%', left: '-16%', width: '100%', behind: false },
  { src: 'public/badges/3.png',  top: '-35%', left: '50%',  width: '80%',  behind: true },
  { src: 'public/badges/4.png',  top: '-50%', left: '0%',   width: '100%', behind: false },
  { src: 'public/badges/5.png',  top: '-23%', left: '-6%',  width: '100%', behind: false },
  { src: 'public/badges/6.png',  top: '-28%', left: '-12%', width: '80%',  behind: false },
  { src: 'public/badges/7.png',  top: '45%',  left: '54%',  width: '80%',  behind: true },
  { src: 'public/badges/8.png',  top: '36%',  left: '60%',  width: '80%',  behind: true },
  { src: 'public/badges/9.png',  top: '-35%', left: '-16%', width: '150%', behind: false },
  { src: 'public/badges/10.png', top: '29%',  left: '-25%', width: '100%', behind: false },
  { src: 'public/badges/11.png', top: '25%',  left: '34%',  width: '100%', behind: true,
    extra: { top: '25%', left: '-34%', width: '100%', behind: true, flipX: true } },
  { src: 'public/badges/12.png', top: '15%',  left: '34%',  width: '100%', behind: false },
  { src: 'public/badges/13.png', top: '45%',  left: '0%',   width: '100%', behind: false },
  { src: 'public/badges/14.png', top: '13%',  left: '23%',  width: '90%',  behind: false },
  { src: 'public/badges/15.png', top: '2%',   left: '-1%',  width: '70%',  behind: false },
  { src: 'public/badges/16.png', top: '-48%', left: '-60%', width: '140%', behind: false },
];

// ── State ──
let currentIndex = -1; // -1 = no decoration selected

// ── DOM refs ──
const avatarContainer = document.getElementById('avatar-wrapper');
const grid = document.getElementById('deco-grid');

// ── Build decoration grid ──
DECORATIONS.forEach((deco, i) => {
  const el = document.createElement('div');
  el.className = 'deco-item';

  const img = document.createElement('img');
  img.src = deco.src;
  img.alt = `decoration ${i + 1}`;
  el.appendChild(img);

  el.addEventListener('click', () => selectDecoration(i));
  grid.appendChild(el);
});

// ── Apply decoration to avatar ──
function makeSticker(cfg, animate) {
  const el = document.createElement('img');
  el.src = cfg.src;
  el.className = 'avatar-sticker'
    + (cfg.flipX ? ' flipped' : '')
    + (animate ? ' slide-in' : '');
  el.style.top    = cfg.top;
  el.style.left   = cfg.left;
  el.style.width  = cfg.width;
  el.style.zIndex = cfg.behind ? '0' : '2';
  return el;
}

function applySticker(index, animate = true) {
  // Remove all existing stickers
  avatarContainer.querySelectorAll('.avatar-sticker').forEach(el => el.remove());

  if (index === -1) return;

  const deco = DECORATIONS[index];
  avatarContainer.appendChild(makeSticker(deco, animate));

  // Render extra sticker if defined
  if (deco.extra) {
    const extraCfg = { src: deco.src, ...deco.extra };
    avatarContainer.appendChild(makeSticker(extraCfg, animate));
  }
}

// ── Select a decoration (from grid click or arrow button) ──
function selectDecoration(index) {
  // Deselect previous grid item
  if (currentIndex !== -1) {
    grid.children[currentIndex].classList.remove('selected');
  }

  if (currentIndex === index) {
    // Clicking same item deselects
    currentIndex = -1;
    applySticker(-1);
    return;
  }

  currentIndex = index;
  grid.children[currentIndex].classList.add('selected');
  applySticker(currentIndex, true);
}

// ── Arrow buttons: cycle through decorations ──
document.getElementById('btn-next').addEventListener('click', () => {
  const next = (currentIndex + 1) % DECORATIONS.length;
  selectDecoration(next);
});

document.getElementById('btn-prev').addEventListener('click', () => {
  const prev = (currentIndex - 1 + DECORATIONS.length) % DECORATIONS.length;
  selectDecoration(prev);
});

// ── Reset ──
document.getElementById('btn-reset').addEventListener('click', () => {
  if (currentIndex !== -1) {
    grid.children[currentIndex].classList.remove('selected');
    currentIndex = -1;
    applySticker(-1);
  }
});

// ── Done ──
let tooltipTimer = null;
document.getElementById('btn-done').addEventListener('click', () => {
  const card = document.querySelector('.card');
  card.style.transition = 'transform 0.12s';
  card.style.transform = 'scale(0.975)';
  setTimeout(() => { card.style.transform = ''; }, 130);

  const tooltip = document.getElementById('tooltip');
  tooltip.classList.add('show');
  clearTimeout(tooltipTimer);
  tooltipTimer = setTimeout(() => { tooltip.classList.remove('show'); }, 3000);
});
