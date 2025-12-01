// Lorentz Transformer Module
// Interactive Lorentz transformation calculator

let c = 299792458; // Speed of light in m/s
let beta = 0.8; // v/c
let gamma = 1 / Math.sqrt(1 - beta * beta);
let history = [];
let canvas;
let events = [];

function setup() {
    canvas = createCanvas(800, 400);
    canvas.parent('lorentzCanvas');
    
    // Setup event listeners
    setupEventListeners();
    
    // Initial calculation
    calculateTransformation();
}

function draw() {
    // Dark background
    background(13, 27, 42);
    
    // Draw visualization
    drawSpacetimeDiagram();
}

function setupEventListeners() {
    // Calculate button
    document.getElementById('calculateBtn').addEventListener('click', calculateTransformation);
    
    // Velocity slider
    document.getElementById('velocitySlider').addEventListener('input', function(e) {
        beta = parseFloat(e.target.value);
        gamma = 1 / Math.sqrt(1 - beta * beta);
        document.getElementById('velocityValue').textContent = beta.toFixed(2) + 'c';
        calculateTransformation();
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
        document.getElementById('velocitySlider').value = Math.abs(beta);
        document.getElementById('velocityValue').textContent = Math.abs(beta).toFixed(2) + 'c';
        
        calculateTransformation();
    });
    
    // Reset button
    document.getElementById('resetBtn').addEventListener('click', function() {
        document.getElementById('inputX').value = '5';
        document.getElementById('inputT').value = '2';
        beta = 0.8;
        gamma = 1 / Math.sqrt(1 - beta * beta);
        document.getElementById('velocitySlider').value
