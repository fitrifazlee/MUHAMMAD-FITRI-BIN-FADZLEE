// Spacetime Explorer - Minkowski Diagram
// p5.js implementation

let canvas;
let events = [];
let draggedEvent = null;
let beta = 0; // v/c
let gamma = 1;
let scale = 40; // pixels per unit
let offsetX, offsetY;
let showGrid = true;
let showLightCones = true;
let showTransformed = true;

// Color scheme
const colors = {
    background: [15, 25, 35],
    grid: [100, 100, 100, 100],
    axes: [79, 195, 247],
    lightCone: [244, 67, 54, 150],
    eventA: [33, 150, 243],
    eventB: [76, 175, 80],
    transformed: [255, 193, 7],
    text: [224, 224, 224]
};

function setup() {
    canvas = createCanvas(800, 600);
    canvas.parent('minkowskiCanvas');
    
    offsetX = width / 2;
    offsetY = height / 2;
    
    // Initialize with two events
    events = [
        {x: 2, ct: 3, color: colors.eventA, label: 'A', dragged: false},
        {x: 4, ct: 1, color: colors.eventB, label: 'B', dragged: false}
    ];
    
    // Setup event listeners for controls
    setupControls();
    
    // Update information display
    updateInfo();
}

function draw() {
    // Dark background
    background(colors.background);
    
    // Draw grid
    if (showGrid) drawGrid();
    
    // Draw axes
    drawAxes();
    
    // Draw light cones
    if (showLightCones) drawLightCones();
    
    // Draw events
    drawEvents();
    
    // Draw transformed frame if velocity > 0
    if (beta > 0.01 && showTransformed) drawTransformedFrame();
    
    // Draw coordinate labels
    drawLabels();
}

function drawGrid() {
    stroke(colors.grid);
    strokeWeight(1);
    
    // Vertical lines
    for (let x = -10; x <= 10; x++) {
        line(
            offsetX + x * scale, 0,
            offsetX + x * scale, height
        );
    }
    
    // Horizontal lines
    for (let y = -10; y <= 10; y++) {
        line(
            0, offsetY + y * scale,
            width, offsetY + y * scale
        );
    }
}

function drawAxes() {
    stroke(colors.axes);
    strokeWeight(2);
    
    // x-axis
    line(0, offsetY, width, offsetY);
    // ct-axis
    line(offsetX, 0, offsetX, height);
    
    // Arrowheads
    drawArrow(offsetX, 0, offsetX, 10, colors.axes);
    drawArrow(width - 10, offsetY, width, offsetY, colors.axes);
    
    // Labels
    fill(colors.axes);
    noStroke();
    textSize(16);
    textAlign(CENTER, CENTER);
    text('x →', width - 20, offsetY - 20);
    text('ct ↑', offsetX + 20, 20);
}

function drawLightCones() {
    stroke(colors.lightCone);
    strokeWeight(2);
    
    // Light cone lines (x = ±ct)
    // Right cone (x = ct)
    line(
        offsetX, offsetY,
        offsetX + 10 * scale, offsetY - 10 * scale
    );
    // Left cone (x = -ct)
    line(
        offsetX, offsetY,
        offsetX - 10 * scale, offsetY - 10 * scale
    );
    
    // Fill light cone regions
    fill(244, 67, 54, 30);
    noStroke();
    beginShape();
    vertex(offsetX, offsetY);
    vertex(offsetX + 10 * scale, offsetY - 10 * scale);
    vertex(offsetX - 10 * scale, offsetY - 10 * scale);
    endShape(CLOSE);
    
    // Label
    fill(colors.lightCone);
    textSize(14);
    text('Light Cone (x = ±ct)', offsetX, offsetY - 10 * scale - 10);
}

function drawEvents() {
    for (let event of events) {
        // Convert coordinates to canvas coordinates
        let screenX = offsetX + event.x * scale;
        let screenY = offsetY - event.ct * scale; // Note: y-axis inverted
        
        // Draw event point
        fill(event.color);
        noStroke();
        ellipse(screenX, screenY, 15, 15);
        
        // Draw label
        fill(255);
        textSize(16);
        textAlign(CENTER, CENTER);
        text(event.label, screenX, screenY);
        
        // Draw light cone lines for this event if selected
        if (event.dragged) {
            stroke(255, 255, 0, 150);
            strokeWeight(1);
            // Right light cone
            line(screenX, screenY, screenX + 5 * scale, screenY - 5 * scale);
            // Left light cone
            line(screenX, screenY, screenX - 5 * scale, screenY - 5 * scale);
        }
    }
}

function drawTransformedFrame() {
    stroke(colors.transformed);
    strokeWeight(2);
    strokeDash(5, 5);
    
    // Calculate transformed axes
    // x' axis: ct = βx
    let x1 = -10, y1 = beta * x1;
    let x2 = 10, y2 = beta * x2;
    
    line(
        offsetX + x1 * scale, offsetY - y1 * scale,
        offsetX + x2 * scale, offsetY - y2 * scale
    );
    
    // ct' axis: x = βct
    let ct1 = -10, xct1 = beta * ct1;
    let ct2 = 10, xct2 = beta * ct2;
    
    line(
        offsetX + xct1 * scale, offsetY - ct1 * scale,
        offsetX + xct2 * scale, offsetY - ct2 * scale
    );
    
    // Draw transformed events
    for (let event of events) {
        // Apply Lorentz transformation
        let xPrime = gamma * (event.x - beta * event.ct);
        let ctPrime = gamma * (event.ct - beta * event.x);
        
        let screenX = offsetX + xPrime * scale;
        let screenY = offsetY - ctPrime * scale;
        
        // Draw transformed point
        fill(colors.transformed);
        noStroke();
        ellipse(screenX, screenY, 10, 10);
        
        // Draw connecting line
        stroke(colors.transformed, 100);
        strokeWeight(1);
        strokeDash(3, 3);
        let origX = offsetX + event.x * scale;
        let origY = offsetY - event.ct * scale;
        line(origX, origY, screenX, screenY);
    }
    
    noStrokeDash();
    
    // Label transformed axes
    fill(colors.transformed);
    textSize(14);
    text(`Moving Frame (β = ${beta.toFixed(2)})`, offsetX + 100, offsetY - 100);
}

function drawLabels() {
    fill(colors.text);
    noStroke();
    textSize(12);
    textAlign(CENTER, CENTER);
    
    // Coordinate labels on axes
    for (let i = -8; i <= 8; i += 2) {
        if (i === 0) continue;
        // x-axis labels
        text(i, offsetX + i * scale, offsetY + 15);
        // ct-axis labels
        text(i, offsetX - 15, offsetY - i * scale);
    }
}

function drawArrow(x1, y1, x2, y2, color) {
    stroke(color);
    strokeWeight(2);
    line(x1, y1, x2, y2);
    
    // Arrowhead
    let angle = atan2(y2 - y1, x2 - x1);
    let arrowSize = 8;
    push();
    translate(x2, y2);
    rotate(angle);
    line(0, 0, -arrowSize, -arrowSize/2);
    line(0, 0, -arrowSize, arrowSize/2);
    pop();
}

function strokeDash(len, gap) {
    drawingContext.setLineDash([len, gap]);
}

function noStrokeDash() {
    drawingContext.setLineDash([]);
}

function mousePressed() {
    for (let event of events) {
        let screenX = offsetX + event.x * scale;
        let screenY = offsetY - event.ct * scale;
        let d = dist(mouseX, mouseY, screenX, screenY);
        
        if (d < 15) {
            draggedEvent = event;
            event.dragged = true;
            return;
        }
    }
}

function mouseDragged() {
    if (draggedEvent) {
        // Convert screen coordinates back to spacetime coordinates
        draggedEvent.x = (mouseX - offsetX) / scale;
        draggedEvent.ct = -(mouseY - offsetY) / scale; // Negative because y is inverted
        
        // Update input fields
        if (draggedEvent.label === 'A') {
            document.getElementById('eventAx').value = draggedEvent.x.toFixed(2);
            document.getElementById('eventAct').value = draggedEvent.ct.toFixed(2);
        } else if (draggedEvent.label === 'B') {
            document.getElementById('eventBx').value = draggedEvent.x.toFixed(2);
            document.getElementById('eventBct').value = draggedEvent.ct.toFixed(2);
        }
        
        updateInfo();
    }
}

function mouseReleased() {
    if (draggedEvent) {
        draggedEvent.dragged = false;
        draggedEvent = null;
    }
}

function setupControls() {
    // Velocity slider
    document.getElementById('velocitySlider').addEventListener('input', function(e) {
        beta = parseFloat(e.target.value);
        gamma = 1 / Math.sqrt(1 - beta * beta);
        
        document.getElementById('velocityValue').textContent = beta.toFixed(2) + 'c';
        document.getElementById('gammaValue').textContent = gamma.toFixed(2);
        
        updateInfo();
    });
    
    // Update events button
    document.getElementById('updateEvents').addEventListener('click', function() {
        events[0].x = parseFloat(document.getElementById('eventAx').value) || 0;
        events[0].ct = parseFloat(document.getElementById('eventAct').value) || 0;
        events[1].x = parseFloat(document.getElementById('eventBx').value) || 0;
        events[1].ct = parseFloat(document.getElementById('eventBct').value) || 0;
        updateInfo();
    });
    
    // Add event button
    document.getElementById('addEvent').addEventListener('click', function() {
        if (events.length < 5) {
            let newColor = [random(150, 255), random(150, 255), random(150, 255)];
            events.push({
                x: random(-5, 5),
                ct: random(-5, 5),
                color: newColor,
                label: String.fromCharCode(65 + events.length),
                dragged: false
            });
            updateInfo();
        }
    });
    
    // Clear events button
    document.getElementById('clearEvents').addEventListener('click', function() {
        events = events.slice(0, 2); // Keep only first two
        updateInfo();
    });
    
    // Display options
    document.getElementById('showGrid').addEventListener('change', function(e) {
        showGrid = e.target.checked;
    });
    
    document.getElementById('showLightCones').addEventListener('change', function(e) {
        showLightCones = e.target.checked;
    });
    
    document.getElementById('showTransformed').addEventListener('change', function(e) {
        showTransformed = e.target.checked;
    });
    
    // Calculate interval button
    document.getElementById('calculateInterval').addEventListener('click', function() {
        updateInfo();
        alert(`Spacetime interval calculated!\nΔs² = ${calculateInterval().toFixed(2)}`);
    });
    
    // Reset view button
    document.getElementById('resetView').addEventListener('click', function() {
        beta = 0;
        gamma = 1;
        document.getElementById('velocitySlider').value = 0;
        document.getElementById('velocityValue').textContent = '0.00c';
        document.getElementById('gammaValue').textContent = '1.00';
        updateInfo();
    });
}

function calculateInterval() {
    if (events.length >= 2) {
        let dx = events[1].x - events[0].x;
        let dct = events[1].ct - events[0].ct;
        return dx * dx - dct * dct; // Δs² = Δx² - Δt² (c=1 units)
    }
    return 0;
}

function updateInfo() {
    // Update interval value
    let interval = calculateInterval();
    document.getElementById('intervalValue').textContent = interval.toFixed(2);
    
    // Determine interval type
    let intervalType = '';
    let intervalColor = '';
    if (interval < 0) {
        intervalType = 'Timelike (causally connected)';
        intervalColor = '#ef9a9a';
    } else if (interval > 0) {
        intervalType = 'Spacelike (no causal connection)';
        intervalColor = '#a5d6a7';
    } else {
        intervalType = 'Lightlike (on light cone)';
        intervalColor = '#fff59d';
    }
    document.getElementById('intervalType').textContent = intervalType;
    document.getElementById('intervalType').style.color = intervalColor;
    
    // Update event coordinates display
    document.getElementById('eventACoords').textContent = 
        `${events[0].x.toFixed(2)}, ${events[0].ct.toFixed(2)}`;
    document.getElementById('eventBCoords').textContent = 
        `${events[1].x.toFixed(2)}, ${events[1].ct.toFixed(2)}`;
    
    // Update event count
    document.getElementById('eventCount').textContent = `${events.length} events`;
    
    // Update causality result
    document.getElementById('causalityResult').textContent = intervalType;
    document.getElementById('causalityResult').style.color = intervalColor;
    
    // Update transformation info
    if (beta > 0.01) {
        let xPrime = gamma * (events[0].x - beta * events[0].ct);
        let ctPrime = gamma * (events[0].ct - beta * events[0].x);
        document.getElementById('transformInfo').innerHTML = 
            `A' = (${xPrime.toFixed(2)}, ${ctPrime.toFixed(2)})<br>` +
            `γ = ${gamma.toFixed(2)}`;
    } else {
        document.getElementById('transformInfo').textContent = 
            'Apply velocity to see transformed coordinates';
    }
}

// Make functions available globally for HTML event handlers
window.setup = setup;
window.draw = draw;
window.mousePressed = mousePressed;
window.mouseDragged = mouseDragged;
window.mouseReleased = mouseReleased;
