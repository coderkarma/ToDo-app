/* global $ */

// Updates the web page task list, takes in an array of tasks.
function updateTaskList(tasks) {

    // Empty out existing web page task list.
    $("#todo-list ul").empty();

    // Loop through the array of tasks.
    for (let i = 0; i < tasks.length; i++) {

        // Create HTML elements for each task.
        let html = '<li><input type="checkbox"><span task-id="' + tasks[i].taskId + '">' + tasks[i].text + '</span><button class="edit-button">Edit</button><button class="delete-button">Delete</button></li>';

        // Append newly created elements to the web page.
        $('#todo-list ul').append(html);
    }

    attachEditListeners();
    attachDeleteListeners();
}

function attachEditListeners() {
    $(".edit-button").click(function() {

        $(".edit-button").attr("disabled", "disabled");

        $(".edit-button").css("background-color", "lightgrey");
        $(".edit-button").css("color", "white");


        let currentTask = $(this).parent().children('span').text();
        let currentTaskId = $(this).parent().children('span').attr('task-id');

        //console.log(currentTask, currentTaskId);
        $(this).parent().after('<li style="background-color: orange"><input class="update-text" type="text" /><button class="update-button">Update Task</button></li>');


        $(".update-button").off();
        attachUpdateListeners();
    });
}

function attachUpdateListeners() {

    $(".update-button").click(function() {

        $(".edit-button").removeAttr("disabled");

        $(".edit-button").css({
            "background-color": "white",
            "color": "black"
        });

        let text = $(this).prev().val();

        let newData = {
            task: text,
            taskId: $(this).parent().prev().children('span').attr('task-id'),
            action: "update"
        };

        $.post("https://app-todo-coderkarma.c9users.io/updateTask", newData, function(response) {
            updateTaskList(response);
        });

        //console.log(text);

        //$(this).parent().remove();

    });

}

// Attaches listeners to delete buttons.
function attachDeleteListeners() {
    $(".delete-button").click(function() {
        // Remove parent of button clicked.
        $(this).parent().remove();

        // Grab the text we want to delete
        let currentTask = $(this).parent().children('span').text();
        let currentTaskId = $(this).parent().children('span').attr('task-id');

        let newData = {
            task: currentTask,
            taskId: currentTaskId,
            dueDate: null,
            action: "delete"
        };

        console.log(newData);

        // Submit to the server the item we want to delete:
        $.post("https://app-todo-coderkarma.c9users.io/deleteTask", newData, function(response) {
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
        let input = $("#tasks").val();

        if (input === '') {
            $("#message").text('Please fill the task text box');
            $("#message").fadeOut(4000, function(){
                 $(this).text("");
                $(this).fadeIn();
            })

        }
        else {


            let inputDate = $("#date").val();

            console.log(input, inputDate);


            // Store input data into an object.
            let newData = {
                "task": input,
                "dueDate": inputDate,
                "action": "create"
            };

            console.log(newData);
            // Send off object to server,  wait for response.
            $.post("https://app-todo-coderkarma.c9users.io/newTask", newData, function(response) {

                // When responded:
                // Put a message on the web page that the task has been added.
                $("#message").text("Task Added!");

                // Fade out the message.
                $("#message").fadeOut(2000, function() {
                    $(this).text("");
                    $(this).fadeIn(0);
                });

                console.log(response);
                // Update the list view.
                updateTaskList(response);
            });
        }

    });

});
