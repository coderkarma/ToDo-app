let fs = require("fs");
let bodyParser = require("body-parser");
let express = require("express");
let crypto = require("crypto");
let mongoose = require("mongoose");


let dbUrl = "mongodb://coderkarma:123456789k@ds119394.mlab.com:19394/todo-fall2018";


mongoose.connect(dbUrl, function(error){
    if(error){
        console.log("MongoDB connection failed");
    } else {
        console.log("MongoDB connectino successfull");
    }
});


let Schema = mongoose.Schema;



let app = express();

let http = require("http").Server(app);

app.use('/', express.static("html_files/"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

http.listen(8080);

function generateRandomString(length){
    let hex = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
    let string = "";
    
    for ( let i = 0; i < length; i++){
        string += hex.charAt(Math.floor(Math.random() * hex.length))
    }
    return string;
}


let Task = Schema({
    "text": String,
    "status": String,
    "dueDate": String,
    "taskId": String
});


let TodoModel = mongoose.model("task", Task);



console.log("Express server is now running on port 8080");

let tasks = ["karma"];

app.post("/fetchTasks", (request, response) => {
    
    let data = {
        "tasks": tasks
    };
    
    response.send(data);
});


app.post("/newTask", (request, response) => {
     let newTask = request.body;
     
     let newTaskForDB = {
         "text": newTask.task,
         "status": "new",
         "dueDate": newTask.dueDate,
         "taskId": crypto.createHash("md5").update(newTask.task).digest("hex") + generateRandomString(8)
     }
    
    let taskToSubmit = TodoModel(newTaskForDB);
    taskToSubmit.save();
    
    let data = {
        "task": "" // mdb request , all task items
    }
    
    response.send(data);
    
});

app.post("/deleteTask", function (request, response) {
    
    let recievedData = request.body;
    let taskToDelete = recievedData.task;
    
    let index = tasks.indexOf(taskToDelete);
    
    if (index > -1) {
        tasks.splice(index, 1);
    }
    
    console.log(tasks);
    
    let data = {
        "tasks": tasks
    }
    
    response.send(data);
});