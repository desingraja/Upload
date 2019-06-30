var express = require("express")
var multer = require('multer')
var app = express()
var path = require('path')
var fs = require('fs')
const MongoClient = require('mongodb').MongoClient
const myurl = 'mongodb://localhost:27017';


var storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname+'/uploads'));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
   
  var upload = multer({ storage: storage })
MongoClient.connect(myurl, (err, client) => {
    if (err) return console.log(err)
    db = client.db('test') 


    app.get('/',function(req,res){
        res.sendFile(__dirname + '/index.html');
        console.log("Get File");
        
       
      });
    
      app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
          console.log("HI");
          
        const file = req.file
        if (!file) {
          const error = new Error('Please upload a file')
          error.httpStatusCode = 400
          return next(error)
        }
        console.log("FIle uploaded");
        
          res.send(file)

          console.log("FIle",file);
          
        
      })
    
      app.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
        const files = req.files
        if (!files) {
          const error = new Error('Please choose files')
          error.httpStatusCode = 400
          return next(error)
        }
        console.log("FIles uploaded");
    
          res.send(files)
        
      })


      app.post('/uploadphoto', upload.single('picture'), (req, res) => {
        var img = fs.readFileSync(req.file.path);
     var encode_image = img.toString('base64');
     // Define a JSONobject for the image attributes for saving to database     
      
     var finalImg = {
          contentType: req.file.mimetype,
          image:  new Buffer(encode_image, 'base64')
       };
    db.collection('quotes').insertOne(finalImg, (err, result) => {
        console.log(result)
     
        if (err) return console.log(err)
     
        console.log('saved to database')
        res.redirect('/')
       
         
      })

    })

    app.get('/photos', (req, res) => {
        db.collection('mycollection').find().toArray((err, result) => {
         
              const imgArray= result.map(element => element._id);
                    console.log(imgArray);
         
           if (err) return console.log(err)
           res.send(imgArray)
         
          })
        });


        app.get('/photo/:id', (req, res) => {
            var filename = req.params.id;
             
            db.collection('mycollection').findOne({'_id': ObjectId(filename) }, (err, result) => {
             
                if (err) return console.log(err)
             
               res.contentType('image/jpeg');
               res.send(result.image.buffer)
               
                
              })
            })


})
    


  

var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log('Node.js listening on port ' + port)
})

























//    https://code.tutsplus.com/tutorials/file-upload-with-multer-in-node--cms-32088