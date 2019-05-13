const colorInput = document.getElementById('color');
const weight = document.getElementById('weight');
const clear = document.getElementById('clear');
const paths = [];
let currentPath = [];
var coordX = 0;
var coordY = 0;
var currentColor = "#ff00ff";
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
            color: currentColor,
            weight: 7
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
    background(0);
});

var saveButton = document.querySelector('#saveAs');

saveButton.addEventListener('click',function(e){
    //e.preventDefault();
    var canvas = document.getElementsByTagName("canvas");
    // canvas context
    var context = canvas[0].getContext("2d");
    // get the current ImageData for the canvas
    var data = context.getImageData(0, 0, canvas[0].width, canvas[0].height);
    // store the current globalCompositeOperation
    var compositeOperation = context.globalCompositeOperation;
    // set to draw behind current content
    context.globalCompositeOperation = "destination-over";
    //set background color
    context.fillStyle = "#FFFFFF";
    // draw background/rectangle on entire canvas
    context.fillRect(0,0,canvas[0].width,canvas[0].height);

    var tempCanvas = document.createElement("canvas"),
        tCtx = tempCanvas.getContext("2d");

    tempCanvas.width = canvas[0].width;
    tempCanvas.height = canvas[0].height;

    tCtx.drawImage(canvas[0],-100,0);

    // write on screen
    var img = tempCanvas.toDataURL("image/png");
    var imageType = 'image/png';
    // var imageData = canvasElm.toDataURL(img); 

    // canvasElm = document.querySelector("#defaultCanvas0");
    // var imageType = 'image/png';
    // var imageData = canvasElm.toDataURL(imageType); 
    document.querySelector("#imageURL").value = img;
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