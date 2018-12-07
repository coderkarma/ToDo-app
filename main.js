//


let bodyParser = require("body-parser");
let express = require("express");
const crypto = require("crypto");
const mongoose = require('mongoose');

let dbUrl = "mongodb://coderkarma:123456789k@ds119394.mlab.com:19394/todo-fall2018";

mongoose.connect(dbUrl, function(error) {

    if (error) {
        console.log("MongoDB connection failed!" + error);
    }
    else {
        console.log("MongoDB connection successfull!");
    }

});

let Schema = mongoose.Schema;

let app = express();

let http = require("http").Server(app);

app.use('/', express.static("html_files/"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

http.listen(8080);

function generateRandomString(length) {
    let hex = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
    let string = "";

    for (let i = 0; i < length; i++) {
        string += hex.charAt(Math.floor(Math.random() * hex.length));
    }

    return string;
}

let Task = Schema({
    "text": String,
    "status": String,
    "dueDate": String,
    "taskId": String
});

let TodoModel = mongoose.model('tasks', Task);


function getTasksFromDB() {

    TodoModel.find({}, function(error, result) {

        if (error) {
            console.log("Something went wrong!");
            return -1;
        }
        else {
            //console.log(result);
            return result;
        }
    });

}

console.log("Express server is now running on port 8080");

app.post("/fetchTasks", function(request, response) {

    TodoModel.find({}, function(error, result) {

        if (error) {
            console.log("Something went wrong!");
        }
        else {
            //console.log(result);
            response.send(result);
        }
    });

});

app.post("/newTask", function(request, response) {

    let newTask = request.body;
        console.log(newTask);
    let newTaskForDB = {
        "text": newTask.task,
        "status": "new",
        "dueDate": newTask.dueDate,
        "taskId": crypto.createHash("md5").update(newTask.task).digest("hex") + generateRandomString(8)
    };

    let taskToSubmit = TodoModel(newTaskForDB);

    taskToSubmit.save(function(error) {
        if (error) {

        }
        else {
            TodoModel.find({}, function(error, result) {

                if (error) {
                    console.log("Something went wrong!");
                }
                else {
                    //console.log(result);
                    response.send(result);
                }
            });
        }
    });
});

app.post("/deleteTask", function(request, response) {

    let recievedData = request.body;
    
    console.log(recievedData);
    
    let taskToDelete = recievedData.taskId;
    
    console.log(taskToDelete);
    
    TodoModel.deleteOne({taskId: taskToDelete}, function (error, result) {
        
        console.log(result);
        
        if (error) {
            console.log("something went wrong with delete!");
        } else {
            TodoModel.find({}, function (error, result) {
                
                if (error) {
                    console.log("could not find list of tasks.");
                } else {
                    response.send(result);
                }
                
            });
        }
    });
});


app.post("/updateTask", function (request, response) {
    
    let receivedData = request.body;
    let taskToUpdate = receivedData.taskId;
    
    TodoModel.findOneAndUpdate({"taskId": taskToUpdate}, {"text": receivedData.task}, {"upsert": true}, function (error, result) {
        
        if (error) {
            
        } else {
             TodoModel.find({}, function (error, result) {
                
                if (error) {
                    console.log("could not find list of tasks.");
                } else {
                    response.send(result);
                }
                
            });
        }
        
        
    });
    
});