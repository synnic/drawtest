const colorInput = document.getElementById('color');
const weight = document.getElementById('weight');
const clear = document.getElementById('clear');
const paths = [];
let currentPath = [];
var coordX = 0;
var coordY = 0;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(0);
}

function draw() {
    noFill();

    window.onmousemove = coordHandler;
    window.ontouchstart = coordHandler;
    window.ontouchmove = coordHandler;
 
    if (mouseIsPressed) {
        const point = {
            x: coordX,
            y: coordY,
            color: "#ff00ff",
            weight: 5
        };
        currentPath.push(point);
    }

    paths.forEach(path => {
        beginShape();
        path.forEach(point => {
            stroke(point.color);
            strokeWeight(point.weight);
            vertex(point.x, point.y);
        });
        endShape();
    });
}

function mousePressed() {
    currentPath = [];
    paths.push(currentPath);
}

clear.addEventListener('click', () => {
    paths.splice(0);
    background(255);
});

var saveButton = document.querySelector('#saveAs');

saveButton.addEventListener('click',function(e){
    //e.preventDefault();
    canvasElm = document.querySelector("#defaultCanvas0");
    var imageType = 'image/png';
    var imageData = canvasElm.toDataURL(imageType); 
    document.querySelector("#imageURL").value = imageData;
    }
);


 

function coordHandler(event) {
    switch (event.type) {
        case 'mousemove':
            coordX = event.clientX;
            coordY = event.clientY;
            break;
        case 'touchstart':
        case 'touchmove':
            var firstTouch = event.touches[0];
            coordX = firstTouch.clientX;
            coordY = firstTouch.clientY;
            break;
    }
}