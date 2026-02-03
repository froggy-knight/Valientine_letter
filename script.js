// Elements
const envelope = document.getElementById("envelope-container");
const letter = document.getElementById("letter-container");
const noBtn = document.querySelector(".no-btn");
const yesBtn = document.getElementById("yes-btn");

const title = document.getElementById("letter-title");
const lunaImg = document.getElementById("luna-img");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");

const messages = ["Really?", "Think again!", "I'll cry...", "Pretty please?", "Don't break my heart!"];

// Track hover count for slice cycling
let noHoverCount = 0;
let noClickCount = 0; // Track clicks for mobile

// Detect if device is touch-enabled (mobile/tablet)
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

// --- TIMER & HEARTS LOGIC ---
let countdown;
const timerDisplay = document.getElementById('timer');
const heartContainer = document.getElementById('heart-lives');

function startTimer() {
    let seconds = 30;
    timerDisplay.classList.add('active'); // Show timer

    countdown = setInterval(() => {
        seconds--;
        timerDisplay.innerText = `TIME REMAINING: 00:${seconds < 10 ? '0' + seconds : seconds}`;

        // Remove a heart every 10 seconds
        if (seconds === 20 || seconds === 10 || seconds === 0) {
            if (heartContainer.children.length > 0) {
                heartContainer.children[0].remove();
            }
        }

        if (seconds <= 0) {
            clearInterval(countdown);
            timerDisplay.innerText = "TIME IS UP! SAY YES!";
            document.getElementById('letter-title').innerText = "TIME IS UP! 😡";
            lunaImg.src = "Slice3.png"; // Angry/Sad
        }
    }, 1000);
}

// --- FLOATING HEARTS BACKGROUND ---
function spawnHearts() {
    const container = document.getElementById('heart-bg');
    for (let i = 0; i < 15; i++) {
        const h = document.createElement('div');
        h.className = 'floating-heart';
        h.innerText = '❤';
        h.style.left = Math.random() * 100 + 'vw';
        h.style.fontSize = (Math.random() * 20 + 10) + 'px';
        h.style.animationDuration = (Math.random() * 5 + 5) + 's';
        container.appendChild(h);
        setTimeout(() => h.remove(), 10000);
    }
}
setInterval(spawnHearts, 3000);
spawnHearts();

// Click Envelope
envelope.addEventListener("click", () => {
    // 1. Add class to animate opening
    document.getElementById("envelope").classList.add("open");

    // 2. Wait for animation, then show letter
    setTimeout(() => {
        envelope.style.display = "none";
        letter.style.display = "flex";

        setTimeout(() => {
            document.querySelector(".letter-window").classList.add("open");
            startTimer(); // Start the countdown!
        }, 50);
    }, 800); // 800ms delay to let envelope open
});

// Logic to move the NO btn & Change Luna Image (Desktop - Hover)
noBtn.addEventListener("mouseover", () => {
    // Only trigger on desktop (non-touch devices)
    if (!isTouchDevice) {
        noHoverCount++;

        // Cycle through slices - these will persist
        if (noHoverCount === 1) {
            lunaImg.src = "Slice2.png"; // First hover
        } else {
            lunaImg.src = "Slice3.png"; // Second+ hover
        }

        title.textContent = messages[Math.floor(Math.random() * messages.length)];

        // Move Button - with viewport constraints for first 4 clicks
        const min = 150;
        const max = 250;

        const distance = Math.random() * (max - min) + min;
        const angle = Math.random() * Math.PI * 2;

        let moveX = Math.cos(angle) * distance;
        let moveY = Math.sin(angle) * distance;

        // Keep button in viewport for first 4 clicks
        if (noClickCount < 4) {
            const rect = noBtn.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            // Calculate new position
            const newLeft = rect.left + moveX;
            const newTop = rect.top + moveY;
            const newRight = newLeft + rect.width;
            const newBottom = newTop + rect.height;

            // Adjust if going out of bounds
            if (newLeft < 20) {
                moveX = 20 - rect.left;
            } else if (newRight > windowWidth - 20) {
                moveX = (windowWidth - 20 - rect.width) - rect.left;
            }

            if (newTop < 20) {
                moveY = 20 - rect.top;
            } else if (newBottom > windowHeight - 20) {
                moveY = (windowHeight - 20 - rect.height) - rect.top;
            }
        }

        noBtn.style.transition = "transform 0.2s ease";
        noBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
});

// No mouseout handler - let the image persist!

// Show Slice4 when hovering Yes button (this resets from sad states)
yesBtn.addEventListener("mouseover", () => {
    if (!isTouchDevice) {
        lunaImg.src = "Slice4.png";
        title.textContent = "Really ?!!"; // Reset title too
    }
});

yesBtn.addEventListener("mouseout", () => {
    if (!isTouchDevice) {
        // Only reset if not clicked yet
        if (buttons.style.display !== "none") {
            // Go back to the last "No" state or Slice1 if never hovered No
            if (noHoverCount === 0) {
                lunaImg.src = "Slice1.png";
            } else if (noHoverCount === 1) {
                lunaImg.src = "Slice2.png";
            } else {
                lunaImg.src = "Slice3.png";
            }
        }
    }
});

// Logic to make YES btn to grow
let yesScale = 1;

yesBtn.style.position = "relative"
yesBtn.style.transformOrigin = "center center";
yesBtn.style.transition = "transform 0.3s ease";

noBtn.addEventListener("click", () => {
    noClickCount++;

    // MOBILE: First 3 clicks show the slices without growing Yes button
    if (isTouchDevice && noClickCount <= 3) {
        if (noClickCount === 1) {
            lunaImg.src = "Slice2.png";
            title.textContent = "Really?";
        } else if (noClickCount === 2) {
            lunaImg.src = "Slice3.png";
            title.textContent = "Luna will be sad 🥺";
        } else if (noClickCount === 3) {
            lunaImg.src = "Slice3.png";
            title.textContent = "Why are you clicking No? 😭";
        }
        return; // Don't grow Yes button yet
    }

    // After 3 clicks on mobile OR on desktop, grow the Yes button
    yesScale += 2;

    if (yesBtn.style.position !== "fixed") {
        yesBtn.style.position = "fixed";
        yesBtn.style.top = "50%";
        yesBtn.style.left = "50%";
        yesBtn.style.transform = `translate(-50%, -50%) scale(${yesScale})`;
    } else {
        yesBtn.style.transform = `translate(-50%, -50%) scale(${yesScale})`;
    }

    // Trigger Slice3 on click
    lunaImg.src = "Slice3.png";
    title.textContent = "Why are you clicking No? 😭";
});

// --- ROSE PETAL CONFETTI ---
function spawnPetals() {
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const p = document.createElement('div');
            p.className = 'petal';
            p.style.left = Math.random() * 100 + 'vw';
            p.style.top = '-20px';
            p.style.backgroundColor = `hsl(${Math.random() * 20 + 340}, 100%, 70%)`;
            p.style.animationDuration = (Math.random() * 2 + 2) + 's';
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 5000);
        }, i * 50);
    }
}

// --- FLOATING LOVE MESSAGES ---
function spawnLoveMessages() {
    const messages = [
        "I love you too! 💕",
        "I love you too! 💕",
        "I love you too! 💕",
        "Forever! ❤️",
        "You're the best! ✨",
        "So happy! 🥰",
        "Best day ever! 💖"
    ];

    // Spawn only 1 message per click
    const msg = document.createElement('div');
    msg.className = 'love-message';
    msg.innerText = messages[Math.floor(Math.random() * messages.length)];
    msg.style.left = Math.random() * 80 + 10 + 'vw'; // 10-90% of viewport width
    msg.style.top = Math.random() * 50 + 50 + 'vh'; // Bottom half of screen
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 5000);
}

// YES is clicked
yesBtn.addEventListener("click", () => {
    clearInterval(countdown); // Stop the timer!

    // Show Slice4 first
    lunaImg.src = "Slice4.png";
    title.textContent = "Yippeeee!";

    // Spawn confetti
    spawnPetals();

    // After a short delay, switch to the dance GIF
    setTimeout(() => {
        lunaImg.src = "luna_dance.gif";
    }, 1500);

    document.querySelector(".letter-window").classList.add("final");

    buttons.style.display = "none";
    finalText.style.display = "block";

    // Setup love button after it's visible
    setTimeout(() => {
        const loveBtn = document.getElementById("love-btn");
        if (loveBtn) {
            loveBtn.addEventListener("click", () => {
                spawnPetals();
                spawnLoveMessages();
            });
        }
    }, 100);
});
