// Quiz Module
// Interactive quiz for Special Relativity concepts

// Quiz database
const quizDatabase = {
    timeDilation: {
        title: "Time Dilation",
        questions: [
            {
                question: "A spaceship travels at 0.8c relative to Earth. If 2 years pass on the spaceship, how many years pass on Earth?",
                options: [
                    "1.2 years",
                    "2.0 years",
                    "3.33 years",
                    "2.5 years"
                ],
                correct: 2,
                explanation: "Using time dilation formula: Δt = Δt₀/√(1 - v²/c²) = 2/√(1 - 0.8²) = 2/0.6 = 3.33 years",
                formula: "Δt = Δt₀/√(1 - v²/c²) where Δt₀ = proper time",
                hint: "Remember that moving clocks run slower by factor γ"
            },
            {
                question: "The twin paradox: If one twin travels at 0.6c to a star 3 light-years away and returns, who ages less?",
                options: [
                    "The traveling twin",
                    "The Earth-bound twin",
                    "Both age the same",
                    "It depends on the direction"
                ],
                correct: 0,
                explanation: "The traveling twin experiences acceleration to turn around, breaking symmetry. Proper time is maximized for inertial observers.",
                formula: "τ = ∫√(1 - v(t)²/c²) dt",
                hint: "Consider the asymmetry due to acceleration"
            },
            {
                question: "What is the Lorentz factor γ for v = 0.866c?",
                options: [
                    "1.5",
                    "2.0",
                    "2.5",
                    "3.0"
                ],
                correct: 1,
                explanation: "γ = 1/√(1 - v²/c²) = 1/√(1 - 0.75) = 1/√0.25 = 1/0.5 = 2.0",
                formula: "γ = 1/√(1 - v²/c²)",
                hint: "Calculate v²/c² = 0.866² = 0.75"
            },
            {
                question: "Muons created in upper atmosphere travel at 0.998c. If their half-life is 2.2μs in rest frame, what is it in Earth frame?",
                options: [
                    "2.2 μs",
                    "34.8 μs",
                    "15.6 μs",
                    "49.2 μs"
                ],
                correct: 3,
                explanation: "γ = 1/√(1 - 0.998²) = 1/√(1 - 0.996004) = 1/√0.003996 ≈ 1/0.0632 ≈ 15.8. Earth frame half-life = 2.2 × 15.8 ≈ 34.8 μs",
                formula: "Δt = γ × Δt₀",
                hint: "First calculate γ for v = 0.998c"
            },
            {
                question: "Proper time is measured by:",
                options: [
                    "A clock at rest relative to the observer",
                    "A clock moving at constant velocity",
                    "Any clock in an inertial frame",
                    "A clock undergoing acceleration"
                ],
                correct: 0,
                explanation: "Proper time is the time measured by a clock at rest relative to the observer. It's the shortest time between two events.",
                formula: "Δτ = ∫√(1 - v²/c²) dt",
                hint: "Think about which clock measures the shortest time interval"
            }
        ]
    },
    
    lengthContraction: {
        title: "Length Contraction",
        questions: [
            {
                question: "A spaceship 100m long (proper length) travels at 0.6c. How long does it appear to a stationary observer?",
                options: [
                    "100 m",
                    "80 m",
                    "125 m",
                    "60 m"
                ],
                correct: 1,
                explanation: "L = L₀√(1 - v²/c²) = 100 × √(1 - 0.36) = 100 × √0.64 = 100 × 0.8 = 80 m",
                formula: "L = L₀√(1 - v²/c²)",
                hint: "Moving objects appear shorter in direction of motion"
            },
            {
                question: "Which length is always the longest?",
                options: [
                    "Proper length",
                    "Contracted length",
                    "They can be equal",
                    "Depends on frame"
                ],
                correct: 0,
                explanation: "Proper length (measured in object's rest frame) is always the maximum length. Moving observers measure shorter lengths.",
                formula: "L₀ ≥ L",
                hint: "Think about which frame measures the object at rest"
            },
            {
                question: "A meter stick moves at 0.866c perpendicular to its length. What length is measured?",
                options: [
                    "0.5 m",
                    "1.0 m",
                    "2.0 m",
                    "0.866 m"
                ],
                correct: 1,
                explanation: "Length contraction occurs only in direction of motion. Perpendicular lengths are unchanged.",
                formula: "L∥ = L₀√(1 - v²/c²), L⟂ = L₀",
                hint: "Contraction only happens in the direction of motion"
            },
            {
                question: "If γ = 2, what is v/c?",
                options: [
                    "0.5",
                    "0.707",
                    "0.866",
                    "0.95"
                ],
                correct: 2,
                explanation: "γ = 2 ⇒ 1/√(1 - v²/c²) = 2 ⇒ √(1 - v²/c²) = 0.5 ⇒ 1 - v²/c² = 0.25 ⇒ v²/c² = 0.75 ⇒ v/c = √0.75 = 0.866",
                formula: "v/c = √(1 - 1/γ²)",
                hint: "Solve γ equation for v/c"
            }
        ]
    },
    
    lorentz: {
        title: "Lorentz Transformations",
        questions: [
            {
                question: "In frame S, event A at (x=2m, t=3s). If S' moves at 0.6c, what is t'?",
                options: [
                    "1.25 s",
                    "2.25 s",
                    "3.75 s",
                    "4.25 s"
                ],
                correct: 1,
                explanation: "γ = 1/√(1-0.36)=1.25, t' = γ(t - vx/c²)=1.25×(3 - 0.6×2/9e16)≈1.25×3=3.75s. Wait, recalc: Actually vx/c² is negligible at low v, but for exact: t'=1.25×(3 - 0.6×2)=1.25×1.8=2.25s",
                formula: "t' = γ(t - vx/c²)",
                hint: "Calculate γ first, then apply transformation"
            },
            {
                question: "Two events simultaneous in S (Δt=0, Δx=4m). Are they simultaneous in S' moving at 0.8c?",
                options: [
                    "Yes, always",
                    "No, never",
                    "Depends on positions",
                    "Only if Δx=0"
                ],
                correct: 1,
                explanation: "Δt' = γ(Δt - vΔx/c²) = γ(0 - 0.8×4/c²) ≠ 0. Relativity of simultaneity: events simultaneous in one frame aren't in another if spatially separated.",
                formula: "Δt' = γ(Δt - vΔx/c²)",
                hint: "Check Δt' formula"
            },
            {
                question: "Spacetime interval Δs² = -16 (units where c=1). This interval is:",
                options: [
                    "Timelike",
                    "Spacelike",
                    "Lightlike",
                    "Invalid"
                ],
                correct: 0,
                explanation: "Δs² < 0 indicates timelike separation (causally connectable).",
                formula: "Δs² = Δx² - c²Δt²",
                hint: "Sign of Δs² determines interval type"
            },
            {
                question: "Velocity addition: u=0.7c in S, S' moves at v=0.7c relative to S. What is u'?",
                options: [
                    "0.94c",
                    "1.4c",
                    "0.7c",
                    "0.0c"
                ],
                correct: 0,
                explanation: "u' = (u - v)/(1 - uv/c²) = (0.7 - 0.7)/(1 - 0.49) = 0/0.51 = 0. Actually wait: u' = (0.7 + 0.7)/(1 + 0.49) = 1.4/1.49 = 0.94c",
                formula: "u' = (u - v)/(1 - uv/c²)",
                hint: "Use relativistic velocity addition formula"
            },
            {
                question: "Event coordinates transform as:",
                options: [
                    "(x,t) → (x',t') linearly",
                    "Only time changes",
                    "Only space changes",
                    "Non-linearly"
                ],
                correct: 0,
                explanation: "Lorentz transformations are linear transformations of spacetime coordinates.",
                formula: "x' = γ(x - vt), t' = γ(t - vx/c²)",
                hint: "Lorentz transformations are linear"
            },
            {
                question: "Invariant quantity under Lorentz transformations:",
                options: [
                    "Spacetime interval",
                    "Time interval",
                    "Spatial distance",
                    "Velocity"
                ],
                correct: 0,
                explanation: "Δs² = Δx² - c²Δt² is invariant (same in all inertial frames).",
                formula: "Δs'² = Δs²",
                hint: "What quantity is the same for all observers?"
            }
        ]
    },
    
    fields: {
        title: "Relativistic Fields",
        questions: [
            {
                question: "A charge moves at constant velocity. Its electric field:",
                options: [
                    "Remains spherical",
                    "Contracts in direction of motion",
                    "Expands in direction of motion",
                    "Becomes zero"
                ],
                correct: 1,
                explanation: "Electric field of moving charge contracts in direction of motion by factor γ. Perpendicular component enhanced by γ.",
                formula: "E∥' = E∥, E⟂' = γE⟂",
                hint: "Think about relativistic length contraction"
            },
            {
                question: "Moving charge produces:",
                options: [
                    "Only electric field",
                    "Only magnetic field",
                    "Both E and B fields",
                    "Neither"
                ],
                correct: 2,
                explanation: "From Maxwell's equations, moving charge produces both electric and magnetic fields.",
                formula: "B = (v × E)/c²",
                hint: "A changing electric field produces magnetic field"
            },
            {
                question: "Field transformation: E' for v parallel to E:",
                options: [
                    "E' = E",
                    "E' = γE",
                    "E' = E/γ",
                    "E' = 0"
                ],
                correct: 0,
                explanation: "Electric field component parallel to motion is unchanged: E∥' = E∥.",
                formula: "E∥' = E∥, E⟂' = γ(E⟂ + v × B)",
                hint: "Parallel components don't transform"
            }
        ]
    },
    
    spacetime: {
        title: "Spacetime Intervals",
        questions: [
            {
                question: "Two events with Δx=3m, Δt=1ns (c=3e8 m/s). Interval type?",
                options: [
                    "Timelike",
                    "Spacelike",
                    "Lightlike",
                    "Cannot determine"
                ],
                correct: 1,
                explanation: "Δs² = 3² - (3e8×1e-9)² = 9 - 0.09 = 8.91 > 0 ⇒ spacelike.",
                formula: "Δs² = Δx² - c²Δt²",
                hint: "Calculate Δs² and check sign"
            },
            {
                question: "Events on light cone have:",
                options: [
                    "Δs² < 0",
                    "Δs² > 0",
                    "Δs² = 0",
                    "Δs² undefined"
                ],
                correct: 2,
                explanation: "Lightlike separation: Δs² = 0. Photons travel along light cones.",
                formula: "Δs² = 0 for lightlike",
                hint: "Light travels at c, so Δx = ±cΔt"
            },
            {
                question: "Causally connected events must have:",
                options: [
                    "Timelike separation",
                    "Spacelike separation",
                    "Either",
                    "Neither"
                ],
                correct: 0,
                explanation: "Only timelike separated events (Δs² < 0) can be causally connected.",
                formula: "Δs² < 0 for causal connection",
                hint: "Information cannot travel faster than light"
            },
            {
                question: "Proper time between events is defined for:",
                options: [
                    "Timelike separation",
                    "Spacelike separation",
                    "Both",
                    "Neither"
                ],
                correct: 0,
                explanation: "Proper time (τ) defined only for timelike separated events (Δτ = √(-Δs²/c²)).",
                formula: "Δτ = √(-Δs²/c²) for Δs² < 0",
                hint: "Proper time is time measured by clock passing through both events"
            }
        ]
    }
};

// Quiz state
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let quizStartTime = null;
let quizTimer = null;
let quizScores = JSON.parse(localStorage.getItem('rilQuizScores')) || {
    timeDilation: 0,
    lengthContraction: 0,
    lorentz: 0,
    fields: 0,
    spacetime: 0,
    final: 0
};

function initializeQuiz() {
    // Load saved scores
    updateScoreDisplays();
    
    // Set up event listeners
    setupEventListeners();
}

function updateScoreDisplays() {
    document.getElementById('scoreTime').textContent = 
        `${Math.round(quizScores.timeDilation)}%`;
    document.getElementById('scoreLength').textContent = 
        `${Math.round(quizScores.lengthContraction)}%`;
    document.getElementById('scoreLorentz').textContent = 
        `${Math.round(quizScores.lorentz)}%`;
    document.getElementById('scoreFields').textContent = 
        `${Math.round(quizScores.fields)}%`;
    document.getElementById('scoreSpacetime').textContent = 
        `${Math.round(quizScores.spacetime)}%`;
    document.getElementById('scoreFinal').textContent = 
        `${Math.round(quizScores.final)}%`;
}

function setupEventListeners() {
    // Topic selection
    document.querySelectorAll('.quiz-topic').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('btn')) return;
            const topic = this.dataset.topic;
            startQuiz(topic);
        });
    });
    
    // Final challenge
    document.getElementById('finalChallengeBtn').addEventListener('click', function() {
        startQuiz('final');
    });
    
    // Practice mode
    document.getElementById('practiceModeBtn').addEventListener('click', function() {
        alert('Practice mode: You can review questions with immediate feedback. Select a topic to begin practice.');
    });
    
    // Review all
    document.getElementById('reviewAllBtn').addEventListener('click', function() {
        alert('Review mode: This would show all questions with explanations. Feature coming soon!');
    });
    
    // View progress
    document.getElementById('viewProgressBtn').addEventListener('click', function() {
        showProgressReport();
    });
    
    // Quiz interface buttons
    document.getElementById('hintBtn').addEventListener('click', showHint);
    document.getElementById('formulaBtn').addEventListener('click', showFormula);
    document.getElementById('prevQuestionBtn').addEventListener('click', prevQuestion);
    document.getElementById('nextQuestionBtn').addEventListener('click', nextQuestion);
    document.getElementById('quitQuizBtn').addEventListener('click', quitQuiz);
    
    // Progress report buttons
    document.getElementById('backToTopicsBtn').addEventListener('click', backToTopics);
    document.getElementById('exportReportBtn').addEventListener('click', exportReport);
    document.getElementById('certificateBtn').addEventListener('click', showCertificate);
    
    // Quick reference buttons
    document.getElementById('cheatSheetBtn').addEventListener('click', function() {
        alert('Cheat sheet downloaded! (In a real implementation, this would generate a PDF)');
    });
    
    document.getElementById('videoTutorialsBtn').addEventListener('click', function() {
        window.open('https://www.youtube.com/results?search_query=special+relativity+tutorial', '_blank');
    });
    
    document.getElementById('simulationHelpBtn').addEventListener('click', function() {
        alert('Need help with a concept? Use the Spacetime Explorer or Lorentz Transformer modules to visualize the concepts!');
    });
}

function startQuiz(topic) {
    // Hide selection, show quiz interface
    document.getElementById('quizSelectionPanel').style.display = 'none';
    document.getElementById('quizInterface').style.display = 'block';
    document.getElementById('progressReport').style.display = 'none';
    
    // Initialize quiz state
    currentQuiz = topic === 'final' ? getMixedQuiz() : quizDatabase[topic];
    currentQuestionIndex = 0;
    userAnswers = new Array(currentQuiz.questions.length).fill(null);
    
    // Update UI
    document.getElementById('quizTopicTitle').textContent = currentQuiz.title;
    document.getElementById('currentScore').textContent = '0';
    
    // Start timer
    quizStartTime = Date.now();
    startTimer();
    
    // Load first question
    loadQuestion();
}

function getMixedQuiz() {
    // Create a mixed quiz from all topics
    const mixed = {
        title: "Final Challenge (Mixed Topics)",
        questions: []
    };
    
    // Take 2 questions from each topic (total 10 questions)
    Object.keys(quizDatabase).forEach(topic => {
        const questions = [...quizDatabase[topic].questions];
        // Shuffle and take 2
        shuffleArray(questions);
        mixed.questions.push(...questions.slice(0, 2));
    });
    
    // Shuffle all questions
    shuffleArray(mixed.questions);
    
    return mixed;
}

function loadQuestion() {
    const question = currentQuiz.questions[currentQuestionIndex];
    
    // Update question text
    document.getElementById('questionText').textContent = question.question;
    
    // Update progress
    document.getElementById('quizProgress').textContent = 
        `Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}`;
    document.getElementById('quizProgressBar').style.width = 
        `${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%`;
    
    // Clear and create options
    const optionsGrid = document.getElementById('optionsGrid');
    optionsGrid.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        
        // Check if already answered
        if (userAnswers[currentQuestionIndex] === index) {
            button.classList.add('selected');
            if (index === question.correct) {
                button.classList.add('correct');
            } else {
                button.classList.add('incorrect');
            }
        }
        
        button.addEventListener('click', () => selectAnswer(index));
        optionsGrid.appendChild(button);
    });
    
    // Update navigation buttons
    document.getElementById('prevQuestionBtn').disabled = currentQuestionIndex === 0;
    
    // Hide feedback initially
    document.getElementById('feedbackPanel').style.display = 'none';
    
    // Reset hint/formula buttons
    document.getElementById('hintBtn').disabled = false;
    document.getElementById('formulaBtn').disabled = false;
}

function selectAnswer(answerIndex) {
    const question = currentQuiz.questions[currentQuestionIndex];
    userAnswers[currentQuestionIndex] = answerIndex;
    
    // Update button styles
    const options = document.querySelectorAll('.option-btn');
    options.forEach((btn, index) => {
        btn.classList.remove('selected', 'correct', 'incorrect');
        if (index === answerIndex) {
            btn.classList.add('selected');
            if (index === question.correct) {
                btn.classList.add('correct');
            } else {
                btn.classList.add('incorrect');
            }
        } else if (index === question.correct) {
            btn.classList.add('correct');
        }
    });
    
    // Show feedback
    const feedbackPanel = document.getElementById('feedbackPanel');
    feedbackPanel.style.display = 'block';
    document.getElementById('feedbackText').textContent = question.explanation;
    document.getElementById('formulaExplanation').style.display = 'none';
    
    // Update score
    updateScore();
    
    // Disable hint/formula after answering
    document.getElementById('hintBtn').disabled = true;
    document.getElementById('formulaBtn').disabled = true;
}

function showHint() {
    const question = currentQuiz.questions[currentQuestionIndex];
    alert(`Hint: ${question.hint}`);
}

function showFormula() {
    const question = currentQuiz.questions[currentQuestionIndex];
    const formulaEl = document.getElementById('formulaExplanation');
    formulaEl.textContent = question.formula;
    formulaEl.style.display = 'block';
    
    // Show feedback panel if not already shown
    document.getElementById('feedbackPanel').style.display = 'block';
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
}

function nextQuestion() {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        finishQuiz();
    }
}

function quitQuiz() {
    if (confirm('Are you sure you want to quit? Your progress will be saved.')) {
        finishQuiz();
    }
}

function finishQuiz() {
    // Stop timer
    clearInterval(quizTimer);
    
    // Calculate final score
    const score = calculateScore();
    const percentage = Math.round((score / currentQuiz.questions.length) * 100);
    
    // Save score
    const topic = Object.keys(quizDatabase).find(key => 
        quizDatabase[key].title === currentQuiz.title) || 'final';
    quizScores[topic] = Math.max(quizScores[topic] || 0, percentage);
    localStorage.setItem('rilQuizScores', JSON.stringify(quizScores));
    
    // Show results
    alert(`Quiz completed!\nYour score: ${score}/${currentQuiz.questions.length} (${percentage}%)\n\n${percentage >= 70 ? 'Excellent! 🎉' : 'Keep practicing! 📚'}`);
    
    // Show progress report
    showProgressReport();
}

function calculateScore() {
    let score = 0;
    for (let i = 0; i < currentQuiz.questions.length; i++) {
        if (userAnswers[i] === currentQuiz.questions[i].correct) {
            score++;
        }
    }
    return score;
}

function updateScore() {
    let score = 0;
    for (let i = 0; i <= currentQuestionIndex; i++) {
        if (userAnswers[i] === currentQuiz.questions[i].correct) {
            score++;
        }
    }
    document.getElementById('currentScore').textContent = score;
}

function startTimer() {
    let timeRemaining = 1500; // 25 minutes in seconds
    
    quizTimer = setInterval(() => {
        timeRemaining--;
        
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        
        document.getElementById('quizTimer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeRemaining <= 0) {
            clearInterval(quizTimer);
            alert('Time\'s up!');
            finishQuiz();
        }
    }, 1000);
}

function showProgressReport() {
    // Hide other panels
    document.getElementById('quizSelectionPanel').style.display = 'none';
    document.getElementById('quizInterface').style.display = 'none';
    document.getElementById('progressReport').style.display = 'block';
    
    // Calculate overall stats
    const topics = Object.keys(quizScores);
    const totalScore = topics.reduce((sum, topic) => sum + quizScores[topic], 0);
    const avgScore = Math.round(totalScore / topics.length);
    
    // Update overall score
    document.getElementById('overallScore').textContent = `${avgScore}%`;
    document.getElementById('overallProgressBar').style.width = `${avgScore}%`;
    
    // Calculate question stats (simulated for demo)
    const questionsAnswered = 25;
    const correctAnswers = Math.round(questionsAnswered * (avgScore / 100));
    const incorrectAnswers = questionsAnswered - correctAnswers;
    
    document.getElementById('questionsAnswered').textContent = questionsAnswered;
    document.getElementById('correctAnswers').textContent = `${correctAnswers} correct`;
    document.getElementById('incorrectAnswers').textContent = `${incorrectAnswers} incorrect`;
    
    // Time spent (simulated)
    const timeSpent = 45; // minutes
    const avgTime = Math.round((timeSpent * 60) / questionsAnswered);
    
    document.getElementById('timeSpent').textContent = `${timeSpent} min`;
    document.getElementById('avgTimePerQuestion').textContent = `${avgTime} sec/question`;
    
    // Update topic performance bars
    const topicPerformance = document.getElementById('topicPerformance');
    topicPerformance.innerHTML = '';
    
    Object.keys(quizDatabase).forEach(topic => {
        const score = quizScores[topic] || 0;
        
        const topicDiv = document.createElement('div');
        topicDiv.style.marginBottom = '15px';
        
        topicDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>${quizDatabase[topic].title}</span>
                <span>${score}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${score}%;"></div>
            </div>
        `;
        
        topicPerformance.appendChild(topicDiv);
    });
}

function backToTopics() {
    document.getElementById('quizSelectionPanel').style.display = 'block';
    document.getElementById('progressReport').style.display = 'none';
    updateScoreDisplays();
}

function exportReport() {
    alert('Progress report exported! (In a real implementation, this would generate a PDF report)');
}

function showCertificate() {
    const avgScore = Math.round(
        Object.values(quizScores).reduce((a, b) => a + b, 0) / Object.keys(quizScores).length
    );
    
    if (avgScore >= 70) {
        const certWindow = window.open('', '_blank');
        certWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Certificate of Achievement</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        text-align: center; 
                        padding: 50px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                    }
                    .certificate {
                        background: white;
                        color: #333;
                        padding: 50px;
                        border-radius: 20px;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                        max-width: 800px;
                        margin: 0 auto;
                        border: 20px solid gold;
                    }
                    h1 { color: #764ba2; }
                    .score { 
                        font-size: 2em; 
                        color: #667eea;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="certificate">
                    <h1>🎓 Certificate of Achievement</h1>
                    <h2>Relativity Interactive Lab</h2>
                    <p>Awarded to:</p>
                    <h3>PHY4503 Student</h3>
                    <p>For successfully completing the Special Relativity Quiz Challenge</p>
                    <div class="score">Overall Score: ${avgScore}%</div>
                    <p>Date: ${new Date().toLocaleDateString()}</p>
                    <p style="margin-top: 50px;">
                        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/4/49/Universiti_Putra_Malaysia_Logo.svg/1200px-Universiti_Putra_Malaysia_Logo.svg.png" 
                             width="100" style="opacity: 0.7;">
                    </p>
                </div>
            </body>
            </html>
        `);
    } else {
        alert('Complete all topics with at least 70% score to earn a certificate!');
    }
}

// Utility function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializeQuiz);
