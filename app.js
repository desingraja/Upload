var express = require("express")
var multer = require('multer')
var app = express()
var path = require('path')
var fs = require('fs')


var storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname+'/uploads'));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
   
  var upload = multer({ storage: storage })

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
  
    res.send(file);
    console.log("FIle",file);

  
})

var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log('Node.js listening on port ' + port)
})