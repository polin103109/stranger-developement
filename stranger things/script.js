const images = [
    'images/will.png',
    'images/eleven.png',
    'images/jonathon.png',
    'images/mike.png',
    'images/lucas.png',
    'images/max.png',
    'images/dustin.png',
    'images/steve.png',
];



const carousel = document.querySelector('.carousel');
const cards = document.querySelectorAll('.card');
const bgLayers = [document.getElementById('bg1'),document.getElementById('bg2')];

const total = cards.length;
const radius = 380;
const angleStep = 360/ total;
let currentBgIndex = 0;

cards.forEach((card,i)=> {
    const theta = angleStep * i;
    card.style.transform = `rotateY(${theta}deg) translateZ(${radius}px)`;
})

bgLayers[0].style.backgroundImage = `url(${images[0]})`;

let currentAngle = 0;
let tragetAngle = 0;
let isDragging = false;
let startX = 0;
let startAngle = 0;
let isHovering = false;
let lastActiveIndex = -1;

function lerp(start,end,factor){
    return start + (end - start) * factor;

}
function animate (){
    if(isDragging){
        currentAngle = tragetAngle;
    } else if(isHovering){
        currentAngle = lerp(currentAngle,tragetAngle,0.1)
    } else {
        tragetAngle -= 0.2;
        currentAngle = lerp(currentAngle, tragetAngle, 0.1)
    }

    carousel.style.transform = `rotateY(${currentAngle}deg)`;
    updateActiveCard();
    requestAnimationFrame(animate);
}

animate();
cards.forEach(card => {

  card.addEventListener('mouseenter',()=> {
    if(card.style.pointerEvents === 'none') return;

    isHovering = true;
    const index = parseInt(card.dataset.index);
    const cardAngle = index * angleStep;

    const currentRest = tragetAngle;
    const baseTarget = -cardAngle;

    const rounds = Math.round((currentRest - baseTarget)/ 360);
    tragetAngle = baseTarget + (rounds * 360);
  });
  card.addEventListener('mouseleave',()=> {
    isHovering = false;
  });


  });

   document.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.clientX;
    startAngle = tragetAngle;
    document.body.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', e => {
    if(!isDragging) return;
    const delta = e.clientx - startX;
    tragetAngle = startAngle + (delta * 0.5);
  });

  document.addEventListener('mouseup', e => {
    isDragging= false;
    document.body.style.cursor = 'default';
  });

  function updateActiveCard (){
    const normalizedAngle = ((-currentAngle % 360) + 360) % 360;
    const activeIndex = Math.round(normalizedAngle / angleStep) % total;
    if(activeIndex !== lastActiveIndex){
        lastActiveIndex = activeIndex;
        changeBackground(activeIndex);
    }

    cards.forEach((card,index) => {

        let distance = Math.abs(index - activeIndex);
        if(distance > total / 2) distance = total - distance;
        if(index === activeIndex) {
            card.classList.add('active');
            card.style.transform = `rotateY(${index * angleStep}deg) translateZ(${radius}px)`;
            card.style.opacity = 1;
            card.style.pointerEvents = 'auto';

        }
        else if( distance <= 1) {
           card.classList.remove('active');
            card.style.transform = `rotateY(${index * angleStep}deg) translateZ(${radius}px)`;
            card.style.opacity = 0.8;
            card.style.pointerEvents = 'auto';

        }
        else {
             card.classList.remove('active');
            card.style.transform = `rotateY(${index * angleStep}deg) translateZ(${radius}px)`;
            card.style.opacity = 0.1;
            card.style.pointerEvents = 'none';

        }
    });
  }

  function changeBackground(index) {
    const nextLayerIndex = (currentBgIndex + 1) % 2;
    const nextLayer = bgLayers[nextLayerIndex];
    const currentLayer = bgLayers[currentBgIndex];

    nextLayer.style.backgroundImage = `url(${images[0]})`;
    nextLayer.classList.add('visible');
    currentLayer.classList.remove('visible');
    currentBgIndex = nextLayerIndex;
  }




