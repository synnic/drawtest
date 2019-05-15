const express = require('express');
var bodyParser = require('body-parser');
const { Storage } = require('@google-cloud/storage');
const vision = require('@google-cloud/vision');
const automl = require(`@google-cloud/automl`).v1beta1;
const CLOUD_BUCKET = process.env.GCLOUD_STORAGE_BUCKET || 'pigturechallenge.appspot.com';
const PROJECT_ID = process.env.PROJECT_ID || 'pigturechallenge';
const KEY_FILE = process.env.GCLOUD_KEY_FILE || 'pigturechallenge-9ae039f98d06.json';
const PORT = process.env.PORT || 8080;

const computeRegion = `us-central1`;
const datasetName = `pig`;
const multiLabel = `false`;
 
async function autoML()
{
   // A resource that represents Google Cloud Platform location.
   const projectLocation = client.locationPath(projectId, computeRegion);

   // Classification type is assigned based on multilabel value.
   let classificationType = `MULTICLASS`;
   if (multiLabel) {
     classificationType = `MULTILABEL`;
   }
 
   // Specify the text classification type for the dataset.
   const datasetMetadata = {
     classificationType: classificationType,
   };
 
   // Set dataset name and metadata.
   const myDataset = {
     displayName: datasetName,
     imageClassificationDatasetMetadata: datasetMetadata,
   };
 
   // Create a dataset with the dataset metadata in the region.
   const [dataset] = await client.createDataset({
     parent: projectLocation,
     dataset: myDataset,
   });
 
}
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

const autoMLClient = new automl.AutoMlClient(
  {
      projectId: PROJECT_ID,
      keyFilename: KEY_FILE
  }
);


async function checkVision(ImagePublicURL) {
    console.log('vision api begins');
  const [objResult] = await client.objectLocalization(ImagePublicURL);
  console.log('await');
  const objects = objResult.localizedObjectAnnotations;
  console.log('localizedObjectAnnotations');
  var resultString = '<ul>';
  objects.forEach(object => {
    //console.log(`Name: ${object.name}`);
    //console.log(`Confidence: ${object.score}`);
    if (object.name == "Animal")
    {
      resultString = resultString + `<li><b>Pig -` + ` ${(Number(object.score).toFixed(4)*100).toFixed(2)}%</b></li>`;
    }
    else
    {
      resultString = resultString + `<li>${object.name} -` + ` ${(Number(object.score).toFixed(4)*100).toFixed(2)}%</li>`;
    }
    console.log(resultString);
  });
  if (resultString == '<ul>')
  {
    resultString = resultString + `Maybe an unknown creature?`;
  }
  else if (!resultString.includes("Pig"))
  {
    resultString = resultString + `<li><b>Pig -` + ` ${Number(Math.random() * (70 - 60) + 60).toFixed(2)}%</b></li>`;
  }
  resultString = resultString + "</ul>";
  return resultString;
}


const bucket = storage.bucket(CLOUD_BUCKET);

const app = express();

//app.use('/blog', express.static('blog/dist'));
app.use(express.static('.')); 


app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

//  app.get('/', function(req, res){
//     res.render('form');// if jade
//     // You should use one of line depending on type of frontend you are with
//     res.sendFile(__dirname + '/form.html'); //if html file is root directory
//    res.sendFile("index.html"); //if html file is within public directory
//   });
app.use(express.json({limit: '50mb'}));

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
        console.log('Image uploaded');
        console.log('publicUrl');
     checkVision(publicUrl).then(x=>{
        var htmlContent = 
        `
        <body style="background:white">
        <div>
            <img src="${publicUrl}" style="width:60%;height:60%"></img>
        </div>
        <div style="text-align:left;font-family:calibri;position:relative">
        <img src="dialogbox.png" style="height:35%">
        <span style="font-size:20px;color:black;position:absolute;left:41px;top:49px">I Guess you are drawing...</span>
        <span style="font-size:19px;color:black;position:absolute;left:21px;top:56px">${x}</span>
        </img>
      
        </div>
        <div style="text-align:right">
        <img src="gcp.png" style="height:5%"></img>
        </div>
        </body>` ;
        res.status(200).write(htmlContent);
        res.end();
     }).catch((error) => {
      console.error(error);
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
