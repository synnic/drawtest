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
    //e.preventDefault();
    canvasElm = document.querySelector("#defaultCanvas0");
    var imageType = 'image/png';
    var imageData = canvasElm.toDataURL(imageType); 
    document.querySelector("#imageURL").value = imageData;
    }
);


// function postItem() {
//     canvasElm = document.querySelector("#defaultCanvas0");

//     // Get a base64 data string
//     var imageType = 'image/png';
//     var imageData = canvasElm.toDataURL(imageType);
//     $.ajax({
//         type: "Post",
//         url: "http://localhost:8080/gupload",
//         timeout: 2000,
//         data: { dataurl: imageData},
//         success: function(data) {
//             //show content
//             console.log('Success!')
//         },
//         error: function(jqXHR, textStatus, err) {
//             //show error message
//             console.log('text status '+textStatus+', err '+err)
//         }
//     });
// }//postItem()

