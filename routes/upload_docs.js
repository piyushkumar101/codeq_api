const express = require("express");
const formidable = require("formidable");
const fs = require("fs");


const router = express.Router()

router.post('upload', (req, res) => {
    router.send("ABC");
    const form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files){


        const oldPath = files.profilePic.path;
        const newPath = path.join(__dirname, 'uploads')
            + '/' + files.profilePic.name;
        const rawData = fs.readFileSync(oldPath);

        fs.writeFile(newPath, rawData, function(err){
            if(err) console.log(err)
            return res.send("Successfully uploaded")
        })

    })

});