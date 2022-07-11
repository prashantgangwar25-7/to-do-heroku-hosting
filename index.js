const express = require("express");
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({path: './config.env'});

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true
}).then(()=> {
    console.log(`connection successful`);
}).catch((err)=> console.log(`cconnection failed`));

const bodyParser = require("body-parser"); 
app.use(bodyParser.urlencoded({extended: true}));//Syntax for using body-parser

app.set('view engine', 'ejs');

app.use(express.static('public'));

const schemaName = new mongoose.Schema({
    name: String
});

const modelName = mongoose.model('collectionName', schemaName);  

app.get("/", function(req,res){
    modelName.find(function (err, collectionnames){
        if(err){console.log(err);}
        else{
            res.render("list", {addTask: collectionnames});
            };
      });
});

app.post("/", function(req,res){
    let next = req.body.nextTask;//stores the text written by user in form using body-parser module
    if(next !="") {
        let document = new modelName ({
        name: next
        });
        document.save();
    };

    let delTask = req.body.checked;
    modelName.deleteOne({name: delTask}, function(err){
            if(err){console.log(err);}
            else{console.log("Task Deleted");}
          });
    res.redirect("/");//Redirects to the home route
});

app.listen(process.env.PORT || 80);