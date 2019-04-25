const colorInput = document.getElementById('color');
const weight = document.getElementById('weight');
const clear = document.getElementById('clear');
const paths = [];
let currentPath = [];

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(255);
}

function draw() {
    noFill();

    if (mouseIsPressed) {
        const point = {
            x: mouseX,
            y: mouseY,
            color: colorInput.value,
            weight: weight.value
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
    e.preventDefault();
    console.log('hihi');
    save();

})

//window.addEventListener('load',() =>
//{
    // const canvas = document.querySelector("#canvas");
    // const ctx = canvas.getContext("2d");
    // canvas.height = window.innerHeight;
    // canvas.width=window.innerWidth;

    // let painting = false;

    // function startPosition()
    // {
    //     painting=true;
    //     draw(e);
    // }
    // function finishedPosition()
    // {
    //     painting=false;
    //     ctx.beginPath();
    // }
    // function draw(e) {
    //     if (!painting) return;
    //     ctx.lineWidth = 10;
    //     ctx.lineCap = "round";

    //     ctx.lineTo(e.clientX, e.clientY);
    //     ctx.stroke();
    //     ctx.beginPath();
    //     ctx.moveTo(e.clientX, e.clientY);
    // }
    // canvas.addEventListener("mousedown",startPosition);
    // canvas.addEventListener("mouseup",finishedPosition);
    // canvas.addEventListener("mousemove",draw);
//})

