// Field Visualizer Module
// Electric and magnetic field visualizations with relativistic transformations

let canvas;
let isPlaying = true;
let charge = 1.0; // in units of e
let velocity = 0; // v/c
let posX = 0, posY = 0;
let scenario = 'stationary';
let showElectric = true;
let showMagnetic = true;
let showVectors = false;
let showEquipotentials = false;
let showGrid = true;
let showFieldStrength = true;
let fieldScale = 5;
let numFieldLines = 20;
let time = 0;

// Colors
const colors = {
    background: [13, 27, 42],
    grid: [64, 64, 64, 50],
    electric: [255, 87, 34, 180], // Orange-red
    magnetic: [33, 150, 243, 180], // Blue
    electricRel: [255, 140, 0, 220], // Orange for relativistic E
    magneticRel: [0, 188, 212, 220], // Cyan for relativistic B
    equipotential: [76, 175, 80, 120], // Green
    positiveCharge: [244, 67, 54], // Red
    negativeCharge: [33, 150, 243], // Blue
    velocityVector: [255, 193, 7, 200], // Yellow
    current: [156, 39, 176, 200], // Purple for current
    text: [224, 224, 224],
    fieldStrength: [255, 255, 255, 180]
};

// Physical constants
const e = 1.602176634e-19; // Elementary charge (C)
const k = 8.9875517873681764e9; // Coulomb constant (N·m²/C²)
const mu0 = 4 * Math.PI * 1e-7; // Magnetic constant (T·m/A)
const epsilon0 = 8.8541878128e-12; // Electric constant (F/m)
const c = 299792458; // Speed of light (m/s)

// Field calculation cache
let fieldCache = [];
let cacheTime = 0;

function setup() {
    canvas = createCanvas(900, 600);
    canvas.parent('fieldCanvas');
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize field cache
    updateFieldCache();
    
    // Initial info update
    updateFieldInfo();
    
    // Smooth text rendering
    drawingContext.font = '14px Arial';
    drawingContext.textBaseline = 'middle';
}

function draw() {
    // Update time if playing
    if (isPlaying) {
        time += 0.016; // ~60 FPS
    }
    
    // Update cache periodically
    if (millis() - cacheTime > 100) {
        updateFieldCache();
        cacheTime = millis();
    }
    
    // Dark background
    background(colors.background);
    
    // Draw grid if enabled
    if (showGrid) drawGrid();
    
    // Draw coordinate axes
    drawAxes();
    
    // Draw based on selected scenario
    switch (scenario) {
        case 'stationary':
            drawStationaryCharge();
            break;
        case 'moving':
            drawMovingCharge();
            break;
        case 'dipole':
            drawDipole();
            break;
        case 'wire':
            drawCurrentWire();
            break;
        case 'parallelPlates':
            drawParallelPlates();
            break;
        case 'relativistic':
            drawRelativisticComparison();
            break;
    }
    
    // Draw field strength heatmap if enabled
    if (showFieldStrength && scenario !== 'wire') {
        drawFieldStrength();
    }
    
    // Draw velocity vector if moving
    if (velocity > 0.01 && (scenario === 'moving' || scenario === 'relativistic')) {
        drawVelocityVector();
    }
    
    // Draw legend
    drawLegend();
    
    // Draw coordinate info
    drawCoordinateInfo();
}

function drawGrid() {
    stroke(colors.grid);
    strokeWeight(1);
    
    const gridSize = 50;
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    
    // Vertical lines
    for (let x = -halfWidth; x <= halfWidth; x += gridSize) {
        const screenX = halfWidth + x;
        line(screenX, 0, screenX, height);
        
        // Grid labels every 2 lines
        if (Math.abs(x) % (gridSize * 2) === 0 && x !== 0) {
            fill(colors.grid[0], colors.grid[1], colors.grid[2], 150);
            noStroke();
            textAlign(CENTER, BOTTOM);
            textSize(10);
            text(`${x/gridSize}`, screenX, halfHeight - 5);
        }
    }
    
    // Horizontal lines
    for (let y = -halfHeight; y <= halfHeight; y += gridSize) {
        const screenY = halfHeight - y; // Inverted Y axis
        line(0, screenY, width, screenY);
        
        // Grid labels
        if (Math.abs(y) % (gridSize * 2) === 0 && y !== 0) {
            fill(colors.grid[0], colors.grid[1], colors.grid[2], 150);
            noStroke();
            textAlign(RIGHT, CENTER);
            textSize(10);
            text(`${y/gridSize}`, halfWidth - 5, screenY);
        }
    }
}

function drawAxes() {
    stroke(200, 200, 200, 200);
    strokeWeight(2);
    
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    
    // x-axis
    line(0, halfHeight, width, halfHeight);
    // y-axis
    line(halfWidth, 0, halfWidth, height);
    
    // Axis labels
    fill(colors.text);
    noStroke();
    textSize(14);
    textAlign(CENTER, CENTER);
    text('x (m)', width - 25, halfHeight - 25);
    text('y (m)', halfWidth + 25, 25);
    
    // Origin marker
    fill(255, 255, 255, 200);
    ellipse(halfWidth, halfHeight, 6, 6);
    text('O', halfWidth + 15, halfHeight - 15);
}

function drawStationaryCharge() {
    const centerX = width / 2 + posX * 50;
    const centerY = height / 2 - posY * 50;
    
    // Draw charge
    const chargeSize = map(Math.abs(charge), 0, 2, 15, 35);
    fill(charge > 0 ? colors.positiveCharge : colors.negativeCharge);
    noStroke();
    ellipse(centerX, centerY, chargeSize, chargeSize);
    
    // Draw charge symbol
    fill(255);
    textSize(14);
    textAlign(CENTER, CENTER);
    text(`${charge > 0 ? '+' : '-'}${Math.abs(charge).toFixed(1)}e`, centerX, centerY);
    
    // Draw electric field
    if (showElectric) {
        drawElectricFieldLines(centerX, centerY, charge);
    }
    
    // No magnetic field for stationary charge
    if (showMagnetic) {
        drawMagneticFieldText(centerX + 60, centerY, "B = 0 (stationary charge)");
    }
}

function drawMovingCharge() {
    const centerX = width / 2 + (posX + velocity * time * 0.5) * 50;
    const centerY = height / 2 - posY * 50;
    
    // Draw charge with motion trail
    if (velocity > 0.1) {
        for (let i = 0; i < 5; i++) {
            const trailX = centerX - (i * 10 * velocity);
            const alpha = map(i, 0, 5, 50, 200);
            fill(charge > 0 ? colors.positiveCharge[0] : colors.negativeCharge[0],
                 charge > 0 ? colors.positiveCharge[1] : colors.negativeCharge[1],
                 charge > 0 ? colors.positiveCharge[2] : colors.negativeCharge[2],
                 alpha);
            noStroke();
            ellipse(trailX, centerY, 10, 10);
        }
    }
    
    // Draw charge
    const chargeSize = map(Math.abs(charge), 0, 2, 15, 35);
    fill(charge > 0 ? colors.positiveCharge : colors.negativeCharge);
    noStroke();
    ellipse(centerX, centerY, chargeSize, chargeSize);
    
    // Draw charge symbol
    fill(255);
    textSize(14);
    textAlign(CENTER, CENTER);
    text(`${charge > 0 ? '+' : '-'}${Math.abs(charge).toFixed(1)}e`, centerX, centerY);
    
    // Calculate relativistic gamma
    const gamma = 1 / Math.sqrt(1 - velocity * velocity);
    
    // Draw electric field
    if (showElectric) {
        drawElectricFieldLines(centerX, centerY, charge, velocity, gamma);
    }
    
    // Draw magnetic field
    if (showMagnetic) {
        drawMagneticFieldLines(centerX, centerY, charge, velocity, gamma);
    }
    
    // Draw equipotential lines
    if (showEquipotentials) {
        drawEquipotentialLines(centerX, centerY, charge, velocity, gamma);
    }
}

function drawDipole() {
    const centerX = width / 2;
    const centerY = height / 2;
    const separation = 150;
    
    // Positive charge
    fill(colors.positiveCharge);
    noStroke();
    ellipse(centerX - separation/2, centerY, 25, 25);
    fill(255);
    textSize(14);
    textAlign(CENTER, CENTER);
    text('+e', centerX - separation/2, centerY);
    
    // Negative charge
    fill(colors.negativeCharge);
    ellipse(centerX + separation/2, centerY, 25, 25);
    fill(255);
    text('-e', centerX + separation/2, centerY);
    
    // Draw field lines
    if (showElectric) {
        stroke(colors.electric);
        strokeWeight(1.5);
        noFill();
        
        // Draw field lines from positive to negative
        for (let i = 0; i < numFieldLines; i++) {
            const angle = (i * TWO_PI) / numFieldLines;
            drawDipoleFieldLine(centerX - separation/2, centerY, angle, separation);
        }
    }
    
    // Show dipole moment
    fill(colors.text);
    noStroke();
    textSize(12);
    textAlign(CENTER, TOP);
    text(`p = qd = ${(1.6e-19 * separation/50).toExponential(1)} C·m`, centerX, centerY + 40);
}

function drawCurrentWire() {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Draw wire
    stroke(colors.current);
    strokeWeight(4);
    line(100, centerY, width - 100, centerY);
    
    // Draw current direction indicators
    fill(colors.current);
    noStroke();
    for (let x = 150; x < width - 150; x += 40) {
        push();
        translate(x, centerY);
        rotate(velocity > 0 ? 0 : PI); // Reverse direction for negative velocity
        triangle(-8, -6, 8, 0, -8, 6);
        pop();
    }
    
    // Current label
    fill(colors.current);
    textSize(14);
    textAlign(CENTER, TOP);
    text(`I = ${(velocity * 1e6).toFixed(1)} A`, width/2, centerY + 20);
    
    // Draw magnetic field
    if (showMagnetic) {
        stroke(colors.magnetic);
        strokeWeight(1.5);
        noFill();
        
        // Magnetic field circles around wire
        for (let r = 30; r < 200; r += 30) {
            ellipse(centerX, centerY, r * 2, r * 2);
            
            // Draw field direction (right-hand rule)
            push();
            translate(centerX + r, centerY);
            rotate(velocity > 0 ? -PI/2 : PI/2);
            drawArrow(0, 0, 0, -15, colors.magnetic);
            pop();
        }
    }
    
    // Draw electric field (none for ideal wire)
    if (showElectric) {
        fill(colors.text);
        textSize(12);
        textAlign(CENTER, BOTTOM);
        text("E = 0 (neutral wire)", width/2, centerY - 100);
    }
}

function drawParallelPlates() {
    const centerX = width / 2;
    const centerY = height / 2;
    const plateWidth = 300;
    const plateHeight = 20;
    const separation = 150;
    
    // Draw positive plate (top)
    fill(colors.positiveCharge);
    noStroke();
    rect(centerX - plateWidth/2, centerY - separation/2 - plateHeight/2, plateWidth, plateHeight);
    
    // Draw negative plate (bottom)
    fill(colors.negativeCharge);
    rect(centerX - plateWidth/2, centerY + separation/2 - plateHeight/2, plateWidth, plateHeight);
    
    // Plate labels
    fill(255);
    textSize(14);
    textAlign(CENTER, CENTER);
    text("+ + + + +", centerX, centerY - separation/2);
    text("- - - - -", centerX, centerY + separation/2);
    
    // Draw uniform electric field
    if (showElectric) {
        stroke(colors.electric);
        strokeWeight(2);
        
        for (let x = centerX - plateWidth/2 + 30; x < centerX + plateWidth/2; x += 40) {
            for (let y = centerY - separation/2 + 30; y < centerY + separation/2; y += 40) {
                drawArrow(x, y, x, y + 20, colors.electric);
            }
        }
    }
    
    // Calculate field strength
    const eField = Math.abs(charge) * 1e4; // Simplified calculation
    fill(colors.text);
    textSize(12);
    textAlign(CENTER, TOP);
    text(`E = ${eField.toFixed(0)} N/C (uniform)`, centerX, centerY + separation/2 + 30);
}

function drawRelativisticComparison() {
    const centerX = width / 2;
    const leftX = centerX - 200;
    const rightX = centerX + 200;
    const centerY = height / 2;
    
    // Draw non-relativistic case (left)
    fill(colors.text);
    textSize(14);
    textAlign(CENTER, TOP);
    text("Non-relativistic\n(v << c)", leftX, 20);
    
    // Draw relativistic case (right)
    text("Relativistic\n(v = " + (velocity*c/1e6).toFixed(0) + "×10⁶ m/s)", rightX, 20);
    
    // Draw charges
    const chargeSize = 25;
    
    // Left (stationary-like field)
    fill(charge > 0 ? colors.positiveCharge : colors.negativeCharge);
    ellipse(leftX, centerY, chargeSize, chargeSize);
    fill(255);
    text(`${charge > 0 ? '+' : '-'}e`, leftX, centerY);
    
    // Right (relativistic field)
    ellipse(rightX, centerY, chargeSize, chargeSize);
    fill(255);
    text(`${charge > 0 ? '+' : '-'}e`, rightX, centerY);
    
    // Draw fields for comparison
    if (showElectric) {
        // Non-relativistic (spherical)
        stroke(colors.electric);
        strokeWeight(1.5);
        noFill();
        for (let i = 0; i < 12; i++) {
            const angle = (i * TWO_PI) / 12;
            const startX = leftX + 20 * cos(angle);
            const startY = centerY + 20 * sin(angle);
            drawFieldLine(startX, startY, angle, charge, 0, 0, false);
        }
        
        // Relativistic (contracted)
        stroke(colors.electricRel);
        const gamma = 1 / Math.sqrt(1 - velocity * velocity);
        for (let i = 0; i < 12; i++) {
            const angle = (i * TWO_PI) / 12;
            const startX = rightX + 20 * cos(angle);
            const startY = centerY + 20 * sin(angle);
            drawFieldLine(startX, startY, angle, charge * gamma, 0, 0, true);
        }
    }
    
    if (showMagnetic && velocity > 0.01) {
        // Only relativistic side has significant B field
        stroke(colors.magneticRel);
        strokeWeight(1.5);
        noFill();
        
        const bStrength = map(velocity, 0, 0.99, 0, 100);
        for (let r = 30; r <= 120; r += 30) {
            // Draw elliptical field lines (contracted in direction of motion)
            const rx = r;
            const ry = r / gamma;
            push();
            translate(rightX, centerY);
            rotate(PI/4); // Diagonal for visualization
            ellipse(0, 0, rx * 2, ry * 2);
            pop();
        }
    }
}

function drawElectricFieldLines(centerX, centerY, charge, velocity = 0, gamma = 1) {
    if (!showElectric) return;
    
    stroke(velocity > 0.1 ? colors.electricRel : colors.electric);
    strokeWeight(1.5);
    noFill();
    
    const numLines = showVectors ? 24 : min(numFieldLines, 36);
    
    for (let i = 0; i < numLines; i++) {
        const angle = (i * TWO_PI) / numLines;
        const startDist = 25;
        const startX = centerX + startDist * cos(angle);
        const startY = centerY + startDist * sin(angle);
        
        if (showVectors) {
            // Draw field vectors
            const r = 50;
            let ex = cos(angle);
            let ey = sin(angle);
            
            // Relativistic effects
            if (velocity > 0) {
                // Enhanced perpendicular components
                if (abs(angle % PI) > PI/4) {
                    ex *= gamma;
                    ey *= gamma;
                }
            }
            
            const magnitude = Math.sqrt(ex*ex + ey*ey);
            if (magnitude > 0) {
                ex = (ex / magnitude) * 40 * fieldScale;
                ey = (ey / magnitude) * 40 * fieldScale;
                drawArrow(startX, startY, startX + ex, startY + ey, 
                         velocity > 0.1 ? colors.electricRel : colors.electric);
            }
        } else {
            // Draw field lines
            drawFieldLine(startX, startY, angle, charge, velocity, gamma);
        }
    }
}

function drawMagneticFieldLines(centerX, centerY, charge, velocity, gamma) {
    if (!showMagnetic || velocity < 0.01) return;
    
    stroke(colors.magneticRel);
    strokeWeight(1.5);
    noFill();
    
    // Calculate B field strength
    const bStrength = (mu0 / (4 * Math.PI)) * Math.abs(charge * e) * velocity * c;
    
    // Draw concentric circles/ellipses
    for (let i = 1; i <= 4; i++) {
        const radius = 40 * i;
        
        // Relativistic contraction in direction perpendicular to motion
        const rx = radius;
        const ry = radius / gamma;
        
        push();
        translate(centerX, centerY);
        if (velocity > 0) {
            rotate(PI/2); // B field is perpendicular to velocity
        }
        ellipse(0, 0, rx * 2, ry * 2);
        pop();
        
        // Draw B field direction indicators
        const points = 8;
        for (let j = 0; j < points; j++) {
            const angle = (j * TWO_PI) / points + time * 0.5;
            const px = centerX + radius * cos(angle);
            const py = centerY + radius * sin(angle);
            
            push();
            translate(px, py);
            rotate(angle + PI/2);
            drawArrow(0, 0, 0, -12, colors.magneticRel);
            pop();
        }
    }
    
    // Display B field info
    fill(colors.magneticRel);
    noStroke();
    textSize(12);
    textAlign(LEFT, TOP);
    text(`B ∝ γv (γ = ${gamma.toFixed(2)})`, centerX + 100, centerY - 100);
}

function drawMagneticFieldText(x, y, text) {
    fill(colors.magnetic);
    noStroke();
    textSize(12);
    textAlign(CENTER, CENTER);
    text(text, x, y);
}

function drawEquipotentialLines(centerX, centerY, charge, velocity, gamma) {
    if (!showEquipotentials) return;
    
    stroke(colors.equipotential);
    strokeWeight(1);
    strokeDash(5, 3);
    noFill();
    
    for (let i = 1; i <= 5; i++) {
        const radius = 30 * i;
        
        // Relativistic effects on equipotential surfaces
        if (velocity > 0) {
            // Ellipsoidal equipotentials for moving charge
            const rx = radius / gamma; // Contracted along motion
            const ry = radius;
            
            ellipse(centerX, centerY, rx * 2, ry * 2);
        } else {
            // Spherical equipotentials for stationary charge
            ellipse(centerX, centerY, radius * 2, radius * 2);
        }
    }
    
    noStrokeDash();
}

function drawFieldStrength() {
    const gridRes = 20;
    const cellSize = width / gridRes;
    
    // Find max field strength for normalization
    let maxStrength = 0;
    for (let i = 0; i < gridRes; i++) {
        for (let j = 0; j < gridRes; j++) {
            const x = (i + 0.5) * cellSize;
            const y = (j + 0.5) * cellSize;
            const strength = calculateFieldStrengthAt(x, y);
            maxStrength = max(maxStrength, strength);
        }
    }
    
    if (maxStrength === 0) return;
    
    // Draw heatmap
    for (let i = 0; i < gridRes; i++) {
        for (let j = 0; j < gridRes; j++) {
            const x = i * cellSize;
            const y = j * cellSize;
            const strength = calculateFieldStrengthAt(x + cellSize/2, y + cellSize/2);
            
            // Color based on field strength
            const intensity = map(strength, 0, maxStrength, 0, 255);
            const alpha = map(strength, 0, maxStrength, 30, 100);
            
            if (showElectric) {
                fill(255, 87, 34, alpha);
                noStroke();
                rect(x, y, cellSize, cellSize);
            }
            
            // Draw strength value for key points
            if ((i % 5 === 0 && j % 5 === 0) && strength > maxStrength * 0.1) {
                fill(colors.fieldStrength);
                textSize(9);
                textAlign(CENTER, CENTER);
                text(strength.toFixed(0), x + cellSize/2, y + cellSize/2);
            }
        }
    }
}

function calculateFieldStrengthAt(x, y) {
    let totalStrength = 0;
    
    switch (scenario) {
        case 'stationary':
        case 'moving':
            const dx = x - (width/2 + posX * 50);
            const dy = y - (height/2 - posY * 50);
            const r = max(sqrt(dx*dx + dy*dy), 10);
            totalStrength = k * Math.abs(charge * e) / (r * r);
            break;
            
        case 'dipole':
            const centerX = width / 2;
            const centerY = height / 2;
            const separation = 150;
            
            // Distance to positive charge
            const dx1 = x - (centerX - separation/2);
            const dy1 = y - centerY;
            const r1 = max(sqrt(dx1*dx1 + dy1*dy1), 10);
            
            // Distance to negative charge
            const dx2 = x - (centerX + separation/2);
            const dy2 = y - centerY;
            const r2 = max(sqrt(dx2*dx2 + dy2*dy2), 10);
            
            totalStrength = k * e * (1/(r1*r1) + 1/(r2*r2));
            break;
    }
    
    return totalStrength;
}

function drawFieldLine(startX, startY, startAngle, charge, velocity = 0, gamma = 1) {
    const steps = 150;
    const stepSize = 5;
    let x = startX;
    let y = startY;
    const chargeSign = Math.sign(charge);
    
    beginShape();
    vertex(x, y);
    
    for (let i = 0; i < steps; i++) {
        // Calculate vector to charge
        const dx = x - startX;
        const dy = y - startY;
        const r = max(sqrt(dx*dx + dy*dy), 15);
        
        // Electric field vector
        let ex = dx / (r * r);
        let ey = dy / (r * r);
        
        // Apply relativistic effects for moving charge
        if (velocity > 0 && gamma > 1) {
            // Contract perpendicular components
            const angle = atan2(dy, dx);
            if (abs(angle % PI) > PI/4) {
                ex *= gamma;
                ey *= gamma;
            }
        }
        
        // Normalize and apply charge sign
        const mag = sqrt(ex*ex + ey*ey);
        if (mag > 0) {
            ex = (ex / mag) * stepSize * chargeSign;
            ey = (ey / mag) * stepSize * chargeSign;
        }
        
        x += ex;
        y += ey;
        
        vertex(x, y);
        
        // Stop conditions
        if (x < 0 || x > width || y < 0 || y > height) break;
        if (r > 300) break; // Too far
    }
    
    endShape();
}

function drawDipoleFieldLine(startX, startY, angle, separation) {
    const steps = 200;
    const stepSize = 4;
    let x = startX + 20 * cos(angle);
    let y = startY + 20 * sin(angle);
    
    beginShape();
    vertex(x, y);
    
    for (let i = 0; i < steps; i++) {
        // Distances to both charges
        const dx1 = x - (width/2 - separation/2);
        const dy1 = y - height/2;
        const r1 = max(sqrt(dx1*dx1 + dy1*dy1), 15);
        
        const dx2 = x - (width/2 + separation/2);
        const dy2 = y - height/2;
        const r2 = max(sqrt(dx2*dx2 + dy2*dy2), 15);
        
        // Field from both charges
        let ex = dx1/(r1*r1) - dx2/(r2*r2);
        let ey = dy1/(r1*r1) - dy2/(r2*r2);
        
        // Normalize
        const mag = sqrt(ex*ex + ey*ey);
        if (mag > 0) {
            ex = (ex / mag) * stepSize;
            ey = (ey / mag) * stepSize;
        }
        
        x += ex;
        y += ey;
        
        vertex(x, y);
        
        // Stop if close to negative charge or out of bounds
        if (dist(x, y, width/2 + separation/2, height/2) < 20) break;
        if (x < 0 || x > width || y < 0 || y > height) break;
    }
    
    endShape();
}

function drawVelocityVector() {
    const centerX = width / 2 + posX * 50;
    const centerY = height / 2 - posY * 50;
    
    const vx = velocity * 100;
    const vy = 0; // Moving along x-axis for simplicity
    
    drawArrow(centerX, centerY, centerX + vx, centerY + vy, colors.velocityVector);
    
    // Velocity label
    fill(colors.velocityVector);
    noStroke();
    textSize(12);
    textAlign(LEFT, CENTER);
    
    const velocityMS = velocity * c;
    let displayVel;
    if (velocityMS >= 1e6) {
        displayVel = (velocityMS / 1e6).toFixed(1) + '×10⁶ m/s';
    } else {
        displayVel = velocityMS.toFixed(0) + ' m/s';
    }
    
    text(`v = ${displayVel} (${(velocity*100).toFixed(1)}% c)`, 
         centerX + vx + 15, centerY);
    
    // Relativistic gamma
    if (velocity > 0.1) {
        const gamma = 1 / Math.sqrt(1 - velocity * velocity);
        text(`γ = ${gamma.toFixed(2)}`, centerX + vx + 15, centerY + 20);
    }
}

function drawLegend() {
    fill(colors.text);
    noStroke();
    textSize(12);
    textAlign(LEFT, TOP);
    
    let legendY = 20;
    const legendX = width - 200;
    
    // Title
    fill(255, 255, 255, 220);
    textSize(14);
    text('Field Legend', legendX, legendY);
    legendY += 25;
    
    // Electric field
    if (showElectric) {
        stroke(colors.electric);
        strokeWeight(2);
        line(legendX, legendY + 7, legendX + 20, legendY + 7);
        noStroke();
        fill(colors.text);
        text('Electric Field (E)', legendX + 30, legendY);
        legendY += 25;
        
        if (velocity > 0.1) {
            stroke(colors.electricRel);
            strokeWeight(2);
            line(legendX, legendY + 7, legendX + 20, legendY + 7);
            noStroke();
            fill(colors.text);
            text('Relativistic E', legendX + 30, legendY);
            legendY += 25;
        }
    }
    
    // Magnetic field
    if (showMagnetic) {
        stroke(colors.magnetic);
        strokeWeight(2);
        line(legendX, legendY + 7, legendX + 20, legendY + 7);
        noStroke();
        fill(colors.text);
        text('Magnetic Field (B)', legendX + 30, legendY);
        legendY += 25;
        
        if (velocity > 0.1) {
            stroke(colors.magneticRel);
            strokeWeight(2);
            line(legendX, legendY + 7, legendX + 20, legendY + 7);
            noStroke();
            fill(colors.text);
            text('Relativistic B', legendX + 30, legendY);
            legendY += 25;
        }
    }
    
    // Equipotentials
    if (showEquipotentials) {
        stroke(colors.equipotential);
        strokeDash(5, 3);
        strokeWeight(1);
        line(legendX, legendY + 7, legendX + 20, legendY + 7);
        noStrokeDash();
        noStroke();
        fill(colors.text);
        text('Equipotential Lines', legendX + 30, legendY);
        legendY += 25;
    }
    
    // Velocity
    if (velocity > 0.01) {
        stroke(colors.velocityVector);
        strokeWeight(3);
        line(legendX, legendY + 7, legendX + 20, legendY + 7);
        noStroke();
        fill(colors.text);
        text('Velocity Vector', legendX + 30, legendY);
        legendY += 25;
    }
    
    // Current (for wire scenario)
    if (scenario === 'wire') {
        stroke(colors.current);
        strokeWeight(3);
        line(legendX, legendY + 7, legendX + 20, legendY + 7);
        noStroke();
        fill(colors.text);
        text('Current', legendX + 30, legendY);
    }
}

function drawCoordinateInfo() {
    fill(colors.text);
    noStroke();
    textSize(12);
    textAlign(LEFT, BOTTOM);
    
    const infoY = height - 20;
    
    text(`Scenario: ${scenario.replace(/([A-Z])/g, ' $1')}`, 20, infoY - 20);
    text(`Charge: ${charge > 0 ? '+' : ''}${charge.toFixed(1)}e (${(charge*e).toExponential(1)} C)`, 20, infoY);
    
    if (velocity > 0) {
        text(`Velocity: ${(velocity*100).toFixed(1)}% c`, 250, infoY);
    }
    
    // Frame info for relativistic scenarios
    if (scenario === 'moving' || scenario === 'relativistic') {
        const gamma = 1 / Math.sqrt(1 - velocity * velocity);
        if (gamma > 1.01) {
            text(`Relativistic factor: γ = ${gamma.toFixed(2)}`, 400, infoY);
        }
    }
}

function drawArrow(x1, y1, x2, y2, color) {
    stroke(color);
    strokeWeight(2);
    line(x1, y1, x2, y2);
    
    // Arrowhead
    const angle = atan2(y2 - y1, x2 - x1);
    push();
    translate(x2, y2);
    rotate(angle);
    line(0, 0, -10, -5);
    line(0, 0, -10, 5);
    pop();
}

function strokeDash(len, gap) {
    drawingContext.setLineDash([len, gap]);
}

function noStrokeDash() {
    drawingContext.setLineDash([]);
}

function updateFieldCache() {
    fieldCache = [];
    // Cache field calculations for performance
    // Implementation depends on specific needs
}

function setupEventListeners() {
    // Scenario selection
    document.getElementById('scenarioSelect').addEventListener('change', function(e) {
        scenario = e.target.value;
        updateScenarioControls();
        updateFieldInfo();
    });
    
    // Charge slider
    const chargeSlider = document.getElementById('chargeSlider');
    chargeSlider.addEventListener('input', function(e) {
        charge = parseFloat(e.target.value);
        document.getElementById('chargeValue').textContent = 
            (charge >= 0 ? '+' : '') + charge.toFixed(1) + 'e';
        updateFieldInfo();
    });
    
    // Velocity slider
    const velocitySlider = document.getElementById('velocitySlider');
    velocitySlider.addEventListener('input', function(e) {
        velocity = parseFloat(e.target.value);
        document.getElementById('velocityValue').textContent = 
            (velocity * 100).toFixed(1) + '% c';
        
        // Update velocity input
        document.getElementById('velocityInput').value = velocity.toFixed(3);
        updateFieldInfo();
    });
    
    // Velocity direct input
    document.getElementById('velocityInput').addEventListener('input', function(e) {
        velocity = parseFloat(e.target.value);
        if (Math.abs(velocity) >= 1) {
            velocity = 0.99 * Math.sign(velocity);
            e.target.value = velocity.toFixed(3);
        }
        velocitySlider.value = Math.abs(velocity);
        document.getElementById('velocityValue').textContent = 
            (Math.abs(velocity) * 100).toFixed(1) + '% c';
        updateFieldInfo();
    });
    
    // Position inputs
    document.getElementById('posX').addEventListener('input', function(e) {
        posX = parseFloat(e.target.value);
        updateFieldInfo();
    });
    
    document.getElementById('posY').addEventListener('input', function(e) {
        posY = parseFloat(e.target.value);
        updateFieldInfo();
    });
    
    // Display options
    document.getElementById('showElectric').addEventListener('change', function(e) {
        showElectric = e.target.checked;
    });
    
    document.getElementById('showMagnetic').addEventListener('change', function(e) {
        showMagnetic = e.target.checked;
    });
    
    document.getElementById('showFieldVectors').addEventListener('change', function(e) {
        showVectors = e.target.checked;
    });
    
    document.getElementById('showEquipotentials').addEventListener('change', function(e) {
        showEquipotentials = e.target.checked;
    });
    
    document.getElementById('showGrid').addEventListener('change', function(e) {
        showGrid = e.target.checked;
    });
    
    document.getElementById('showFieldStrength').addEventListener('change', function(e) {
        showFieldStrength = e.target.checked;
    });
    
    // Field scale
    document.getElementById('fieldScaleSlider').addEventListener('input', function(e) {
        fieldScale = parseFloat(e.target.value);
        document.getElementById('fieldScaleValue').textContent = fieldScale.toFixed(1);
    });
    
    document.getElementById('fieldLinesSlider').addEventListener('input', function(e) {
        numFieldLines = parseInt(e.target.value);
        document.getElementById('fieldLinesValue').textContent = numFieldLines;
    });
    
    // Control buttons
    document.getElementById('playPauseBtn').addEventListener('click', function() {
        isPlaying = !isPlaying;
        const icon = this.querySelector('i');
        const text = this.querySelector('span');
        if (isPlaying) {
            icon.className = 'fas fa-pause';
            text.textContent = ' Pause';
        } else {
            icon.className = 'fas fa-play';
            text.textContent = ' Play';
        }
    });
    
    document.getElementById('resetBtn').addEventListener('click', function() {
        time = 0;
        posX = 0;
        posY = 0;
        velocity = 0;
        charge = 1.0;
        
        // Reset UI elements
        document.getElementById('posX').value = '0';
        document.getElementById('posY').value = '0';
        document.getElementById('velocitySlider').value = '0';
        document.getElementById('velocityInput').value = '0';
        document.getElementById('chargeSlider').value = '1';
        document.getElementById('velocityValue').textContent = '0.0% c';
        document.getElementById('chargeValue').textContent = '+1.0e';
        
        // Reset to default scenario
        scenario = 'stationary';
        document.getElementById('scenarioSelect').value = 'stationary';
        updateScenarioControls();
        
        updateFieldInfo();
    });
    
    document.getElementById('snapshotBtn').addEventListener('click', function() {
        // Create a temporary canvas for download
        const link = document.createElement('a');
        link.download = `field-visualizer-${scenario}-${Date.now()}.png`;
        link.href = canvas.elt.toDataURL('image/png');
        link.click();
        
        // Show notification
        showNotification('Snapshot saved!', 'success');
    });
    
    // Initialize scenario controls
    updateScenarioControls();
}

function updateScenarioControls() {
    const scenario = document.getElementById('scenarioSelect').value;
    const chargeControl = document.getElementById('chargeControl');
    const velocityControl = document.getElementById('velocityControl');
    const positionControl = document.getElementById('positionControl');
    
    // Show/hide controls based on scenario
    switch (scenario) {
        case 'stationary':
            chargeControl.style.display = 'block';
            velocityControl.style.display = 'none';
            positionControl.style.display = 'block';
            break;
            
        case 'moving':
        case 'relativistic':
            chargeControl.style.display = 'block';
            velocityControl.style.display = 'block';
            positionControl.style.display = 'block';
            break;
            
        case 'dipole':
        case 'wire':
        case 'parallelPlates':
            chargeControl.style.display = 'none';
            velocityControl.style.display = scenario === 'wire' ? 'block' : 'none';
            positionControl.style.display = 'none';
            break;
    }
}

function updateFieldInfo() {
    // Calculate gamma
    const gamma = 1 / Math.sqrt(1 - velocity * velocity);
    document.getElementById('gammaValue').textContent = gamma.toFixed(3);
    
    // Calculate field strengths based on scenario
    let eField = 0;
    let bField = 0;
    const r = 1; // Reference distance of 1 meter
    
    switch (scenario) {
        case 'stationary':
        case 'moving':
            // Coulomb's law with relativistic correction
            eField = k * Math.abs(charge * e) / (r * r);
            if (velocity > 0) {
                // Enhanced perpendicular components for moving charge
                eField *= gamma;
                // Magnetic field from moving charge (Biot-Savart law)
                bField = (mu0 / (4 * Math.PI)) * Math.abs(charge * e) * velocity * c / (r * r);
            }
            break;
            
        case 'dipole':
            // Approximate dipole field strength
            const dipoleMoment = Math.abs(charge * e) * 0.1; // 10cm separation
            eField = (1 / (4 * Math.PI * epsilon0)) * dipoleMoment / (r * r * r);
            break;
            
        case 'wire':
            // Magnetic field from current-carrying wire
            const current = velocity * 1e6; // Scale for visualization
            bField = (mu0 * current) / (2 * Math.PI * r);
            break;
            
        case 'parallelPlates':
            // Uniform field between parallel plates
            eField = Math.abs(charge) * 1e4; // Simplified
            break;
    }
    
    // Format and display values
    document.getElementById('eFieldValue').textContent = formatScientific(eField, 'N/C');
    document.getElementById('bFieldValue').textContent = formatScientific(bField, 'T');
    
    // Update transformation formulas
    updateTransformationFormulas();
}

function updateTransformationFormulas() {
    const gamma = 1 / Math.sqrt(1 - velocity * velocity);
    
    let formulas = '';
    if (velocity > 0.01) {
        formulas = `
            <div class="formula-group">
                <div class="formula-title">Relativistic Transformations:</div>
                <div class="formula">E∥′ = E∥</div>
                <div class="formula">E⟂′ = γ(E⟂ + v × B)</div>
                <div class="formula">B∥′ = B∥</div>
                <div class="formula">B⟂′ = γ(B⟂ - (v × E)/c²)</div>
                <div class="formula" style="margin-top: 10px;">γ = ${gamma.toFixed(3)}</div>
            </div>
        `;
    } else {
        formulas = `
            <div class="formula-group">
                <div class="formula-title">Classical Fields:</div>
                <div class="formula">E = kq/r²</div>
                <div class="formula">B = (μ₀/4π) q(v × r̂)/r²</div>
            </div>
        `;
    }
    
    document.getElementById('transformationFormulas').innerHTML = formulas;
}

function formatScientific(value, unit) {
    if (value === 0) return `0 ${unit}`;
    
    if (value < 1e-6) {
        return `${(value * 1e9).toFixed(2)} n${unit}`;
    } else if (value < 1e-3) {
        return `${(value * 1e6).toFixed(2)} μ${unit}`;
    } else if (value < 1) {
        return `${(value * 1e3).toFixed(2)} m${unit}`;
    } else if (value < 1e3) {
        return `${value.toFixed(2)} ${unit}`;
    } else if (value < 1e6) {
        return `${(value / 1e3).toFixed(2)} k${unit}`;
    } else {
        return `${(value / 1e6).toFixed(2)} M${unit}`;
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Make functions available globally
window.setup = setup;
window.draw = draw;
window.updateFieldInfo = updateFieldInfo;
