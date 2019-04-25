const colorInput = document.getElementById('color');
const weight = document.getElementById('weight');
const clear = document.getElementById('clear');
const paths = [];
let currentPath = [];

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(255);
    document.addEventListener('touchmove',preventDefault, false);
    window.addEventListener('DOMMouseScroll', wheel, false);
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
    save();

})

function wheel(e) {
    preventDefault(e);
  }

// DESKTOP
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
// left: 37, up: 38, right: 39, down: 40,
// (Source: http://stackoverflow.com/a/4770179)

//   var keys = [32,33,34,35,36,37,38,39,40];
//   function keydown(e) {
//     for (var i = keys.length; i--;) {
//         if (e.keyCode === keys[i]) {
//             preventDefault(e);
//             return;
//         }
//     }
// }

function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;  
  }
// function disable_scroll() {
//     if (window.addEventListener) {
//         window.addEventListener('DOMMouseScroll', wheel, false);
//     }
//     window.onmousewheel = document.onmousewheel = wheel;
//     document.onkeydown = keydown;
//     disable_scroll_mobile();
//   }
  
// function disable_scroll_mobile(){
//     document.addEventListener('touchmove',preventDefault, false);
//   }


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

