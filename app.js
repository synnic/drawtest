const express = require('express');
var bodyParser = require('body-parser');
const { Storage } = require('@google-cloud/storage');
const vision = require('@google-cloud/vision');

const CLOUD_BUCKET = process.env.GCLOUD_STORAGE_BUCKET || 'pigturechallenge.appspot.com';
const PROJECT_ID = process.env.PROJECT_ID || 'pigturechallenge';
const KEY_FILE = process.env.GCLOUD_KEY_FILE || 'pigturechallenge-9ae039f98d06.json';
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


app.post("/", function(req, res) {
    imageTest = req.body.imageURL.split(';base64,').pop();
  var timestamp = new Date();
  var newName = 'drawing'+timestamp.toISOString().replace(/T/, '').replace(/\..+/, '').replace(/-/,'').replace(/:/,'').replace(/-/,'').replace(/:/,'');
  const blob = bucket.file(newName);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: 'image/jpeg',
    }
  });

  blobStream.on("error", err => {
    console.log(err);
    return;
  });
  blobStream.on("finish", () => {
    // The public URL can be used to directly access the file via HTTP.
   const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

    // Make the image public to the web (since we'll be displaying it in browser)
    blob.makePublic().then(() => {
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
});

// Start the server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
