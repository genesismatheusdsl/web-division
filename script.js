// Rolagem suave para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// Fundo animado de partículas (IA)
const canvas = document.getElementById('ai-background');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = 200;

const particles = [];
const particleCount = 100;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 2 + 1;
    this.vx = (Math.random() - 0.5) * 1;
    this.vy = (Math.random() - 0.5) * 1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = '#f7c600';
    ctx.fill();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if(this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if(this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
}

// Criar partículas
for(let i=0; i<particleCount; i++){
  particles.push(new Particle());
}

function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  
  // Desenha partículas
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  // Conecta partículas próximas
  for(let i=0; i<particles.length; i++){
    for(let j=i+1; j<particles.length; j++){
      let dx = particles[i].x - particles[j].x;
      let dy = particles[i].y - particles[j].y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < 100){
        ctx.beginPath();
        ctx.strokeStyle = `rgba(247,198,0,${1-dist/100})`;
        ctx.lineWidth = 1;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animate);
}

animate();

// Atualizar canvas ao redimensionar
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = 200;
});
