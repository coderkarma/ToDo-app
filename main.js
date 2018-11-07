let fs = require("fs");
let bodyParser = require("body-parser");
let express = require("express");

let app = express();

let http = require("http").Server(app);

app.use('/', express.static("html_files/"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

http.listen(8080);

console.log("Express server is now running on port 8080");

let tasks = ["karma"];

app.post("/fetchTasks", (request, response) => {
    
    let data = {
        "tasks": tasks
    };
    
    response.send(data);
});


app.post("/newTask", (request, response) => {
    let recievedData = request.body;
    let newTask = recievedData.task;
     console.log(tasks);
    tasks.push(newTask);

    console.log(tasks);
    
     let data = {
        "tasks": tasks
    };
    
    response.send(data);
    
});