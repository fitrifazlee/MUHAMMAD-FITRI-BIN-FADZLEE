// Field Visualizer Module
// Electric and magnetic field visualizations

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
let fieldScale = 5;
let numFieldLines = 20;
let time = 0;

// Colors
const colors = {
    background: [13, 27, 42],
    grid: [64, 64, 64, 50],
    electric: [255, 87, 34, 150], // Orange-red
    magnetic: [33, 150, 243, 150], // Blue
    equipotential: [76, 175, 80, 100], // Green
    positiveCharge: [244, 67, 54], // Red
    negativeCharge: [33, 150, 243], // Blue
    velocityVector: [255, 193, 7], // Yellow
    text: [224, 224, 224]
};

// Physical constants
const k = 9e9; // Coulomb constant (N·m²/C²)
const mu0 = 4 * Math.PI * 1e-7; // Magnetic constant
const c = 299792458; // Speed of light

function setup() {
    canvas = createCanvas(800, 600);
    canvas.parent('fieldCanvas');
    
    // Setup event listeners
    setupEventListeners();
    
    // Initial update
    updateFieldInfo();
}

function draw() {
    // Update time if playing
    if (isPlaying) {
        time += 0.02;
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
        case 'twoCharges':
            drawTwoCharges();
            break;
        case 'wire':
            drawCurrentWire();
            break;
        case 'dipole':
            drawDipole();
            break;
        case 'accelerating':
            drawAcceleratingCharge();
            break;
    }
    
    // Draw velocity vector if moving
    if (velocity > 0.01) {
        drawVelocityVector();
    }
    
    // Draw legend
    drawLegend();
}

function drawGrid() {
    stroke(colors.grid);
    strokeWeight(1);
    
    let gridSize = 50;
    
    // Vertical lines
    for (let x = -width/2; x <= width/2; x += gridSize) {
        let screenX = width/2 + x;
        line(screenX, 0, screenX, height);
    }
    
    // Horizontal lines
    for (let y = -height/2; y <= height/2; y += gridSize) {
        let screenY = height/2 + y;
        line(0, screenY, width, screenY);
    }
}

function drawAxes() {
    stroke(200, 200, 200, 150);
    strokeWeight(2);
    
    // x-axis
    line(0, height/2, width, height/2);
    // y-axis
    line(width/2, 0, width/2, height);
    
    // Labels
    fill(colors.text);
    noStroke();
    textSize(14);
    textAlign(CENTER, CENTER);
    text('x', width - 20, height/2 - 20);
    text('y', width/2 + 20, 20);
}

function drawStationaryCharge() {
    let centerX = width/2 + posX * 50;
    let centerY = height/2 - posY * 50; // Inverted y
    
    // Draw charge
    fill(charge > 0 ? colors.positiveCharge : colors.negativeCharge);
    noStroke();
    let chargeSize = Math.abs(charge) * 20;
    ellipse(centerX, centerY, chargeSize, chargeSize);
    
    // Draw charge symbol
    fill(255);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(`${charge > 0 ? '+' : ''}${charge.toFixed(1)}e`, centerX, centerY);
    
    // Draw electric field lines
    if (showElectric) {
        drawElectricField(centerX, centerY, charge, 0, 0);
    }
    
    // No magnetic field for stationary charge
}

function drawMovingCharge() {
    let centerX = width/2 + (posX + velocity * time) * 50;
    let centerY = height/2 - posY * 50;
    
    // Draw charge
    fill(charge > 0 ? colors.positiveCharge : colors.negativeCharge);
    noStroke();
    let chargeSize = Math.abs(charge) * 20;
    ellipse(centerX, centerY, chargeSize, chargeSize);
    
    // Draw charge symbol
    fill(255);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(`${charge > 0 ? '+' : ''}${charge.toFixed(1)}e`, centerX, centerY);
    
    // Calculate relativistic gamma
    let gamma = 1 / Math.sqrt(1 - velocity * velocity);
    
    // Draw electric field (contracted perpendicular to motion)
    if (showElectric) {
        drawElectricField(centerX, centerY, charge, velocity, gamma);
    }
    
    // Draw magnetic field (due to moving charge)
    if (showMagnetic) {
        drawMagneticField(centerX, centerY, charge, velocity);
    }
    
    // Draw equipotential lines
    if (showEquipotentials) {
        drawEquipotentials(centerX, centerY, charge, velocity, gamma);
    }
}

function drawTwoCharges() {
    let charge1 = 1.0;
    let charge2 = -1.0; // Opposite charge for dipole
    
    let x1 = width/2 - 100;
    let x2 = width/2 + 100;
    let y = height/2;
    
    // Draw charges
    fill(colors.positiveCharge);
    ellipse(x1, y, Math.abs(charge1) * 20, Math.abs(charge1) * 20);
    fill(colors.negativeCharge);
    ellipse(x2, y, Math.abs(charge2) * 20, Math.abs(charge2) * 20);
    
    // Draw labels
    fill(255);
    textSize(16);
    textAlign(CENTER, CENTER);
    text('+e', x1, y);
    text('-e', x2, y);
    
    // Draw field lines
    if (showElectric) {
        // Draw field lines from positive to negative
        for (let i = 0; i < numFieldLines; i++) {
            let angle = (i * TWO_PI) / numFieldLines;
            drawFieldLine(x1, y, angle, charge1, charge2, x2, y);
        }
    }
}

function drawCurrentWire() {
    // Draw wire
    stroke(200, 200, 200);
    strokeWeight(3);
    line(100, height/2, width - 100, height/2);
    
    // Draw current direction
    fill(colors.magnetic);
    noStroke();
    for (let x = 150; x < width - 150; x += 50) {
        triangle(x, height/2 - 10, x + 20, height/2, x, height/2 + 10);
    }
    
    // Draw magnetic field circles around wire
    if (showMagnetic) {
        stroke(colors.magnetic);
        strokeWeight(1);
        noFill();
        
        for (let r = 30; r < 200; r += 30) {
            ellipse(width/2, height/2, r * 2, r * 2);
        }
        
        // Add field direction indicators
        for (let angle = 0; angle < TWO_PI; angle += PI/6) {
            let x = width/2 + 100 * cos(angle);
            let y = height/2 + 100 * sin(angle);
            let tangentAngle = angle + PI/2;
            
            push();
            translate(x, y);
            rotate(tangentAngle);
            line(-5, 0, 5, 0);
            line(5, 0, 3, -3);
            line(5, 0, 3, 3);
            pop();
        }
    }
}

function drawDipole() {
    // Similar to two charges but with field lines
    drawTwoCharges();
}

function drawAcceleratingCharge() {
    let centerX = width/2 + posX * 50 + 50 * sin(time);
    let centerY = height/2 - posY * 50 + 30 * cos(time * 1.5);
    
    // Draw charge
    fill(colors.positiveCharge);
    noStroke();
    ellipse(centerX, centerY, 25, 25);
    
    // Draw radiation pattern (for accelerating charge)
    if (showElectric) {
        stroke(colors.electric);
        strokeWeight(1);
        noFill();
        
        // Draw radiation lobes
        for (let i = 0; i < 4; i++) {
            let angle = i * PI/2 + time;
            let lobeLength = 100 + 30 * sin(time * 2);
            let lobeWidth = PI/4;
            
            push();
            translate(centerX, centerY);
            rotate(angle);
            arc(0, 0, lobeLength, lobeLength, -lobeWidth/2, lobeWidth/2);
            pop();
        }
    }
}

function drawElectricField(centerX, centerY, charge, velocity, gamma) {
    stroke(colors.electric);
    strokeWeight(1.5);
    noFill();
    
    let numLines = showVectors ? 36 : numFieldLines;
    
    for (let i = 0; i < numLines; i++) {
        let angle = (i * TWO_PI) / numLines;
        let startX = centerX + 30 * cos(angle);
        let startY = centerY + 30 * sin(angle);
        
        if (showVectors) {
            // Draw field vectors
            let r = 50;
            let ex = cos(angle);
            let ey = sin(angle);
            
            // Apply relativistic contraction perpendicular to motion
            if (velocity > 0) {
                if (abs(angle) > PI/4 && abs(angle) < 3*PI/4) {
                    ey /= gamma; // Contract perpendicular component
                }
            }
            
            let mag = sqrt(ex*ex + ey*ey);
            ex = (ex / mag) * 30 * fieldScale;
            ey = (ey / mag) * 30 * fieldScale;
            
            arrow(startX, startY, startX + ex, startY + ey, colors.electric);
        } else {
            // Draw field lines
            drawFieldLine(startX, startY, angle, charge);
        }
    }
}

function drawMagneticField(centerX, centerY, charge, velocity) {
    if (velocity < 0.01) return; // No B field for stationary charge
    
    stroke(colors.magnetic);
    strokeWeight(1.5);
    noFill();
    
    let bStrength = (mu0 / (4 * Math.PI)) * Math.abs(charge) * velocity * c / 25;
    
    for (let i = 0; i < 8; i++) {
        let radius = 50 + i * 40;
        ellipse(centerX, centerY, radius * 2, radius * 2);
        
        // Draw B field direction (circles around velocity direction)
        let angle = time * 2 + i * PI/4;
        let x = centerX + radius * cos(angle);
        let y = centerY + radius * sin(angle);
        
        push();
        translate(x, y);
        rotate(angle + PI/2);
        line(-5, 0, 5, 0);
        line(5, 0, 3, -3);
        line(5, 0, 3, 3);
        pop();
    }
}

function drawEquipotentials(centerX, centerY, charge, velocity, gamma) {
    stroke(colors.equipotential);
    strokeWeight(1);
    strokeDash(5, 5);
    
    for (let i = 1; i <= 5; i++) {
        let radius = 40 * i;
        
        // Relativistic contraction in direction of motion
        let rx = radius / (velocity > 0 ? gamma : 1);
        let ry = radius;
        
        ellipse(centerX, centerY, rx * 2, ry * 2);
    }
    
    noStrokeDash();
}

function drawFieldLine(startX, startY, startAngle, charge, charge2 = 0, targetX = 0, targetY = 0) {
    let steps = 100;
    let stepSize = 5;
    let x = startX;
    let y = startY;
    let vx = cos(startAngle);
    let vy = sin(startAngle);
    
    beginShape();
    vertex(x, y);
    
    for (let i = 0; i < steps; i++) {
        // Calculate field direction at current point
        let dx1 = x - startX;
        let dy1 = y - startY;
        let r1 = max(sqrt(dx1*dx1 + dy1*dy1), 10);
        
        let ex, ey;
        
        if (charge2 !== 0) {
            // Two charges
            let dx2 = x - targetX;
            let dy2 = y - targetY;
            let r2 = max(sqrt(dx2*dx2 + dy2*dy2), 10);
            
            ex = charge * dx1 / (r1 * r1) + charge2 * dx2 / (r2 * r2);
            ey = charge * dy1 / (r1 * r1) + charge2 * dy2 / (r2 * r2);
        } else {
            // Single charge
            ex = charge * dx1 / (r1 * r1);
            ey = charge * dy1 / (r1 * r1);
        }
        
        // Normalize
        let mag = sqrt(ex*ex + ey*ey);
        if (mag > 0) {
            vx = ex / mag;
            vy = ey / mag;
            
            // Reverse if charge is negative
            if (charge < 0) {
                vx = -vx;
                vy = -vy;
            }
        }
        
        x += vx * stepSize;
        y += vy * stepSize;
        
        vertex(x, y);
        
        // Stop if out of bounds
        if (x < 0 || x > width || y < 0 || y > height) break;
    }
    
    endShape();
}

function drawVelocityVector() {
    let centerX = width/2 + posX * 50;
    let centerY = height/2 - posY * 50;
    
    stroke(colors.velocityVector);
    strokeWeight(3);
    
    let vx = velocity * 100;
    arrow(centerX, centerY, centerX + vx, centerY, colors.velocityVector);
    
    // Label
    fill(colors.velocityVector);
    noStroke();
    textSize(12);
    textAlign(LEFT, CENTER);
    text(`v = ${(velocity * c / 1e6).toFixed(0)}×10⁶ m/s`, centerX + vx + 10, centerY);
}

function drawLegend() {
    fill(colors.text);
    noStroke();
    textSize(12);
    textAlign(LEFT, TOP);
    
    let legendY = 20;
    let legendX = 20;
    
    // Electric field
    if (showElectric) {
        fill(colors.electric);
        rect(legendX, legendY, 15, 15);
        fill(colors.text);
        text('Electric Field (E)', legendX + 25, legendY);
        legendY += 25;
    }
    
    // Magnetic field
    if (showMagnetic) {
        fill(colors.magnetic);
        rect(legendX, legendY, 15, 15);
        fill(colors.text);
        text('Magnetic Field (B)', legendX + 25, legendY);
        legendY += 25;
    }
    
    // Equipotentials
    if (showEquipotentials) {
        stroke(colors.equipotential);
        strokeWeight(1);
        line(legendX, legendY + 7, legendX + 15, legendY + 7);
        noStroke();
        fill(colors.text);
        text('Equipotential Lines', legendX + 25, legendY);
    }
}

function arrow(x1, y1, x2, y2, color) {
    stroke(color);
    strokeWeight(2);
    line(x1, y1, x2, y2);
    
    // Arrowhead
    let angle = atan2(y2 - y1, x2 - x1);
    push();
    translate(x2, y2);
    rotate(angle);
    line(0, 0, -8, -4);
    line(0, 0, -8, 4);
    pop();
}

function strokeDash(len, gap) {
    drawingContext.setLineDash([len, gap]);
}

function noStrokeDash() {
    drawingContext.setLineDash([]);
}

function setupEventListeners() {
    // Scenario selection
    document.getElementById('scenarioSelect').addEventListener('change', function(e) {
        scenario = e.target.value;
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
    
    // Field scale
    document.getElementById('fieldScaleSlider').addEventListener('input', function(e) {
        fieldScale = parseFloat(e.target.value);
    });
    
    document.getElementById('fieldLinesSlider').addEventListener('input', function(e) {
        numFieldLines = parseFloat(e.target.value);
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
        velocity = 0;
        charge = 1.0;
        document.getElementById('posX').value = '0';
        document.getElementById('posY').value = '0';
        document.getElementById('velocitySlider').value = '0';
        document.getElementById('chargeSlider').value = '1';
        document.getElementById('velocityValue').textContent = '0.00c';
        document.getElementById('chargeValue').textContent = '+1.0e';
        updateFieldInfo();
    });
    
    document.getElementById('snapshotBtn').addEventListener('click', function() {
        // Simple snapshot - in a real app, this would save the canvas
        alert('Snapshot taken! (In a real implementation, this would save the canvas image)');
    });
}

function updateFieldInfo() {
    // Calculate gamma
    let gamma = 1 / Math.sqrt(1 - velocity * velocity);
    document.getElementById('gammaValue').textContent = gamma.toFixed(2);
    
    // Calculate approximate field strengths
    let r = 1; // 1 meter distance
    let eField = k * Math.abs(charge) * 1.6e-19 / (r * r);
    let bField = velocity > 0 ? (mu0 / (4 * Math.PI)) * Math.abs(charge) * 1.6e-19 * velocity * c / (r * r) : 0;
    
    // Apply relativistic correction to perpendicular components
    if (velocity > 0) {
        eField *= gamma; // E perpendicular is enhanced
    }
    
    document.getElementById('eFieldValue').textContent = eField.toFixed(2) + ' N/C';
    document.getElementById('bFieldValue').textContent = bField.toFixed(2) + ' T';
}

// Make functions available globally
window.setup = setup;
window.draw = draw;
