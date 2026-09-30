const entry = document.getElementById("entry");
const main = document.getElementById("main");
const transition = document.getElementById("transition");
const enterBtn = document.getElementById("enterBtn");
const plusBtn = document.getElementById("plusBtn");
const menu = document.getElementById("menu");
const player = document.getElementById("player");
const panels = {
  aboutPanel: document.getElementById("aboutPanel"),
  friendsPanel: document.getElementById("friendsPanel")
};

let menuOpen = false;

enterBtn.addEventListener("click", async () => {
  transition.classList.remove("play");
  void transition.offsetWidth;
  transition.classList.add("play");

  entry.style.transition = "opacity .7s ease";
  entry.style.opacity = "0";
  entry.style.pointerEvents = "none";

  setTimeout(() => {
    main.classList.add("show");
  }, 360);

  /* La pulsación de PRESS permite intentar el autoplay. */
  try {
    await player.play();
    playBtn.textContent = "Ⅱ";
  } catch(e) {
    playBtn.textContent = "▶";
  }

  setTimeout(() => {
    entry.style.display = "none";
  }, 900);
});

plusBtn.addEventListener("click", () => {
  menuOpen = !menuOpen;
  menu.classList.toggle("open", menuOpen);
  plusBtn.classList.toggle("active", menuOpen);
  plusBtn.textContent = menuOpen ? "−" : "+";
});

const playBtn = document.getElementById("playBtn");
const progress = document.querySelector(".progress");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

function fmtTime(seconds){
  if(!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2,"0");
  return `${m}:${s}`;
}

playBtn.addEventListener("click", async () => {
  if(player.paused){
    try{
      await player.play();
      playBtn.textContent = "Ⅱ";
    }catch(e){}
  }else{
    player.pause();
    playBtn.textContent = "▶";
  }
});

player.addEventListener("loadedmetadata", () => {
  durationEl.textContent = fmtTime(player.duration);
});

player.addEventListener("timeupdate", () => {
  currentTimeEl.textContent = fmtTime(player.currentTime);
  const pct = player.duration ? (player.currentTime / player.duration) * 100 : 0;
  progressBar.style.width = `${pct}%`;
});

player.addEventListener("play", () => playBtn.textContent = "Ⅱ");
player.addEventListener("pause", () => playBtn.textContent = "▶");

progress.addEventListener("click", (event) => {
  if(!Number.isFinite(player.duration) || player.duration <= 0) return;
  const rect = progress.getBoundingClientRect();
  const pct = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  player.currentTime = pct * player.duration;
});

menu.querySelectorAll("button").forEach(button => {
  button.addEventListener("click", () => {
    menu.querySelectorAll("button").forEach(b => b.classList.remove("active"));
    button.classList.add("active");

    Object.values(panels).forEach(panel => panel.classList.remove("open"));

    const target = button.dataset.panel;

    if(target === "backAction"){
      main.classList.remove("show");
      entry.style.display = "grid";
      requestAnimationFrame(() => {
        entry.style.opacity = "1";
        entry.style.pointerEvents = "auto";
      });
      menuOpen = false;
      menu.classList.remove("open");
      plusBtn.classList.remove("active");
      plusBtn.textContent = "+";
      player.pause();
      return;
    }

    panels[target].classList.add("open");
  });
});
