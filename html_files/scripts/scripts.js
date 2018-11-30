/* global $ */

$(document).ready( () => {
    console.log("Ready");
    
    let data = {
    };
    // fetchTask is the handler for the server
    $.post("https://app-todo-coderkarma.c9users.io/fetchTasks", data, (response) => {
        
        for (let i = 0; i < response.tasks.length; i++) {
            console.log(response.tasks[i]);
            
            let html = '<li><input type="checkbox">' + response.tasks[i] + '<button>Edit</button><button>Delete</button></li>';
            
            $('#todo-list ul').append(html);
        }
        
    });
    
    $('#submitNewTask').click( () => {
    
    let input = $('#tasks').val();
    let inputDate = $('#date').val();
    
    let newData = {
        "task": input,
        "dueDate": inputDate,
        "action": "create"
        
    }
        
      // newTask is the handler for the server
      $.post("https://app-todo-coderkarma.c9users.io/newTask", newData, (response, error) => {
          
         $("#message").text("Task Added!");
          $("#message").fadeOut(2000, () => {
              $(this).text("");
              $(this).fadeIn(0);
          });
         
         
         $("#todo-list ul").empty();
          
          for (let i = 0; i < response.tasks.length; i++) {
            console.log(response.tasks[i]);
            
            let html = '<li><input type="checkbox">' + response.tasks[i] + '<button>Edit</button><button class="delete-button">Delete</button></li>';
            
            $('#todo-list ul').append(html);
            
            }
            
            $(".delete-button").click(function (){
                 console.log("Delete button pressed on no!!")
              
              }); 
          
      });
    });
    
});