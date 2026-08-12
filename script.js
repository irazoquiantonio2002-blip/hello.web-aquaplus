const body = document.body;
const loader = document.getElementById("loader");
const nav = document.getElementById("nav");
const ham = document.getElementById("ham");
const mob = document.getElementById("mob");
const twText = document.getElementById("twText");
const form = document.getElementById("cForm");

body.classList.add("is-loading");

window.addEventListener("load", () => {
  window.setTimeout(() => {
    loader.classList.add("loaded");
    body.classList.remove("is-loading");
  }, 2200);
});

const setNavState = () => {
  nav.classList.toggle("scrolled", window.scrollY > 18);
};

setNavState();
window.addEventListener("scroll", setNavState, { passive: true });

ham.addEventListener("click", () => {
  const isOpen = mob.classList.toggle("open");
  ham.classList.toggle("active", isOpen);
  ham.setAttribute("aria-expanded", String(isOpen));
});

mob.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mob.classList.remove("open");
    ham.classList.remove("active");
    ham.setAttribute("aria-expanded", "false");
  });
});

const lines = [
  "PPR para agua caliente",
  "CPVC y conexiones",
  "PVC sanitario e hidráulico",
  "Cobre para gas y agua"
];

let lineIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  if (!twText) return;

  const current = lines[lineIndex];
  twText.textContent = current.slice(0, charIndex);

  if (!deleting && charIndex < current.length) {
    charIndex += 1;
    window.setTimeout(typeLoop, 56);
    return;
  }

  if (!deleting && charIndex === current.length) {
    deleting = true;
    window.setTimeout(typeLoop, 1350);
    return;
  }

  if (deleting && charIndex > 0) {
    charIndex -= 1;
    window.setTimeout(typeLoop, 30);
    return;
  }

  deleting = false;
  lineIndex = (lineIndex + 1) % lines.length;
  window.setTimeout(typeLoop, 220);
}

typeLoop();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".rev").forEach((el) => revealObserver.observe(el));

function animateNumber(el) {
  const end = Number(el.dataset.count || "0");
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const duration = 1250;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(end * eased);
    el.textContent = `${prefix}${value}${suffix}`;
    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateNumber(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.45 });

document.querySelectorAll("[data-count]").forEach((el) => counterObserver.observe(el));

const parallaxTargets = document.querySelectorAll(".hero-bg, .why-bg, .numbers-bg, .contact-info-bg");

function parallax() {
  const scroll = window.scrollY;
  parallaxTargets.forEach((el, index) => {
    const speed = index === 0 ? 0.08 : 0.045;
    el.style.transform = `translate3d(0, ${scroll * speed}px, 0) scale(1.08)`;
  });
}

window.addEventListener("scroll", () => requestAnimationFrame(parallax), { passive: true });
parallax();

function createParticles(canvasId, palette) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let particles = [];
  let rafId = 0;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.max(22, Math.floor(width / 34));
    particles = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.2 + .7,
      vx: (Math.random() - .5) * .28,
      vy: (Math.random() - .5) * .28,
      color: palette[i % palette.length]
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j += 1) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 118) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(159, 232, 255, ${1 - dist / 118})`;
          ctx.lineWidth = .45;
          ctx.stroke();
        }
      }
    });

    rafId = requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener("resize", resize);

  return () => cancelAnimationFrame(rafId);
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  createParticles("pcanvas", ["rgba(112,255,216,.88)", "rgba(47,183,255,.72)", "rgba(255,255,255,.6)"]);
  createParticles("pcanvasWhy", ["rgba(112,255,216,.7)", "rgba(47,183,255,.55)", "rgba(185,106,60,.55)"]);
  createParticles("pcanvasNumbers", ["rgba(112,255,216,.75)", "rgba(47,183,255,.5)", "rgba(255,255,255,.46)"]);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const required = [...form.querySelectorAll("[required]")];
  let valid = true;

  required.forEach((field) => {
    const ok = field.value.trim().length > 0;
    field.classList.toggle("error", !ok);
    if (!ok) valid = false;
  });

  if (!valid) return;

  const data = new FormData(form);
  const message = [
    "Hola, quiero solicitar una cotización de Aquaplus.",
    `Nombre: ${data.get("nombre")}`,
    `Teléfono: ${data.get("telefono")}`,
    `Producto de interés: ${data.get("producto")}`,
    `Detalle: ${data.get("mensaje") || "Sin detalle adicional"}`
  ].join("\n");

  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
});
