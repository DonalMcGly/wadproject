var express = require("express"); // this calls the express framework //
// involk the express package into action from here //
var app = express();
///********** Never write anything above the express call line ***********

// call the sql middleware //
var mysql = require('mysql');

app.set("view engine","ejs"); //set default view engine //
var fs = require('fs')
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

var athletes = require("./model/athletes.json");  //this declares the content of contact json file as a variable contact //

// call access to the views folder and allow content to be rendered. //
app.use(express.static("views"));
// call middleware for file upload //
const fileUpload = require('express-fileupload');
app.use(fileUpload());

// call access to the script folder and allow content to be rendered. //
app.use(express.static("script"));

app.use(express.static("images"));

// Create Sql database connectivity //
const db = mysql.createConnection ({
 host: 'hostingmysql304.webapps.net',
 user: 'liamme',
 password: 'L1Am39??',
 database: 'liam'    
})

db.connect((err) => {
    if(err){
    console.log("Connection failed :(")
    }
    else
    {
    console.log("Connection successful :)")    
    }
});
// JSON ATHLETES CODE /// ADD EDIT AND DELETE //
// Route to home page //    
app.get('/',function(req,res){
    res.render("index")
    console.log("Opening home page")
});
app.get('/about',function(req,res){
    res.render("about")
    console.log("Opening about us page")
});

// route to get the athletes page //
app.get('/athletes',function(req,res){
    res.render("athletes",{athletes})
    console.log("Going to view athletes page")
});
// route to add athletes page //
app.get('/add',function(req,res){
    res.render("add")
    console.log("Going to add a athlete page")
});

app.post('/add',function(req,res){
    let sampleFile = req.files.sampleFile
    var filename = sampleFile.name;
// Use middleware to move the data from the form to the desired location //
    sampleFile.mv('./images/'+ filename, function(err){
    if(err)
    return res.status(500).send(err);
    });
    
// Write a function to find max id in json file //
    function getMax(athlete,id){
        var max 
        for (var i=0; i<athlete.length; i++){
            if(!max || parseInt(athletes[i][id]) > parseInt(max[id]))
            max = athletes[i];
        }
        return max;
    }
                                            // Call the max function,pass information to it //
    var maxCid = getMax(athletes,"id")
    var newId = maxCid.id +1;               // make new variable for id ,1 larger than current max //
    console.log("New id is:"+newId);
    var json = JSON.stringify(athletes)     //tell application to get JSON ready for the app //

// Create a new JSON  //
    var athletex = {
        name:req.body.name,
        sport:req.body.sport,
        id:newId,
        dob:req.body.dob,
        image:filename,
        country:req.body.country
    }
    fs.readFile('./model/athletes.json','utf8',function readfileCallback(err){
        if(err){
            throw(err)
        } else {
        athletes.push(athletex)   //add new contact to JSON file //
        json = JSON.stringify(athletes,null,4) //This structures new data in JSON file //      
        fs.writeFile('./model/athletes.json',json,'utf8')
        }
        
    })
    res.redirect('/athletes')
    
});
//  To delete an athlete //
app.get('/deleteathletes/:id', function(req, res) {
    var json = JSON.stringify(athletes);
    var keyToFind = parseInt(req.params.id); // call name from the url //
    var data = athletes; //this declares data //
    var index = data.map(function(athletes) {return athletes.id;}).indexOf(keyToFind)
    athletes.splice(index ,1); // deletes one item //
    json = JSON.stringify(athletes, null, 4);
    fs.writeFile('./model/athletes.json', json, 'utf8'); // Writing the data back to the file //
    console.log("Deleted athletes information");
    res.redirect("/athletes");
});
//  To edit an athlete //
app.get('/editathletes/:id',function(req,res){
    
    function chooseAthletes(indOne){
       return indOne.id === parseInt(req.params.id)
    
    }
    var indOne = athletes.filter(chooseAthletes);
    res.render('editathletes',{res:indOne});
    
});
// Post request to edit athlete //
app.post('/editathletes/:id',function(req,res){
    
    let sampleFile = req.files.sampleFile
    var filename = sampleFile.name;
    // Use middleware to move the data from the form to the desired location //
    sampleFile.mv('./images/'+ filename, function(err){
    if(err)
    return res.status(500).send(err);
    });
    
    var json = JSON.stringify(athletes);
    var keyToFind = parseInt(req.params.id);                                            // Find the data for editing //
    var data = athletes                                                                 // declare json file as data // 
    var index = data.map(function(athletes){return athletes.id;}).indexOf(keyToFind)    // Map out data to find information //
    
    athletes.splice(index,1,{
        
    name: req.body.name,
    sport: req.body.sport,
    id: parseInt(req.params.id),
    dob: req.body.dob,
    country:req.body.country,
    image:filename
    });
    
    json = JSON.stringify(athletes, null, 4);               // Structure the new data //
    fs.writeFile('./model/athletes.json',json,'utf8')
    
        res.redirect("/athletes");
});

// SQL DATA //
// Creating a database table route //
app.get('/createtable',function(req,res){
    let sql = 'CREATE TABLE Donal (id int not null AUTO_INCREMENT PRIMARY KEY,Name varchar(50),Price int,image varchar(255), Description varchar(255));'
    let query = db.query(sql,(err,res) => {
    if (err) throw err;
    });
    res.send("Sql successful")
});
// Creating a remove table route //
app.get('/rmtable',function(req,res){
    let sql = 'DROP TABLE Donal;'
    let query = db.query(sql,(err,res) => {
    if (err) throw err;
    });
    res.send("Table removed successfully")
});
// Route to view available products //
app.get('/products',  function(req, res){  
 let sql = 'SELECT * FROM Donal;'
  let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    console.log(res1);
    res.render('products', {res1});
  });
 
  console.log("Entering the products page!");
});

app.get('/insertsql',function(req,res){
res.render('insertsql')
    
}); 

// Route to post / insert a new product //
app.post('/insertsql',function(req,res){
    
    let sampleFile = req.files.sampleFile
    var filename = sampleFile.name;
// Use middleware to move the data from the form to the desired location //
    sampleFile.mv('./images/'+ filename, function(err){
    if(err)
    return res.status(500).send(err);
    });
    
let sql = 'INSERT INTO Donal (Name, Price, Image, Description) VALUES ("'+req.body.name+'", '+req.body.price+', "'+filename+'","'+req.body.description+'")'
let query = db.query(sql,(err,res) =>{
if(err) throw err;
console.log("Oh dear,sql failed to input your data")
    });
    res.redirect("/products");
    
});

// Edit a product sql data //

app.get('/editsql/:id',function(req,res){
    let sql = 'SELECT * FROM Donal WHERE id = "'+req.params.id+'"'
    let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    console.log(res1);
    res.render('editsql',{res1});
    });

});
// Post url to edit products //
app.post('/editsql/:id',function(req,res){
let sql = 'UPDATE Donal SET Name = "'+req.body.name+'",Price = '+req.body.price+',Image = "'+req.body.image+'",Description = "'+req.body.description+'" WHERE id = "'+req.params.id+'"'
        let query = db.query(sql, (err, res1) => {
        if(err) throw err;
        console.log("Oh dear,update failed")
    });
    res.redirect("/products");
   
    
});
// Route to delete products via sql //
app.get('/deletesql/:id', function(req, res) {
    let sql = 'DELETE FROM Donal WHERE id = '+req.params.id+''
    let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    console.log("Oh dear,failed to delete product")
    });
    res.redirect('/products'); 
});


//******** NEVER WRITE BELOW THIS LINE EVER EVER **********

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0",function(){

console.log("Application is now running!")
    
});
