/* global $ */

// Updates the web page task list, takes in an array of tasks.
function updateTaskList(tasks) {
    
    // Empty out existing web page task list.
    $("#todo-list ul").empty();
    
    // Loop through the array of tasks.
    for (let i = 0; i < tasks.length; i++) {
        
        // Create HTML elements for each task.
        let html = '<li><input type="checkbox"><span task-id="' + tasks[i].taskId + '">' + tasks[i].text + '</span><button>Edit</button><button class="delete-button">Delete</button></li>';

        // Append newly created elements to the web page.
        $('#todo-list ul').append(html);
    }
    
    attachDeleteListeners();
}

// Attaches listeners to delete buttons.
function attachDeleteListeners() {
    $(".delete-button").click( function () {
        // Remove parent of button clicked.
        $(this).parent().remove();
        
        // Grab the text we want to delete
        let currentTask = $(this).parent().children('span').text();
        let currentTaskId =  $(this).parent().children('span').attr('task-id');
        
        let newData = {
            task: currentTask,
            taskId: currentTaskId,
            dueDate: null,
            action: "delete"
        };
        
        console.log(newData);
        
        // Submit to the server the item we want to delete:
        $.post("https://app-todo-coderkarma.c9users.io/deleteTask", newData, function (response) {
            // -> update the List
            updateTaskList(response);
        });
    });
}

$(document).ready(function() {
    console.log("Ready");

    // Create object to send to server. Should be empty.
    let data = {};
    
    // Submit data to server and wait for response:
    $.post("https://app-todo-coderkarma.c9users.io/fetchTasks", data, function(response) {
        // Update the list view.
        updateTaskList(response);
    });

    // When a person clicks on the Create New Task button:
    $("#submitNewTask").click(function() {
        
        // Grab values from the input boxes.
        let input = $("#task").val();
        let inputDate = $("#date").val();
        
        
        
        // Store input data into an object.
        let newData = {
            "task": input,
            "dueDate": inputDate,
            "action": "create"
        };
        
        // Send off object to server,  wait for response.
        $.post("https://app-todo-coderkarma.c9users.io/newTask", newData, function(response) {
            
            // When responded:
            // Put a message on the web page that the task has been added.
            $("#message").text("Task Added!");
            
            // Fade out the message.
            $("#message").fadeOut(2000, function () {
               $(this).text("");
               $(this).fadeIn(0);
            });
            
            console.log(response);
            // Update the list view.
            updateTaskList(response);
        });
        

    });
});
