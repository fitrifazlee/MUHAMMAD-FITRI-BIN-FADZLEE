// Field Visualizer Module
// Complete Electric and Magnetic Field Visualizations with Relativistic Effects

let canvas;
let isPlaying = true;
let charge = 1.0; // in units of elementary charge (e = 1.602e-19 C)
let velocity = 0; // v/c (dimensionless, 0-0.99)
let posX = 0, posY = 0;
let scenario = 'stationary';
let showElectric = true;
let showMagnetic = true;
let showVectors = false;
let showEquipotentials = false;
let showGrid = true;
let showFieldTransformation = false;
let fieldScale = 5;
let numFieldLines = 20;
let time = 0;
let simulationQuality = 1; // 1 = normal, 2 = high quality
let selectedPoint = null;

// Field calculation settings
const FIELD_RESOLUTION = 25; // Grid resolution for vector field
const MAX_FIELD_STRENGTH = 1e6; // Max field strength for normalization
const EQUIPOTENTIAL_LEVELS = 8;

// Colors
const colors = {
    background: [13, 27, 42],
    grid: [64, 64, 64, 50],
    electric: [255, 87, 34, 200], // Orange-red
    magnetic: [33, 150, 243, 200], // Blue
    equipotential: [76, 175, 80, 150], // Green
    positiveCharge: [244, 67, 54, 255], // Red
    negativeCharge: [33, 150, 243, 255], // Blue
    velocityVector: [255, 193, 7, 255], // Yellow
    transformationEffect: [186, 85, 211, 180], // Purple for relativistic effects
    selectedPoint: [255, 255, 0, 255], // Yellow for selected point
    text: [224, 224, 224, 255],
    infoBox: [30, 41, 59, 200]
};

// Physical constants
const k = 8.9875517873681764e9; // Coulomb constant (N·m²/C²)
const mu0 = 4 * Math.PI * 1e-7; // Magnetic constant (T·m/A)
const c = 299792458; // Speed of light in m/s
const e = 1.602176634e-19; // Elementary charge in Coulombs

// Scenario configurations
const scenarios = {
    stationary: {
        name: "Stationary Point Charge",
        description: "A single charge at rest. Shows radial electric field only.",
        charges: [{x: 0, y: 0, q: 1}]
    },
    moving: {
        name: "Moving Charge",
        description: "A charge moving at constant velocity. Shows both E and B fields with relativistic effects.",
        charges: [{x: 0, y: 0, q: 1, vx: 0.5}]
    },
    dipole: {
        name: "Electric Dipole",
        description: "Equal and opposite charges separated by a distance.",
        charges: [
            {x: -1, y: 0, q: 1},
            {x: 1, y: 0, q: -1}
        ]
    },
    wire: {
        name: "Current-Carrying Wire",
        description: "Infinitely long straight wire carrying current.",
        current: 1.0, // Amperes
        wireLength: 10
    },
    twoCharges: {
        name: "Two Similar Charges",
        description: "Two charges of same sign showing field repulsion.",
        charges: [
            {x: -1, y: 0, q: 1},
            {x: 1, y: 0, q: 1}
        ]
    },
    quadrupole: {
        name: "Quadrupole",
        description: "Four charges arranged in alternating pattern.",
        charges: [
            {x: -1, y: -1, q: 1},
            {x: 1, y: -1, q: -1},
            {x: -1, y: 1, q: -1},
            {x: 1, y: 1, q: 1}
        ]
    }
};

function setup() {
    canvas = createCanvas(1000, 700);
    canvas.parent('fieldCanvas');
    canvas.mousePressed(canvasMousePressed);
    canvas.mouseMoved(canvasMouseMoved);
    
    // Setup event listeners
    setupEventListeners();
    
    // Initial update
    updateFieldInfo();
    
    // Set up initial scenario
    updateScenario();
}

function draw() {
    // Update time if playing
    if (isPlaying) {
        time += 0.016; // Approx 60 FPS
    }
    
    // Dark background
    background(colors.background);
    
    // Draw grid if enabled
    if (showGrid) drawGrid();
    
    // Draw coordinate axes
    drawAxes();
    
    // Save transformation state
    push();
    
    // Center coordinate system
    translate(width/2, height/2);
    scale(50, -50); // 50 pixels per unit, invert Y axis
    
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
        case 'twoCharges':
            drawTwoCharges();
            break;
        case 'quadrupole':
            drawQuadrupole();
            break;
    }
    
    // Draw selected point info if needed
    if (selectedPoint) {
        drawSelectedPointInfo();
    }
    
    pop(); // Restore transformation
    
    // Draw legend and info
    drawLegend();
    drawTransformationInfo();
}

function drawGrid() {
    push();
    translate(width/2, height/2);
    
    stroke(colors.grid);
    strokeWeight(1);
    
    let gridSpacing = 50; // pixels
    let gridSize = 10; // units
    
    // Calculate visible grid bounds
    let left = -width/2;
    let right = width/2;
    let top = -height/2;
    let bottom = height/2;
    
    // Draw grid lines
    for (let x = -gridSize; x <= gridSize; x++) {
        let screenX = x * gridSpacing;
        line(screenX, top, screenX, bottom);
        
        // Grid labels
        if (x !== 0) {
            fill(colors.grid);
            noStroke();
            textSize(10);
            textAlign(CENTER, TOP);
            text(x.toString(), screenX, 10);
        }
    }
    
    for (let y = -gridSize; y <= gridSize; y++) {
        let screenY = y * gridSpacing;
        line(left, screenY, right, screenY);
        
        // Grid labels
        if (y !== 0) {
            fill(colors.grid);
            noStroke();
            textSize(10);
            textAlign(RIGHT, CENTER);
            text(y.toString(), -10, screenY);
        }
    }
    
    pop();
}

function drawAxes() {
    push();
    translate(width/2, height/2);
    
    // Axes lines
    stroke(200, 200, 200, 150);
    strokeWeight(2);
    
    // x-axis
    line(-width/2, 0, width/2, 0);
    // y-axis
    line(0, -height/2, 0, height/2);
    
    // Axis labels
    fill(colors.text);
    noStroke();
    textSize(14);
    textAlign(CENTER, CENTER);
    text('x (m)', width/2 - 30, -20);
    text('y (m)', 20, -height/2 + 30);
    
    // Origin label
    textSize(12);
    text('(0,0)', 15, 15);
    
    pop();
}

function drawStationaryCharge() {
    // Calculate gamma (1 for stationary)
    let gamma = 1;
    
    // Draw electric field
    if (showElectric) {
        if (showVectors) {
            drawElectricVectors(0, 0, charge, 0, gamma);
        } else {
            drawElectricFieldLines(0, 0, charge, 0, gamma);
        }
    }
    
    // Draw charge
    drawCharge(0, 0, charge, 0);
    
    // Draw equipotentials if enabled
    if (showEquipotentials) {
        drawEquipotentials(0, 0, charge, 0, gamma);
    }
}

function drawMovingCharge() {
    let v = velocity;
    let gamma = 1 / Math.sqrt(1 - v*v);
    
    // Position of moving charge
    let xPos = v * time * 3; // Move 3 units per second
    
    // Draw electric field (relativistically contracted)
    if (showElectric) {
        if (showVectors) {
            drawElectricVectors(xPos, 0, charge, v, gamma);
        } else {
            drawElectricFieldLines(xPos, 0, charge, v, gamma);
        }
    }
    
    // Draw magnetic field
    if (showMagnetic && v > 0.01) {
        if (showVectors) {
            drawMagneticVectors(xPos, 0, charge, v, gamma);
        } else {
            drawMagneticFieldLines(xPos, 0, charge, v, gamma);
        }
    }
    
    // Draw charge with velocity indicator
    drawCharge(xPos, 0, charge, v);
    
    // Draw equipotentials if enabled
    if (showEquipotentials) {
        drawEquipotentials(xPos, 0, charge, v, gamma);
    }
    
    // Show relativistic transformation info
    if (showFieldTransformation && v > 0.01) {
        drawTransformationEffects(xPos, 0, charge, v, gamma);
    }
}

function drawDipole() {
    let spacing = 2.0;
    
    // Draw electric field
    if (showElectric) {
        if (showVectors) {
            // Draw vector field for dipole
            drawDipoleVectorField(-spacing/2, 0, spacing/2, 0, 1, -1);
        } else {
            drawDipoleFieldLines(-spacing/2, 0, spacing/2, 0, 1, -1);
        }
    }
    
    // Draw charges
    drawCharge(-spacing/2, 0, 1, 0);
    drawCharge(spacing/2, 0, -1, 0);
    
    // Draw equipotentials if enabled
    if (showEquipotentials) {
        drawDipoleEquipotentials(-spacing/2, 0, spacing/2, 0, 1, -1);
    }
}

function drawCurrentWire() {
    let current = 1.0; // Amperes
    
    // Draw wire
    stroke(200, 200, 200);
    strokeWeight(3);
    line(-5, -height/100, 5, height/100);
    
    // Current direction indicators
    fill(colors.magnetic);
    noStroke();
    for (let y = -4; y <= 4; y += 1) {
        if (y % 2 === 0) {
            triangle(0.1, y, 0.3, y + 0.3, 0.3, y - 0.3);
        }
    }
    
    // Draw magnetic field
    if (showMagnetic) {
        if (showVectors) {
            drawWireMagneticVectors(current);
        } else {
            drawWireMagneticFieldLines(current);
        }
    }
    
    // Label
    fill(colors.text);
    noStroke();
    textSize(12);
    textAlign(CENTER, CENTER);
    text(`I = ${current} A`, 0, 2.5);
}

function drawTwoCharges() {
    let spacing = 3.0;
    
    // Draw electric field
    if (showElectric) {
        if (showVectors) {
            // Draw vector field for two same charges
            for (let x = -width/100; x <= width/100; x += 0.5) {
                for (let y = -height/100; y <= height/100; y += 0.5) {
                    if (dist(x, y, -spacing/2, 0) > 0.3 && dist(x, y, spacing/2, 0) > 0.3) {
                        let [ex, ey] = calculateElectricFieldAtPoint(x, y, [
                            {x: -spacing/2, y: 0, q: 1},
                            {x: spacing/2, y: 0, q: 1}
                        ]);
                        drawFieldVector(x, y, ex, ey, colors.electric, 0.2);
                    }
                }
            }
        } else {
            drawTwoChargesFieldLines(-spacing/2, 0, spacing/2, 0, 1, 1);
        }
    }
    
    // Draw charges
    drawCharge(-spacing/2, 0, 1, 0);
    drawCharge(spacing/2, 0, 1, 0);
}

function drawQuadrupole() {
    let spacing = 1.5;
    
    // Draw charges
    drawCharge(-spacing, -spacing, 1, 0);
    drawCharge(spacing, -spacing, -1, 0);
    drawCharge(-spacing, spacing, -1, 0);
    drawCharge(spacing, spacing, 1, 0);
    
    // Draw electric field
    if (showElectric) {
        drawQuadrupoleField(spacing);
    }
}

function drawCharge(x, y, q, v) {
    push();
    
    // Charge size based on magnitude
    let size = abs(q) * 0.4;
    
    // Color based on charge sign
    if (q > 0) {
        fill(colors.positiveCharge);
    } else {
        fill(colors.negativeCharge);
    }
    
    noStroke();
    ellipse(x, y, size, size);
    
    // Charge symbol
    fill(255);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(`${q > 0 ? '+' : ''}${q.toFixed(0)}e`, x, y);
    
    // Velocity vector if moving
    if (abs(v) > 0.01) {
        stroke(colors.velocityVector);
        strokeWeight(2);
        let arrowLength = v * 0.8;
        drawArrow(x, y, x + arrowLength, y, colors.velocityVector);
        
        // Velocity label
        fill(colors.velocityVector);
        noStroke();
        textSize(10);
        textAlign(LEFT, BOTTOM);
        text(`${(v*100).toFixed(0)}% c`, x + arrowLength + 0.1, y);
    }
    
    pop();
}

function drawElectricVectors(x, y, q, v, gamma) {
    let step = 0.5;
    
    for (let px = -5; px <= 5; px += step) {
        for (let py = -4; py <= 4; py += step) {
            let dx = px - x;
            let dy = py - y;
            let r = sqrt(dx*dx + dy*dy);
            
            if (r > 0.5) { // Avoid drawing vectors too close to charge
                // Calculate electric field at point
                let ex = 0, ey = 0;
                
                if (v === 0) {
                    // Stationary charge
                    ex = q * dx / (r*r*r);
                    ey = q * dy / (r*r*r);
                } else {
                    // Moving charge - relativistic field transformation
                    let beta = v;
                    let theta = atan2(dy, dx);
                    
                    // Radial distance in charge's rest frame
                    let rPrime = r * sqrt(1 - beta*beta*sin(theta)*sin(theta));
                    
                    // Electric field components in lab frame
                    ex = (gamma * q * dx) / (rPrime*rPrime*rPrime);
                    ey = (gamma * q * dy) / (rPrime*rPrime*rPrime);
                    
                    // Field is stronger perpendicular to motion
                    let factor = 1 - beta*beta;
                    if (abs(theta) > PI/4 && abs(theta) < 3*PI/4) {
                        ey *= gamma;
                    }
                }
                
                // Normalize and scale
                let mag = sqrt(ex*ex + ey*ey);
                if (mag > 0.001) {
                    ex = ex / mag * 0.3 * fieldScale;
                    ey = ey / mag * 0.3 * fieldScale;
                    
                    // Draw vector
                    drawFieldVector(px, py, ex, ey, colors.electric, 0.1);
                }
            }
        }
    }
}

function drawElectricFieldLines(x, y, q, v, gamma) {
    let numLines = numFieldLines;
    let lineLength = 8;
    
    stroke(colors.electric);
    strokeWeight(1.5);
    noFill();
    
    for (let i = 0; i < numLines; i++) {
        let angle = (i * TWO_PI) / numLines;
        
        // Start point slightly away from charge
        let startX = x + 0.5 * cos(angle);
        let startY = y + 0.5 * sin(angle);
        
        // Draw field line
        drawFieldLine(startX, startY, angle, q, v, gamma, lineLength, false);
    }
}

function drawMagneticVectors(x, y, q, v, gamma) {
    if (v === 0) return;
    
    let step = 0.6;
    let beta = v;
    
    for (let px = -5; px <= 5; px += step) {
        for (let py = -4; py <= 4; py += step) {
            let dx = px - x;
            let dy = py - y;
            let r = sqrt(dx*dx + dy*dy);
            
            if (r > 0.6) {
                // Magnetic field of moving charge: B = (v × E)/c²
                // For simplicity in 2D with v in x-direction:
                let ex = q * dx / (r*r*r);
                let ey = q * dy / (r*r*r);
                
                // B field is perpendicular to both v and r
                let bz = (v * ey) / (c*c); // Only z-component in 2D
                
                // For visualization, we'll show the direction of B
                // B circles around the direction of motion
                let bx = -dy / r * 0.2 * abs(bz) * fieldScale;
                let by = dx / r * 0.2 * abs(bz) * fieldScale;
                
                // Draw vector representing B field direction
                drawFieldVector(px, py, bx, by, colors.magnetic, 0.08);
            }
        }
    }
}

function drawMagneticFieldLines(x, y, q, v, gamma) {
    if (v === 0) return;
    
    stroke(colors.magnetic);
    strokeWeight(1.5);
    noFill();
    
    let numCircles = 6;
    let maxRadius = 4;
    
    for (let i = 1; i <= numCircles; i++) {
        let radius = (i / numCircles) * maxRadius;
        
        // Draw circle for magnetic field line
        beginShape();
        for (let a = 0; a < TWO_PI; a += 0.1) {
            let px = x + radius * cos(a);
            let py = y + radius * sin(a);
            vertex(px, py);
        }
        endShape(CLOSE);
        
        // Add arrowheads to show direction
        for (let a = 0; a < TWO_PI; a += PI/4) {
            let px = x + radius * cos(a);
            let py = y + radius * sin(a);
            let tangentAngle = a + PI/2; // Tangent to circle
            
            push();
            translate(px, py);
            rotate(tangentAngle);
            stroke(colors.magnetic);
            strokeWeight(1);
            line(-0.1, 0, 0.1, 0);
            line(0.1, 0, 0.05, -0.05);
            line(0.1, 0, 0.05, 0.05);
            pop();
        }
    }
}

function drawWireMagneticVectors(current) {
    let step = 0.5;
    
    for (let px = -4; px <= 4; px += step) {
        for (let py = -3; py <= 3; py += step) {
            // Magnetic field around wire: B = μ₀I/(2πr)
            let r = sqrt(px*px + py*py);
            
            if (r > 0.3) {
                // Direction is tangential (circling wire)
                let bx = -py / r * 0.15 * fieldScale;
                let by = px / r * 0.15 * fieldScale;
                
                drawFieldVector(px, py, bx, by, colors.magnetic, 0.08);
            }
        }
    }
}

function drawWireMagneticFieldLines(current) {
    stroke(colors.magnetic);
    strokeWeight(1.5);
    noFill();
    
    let numCircles = 8;
    let maxRadius = 5;
    
    for (let i = 1; i <= numCircles; i++) {
        let radius = (i / numCircles) * maxRadius;
        
        // Draw circle
        ellipse(0, 0, radius*2, radius*2);
        
        // Add direction indicators
        for (let a = 0; a < TWO_PI; a += PI/4) {
            let px = radius * cos(a);
            let py = radius * sin(a);
            let tangentAngle = a + PI/2;
            
            push();
            translate(px, py);
            rotate(tangentAngle);
            stroke(colors.magnetic);
            strokeWeight(1);
            line(-0.1, 0, 0.1, 0);
            line(0.1, 0, 0.05, -0.05);
            line(0.1, 0, 0.05, 0.05);
            pop();
        }
    }
}

function drawFieldLine(startX, startY, startAngle, q, v, gamma, maxSteps, isMagnetic) {
    let steps = 100;
    let stepSize = 0.05;
    let x = startX;
    let y = startY;
    
    beginShape();
    vertex(x, y);
    
    for (let i = 0; i < steps; i++) {
        // Calculate field direction at current point
        let dx = x - startX;
        let dy = y - startY;
        let r = max(sqrt(dx*dx + dy*dy), 0.1);
        
        let fx, fy;
        
        if (isMagnetic) {
            // Magnetic field direction (circles around charge)
            fx = -dy / r;
            fy = dx / r;
        } else {
            // Electric field direction
            if (v === 0) {
                fx = dx / r;
                fy = dy / r;
            } else {
                // Relativistic correction
                let beta = v;
                let theta = atan2(dy, dx);
                let factor = 1 - beta*beta*sin(theta)*sin(theta);
                fx = dx / r / sqrt(factor);
                fy = dy / r / sqrt(factor);
            }
            
            // Adjust for charge sign
            if (q < 0) {
                fx = -fx;
                fy = -fy;
            }
        }
        
        // Normalize
        let mag = sqrt(fx*fx + fy*fy);
        if (mag > 0) {
            fx = fx / mag;
            fy = fy / mag;
        }
        
        x += fx * stepSize;
        y += fy * stepSize;
        
        vertex(x, y);
        
        // Stop conditions
        if (abs(x) > 6 || abs(y) > 5) break;
        if (r > maxSteps) break;
    }
    
    endShape();
    
    // Add arrowhead at end
    let endAngle = atan2(y - startY, x - startX);
    push();
    translate(x, y);
    rotate(endAngle);
    stroke(isMagnetic ? colors.magnetic : colors.electric);
    strokeWeight(1.5);
    line(-0.1, 0, 0.1, 0);
    line(0.1, 0, 0.05, -0.05);
    line(0.1, 0, 0.05, 0.05);
    pop();
}

function drawFieldVector(x, y, vx, vy, color, scale = 1.0) {
    push();
    translate(x, y);
    
    let angle = atan2(vy, vx);
    let magnitude = sqrt(vx*vx + vy*vy);
    
    rotate(angle);
    
    stroke(color);
    strokeWeight(1.5);
    
    // Draw shaft
    line(0, 0, magnitude * scale, 0);
    
    // Draw arrowhead
    if (magnitude > 0.05) {
        line(magnitude * scale, 0, magnitude * scale - 0.1, -0.05);
        line(magnitude * scale, 0, magnitude * scale - 0.1, 0.05);
    }
    
    pop();
}

function drawEquipotentials(x, y, q, v, gamma) {
    stroke(colors.equipotential);
    strokeWeight(1);
    drawingContext.setLineDash([5, 5]);
    
    let numLevels = EQUIPOTENTIAL_LEVELS;
    
    for (let i = 1; i <= numLevels; i++) {
        // Potential level
        let potential = (i * q) / numLevels;
        
        // For stationary charge: equipotentials are circles
        if (v === 0) {
            let radius = abs(q / (potential + 0.001));
            ellipse(x, y, radius*2, radius*2);
        } else {
            // For moving charge: ellipses due to relativistic contraction
            let radius = abs(q / (potential + 0.001));
            let rx = radius / gamma; // Contracted in direction of motion
            let ry = radius;
            
            ellipse(x, y, rx*2, ry*2);
        }
    }
    
    drawingContext.setLineDash([]);
}

function drawTransformationEffects(x, y, q, v, gamma) {
    // Show how fields transform between frames
    stroke(colors.transformationEffect);
    strokeWeight(2);
    noFill();
    
    // Draw lines showing direction of motion
    line(x - 1, y, x + 1, y);
    
    // Label transformation equations
    push();
    translate(x + 1.5, y + 1.5);
    scale(0.03, -0.03); // Scale for readable text
    
    fill(colors.transformationEffect);
    noStroke();
    textSize(20);
    textAlign(LEFT, CENTER);
    text("E' = γ(E + v×B)", 0, 0);
    text("B' = γ(B - v×E/c²)", 0, -30);
    
    pop();
}

function drawDipoleFieldLines(x1, y1, x2, y2, q1, q2) {
    let numLines = 12;
    
    for (let i = 0; i < numLines; i++) {
        let angle = (i * TWO_PI) / numLines;
        
        // Start from positive charge
        if (q1 > 0) {
            let startX = x1 + 0.3 * cos(angle);
            let startY = y1 + 0.3 * sin(angle);
            drawFieldLineToCharge(startX, startY, x2, y2, q1, q2);
        }
    }
}

function drawFieldLineToCharge(startX, startY, targetX, targetY, qStart, qTarget) {
    let steps = 200;
    let stepSize = 0.05;
    let x = startX;
    let y = startY;
    
    beginShape();
    vertex(x, y);
    
    for (let i = 0; i < steps; i++) {
        // Calculate field from both charges
        let dx1 = x - startX;
        let dy1 = y - startY;
        let r1 = max(sqrt(dx1*dx1 + dy1*dy1), 0.1);
        
        let dx2 = x - targetX;
        let dy2 = y - targetY;
        let r2 = max(sqrt(dx2*dx2 + dy2*dy2), 0.1);
        
        // Combined field
        let ex = qStart * dx1 / (r1*r1*r1) + qTarget * dx2 / (r2*r2*r2);
        let ey = qStart * dy1 / (r1*r1*r1) + qTarget * dy2 / (r2*r2*r2);
        
        // Normalize
        let mag = sqrt(ex*ex + ey*ey);
        if (mag > 0) {
            ex = ex / mag;
            ey = ey / mag;
        }
        
        x += ex * stepSize;
        y += ey * stepSize;
        
        vertex(x, y);
        
        // Stop if close to target or out of bounds
        if (dist(x, y, targetX, targetY) < 0.3) break;
        if (abs(x) > 6 || abs(y) > 5) break;
    }
    
    endShape();
}

function drawDipoleEquipotentials(x1, y1, x2, y2, q1, q2) {
    stroke(colors.equipotential);
    strokeWeight(1);
    drawingContext.setLineDash([5, 5]);
    
    let numLevels = 10;
    
    for (let i = -numLevels; i <= numLevels; i++) {
        if (i !== 0) {
            // Sample points on equipotential line
            beginShape();
            for (let angle = 0; angle <= TWO_PI; angle += 0.1) {
                // This is a simplified approximation
                let r = 2 / abs(i);
                let x = (x1 + x2)/2 + r * cos(angle);
                let y = (y1 + y2)/2 + r * sin(angle);
                
                // Adjust for dipole asymmetry
                if (i > 0) x += 0.1;
                else x -= 0.1;
                
                vertex(x, y);
            }
            endShape(CLOSE);
        }
    }
    
    drawingContext.setLineDash([]);
}

function drawQuadrupoleField(spacing) {
    if (showVectors) {
        // Draw vector field
        let step = 0.4;
        for (let x = -3; x <= 3; x += step) {
            for (let y = -3; y <= 3; y += step) {
                if (dist(x, y, -spacing, -spacing) > 0.3 &&
                    dist(x, y, spacing, -spacing) > 0.3 &&
                    dist(x, y, -spacing, spacing) > 0.3 &&
                    dist(x, y, spacing, spacing) > 0.3) {
                    
                    let [ex, ey] = calculateElectricFieldAtPoint(x, y, [
                        {x: -spacing, y: -spacing, q: 1},
                        {x: spacing, y: -spacing, q: -1},
                        {x: -spacing, y: spacing, q: -1},
                        {x: spacing, y: spacing, q: 1}
                    ]);
                    
                    drawFieldVector(x, y, ex, ey, colors.electric, 0.15);
                }
            }
        }
    } else {
        // Draw field lines
        stroke(colors.electric);
        strokeWeight(1.5);
        
        // Draw lines from positive charges
        let angles = [0, PI/2, PI, 3*PI/2];
        for (let angle of angles) {
            let startX = -spacing + 0.3 * cos(angle);
            let startY = -spacing + 0.3 * sin(angle);
            drawQuadrupoleFieldLine(startX, startY, spacing);
        }
    }
}

function drawQuadrupoleFieldLine(startX, startY, spacing) {
    let steps = 150;
    let stepSize = 0.03;
    let x = startX;
    let y = startY;
    
    beginShape();
    vertex(x, y);
    
    for (let i = 0; i < steps; i++) {
        let [ex, ey] = calculateElectricFieldAtPoint(x, y, [
            {x: -spacing, y: -spacing, q: 1},
            {x: spacing, y: -spacing, q: -1},
            {x: -spacing, y: spacing, q: -1},
            {x: spacing, y: spacing, q: 1}
        ]);
        
        // Normalize
        let mag = sqrt(ex*ex + ey*ey);
        if (mag > 0) {
            ex = ex / mag;
            ey = ey / mag;
        }
        
        x += ex * stepSize;
        y += ey * stepSize;
        
        vertex(x, y);
        
        // Stop if out of bounds
        if (abs(x) > 4 || abs(y) > 4) break;
    }
    
    endShape();
}

function calculateElectricFieldAtPoint(x, y, charges) {
    let ex = 0, ey = 0;
    
    for (let charge of charges) {
        let dx = x - charge.x;
        let dy = y - charge.y;
        let r = sqrt(dx*dx + dy*dy);
        let r3 = r * r * r;
        
        if (r3 > 0.001) {
            ex += charge.q * dx / r3;
            ey += charge.q * dy / r3;
        }
    }
    
    return [ex, ey];
}

function drawDipoleVectorField(x1, y1, x2, y2, q1, q2) {
    let step = 0.4;
    
    for (let x = -4; x <= 4; x += step) {
        for (let y = -3; y <= 3; y += step) {
            if (dist(x, y, x1, y1) > 0.3 && dist(x, y, x2, y2) > 0.3) {
                let [ex, ey] = calculateElectricFieldAtPoint(x, y, [
                    {x: x1, y: y1, q: q1},
                    {x: x2, y: y2, q: q2}
                ]);
                
                // Normalize for visualization
                let mag = sqrt(ex*ex + ey*ey);
                if (mag > 0.01) {
                    ex = ex / mag * 0.2 * fieldScale;
                    ey = ey / mag * 0.2 * fieldScale;
                    drawFieldVector(x, y, ex, ey, colors.electric, 0.1);
                }
            }
        }
    }
}

function drawTwoChargesFieldLines(x1, y1, x2, y2, q1, q2) {
    let numLines = 16;
    
    for (let i = 0; i < numLines; i++) {
        let angle = (i * TWO_PI) / numLines;
        
        // Start from each charge
        let startX1 = x1 + 0.3 * cos(angle);
        let startY1 = y1 + 0.3 * sin(angle);
        drawFieldLineAway(startX1, startY1, x1, y1, q1, q2, x2, y2);
        
        let startX2 = x2 + 0.3 * cos(angle + PI/numLines);
        let startY2 = y2 + 0.3 * sin(angle + PI/numLines);
        drawFieldLineAway(startX2, startY2, x2, y2, q2, q1, x1, y1);
    }
}

function drawFieldLineAway(startX, startY, sourceX, sourceY, sourceQ, otherQ, otherX, otherY) {
    let steps = 200;
    let stepSize = 0.05;
    let x = startX;
    let y = startY;
    
    beginShape();
    vertex(x, y);
    
    for (let i = 0; i < steps; i++) {
        // Field from both charges
        let dx1 = x - sourceX;
        let dy1 = y - sourceY;
        let r1 = max(sqrt(dx1*dx1 + dy1*dy1), 0.1);
        
        let dx2 = x - otherX;
        let dy2 = y - otherY;
        let r2 = max(sqrt(dx2*dx2 + dy2*dy2), 0.1);
        
        // Both charges are positive, so field pushes away
        let ex = sourceQ * dx1 / (r1*r1*r1) + otherQ * dx2 / (r2*r2*r2);
        let ey = sourceQ * dy1 / (r1*r1*r1) + otherQ * dy2 / (r2*r2*r2);
        
        // Normalize
        let mag = sqrt(ex*ex + ey*ey);
        if (mag > 0) {
            ex = ex / mag;
            ey = ey / mag;
        }
        
        x += ex * stepSize;
        y += ey * stepSize;
        
        vertex(x, y);
        
        // Stop if out of bounds
        if (abs(x) > 6 || abs(y) > 5) break;
    }
    
    endShape();
}

function drawArrow(x1, y1, x2, y2, color) {
    push();
    stroke(color);
    strokeWeight(2);
    
    line(x1, y1, x2, y2);
    
    // Arrowhead
    let angle = atan2(y2 - y1, x2 - x1);
    push();
    translate(x2, y2);
    rotate(angle);
    line(0, 0, -0.2, -0.1);
    line(0, 0, -0.2, 0.1);
    pop();
    
    pop();
}

function drawLegend() {
    let legendX = 20;
    let legendY = 50;
    
    fill(colors.infoBox);
    noStroke();
    rect(legendX - 10, legendY - 10, 200, 150, 5);
    
    fill(colors.text);
    noStroke();
    textSize(14);
    textAlign(LEFT, TOP);
    text('Legend:', legendX, legendY);
    
    textSize(12);
    legendY += 25;
    
    // Electric field
    if (showElectric) {
        fill(colors.electric);
        rect(legendX, legendY, 15, 15, 3);
        fill(colors.text);
        text('Electric Field (E)', legendX + 25, legendY);
        legendY += 25;
    }
    
    // Magnetic field
    if (showMagnetic) {
        fill(colors.magnetic);
        rect(legendX, legendY, 15, 15, 3);
        fill(colors.text);
        text('Magnetic Field (B)', legendX + 25, legendY);
        legendY += 25;
    }
    
    // Equipotentials
    if (showEquipotentials) {
        stroke(colors.equipotential);
        strokeWeight(1);
        drawingContext.setLineDash([3, 3]);
        line(legendX, legendY + 7, legendX + 15, legendY + 7);
        noStroke();
        drawingContext.setLineDash([]);
        fill(colors.text);
        text('Equipotential Lines', legendX + 25, legendY);
        legendY += 25;
    }
    
    // Relativistic effects
    if (showFieldTransformation && velocity > 0.01) {
        fill(colors.transformationEffect);
        rect(legendX, legendY, 15, 15, 3);
        fill(colors.text);
        text('Relativistic Effects', legendX + 25, legendY);
    }
}

function drawTransformationInfo() {
    if (scenario === 'moving' && velocity > 0.01) {
        let infoX = width - 250;
        let infoY = 50;
        
        fill(colors.infoBox);
        noStroke();
        rect(infoX - 10, infoY - 10, 240, 120, 5);
        
        fill(colors.text);
        textSize(14);
        textAlign(LEFT, TOP);
        text('Relativistic Effects:', infoX, infoY);
        
        textSize(12);
        infoY += 25;
        
        let gamma = 1 / sqrt(1 - velocity*velocity);
        let beta = velocity;
        
        text(`γ (Gamma) = ${gamma.toFixed(3)}`, infoX, infoY);
        infoY += 20;
        text(`β = v/c = ${beta.toFixed(3)}`, infoX, infoY);
        infoY += 20;
        text(`E⊥ enhanced by γ`, infoX, infoY);
        infoY += 20;
        text(`B field appears`, infoX, infoY);
    }
}

function drawSelectedPointInfo() {
    if (!selectedPoint) return;
    
    let {x, y} = selectedPoint;
    
    // Convert to simulation coordinates
    let simX = (x - width/2) / 50;
    let simY = -(y - height/2) / 50;
    
    // Draw crosshair at selected point
    push();
    stroke(colors.selectedPoint);
    strokeWeight(1);
    drawingContext.setLineDash([5, 5]);
    line(x, 0, x, height);
    line(0, y, width, y);
    drawingContext.setLineDash([]);
    pop();
    
    // Draw info box
    let infoX = x + 20;
    let infoY = y - 60;
    
    if (infoX > width - 200) infoX = x - 220;
    if (infoY < 20) infoY = y + 20;
    
    fill(colors.infoBox);
    noStroke();
    rect(infoX - 10, infoY - 10, 210, 80, 5);
    
    fill(colors.text);
    textSize(12);
    textAlign(LEFT, TOP);
    
    text(`Position: (${simX.toFixed(2)}, ${simY.toFixed(2)}) m`, infoX, infoY);
    
    // Calculate field at this point
    let eField = 0, bField = 0;
    
    if (scenario === 'stationary') {
        let r = sqrt(simX*simX + simY*simY);
        eField = k * charge * e / (r*r + 0.01); // Avoid division by zero
    } else if (scenario === 'moving') {
        let v = velocity;
        let gamma = 1 / sqrt(1 - v*v);
        let dx = simX - v * time * 3;
        let dy = simY;
        let r = sqrt(dx*dx + dy*dy);
        
        if (r > 0.1) {
            eField = gamma * k * charge * e / (r*r);
            bField = (v / (c*c)) * eField;
        }
    }
    
    text(`E = ${eField.toExponential(2)} N/C`, infoX, infoY + 20);
    text(`B = ${bField.toExponential(2)} T`, infoX, infoY + 40);
}

function canvasMousePressed() {
    let x = mouseX;
    let y = mouseY;
    
    // Convert to simulation coordinates
    let simX = (x - width/2) / 50;
    let simY = -(y - height/2) / 50;
    
    // Check if we clicked near a charge
    let clickedOnCharge = false;
    
    switch (scenario) {
        case 'stationary':
            if (dist(simX, simY, 0, 0) < 0.3) clickedOnCharge = true;
            break;
        case 'moving':
            let chargeX = velocity * time * 3;
            if (dist(simX, simY, chargeX, 0) < 0.3) clickedOnCharge = true;
            break;
        case 'dipole':
            if (dist(simX, simY, -1, 0) < 0.3 || dist(simX, simY, 1, 0) < 0.3) clickedOnCharge = true;
            break;
    }
    
    if (clickedOnCharge) {
        // If clicked on charge, select it
        selectedPoint = {x, y};
        document.getElementById('selectedPointInfo').style.display = 'block';
        document.getElementById('selectedCoords').textContent = 
            `(${simX.toFixed(2)}, ${simY.toFixed(2)})`;
    } else {
        // Otherwise, add a field measurement point
        selectedPoint = {x, y};
    }
}

function canvasMouseMoved() {
    // Update mouse position display
    let simX = (mouseX - width/2) / 50;
    let simY = -(mouseY - height/2) / 50;
    
    document.getElementById('mousePosition').textContent = 
        `(${simX.toFixed(2)}, ${simY.toFixed(2)})`;
}

function updateScenario() {
    let scenarioConfig = scenarios[scenario];
    
    // Update scenario description
    document.getElementById('scenarioDescription').textContent = scenarioConfig.description;
    
    // Update charge value if scenario has specific charges
    if (scenarioConfig.charges) {
        charge = scenarioConfig.charges[0].q;
        document.getElementById('chargeSlider').value = charge;
        document.getElementById('chargeValue').textContent = 
            (charge >= 0 ? '+' : '') + charge.toFixed(1) + 'e';
    }
    
    // For moving charge scenario, set default velocity
    if (scenario === 'moving') {
        velocity = 0.6;
        document.getElementById('velocitySlider').value = velocity;
        document.getElementById('velocityValue').textContent = velocity.toFixed(2) + 'c';
    }
    
    updateFieldInfo();
}

function updateFieldInfo() {
    // Calculate gamma
    let gamma = 1 / Math.sqrt(1 - velocity * velocity);
    document.getElementById('gammaValue').textContent = gamma.toFixed(3);
    
    // Calculate field strengths at 1 meter distance
    let r = 1.0; // 1 meter distance
    let eCharge = Math.abs(charge) * e; // Convert to Coulombs
    
    // Electric field
    let eField = k * eCharge / (r * r);
    
    // Apply relativistic correction for moving charge
    if (velocity > 0) {
        // Perpendicular component is enhanced by gamma
        eField *= gamma;
    }
    
    // Magnetic field (only for moving charges)
    let bField = 0;
    if (velocity > 0.01) {
        // B = (v × E)/c² for moving point charge
        bField = (velocity * eField) / (c * c);
    }
    
    // Update display
    document.getElementById('eFieldValue').textContent = eField.toExponential(2) + ' N/C';
    document.getElementById('bFieldValue').textContent = bField.toExponential(2) + ' T';
    
    // Update transformation formulas
    if (velocity > 0.01) {
        document.getElementById('transformationInfo').innerHTML = `
            <strong>Field Transformations:</strong><br>
            E∥' = E∥<br>
            E⟂' = γ(E⟂ + v × B)<br>
            B∥' = B∥<br>
            B⟂' = γ(B⟂ - v × E/c²)<br>
            γ = ${gamma.toFixed(3)}
        `;
    } else {
        document.getElementById('transformationInfo').innerHTML = `
            <strong>Non-relativistic Fields:</strong><br>
            E = kq/r²<br>
            B = 0 (stationary charge)
        `;
    }
}

function setupEventListeners() {
    // Scenario selection
    const scenarioSelect = document.getElementById('scenarioSelect');
    scenarioSelect.addEventListener('change', function(e) {
        scenario = e.target.value;
        updateScenario();
    });
    
    // Charge slider
    document.getElementById('chargeSlider').addEventListener('input', function(e) {
        charge = parseFloat(e.target.value);
        document.getElementById('chargeValue').textContent = 
            (charge >= 0 ? '+' : '') + charge.toFixed(1) + 'e';
        updateFieldInfo();
    });
    
    // Velocity slider
    document.getElementById('velocitySlider').addEventListener('input', function(e) {
        velocity = parseFloat(e.target.value);
        document.getElementById('velocityValue').textContent = velocity.toFixed(2) + 'c';
        updateFieldInfo();
    });
    
    // Position inputs
    document.getElementById('posX').addEventListener('input', function(e) {
        posX = parseFloat(e.target.value);
    });
    
    document.getElementById('posY').addEventListener('input', function(e) {
        posY = parseFloat(e.target.value);
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
    
    document.getElementById('showTransformation').addEventListener('change', function(e) {
        showFieldTransformation = e.target.checked;
    });
    
    // Field scale
    document.getElementById('fieldScaleSlider').addEventListener('input', function(e) {
        fieldScale = parseFloat(e.target.value);
    });
    
    document.getElementById('fieldLinesSlider').addEventListener('input', function(e) {
        numFieldLines = parseFloat(e.target.value);
    });
    
    // Quality setting
    document.getElementById('qualitySelect').addEventListener('change', function(e) {
        simulationQuality = parseInt(e.target.value);
    });
    
    // Control buttons
    document.getElementById('playPauseBtn').addEventListener('click', function() {
        isPlaying = !isPlaying;
        this.innerHTML = isPlaying ? 
            '<i class="fas fa-pause"></i> Pause' : 
            '<i class="fas fa-play"></i> Play';
    });
    
    document.getElementById('resetBtn').addEventListener('click', function() {
        time = 0;
        posX = 0;
        posY = 0;
        selectedPoint = null;
        document.getElementById('posX').value = '0';
        document.getElementById('posY').value = '0';
        document.getElementById('selectedPointInfo').style.display = 'none';
        updateFieldInfo();
    });
    
    document.getElementById('snapshotBtn').addEventListener('click', function() {
        // Create a temporary canvas for snapshot
        let tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        let tempCtx = tempCanvas.getContext('2d');
        
        // Draw current canvas content
        tempCtx.drawImage(canvas.elt, 0, 0);
        
        // Add timestamp
        tempCtx.fillStyle = 'white';
        tempCtx.font = '14px Arial';
        tempCtx.fillText(`Field Visualizer - ${new Date().toLocaleString()}`, 10, 20);
        tempCtx.fillText(`Scenario: ${scenarios[scenario].name}`, 10, 40);
        tempCtx.fillText(`Charge: ${charge >= 0 ? '+' : ''}${charge}e, Velocity: ${(velocity*100).toFixed(0)}%c`, 10, 60);
        
        // Download the image
        let link = document.createElement('a');
        link.download = `field-visualizer-${scenario}-${Date.now()}.png`;
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
    });
    
    // Clear selected point
    document.getElementById('clearSelectedBtn').addEventListener('click', function() {
        selectedPoint = null;
        document.getElementById('selectedPointInfo').style.display = 'none';
    });
}

// Make functions available globally
window.setup = setup;
window.draw = draw;
