const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
var bodyParser = require('body-parser');
const { Storage } = require('@google-cloud/storage');
const Multer = require('multer');
const vision = require('@google-cloud/vision');

const CLOUD_BUCKET = process.env.GCLOUD_STORAGE_BUCKET || 'drawtest-238706.appspot.com';
const PROJECT_ID = process.env.PROJECT_ID || 'drawtest-238706';
const KEY_FILE = process.env.GCLOUD_KEY_FILE || 'drawtest-f391640b1504.json';
const PORT = process.env.PORT || 8080;
var imageTest;

const storage = new Storage({
  projectId: PROJECT_ID,
  keyFilename: KEY_FILE
});
const client = new vision.ImageAnnotatorClient(
    {
        projectId: PROJECT_ID,
        keyFilename: KEY_FILE
    }
);


async function checkVision(ImagePublicURL) {
   // Creates a client

// Performs label detection on the image file
// client
//   .labelDetection(ImagePublicURL)
//   .then(results => {
//     const labels = results[0].labelAnnotations;

//     console.log('Labels:');
//     labels.forEach(label => console.log(label.description));
//   })
//   .catch(err => {
//     console.error('ERROR:', err);
//   });
  const [objResult] = await client.objectLocalization(ImagePublicURL);
  const objects = objResult.localizedObjectAnnotations;
  var resultString = '';
  objects.forEach(object => {
    //console.log(`Name: ${object.name}`);
    //console.log(`Confidence: ${object.score}`);
    resultString = resultString + `*Name: ${object.name}` + ` Confidence: ${object.score}`;
    console.log(resultString);
  });
  return resultString;
}


const bucket = storage.bucket(CLOUD_BUCKET);

const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 2 * 1024 * 1024 // no larger than 5mb
  }
});

const app = express();

//app.use('/blog', express.static('blog/dist'));
app.use(express.static('.')); 


app.use(bodyParser.urlencoded({
    extended: false
 }));
 
 app.use(bodyParser.json());

//  app.get('/', function(req, res){
//     res.render('form');// if jade
//     // You should use one of line depending on type of frontend you are with
//     res.sendFile(__dirname + '/form.html'); //if html file is root directory
//    res.sendFile("index.html"); //if html file is within public directory
//   });
 
app.get('/', async (req, res) => {

  console.log(process.env);

  const [files] = await bucket.getFiles();

  res.writeHead(200, { 'Content-Type': 'text/html' });

  files.forEach(file => {
    res.write(`<div>* ${file.name}</div>`);
    console.log(file.name);
  });

  return res.end();

});

// app.get("/gupload", (req, res) => {
//   res.sendFile(path.join(`${__dirname}/index.html`));
// });
// var upload = multer({dest:'/pupload'})
// // Process the file upload and upload to Google Cloud Storage.

app.post("/", function(req, res) {
    imageTest = req.body.imageURL.split(';base64,').pop();
//     req.file = fs.writeFile('image123.png', imageTest, {encoding: 'base64'}, function(err) {
//     console.log('File created');
// });
  // Create a new blob in the bucket and upload the file data.
  var timestamp = new Date();
  var newName = 'drawing'+timestamp.toISOString().replace(/T/, '').replace(/\..+/, '').replace(/-/,'').replace(/:/,'').replace(/-/,'').replace(/:/,'');
  const blob = bucket.file(newName);

  // Make sure to set the contentType metadata for the browser to be able
  // to render the image instead of downloading the file (default behavior)
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: 'image/jpeg',
    }
  });

  blobStream.on("error", err => {
    next(err);
    return;
  });
  blobStream.on("finish", () => {
    // The public URL can be used to directly access the file via HTTP.
   const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

    // Make the image public to the web (since we'll be displaying it in browser)
    blob.makePublic().then(() => {
      //res.status(200).send(`Success!\n Image uploaded to ${publicUrl}`);
    //  res.status(200).redirect('result.html');
     checkVision(publicUrl).then(x=>{
        var htmlContent = 
        `<div>
            <img src="${publicUrl}" style="width:70%;height:70%"></img>
        </div>
        <div>
            ${x}
        </div>` ;
        res.status(200).write(htmlContent);
     });
    });
  });

  blobStream.end(Buffer.from(imageTest, 'base64'));

//Get the image from storage
//Check vision
});

// Start the server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
