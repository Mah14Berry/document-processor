const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const app = express();

//creates new folder when first file gets added
//recursive = true makes sure no extra folder added (how?)
fs.mkdirSync('uploads', {recursive : true});
fs.mkdirSync('outputs', {recursive : true});

//multer stores incoming files and gives them unique names
const upload = multer({dest : 'uploads/'});

// /health is to check if server is alive
// reply with status ok
app.get('/health', (req,res) => res.json({status: 'ok'}));

//upload.single saves uploaded file, async handles it
//jobs is a url path to server that activates doc processing code
app.post('/jobs', upload.single('file'), async(req,res) => {
  //if request doesn't send file
  if(!req.file) return res.status(400).json({error : 'No file upploaded'});

  //set up width for output 
  //resizes img with new width and corresponding scaled height
  const width = parseInt(req.body.width, 10) || 300;
  //sets up file path string name
  const outputPath = path.join('outputs', req.file.filename + '.png');
  /*await sends promise to Node saying .toFile will finish later
  (since it takes time), so node can handle other requests in the meantime*/
  await sharp(req.file.path).resize({width}).png().toFile(outputPath);
  res.json({output: outputPath});
});

app.listen(4000, () => console.log("port 4000 is running"));

/*
  ex output:
    bobilgom@Mahirs-MacBook-Pro ~ % curl -F "file=@/Users/bobilgom/Downloads/photo.jpg" -F "width=200" http://localhost:4000/jobs 
    {"output":"outputs/ac0f2a1f2499b5b0717903da93ebda42.png"}%                               bobilgom@Mahirs-MacBook-Pro ~ % 

*/

/*notes
- don't set "type": "module" in package.json or require lines will break
*/