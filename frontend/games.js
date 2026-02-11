// Global toggle function for accordion
window.toggleGame = function (gameId) {
    const card = document.getElementById(gameId);

    // Check if currently active
    const isActive = card.classList.contains('active');

    // Close all other games
    document.querySelectorAll('.game-card').forEach(c => {
        c.classList.remove('active');
    });

    // Toggle current
    if (!isActive) {
        card.classList.add('active');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initFoodGame();
    initMatchGame();
    initQuizGame();
});

// --- Game 1: Food Sorter Redesign ---
function initFoodGame() {
    const foods = [
        { icon: '🍎', name: 'Apple', type: 'healthy' },
        { icon: '🍔', name: 'Burger', type: 'junk' },
        { icon: '🥦', name: 'Broccoli', type: 'healthy' },
        { icon: '🍕', name: 'Pizza', type: 'junk' },
        { icon: '🥕', name: 'Carrot', type: 'healthy' },
        { icon: '🍩', name: 'Donut', type: 'junk' },
        { icon: '🥑', name: 'Avocado', type: 'healthy' },
        { icon: '🍟', name: 'Fries', type: 'junk' }
    ];

    const source = document.getElementById('foodSource');
    const resetBtn = document.getElementById('resetFoodGame');
    const scoreBadge = document.getElementById('foodScoreBadge');
    const progressBar = document.getElementById('gameProgress');
    const comboDisplay = document.getElementById('comboDisplay');
    const modal = document.getElementById('levelCompleteModal');
    const finalScoreDisplay = document.getElementById('finalScoreDisplay');

    let score = 0;
    let streak = 0;
    let itemsLeft = foods.length;

    function renderFoods() {
        source.innerHTML = '';
        score = 0;
        streak = 0;
        itemsLeft = foods.length;

        if (scoreBadge) {
            scoreBadge.textContent = `Score: 0`;
            scoreBadge.classList.remove('hidden');
        }
        if (progressBar) progressBar.style.width = '0%';
        if (comboDisplay) comboDisplay.textContent = '';
        if (modal) modal.classList.add('hidden');

        // Shuffle
        const shuffled = [...foods].sort(() => Math.random() - 0.5);

        shuffled.forEach(food => {
            const el = document.createElement('div');
            el.className = 'food-card';
            el.draggable = true;
            el.setAttribute('data-type', food.type);
            el.innerHTML = `
                <span class="food-emoji">${food.icon}</span>
                <span class="food-name">${food.name}</span>
            `;

            // Drag Events
            el.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('type', food.type);
                setTimeout(() => el.classList.add('dragging'), 0);
            });

            el.addEventListener('dragend', () => {
                el.classList.remove('dragging');
            });

            source.appendChild(el);
        });
    }

    const baskets = document.querySelectorAll('.basket-zone');
    baskets.forEach(basket => {
        basket.addEventListener('dragover', (e) => {
            e.preventDefault();
            basket.classList.add('drag-over');
        });

        basket.addEventListener('dragleave', () => {
            basket.classList.remove('drag-over');
        });

        basket.addEventListener('drop', (e) => {
            e.preventDefault();
            basket.classList.remove('drag-over');

            const draggingEl = document.querySelector('.dragging');
            if (!draggingEl) return;

            const type = draggingEl.getAttribute('data-type');
            const targetType = basket.getAttribute('data-type');

            const rect = basket.getBoundingClientRect();

            if (type === targetType) {
                // Correct
                streak++;
                const multiplier = streak > 2 ? 1.5 : 1;
                const points = Math.floor(10 * multiplier);
                score += points;

                if (scoreBadge) scoreBadge.textContent = `Score: ${score}`;

                // Show Floating Feedback
                showFloatingText(rect.left + rect.width / 2, rect.top, `+${points}`, 'positive');

                if (streak > 1 && comboDisplay) {
                    comboDisplay.textContent = `🔥 Streak x${streak}!`;
                }

                draggingEl.remove();
                triggerConfetti(basket, 0.2);

                // Update Progress
                itemsLeft--;
                if (progressBar) {
                    const progress = ((foods.length - itemsLeft) / foods.length) * 100;
                    progressBar.style.width = `${progress}%`;
                }

                if (itemsLeft === 0) {
                    setTimeout(() => {
                        if (finalScoreDisplay) finalScoreDisplay.textContent = `Final Score: ${score}`;
                        if (modal) modal.classList.remove('hidden');
                        triggerConfetti();
                    }, 500);
                }
            } else {
                // Wrong
                streak = 0;
                if (comboDisplay) comboDisplay.textContent = '';
                score = Math.max(0, score - 5);
                if (scoreBadge) scoreBadge.textContent = `Score: ${score}`;

                showFloatingText(rect.left + rect.width / 2, rect.top, `-5`, 'negative');

                // Shake Animation
                draggingEl.animate([
                    { transform: 'translateX(0)' },
                    { transform: 'translateX(-10px)' },
                    { transform: 'translateX(10px)' },
                    { transform: 'translateX(0)' }
                ], { duration: 400 });
            }
        });
    });

    function showFloatingText(x, y, text, type) {
        const el = document.createElement('div');
        el.className = `float-feedback ${type}`;
        el.textContent = text;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 800);
    }

    if (resetBtn) resetBtn.addEventListener('click', renderFoods);
    renderFoods();
}

window.closeModal = function () {
    const modal = document.getElementById('levelCompleteModal');
    if (modal) modal.classList.add('hidden');
    // Optionally reset game
    initFoodGame();
};

// --- Game 2: Fitness Architect (Builder) ---
function initMatchGame() {
    // Defines correct zone for each exercise
    const exercises = [
        { id: 'e1', name: '🏃‍♂️ Running', zone: 'Cardio', tooltip: 'Boosts heart health' },
        { id: 'e2', name: '🧘‍♀️ Yoga', zone: 'Flexibility', tooltip: 'Improves balance' },
        { id: 'e3', name: '🏋️‍♂️ Weights', zone: 'Strength', tooltip: 'Builds muscle' },
        { id: 'e4', name: '🏊‍♂️ Swimming', zone: 'Endurance', tooltip: 'Full body stamina' },
        { id: 'e5', name: '🚴‍♂️ Cycling', zone: 'Cardio', tooltip: 'Leg strength & cardio' },
        { id: 'e6', name: '🤸‍♂️ Stretching', zone: 'Flexibility', tooltip: 'Range of motion' },
        { id: 'e7', name: '🧗‍♂️ Climbing', zone: 'Strength', tooltip: 'Grip & core strength' },
        { id: 'e8', name: '🚣‍♂️ Rowing', zone: 'Endurance', tooltip: 'Sustained power' }
    ];

    let deck = [...exercises];
    let moves = 0;
    let filledZones = { Cardio: 0, Strength: 0, Flexibility: 0, Endurance: 0 };
    const requiredPerZone = 2; // Need 2 items per zone to be "balanced"

    const deckContainer = document.getElementById('exerciseDeck');
    const resetBtn = document.getElementById('resetArchitectGame');
    const movesDisplay = document.getElementById('architectMoves');
    const balanceBar = document.getElementById('fitnessBalanceBar');
    const balanceText = document.getElementById('balanceText');
    const zones = document.querySelectorAll('.target-zone');

    function initGame() {
        deck = [...exercises].sort(() => Math.random() - 0.5); // Shuffle
        moves = 0;
        filledZones = { Cardio: 0, Strength: 0, Flexibility: 0, Endurance: 0 };

        if (movesDisplay) movesDisplay.innerText = `Moves: 0`;
        updateBalance();
        renderDeck();
        resetZones();
    }

    function renderDeck() {
        if (!deckContainer) return;
        deckContainer.innerHTML = '';

        deck.forEach(ex => {
            const card = document.createElement('div');
            card.className = 'exercise-card';
            card.draggable = true;
            card.id = ex.id;
            card.innerHTML = `
                <div style="font-size:2rem; margin-bottom:0.5rem;">${ex.name.split(' ')[0]}</div>
                <div style="font-weight:600; font-size:0.9rem;">${ex.name.split(' ').slice(1).join(' ')}</div>
                <small style="color:#666; font-size:0.75rem;">${ex.tooltip}</small>
            `;

            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify(ex));
                card.classList.add('dragging');
            });

            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
            });

            deckContainer.appendChild(card);
        });
    }

    function resetZones() {
        zones.forEach(zone => {
            zone.innerHTML = `
                <div class="zone-icon">${getZoneIcon(zone.dataset.zone)}</div>
                <span>${zone.dataset.zone}</span>
                <div class="zone-progress-ring"></div>
            `;
            zone.classList.remove('filled');

            // Re-bind events
            zone.ondragover = (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            };

            zone.ondragleave = () => {
                zone.classList.remove('drag-over');
            };

            zone.ondrop = (e) => handleDrop(e, zone);
        });
    }

    function handleDrop(e, zone) {
        e.preventDefault();
        zone.classList.remove('drag-over');

        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const targetZone = zone.dataset.zone;

        moves++;
        if (movesDisplay) movesDisplay.innerText = `Moves: ${moves}`;

        if (data.zone === targetZone) {
            // Correct
            handleCorrectDrop(zone, data);
        } else {
            // Wrong
            handleWrongDrop(zone);
        }
    }

    function handleCorrectDrop(zone, data) {
        // Remove from deck visually and data-wise
        const cardEl = document.getElementById(data.id);
        if (cardEl) cardEl.remove();
        deck = deck.filter(d => d.id !== data.id);

        // Update Zone State
        filledZones[data.zone]++;

        // Visual Feedback inside zone
        const miniCard = document.createElement('div');
        miniCard.style.cssText = 'background:rgba(255,255,255,0.8); padding:0.2rem 0.5rem; border-radius:4px; font-size:0.8rem; margin-top:0.2rem; animation:pop-in 0.3s;';
        miniCard.innerText = data.name;
        zone.appendChild(miniCard);

        // Progress Ring
        const ring = zone.querySelector('.zone-progress-ring');
        if (ring) {
            const progress = Math.min(100, (filledZones[data.zone] / requiredPerZone) * 100);
            ring.style.width = `${progress}%`;
        }

        triggerConfetti(zone, 0.1);
        updateBalance();
    }

    function handleWrongDrop(zone) {
        zone.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(0)' }
        ], { duration: 300 });

        zone.style.borderColor = 'red';
        setTimeout(() => zone.style.borderColor = '', 500);
    }

    function updateBalance() {
        if (!balanceBar || !balanceText) return;

        let totalProgress = 0;
        let zonesCompleted = 0;

        Object.keys(filledZones).forEach(z => {
            const p = Math.min(1, filledZones[z] / requiredPerZone);
            totalProgress += p;
            if (p >= 1) zonesCompleted++;
        });

        const percentage = Math.round((totalProgress / 4) * 100);
        balanceBar.style.width = `${percentage}%`;
        balanceText.innerText = `${percentage}% Balanced`;

        if (percentage >= 100) {
            balanceText.innerText = "🏆 Perfect Balance!";
            triggerConfetti();
        }
    }

    function getZoneIcon(type) {
        const icons = { 'Cardio': '🫀', 'Strength': '💪', 'Flexibility': '🧘', 'Endurance': '🔥' };
        return icons[type] || '❓';
    }

    if (resetBtn) resetBtn.onclick = initGame;

    // Start
    initGame();
}

// --- Game 3: Adventure Nutrient Quiz ---
function initQuizGame() {
    const questions = [
        { icon: '🍊', q: 'Oranges are rich in...', a: ['Vitamin C', 'Protein', 'Fat'], correct: 0 },
        { icon: '🍌', q: 'Bananas are good for...', a: ['Potassium', 'Sodium', 'Calcium'], correct: 0 },
        { icon: '🥑', q: 'Avocados contain healthy...', a: ['Fats', 'Sugar', 'Salt'], correct: 0 },
        { icon: '🥩', q: 'Steak is a primary source of...', a: ['Protein', 'Carbs', 'Fiber'], correct: 0 },
        { icon: '🥛', q: 'Milk helps build strong...', a: ['Bones', 'Eyes', 'Hair'], correct: 0 },
        { icon: '🥕', q: 'Carrots improve...', a: ['Vision', 'Hearing', 'Taste'], correct: 0 },
        { icon: '🐟', q: 'Salmon is rich in...', a: ['Omega-3', 'Sugar', 'Caffeine'], correct: 0 },
        { icon: '🥚', q: 'Eggs are a great source of...', a: ['Protein', 'Fiber', 'Sugar'], correct: 0 }
    ];

    // State
    let currentQ = 0;
    let lives = 3;
    let xp = 0;
    let level = 1;
    let timer = 10;
    let timerInterval = null;
    let isGameOver = false;

    // Elements
    const questionText = document.getElementById('questionText');
    const heroIcon = document.getElementById('quizHeroIcon');
    const optionsContainer = document.getElementById('quizOptions');
    const resetBtn = document.getElementById('resetQuizGame');
    const livesContainer = document.getElementById('quizLives');
    const timerBar = document.getElementById('quizTimerBar');
    const xpBar = document.getElementById('quizXPBar');
    const xpText = document.getElementById('xpText');
    const levelBadge = document.getElementById('levelBadge');

    // XP Milestones
    const LEVEL_2_XP = 30;
    const LEVEL_3_XP = 60;

    function startGame() {
        currentQ = 0;
        lives = 3;
        xp = 0;
        level = 1;
        isGameOver = false;
        updateUI();
        loadQuestion();
    }

    function updateUI() {
        if (livesContainer) livesContainer.textContent = '❤️'.repeat(lives);
        if (xpText) xpText.textContent = `${xp} XP`;
        if (xpBar) xpBar.style.width = `${Math.min(100, xp)}%`; // Simplified visual
        if (levelBadge) levelBadge.textContent = `Lvl ${level}`;
    }

    function startTimer() {
        clearInterval(timerInterval);
        timer = 10;
        if (timerBar) {
            timerBar.style.width = '100%';
            timerBar.style.background = 'linear-gradient(90deg, #f1c40f, #e74c3c)';
        }

        timerInterval = setInterval(() => {
            timer -= 0.1;
            if (timerBar) timerBar.style.width = `${(timer / 10) * 100}%`;

            if (timer <= 3 && timerBar) {
                // Flash effect logic could go here
                timerBar.style.background = '#ff0000';
            }

            if (timer <= 0) {
                clearInterval(timerInterval);
                handleWrong(null, true); // Time out
            }
        }, 100);
    }

    function loadQuestion() {
        if (lives <= 0) {
            endGame(false);
            return;
        }

        if (currentQ >= questions.length) {
            endGame(true);
            return;
        }

        const q = questions[currentQ];
        if (questionText) questionText.innerText = q.q;
        if (heroIcon) heroIcon.innerText = q.icon;

        // Reset animation
        if (heroIcon) {
            heroIcon.classList.remove('pop-in');
            void heroIcon.offsetWidth; // trigger reflow
            heroIcon.classList.add('pop-in');
        }

        if (optionsContainer) {
            optionsContainer.innerHTML = '';

            // Create options with correct flag
            let opts = q.a.map((opt, index) => ({ text: opt, isCorrect: index === q.correct }));

            // Shuffle options
            opts.sort(() => Math.random() - 0.5);

            opts.forEach((opt) => {
                const btn = document.createElement('div');
                btn.className = 'quiz-option';
                btn.innerText = opt.text;
                if (opt.isCorrect) btn.dataset.correct = "true";
                // Pass boolean isCorrect directly
                btn.onclick = () => handleAnswer(opt.isCorrect, btn);
                optionsContainer.appendChild(btn);
            });
        }

        startTimer();
    }

    function handleAnswer(isCorrect, btn) {
        if (isGameOver) return;
        clearInterval(timerInterval);

        // Lock options
        const allOpts = optionsContainer.children;
        for (let opt of allOpts) opt.style.pointerEvents = 'none';

        if (isCorrect) {
            // Correct
            btn.classList.add('correct');
            xp += 10;
            checkLevelUp();
            triggerConfetti(btn, 0.3);
            setTimeout(() => {
                currentQ++;
                updateUI();
                loadQuestion();
            }, 1000);
        } else {
            handleWrong(btn);
        }
    }

    function handleWrong(btn, isTimeout = false) {
        lives--;
        updateUI();

        // Shake screen
        const gameArea = document.getElementById('adventure-quiz-container');
        if (gameArea) {
            gameArea.animate([
                { transform: 'translateX(0)' },
                { transform: 'translateX(-10px)' },
                { transform: 'translateX(10px)' },
                { transform: 'translateX(0)' }
            ], { duration: 400 });
        }

        if (btn) btn.classList.add('wrong');

        // Show correct answer
        const allOpts = optionsContainer.children;
        for (let opt of allOpts) {
            if (opt.dataset.correct === "true") {
                opt.classList.add('correct');
            }
        }

        setTimeout(() => {
            currentQ++;
            loadQuestion(); // loadQuestion checks for lives <= 0
        }, 1500);
    }

    function checkLevelUp() {
        if (xp >= LEVEL_3_XP) level = 3;
        else if (xp >= LEVEL_2_XP) level = 2;
    }

    function endGame(victory) {
        isGameOver = true;
        clearInterval(timerInterval);

        const title = victory ? "🏆 Expedition Complete!" : "💀 Game Over";
        const msg = victory ? `You reached Level ${level} with ${xp} XP!` : "You ran out of lives!";

        if (questionText) questionText.innerText = title;
        if (optionsContainer) {
            optionsContainer.innerHTML = `
                <div style="text-align:center; padding:1rem;">
                    <p style="font-size:1.2rem; margin-bottom:1rem;">${msg}</p>
                    <button class="primary-btn" onclick="initQuizGame()">Play Again</button>
                </div>
            `;
        }

        if (victory) triggerConfetti();
    }

    if (resetBtn) resetBtn.onclick = startGame;

    // Start immediately
    startGame();
}

// Utility: Confetti
function triggerConfetti(element, particleCountScale = 1) {
    if (typeof confetti === 'undefined') return;

    if (element) {
        const rect = element.getBoundingClientRect();
        // Center of element
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
            origin: { x, y },
            particleCount: 30 * particleCountScale,
            spread: 40,
            ticks: 60,
            gravity: 1.5,
            colors: ['#6C63FF', '#00D2D3', '#ff9f43', '#ff6b6b']
        });
    } else {
        // Full screen
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#6C63FF', '#00D2D3', '#ff9f43', '#ff6b6b']
        });
    }
}
