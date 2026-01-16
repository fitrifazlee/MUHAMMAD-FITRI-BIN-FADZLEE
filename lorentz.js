// Lorentz Transformer Module
// Interactive Lorentz transformation calculator

let c = 299792458; // Speed of light in m/s
let beta = 0.8; // v/c
let gamma = 1 / Math.sqrt(1 - beta * beta);
let history = [];
let canvas;
let events = [];
let currentPreset = 'custom';
let isAnimating = false;
let animationTime = 0;

function setup() {
    canvas = createCanvas(800, 400);
    canvas.parent('lorentzCanvas');
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize events array
    events.push({
        x: 5,
        t: 2,
        label: 'Event A',
        color: [255, 105, 180]
    });
    
    // Initial calculation
    calculateTransformation();
}

function draw() {
    // Dark background
    background(13, 27, 42);
    
    // Draw visualization
    drawSpacetimeDiagram();
    
    // Animation effect
    if (isAnimating) {
        animationTime += deltaTime / 1000;
        if (animationTime > 2) {
            isAnimating = false;
            animationTime = 0;
        }
    }
}

function setupEventListeners() {
    // Calculate button
    document.getElementById('calculateBtn').addEventListener('click', calculateTransformation);
    
    // Velocity slider
    const velocitySlider = document.getElementById('velocitySlider');
    velocitySlider.addEventListener('input', function(e) {
        beta = parseFloat(e.target.value);
        gamma = 1 / Math.sqrt(1 - beta * beta);
        document.getElementById('velocityValue').textContent = (beta * 100).toFixed(0) + '% c';
        document.getElementById('betaValue').textContent = beta.toFixed(3);
        document.getElementById('gammaValue').textContent = gamma.toFixed(3);
        
        if (currentPreset === 'custom') {
            calculateTransformation();
        }
    });
    
    // Direct beta input
    document.getElementById('betaInput').addEventListener('input', function(e) {
        beta = parseFloat(e.target.value);
        if (Math.abs(beta) >= 1) {
            beta = 0.99 * Math.sign(beta);
            e.target.value = beta;
        }
        gamma = 1 / Math.sqrt(1 - beta * beta);
        velocitySlider.value = Math.abs(beta);
        document.getElementById('velocityValue').textContent = (Math.abs(beta) * 100).toFixed(0) + '% c';
        document.getElementById('betaValue').textContent = beta.toFixed(3);
        document.getElementById('gammaValue').textContent = gamma.toFixed(3);
        
        if (currentPreset === 'custom') {
            calculateTransformation();
        }
    });
    
    // Input coordinate listeners for real-time updates
    document.getElementById('inputX').addEventListener('input', function() {
        if (currentPreset === 'custom') {
            calculateTransformation();
        }
    });
    
    document.getElementById('inputT').addEventListener('input', function() {
        if (currentPreset === 'custom') {
            calculateTransformation();
        }
    });
    
    // Swap frames button
    document.getElementById('swapFramesBtn').addEventListener('click', function() {
        // Get current outputs
        let xPrime = parseFloat(document.getElementById('outputX').textContent);
        let tPrime = parseFloat(document.getElementById('outputT').textContent);
        
        // Swap inputs with outputs (inverse transformation)
        document.getElementById('inputX').value = xPrime.toFixed(2);
        document.getElementById('inputT').value = tPrime.toFixed(2);
        beta = -beta; // Reverse velocity for inverse transform
        velocitySlider.value = Math.abs(beta);
        document.getElementById('velocityValue').textContent = (Math.abs(beta) * 100).toFixed(0) + '% c';
        document.getElementById('betaValue').textContent = beta.toFixed(3);
        gamma = 1 / Math.sqrt(1 - beta * beta);
        document.getElementById('gammaValue').textContent = gamma.toFixed(3);
        
        calculateTransformation();
        isAnimating = true;
        animationTime = 0;
    });
    
    // Reset button
    document.getElementById('resetBtn').addEventListener('click', function() {
        document.getElementById('inputX').value = '5';
        document.getElementById('inputT').value = '2';
        beta = 0.8;
        velocitySlider.value = Math.abs(beta);
        document.getElementById('velocityValue').textContent = (Math.abs(beta) * 100).toFixed(0) + '% c';
        document.getElementById('betaValue').textContent = beta.toFixed(3);
        gamma = 1 / Math.sqrt(1 - beta * beta);
        document.getElementById('gammaValue').textContent = gamma.toFixed(3);
        currentPreset = 'custom';
        selectPreset('custom');
        calculateTransformation();
    });
    
    // Preset scenarios
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const preset = this.getAttribute('data-preset');
            selectPreset(preset);
        });
    });
    
    // Add event button
    document.getElementById('addEventBtn').addEventListener('click', function() {
        const x = parseFloat(prompt("Enter x coordinate:", "3"));
        const t = parseFloat(prompt("Enter t coordinate:", "1"));
        const label = prompt("Enter event label:", "Event " + (events.length + 1));
        
        if (!isNaN(x) && !isNaN(t)) {
            events.push({
                x: x,
                t: t,
                label: label,
                color: [Math.random() * 255, Math.random() * 255, Math.random() * 255]
            });
            calculateTransformation();
        }
    });
    
    // Clear events button
    document.getElementById('clearEventsBtn').addEventListener('click', function() {
        events = [events[0]]; // Keep first event
        calculateTransformation();
    });
}

function selectPreset(preset) {
    currentPreset = preset;
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-preset="${preset}"]`).classList.add('active');
    
    switch(preset) {
        case 'timeDilation':
            document.getElementById('inputX').value = '0';
            document.getElementById('inputT').value = '5';
            beta = 0.6;
            break;
            
        case 'lengthContraction':
            document.getElementById('inputX').value = '10';
            document.getElementById('inputT').value = '0';
            beta = 0.8;
            break;
            
        case 'twinParadox':
            document.getElementById('inputX').value = '0';
            document.getElementById('inputT').value = '10';
            beta = 0.87;
            break;
            
        case 'relativitySimultaneity':
            document.getElementById('inputX').value = '5';
            document.getElementById('inputT').value = '0';
            beta = 0.9;
            break;
            
        case 'custom':
            // Keep current values
            break;
    }
    
    if (preset !== 'custom') {
        const velocitySlider = document.getElementById('velocitySlider');
        velocitySlider.value = Math.abs(beta);
        document.getElementById('velocityValue').textContent = (Math.abs(beta) * 100).toFixed(0) + '% c';
        document.getElementById('betaValue').textContent = beta.toFixed(3);
        gamma = 1 / Math.sqrt(1 - beta * beta);
        document.getElementById('gammaValue').textContent = gamma.toFixed(3);
        calculateTransformation();
    }
}

function calculateTransformation() {
    // Get input values
    const x = parseFloat(document.getElementById('inputX').value) || 0;
    const t = parseFloat(document.getElementById('inputT').value) || 0;
    
    // Calculate Lorentz transformation
    const xPrime = gamma * (x - beta * c * t);
    const tPrime = gamma * (t - (beta / c) * x);
    
    // Update output displays
    document.getElementById('outputX').textContent = xPrime.toFixed(6);
    document.getElementById('outputT').textContent = tPrime.toFixed(6);
    
    // Display step-by-step calculation
    displayCalculationSteps(x, t, xPrime, tPrime);
    
    // Update event transformations
    updateEventTransformations();
    
    // Add to history
    addToHistory(x, t, xPrime, tPrime);
}

function displayCalculationSteps(x, t, xPrime, tPrime) {
    const stepsDiv = document.getElementById('calculationSteps');
    stepsDiv.innerHTML = `
        <h4>Calculation Steps:</h4>
        <div class="step">
            <strong>Step 1: Calculate γ (gamma)</strong><br>
            γ = 1 / √(1 - β²) = 1 / √(1 - (${beta.toFixed(3)})²)<br>
            γ = ${gamma.toFixed(6)}
        </div>
        <div class="step">
            <strong>Step 2: Lorentz Transformation for x'</strong><br>
            x' = γ(x - βct)<br>
            x' = ${gamma.toFixed(3)} × (${x.toFixed(3)} - ${beta.toFixed(3)} × ${c.toExponential(2)} × ${t.toFixed(3)})<br>
            x' = ${xPrime.toFixed(6)} m
        </div>
        <div class="step">
            <strong>Step 3: Lorentz Transformation for t'</strong><br>
            t' = γ(t - βx/c)<br>
            t' = ${gamma.toFixed(3)} × (${t.toFixed(3)} - ${beta.toFixed(3)} × ${x.toFixed(3)} / ${c.toExponential(2)})<br>
            t' = ${tPrime.toFixed(6)} s
        </div>
        <div class="step">
            <strong>Key Parameters:</strong><br>
            β = v/c = ${beta.toFixed(3)}<br>
            v = ${(beta * c).toExponential(2)} m/s<br>
            γ = ${gamma.toFixed(3)}<br>
            ${gamma > 1 ? `Time dilation factor: ${gamma.toFixed(3)}` : ''}<br>
            ${gamma > 1 ? `Length contraction factor: 1/γ = ${(1/gamma).toFixed(3)}` : ''}
        </div>
    `;
}

function updateEventTransformations() {
    const eventsDiv = document.getElementById('eventsList');
    eventsDiv.innerHTML = '<h4>Transformed Events:</h4>';
    
    events.forEach((event, index) => {
        const xPrime = gamma * (event.x - beta * c * event.t);
        const tPrime = gamma * (event.t - (beta / c) * event.x);
        
        eventsDiv.innerHTML += `
            <div class="event-item" style="border-left: 4px solid rgb(${event.color.join(',')})">
                <strong>${event.label}:</strong><br>
                S: (${event.x.toFixed(2)} m, ${event.t.toFixed(2)} s)<br>
                S': (${xPrime.toFixed(2)} m, ${tPrime.toFixed(2)} s)<br>
                Δt' = ${tPrime.toFixed(2)} s, Δx' = ${xPrime.toFixed(2)} m
            </div>
        `;
    });
}

function addToHistory(x, t, xPrime, tPrime) {
    const entry = {
        timestamp: new Date().toLocaleTimeString(),
        beta: beta,
        input: {x: x, t: t},
        output: {x: xPrime, t: tPrime}
    };
    
    history.unshift(entry); // Add to beginning
    if (history.length > 5) history.pop(); // Keep only last 5
    
    // Update history display
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = '<h4>Recent Calculations:</h4>';
    history.forEach(entry => {
        historyDiv.innerHTML += `
            <div class="history-entry">
                <small>${entry.timestamp} | β=${entry.beta.toFixed(2)}</small><br>
                S: (${entry.input.x.toFixed(2)}, ${entry.input.t.toFixed(2)}) → 
                S': (${entry.output.x.toFixed(2)}, ${entry.output.t.toFixed(2)})
            </div>
        `;
    });
}

function drawSpacetimeDiagram() {
    push();
    translate(50, height - 50);
    
    // Draw grid
    stroke(50);
    strokeWeight(1);
    for (let i = -5; i <= 5; i++) {
        line(i * 60, -300, i * 60, 0);
        line(-300, i * 60, 300, i * 60);
    }
    
    // Draw axes for S frame
    stroke(0, 255, 0);
    strokeWeight(2);
    line(-300, 0, 300, 0); // x-axis
    line(0, -300, 0, 0); // t-axis (upward negative for time)
    
    // Draw axes for S' frame (boosted frame)
    stroke(255, 100, 100);
    strokeWeight(2);
    const angle = Math.atan(beta);
    
    // x' axis (ct' = 0)
    const x1 = 300;
    const t1 = beta * 300;
    const x2 = -300;
    const t2 = beta * -300;
    line(x1, -t1, x2, -t2);
    
    // t' axis (x' = 0)
    const x3 = beta * 300;
    const t3 = 300;
    const x4 = beta * -300;
    const t4 = -300;
    line(x3, -t3, x4, -t4);
    
    // Draw light cone
    stroke(255, 255, 0, 100);
    strokeWeight(1);
    line(-300, -300, 300, 300); // 45° line
    
    // Draw events
    events.forEach(event => {
        // S frame coordinates
        const xS = event.x * 30;
        const tS = -event.t * 30;
        
        // S' frame coordinates
        const xPrime = gamma * (event.x - beta * event.t);
        const tPrime = gamma * (event.t - beta * event.x);
        const xSprime = xPrime * 30;
        const tSprime = -tPrime * 30;
        
        // Draw S frame event
        fill(event.color[0], event.color[1], event.color[2]);
        noStroke();
        ellipse(xS, tS, 10, 10);
        
        // Draw S' frame event
        fill(event.color[0], event.color[1], event.color[2], 150);
        ellipse(xSprime, tSprime, 8, 8);
        
        // Draw connecting line
        stroke(event.color[0], event.color[1], event.color[2], 100);
        strokeWeight(1);
        line(xS, tS, xSprime, tSprime);
        
        // Labels
        fill(255);
        noStroke();
        textAlign(LEFT);
        textSize(10);
        text(event.label, xS + 5, tS - 5);
    });
    
    // Draw labels
    fill(0, 255, 0);
    noStroke();
    textAlign(CENTER);
    textSize(12);
    text("S Frame: x-axis", 0, 20);
    text("S Frame: t-axis", -20, -150);
    
    fill(255, 100, 100);
    text("S' Frame: x'-axis", 150, -beta * 150 + 20);
    text("S' Frame: t'-axis", beta * 150 + 20, -150);
    
    fill(255, 255, 0);
    text("Light cone (x = ±ct)", 200, -200);
    
    pop();
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', function() {
    // Set initial values
    document.getElementById('inputX').value = '5';
    document.getElementById('inputT').value = '2';
    document.getElementById('betaInput').value = beta;
    document.getElementById('betaValue').textContent = beta.toFixed(3);
    document.getElementById('gammaValue').textContent = gamma.toFixed(3);
    document.getElementById('velocityValue').textContent = (beta * 100).toFixed(0) + '% c';
    
    // Initialize preset
    selectPreset('custom');
});
