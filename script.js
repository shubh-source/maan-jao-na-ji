// --- Web Audio API for Cute Sound Effects ---
let audioCtx;
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playPop() {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

function playSqueak() {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, audioCtx.currentTime + 0.15);
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
}

function playYay() {
    initAudio();
    const frequencies = [440, 554.37, 659.25, 880]; // Happy A Major chord
    frequencies.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime + (index * 0.1));
        gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05 + (index * 0.1));
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5 + (index * 0.1));
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + (index * 0.1));
        osc.stop(audioCtx.currentTime + 0.5 + (index * 0.1));
    });
}

// --- Page Navigation & Logic ---
function nextPage(currentId, nextId) {
    playPop();
    
    document.getElementById(currentId).classList.remove('active');
    document.getElementById(nextId).classList.add('active');
    
    // Play the local background music on the first click!
    const bgMusic = document.getElementById('bg-music');
    if (bgMusic && bgMusic.paused) {
        bgMusic.currentTime = 10; // Skip first 10 seconds as requested
        bgMusic.play().catch(e => console.log('Autoplay blocked:', e));
    }
}

const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

// Make the "No" button run away when she tries to hover or click it (on Page 3)
if (noBtn) {
    noBtn.addEventListener('mouseover', moveHover);
    noBtn.addEventListener('click', moveHover);
}

function moveHover() {
    playSqueak();
    
    const btnRect = noBtn.getBoundingClientRect();
    
    const maxX = window.innerWidth - btnRect.width;
    const maxY = window.innerHeight - btnRect.height;
    
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
}

// When she finally clicks "Yes", move to the Happy Ending page (Page 7)
if (yesBtn) {
    yesBtn.addEventListener('click', () => {
        playYay();
        nextPage('page6', 'page7');
        
        // Trigger amazing Confetti Effect! 🎉
        var duration = 3 * 1000;
        var end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ff0000', '#ff69b4', '#ff1493']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ff0000', '#ff69b4', '#ff1493']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    });
}

// --- Floating Hearts Effect ---
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    
    // Choose a random heart emoji using Unicode escapes to avoid encoding issues
    const hearts = ['\u2764\uFE0F', '\ud83d\udc96', '\ud83d\udc95', '\ud83d\udc97', '\ud83d\udc93'];
    heart.innerText = hearts[Math.floor(Math.random() * hearts.length)];
    
    // Randomize position and animation duration
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 3 + 4 + 's'; // 4 to 7 seconds fall time
    heart.style.fontSize = Math.random() * 1 + 1 + 'rem'; // 1rem to 2rem size
    
    document.body.appendChild(heart);
    
    // Remove heart after it falls down (8 seconds to be safe)
    setTimeout(() => {
        heart.remove();
    }, 8000);
}

// Create a new heart every 400 milliseconds
setInterval(createHeart, 400);
