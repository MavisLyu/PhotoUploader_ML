var express = require('express');
var formidable = require('formidable');
var fs = require('fs-extra');
var walk = require('walk');

var app = express();


app.get('/', function(req,res){
    res.writeHead(200, {'Content-Type': 'text/html' });
    var welcomePage = '<html><head><title>Welcome to Picture Uploader </title>'+
        '<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>'+
        '<body style="background-color:powderblue;">'+'<h1 style="text-align:center;"> <mark>Picture Uploader</mark></h1><br><br>'+'<form action="/api/upload" enctype="multipart/form-data" method="post" style="text-align:center;">'+
        '<h3>Upload a picture:</h3>'+'<input multiple="multiple" name="upload" type="file" />'+
        '<input type="submit" value="Upload" />'+'</form><br><br><hr>'+
        '<form action="/api/photos" enctype="multipart/form-data" method="get" style="text-align:center;">'+
        '<h3>Get all pictures:</h3>'+
        '<input type="submit" value="View" />'+
        '</form></body></html>';
    res.end(welcomePage);
});


app.get('/api/photos', function(req,res){
    var files = '';
    var walker  = walk.walk('pictures/', { followLinks: false });

    walker.on('file', function(root, stat, next) {
        files = files + stat.name + "<br><br>";
        next();
    });

    walker.on('end', function() {
        console.log(files);
        var message = '';

        if (files === ''){
            message = 'There is currently no pictures.';
        }else{
            message = 'This is a list of all pictures:';
        }

        res.writeHead(200, {'content-type': 'text/html'});
        var viewPage = '<html><head><title>Welcome to Picture Uploader </title>'+
            '<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>'+
            '<body style="background-color:powderblue;">'+'<form action="/" enctype="multipart/form-data" method="get" style="text-align:center;">'+ '<h1>'
            + message + '</h1>' +
            '<br><br>'+ files +'<input type="submit" value="Homepage"/>'+
            '</form></body></html>';
        res.end(viewPage);
    });
});


app.post('/api/upload', function (req, res){

    var form = new formidable.IncomingForm();

    form.parse(req, function(err,files) {
        if (err) {
            console.error(err);
        }else{
            console.log("success uploaded");
            res.writeHead(200, {'content-type': 'text/html'});

            var uploadPage = '<html><head><title>Welcome to Picture Uploader </title>' +
                '<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>' +
                '<body style="background-color:powderblue;">' + '<form action="/" enctype="multipart/form-data" method="get" style="text-align:center;">'+ '<h1>'
                + 'You have successfully uploaded a picture!' + '</h1>'+'<br><br>' + '<input type="submit" value="Homepage"/>' +
                '</form></body></html>';
            res.end(uploadPage);
        }
    });

    form.on('end', function() {
        var path = this.openedFiles[0].path;
        var name = this.openedFiles[0].name;
        var location = 'pictures/';

        fs.copy(path, location + name, function(err) {
            if (err) {
                console.error(err);
            } else {
                console.log("success!")
            }
        });
    });
});





app.listen(3000);
console.log('Server running on port 3000');