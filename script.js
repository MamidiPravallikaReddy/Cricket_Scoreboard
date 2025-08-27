// Game state
const gameState = {
    teamScore: 0,
    wickets: 0,
    balls: 0,
    overs: 0,
    rahulScore: 0,
    rohitScore: 0,
    striker: 'rahul', // rahul or rohit
    freeHit: false,
    isGameOver: false
};

// DOM elements
const teamScoreElement = document.getElementById('team-score');
const oversElement = document.getElementById('overs');
const rahulScoreElement = document.getElementById('rahul-score');
const rohitScoreElement = document.getElementById('rohit-score');
const rahulStrikeElement = document.getElementById('rahul-strike');
const rohitStrikeElement = document.getElementById('rohit-strike');
const statusMessageElement = document.getElementById('status-message');
const freeHitIndicator = document.getElementById('free-hit-indicator');
const resetButton = document.getElementById('reset-btn');
const switchStrikerButton = document.getElementById('switch-striker-btn');
const freeHitButton = document.getElementById('free-hit-btn');

// Initialize the game
function initGame() {
    updateScoreboard();
    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    // Run buttons
    document.querySelectorAll('.run-btn').forEach(button => {
        button.addEventListener('click', function() {
            const runs = parseInt(this.getAttribute('data-runs'));
            addRuns(runs);
        });
    });

    // Extra buttons
    document.querySelectorAll('.extra-btn').forEach(button => {
        button.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            handleExtra(type);
        });
    });

    // Wicket buttons
    document.querySelectorAll('.wicket-btn').forEach(button => {
        button.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            handleWicket(type);
        });
    });

    // Special buttons
    freeHitButton.addEventListener('click', handleFreeHit);
    switchStrikerButton.addEventListener('click', switchStriker);
    resetButton.addEventListener('click', resetGame);
}

// Update the scoreboard display
function updateScoreboard() {
    teamScoreElement.textContent = `${gameState.teamScore}/${gameState.wickets}`;
    oversElement.textContent = `${gameState.overs}.${gameState.balls}`;
    rahulScoreElement.textContent = gameState.rahulScore;
    rohitScoreElement.textContent = gameState.rohitScore;
    
    // Update striker indicator
    if (gameState.striker === 'rahul') {
        rahulStrikeElement.textContent = '*';
        rohitStrikeElement.textContent = '';
        document.getElementById('rahul').classList.add('strike');
        document.getElementById('rohit').classList.remove('strike');
    } else {
        rahulStrikeElement.textContent = '';
        rohitStrikeElement.textContent = '*';
        document.getElementById('rahul').classList.remove('strike');
        document.getElementById('rohit').classList.add('strike');
    }
    
    // Update free hit indicator
    if (gameState.freeHit) {
        freeHitIndicator.classList.remove('hidden');
    } else {
        freeHitIndicator.classList.add('hidden');
    }
    
    // Check if game is over
    if (gameState.wickets >= 10 || gameState.isGameOver) {
        statusMessageElement.textContent = "Game Over!";
        disableButtons(true);
    }
}

// Add runs to the score
function addRuns(runs) {
    if (gameState.isGameOver) return;
    
    gameState.teamScore += runs;
    
    if (gameState.striker === 'rahul') {
        gameState.rahulScore += runs;
    } else {
        gameState.rohitScore += runs;
    }
    
    // Update status message
    statusMessageElement.textContent = `Scored ${runs} run${runs > 1 ? 's' : ''}!`;
    
    // Switch striker for odd runs
    if (runs % 2 !== 0) {
        switchStriker();
    }
    
    // Increment ball count for valid deliveries
    incrementBallCount();
    
    updateScoreboard();
}

// Handle extras (wide, noball, bye, legbye)
function handleExtra(type) {
    if (gameState.isGameOver) return;
    
    switch(type) {
        case 'wide':
        case 'bye':
        case 'legbye':
            gameState.teamScore += 1;
            statusMessageElement.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)}! 1 run added.`;
            // No ball increment for these extras
            break;
            
        case 'noball':
            gameState.teamScore += 1;
            if (gameState.striker === 'rahul') {
                gameState.rahulScore += 1;
            } else {
                gameState.rohitScore += 1;
            }
            statusMessageElement.textContent = "No Ball! 1 run added.";
            // No ball increment for no balls
            break;
    }
    
    updateScoreboard();
}

// Handle wickets
function handleWicket(type) {
    if (gameState.isGameOver || gameState.wickets >= 10) return;
    
    // No wicket on free hit
    if (gameState.freeHit) {
        statusMessageElement.textContent = "No wicket on Free Hit!";
        return;
    }
    
    gameState.wickets += 1;
    
    // Update status message
    if (type === 'lbw') {
        statusMessageElement.textContent = "Out! LBW";
    } else {
        statusMessageElement.textContent = "Out! Wicket";
    }
    
    // Reset the striker's score and set new striker to Rahul
    if (gameState.striker === 'rahul') {
        gameState.rahulScore = 0;
    } else {
        gameState.rohitScore = 0;
    }
    
    // Always set Rahul as the new batsman
    gameState.striker = 'rahul';
    
    // Increment ball count for valid deliveries
    incrementBallCount();
    
    updateScoreboard();
}

// Handle free hit
function handleFreeHit() {
    if (gameState.isGameOver) return;
    
    gameState.freeHit = true;
    statusMessageElement.textContent = "Next ball is a Free Hit!";
    freeHitButton.disabled = true;
    
    updateScoreboard();
}

// Switch the striker
function switchStriker() {
    gameState.striker = gameState.striker === 'rahul' ? 'rohit' : 'rahul';
    statusMessageElement.textContent = `Striker switched to ${gameState.striker}`;
    updateScoreboard();
}

// Increment ball count and handle over completion
function incrementBallCount() {
    // Don't increment for wides, no balls, or free hits
    if (gameState.freeHit) {
        gameState.freeHit = false;
        freeHitButton.disabled = false;
        return;
    }
    
    gameState.balls += 1;
    
    if (gameState.balls === 6) {
        gameState.balls = 0;
        gameState.overs += 1;
        switchStriker(); // Switch striker at the end of over
    }
}

// Reset the game
function resetGame() {
    gameState.teamScore = 0;
    gameState.wickets = 0;
    gameState.balls = 0;
    gameState.overs = 0;
    gameState.rahulScore = 0;
    gameState.rohitScore = 0;
    gameState.striker = 'rahul';
    gameState.freeHit = false;
    gameState.isGameOver = false;
    
    statusMessageElement.textContent = "Game reset. Rahul on strike.";
    freeHitButton.disabled = false;
    disableButtons(false);
    
    updateScoreboard();
}

// Disable or enable all buttons
function disableButtons(disable) {
    document.querySelectorAll('.btn').forEach(button => {
        if (button.id !== 'reset-btn') {
            button.disabled = disable;
        }
    });
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initGame);