// DOM stuff
//
import {projects, tasks, currentProject, setCurrentProject, getTasksInCalendar,
  getTasksInProject, editProject, toggleCompleteTask, adjPriority, delProject,
  delTask, newTask, editTask, newProject} from "./index.js";

const boxtickPic = require("../boxtick1.jpg");
const boxPic = require("../box1.jpg");

export function dislayTasksInCalendar() {
  // display tasks in days
  let tasksInCalendar = getTasksInCalendar(10);
  let text = "";
  let overdueItem = false;
  let todayItem = false;
  let tomorrowItem = false;
  document.getElementById('calendarBody').innerHTML = "";
  tasksInCalendar.forEach(function(item, index, arr) {
    // if any items are overdue show overdue heading
    if (item.calDay === "Overdue") {
      if (!overdueItem) {
        overdueItem = true;
        text += '<hr><p class="day">Overdue</p>';
      }
      text += '<p class="taskTitleC" id="taskC' + item.taskKey + '">' + item.title;
      text += '</p><p class="taskProject">' + item.project + '</p>';

    } else if (item.calDay === "Today") {
      if (!todayItem) {
        todayItem = true;
        text += '<hr><p class="day">Today</p>';
      }
      text += '<p class="taskTitleC" id="taskC' + item.taskKey + '">' + item.title;
      text += '</p><p class="taskProject">' +  item.project + '</p>';

    } else if (item.calDay === "Tomorrow") {
      if (!tomorrowItem) {
        tomorrowItem = true;
        text += '<hr><p class="day">Tomorrow</p>';
      }
      text += '<p class="taskTitleC" id="taskC' + item.taskKey + '">' + item.title;
      text += '</p><p class="taskProject">' + item.project + '</p>';

    } else {
        if (item.dueDate - arr[index-1] != 0) {
          text += '<hr><p class="day">' + item.dueDate.toDateString() + '</p>';
        }
        text += '<p class="taskTitleC" id="taskC' + item.taskKey + '">' + item.title;
        text += '</p><p class="taskProject">' + item.project + '</p>';
      }
  });
  document.getElementById('calendarBody').innerHTML = text;

  tasksInCalendar.forEach(function(item, index, arr) {
    let calId = "taskC" + item.taskKey;
    document.getElementById(calId).addEventListener("click", function(e) {
      // edit task
      // show current values
      let currentTask = e.target.id.substring(5); // id is "taskCNN"
      updateEditTaskForm(currentTask);
      toggleModalET();
    });
  });
}

export function updateEditTaskForm(currentTask) {
  document.getElementById("taskNo").value = currentTask;
  document.getElementById("taskET").value = tasks[currentTask].title;
  document.getElementById("dueDateET").value = tasks[currentTask].dueDate.toDateString();
  document.getElementById("completeET").checked = tasks[currentTask].complete;
  document.getElementById("notesET").value = tasks[currentTask].notes;
}

// display the list of projects
export function showProjectList() {
  let text = "";
  let projectId = "";
  // clear project list first (and listeners)
  document.getElementById('projectList').innerHTML = "";
  projects.forEach(function(element, index) {
    projectId = "proj" + index;
    text += '<p class="project" id="' + projectId + '">' + element[0] + '</p>';
  });
  document.getElementById('projectList').innerHTML = text;
  projects.forEach(function(element, index) {
    projectId = "proj" + index;
    document.getElementById(projectId).addEventListener("click", function(e) {
      setCurrentProject(e.target.id.substring(4));
      displayProject(currentProject);
    });
  });
}

// display projects and all it's tasks
export function displayProject(proj) {
  // clear project task view and all listeners
  displayBlankProject();
  if (proj !== null) {
    // create text for chosen project and new task button
    let text = '<h3><span id="currentProject">' + projects[proj][0];
    text += '</span><button class="delete" id="delProj">&#x2717;</button></h3>';
    text += '<p id="currentProjectDesc">' + projects[proj][1];
    text += '</p><button id="newTask">New Task</button>';

    // show each task in the project and the details of tasks
    let tasksInProject = getTasksInProject(proj);
    tasksInProject.forEach(function(item) {
      text += '<p><img class="boxTick" src="';
      if (tasks[item].complete) {
        text += boxtickPic;
      } else {
        text += boxPic;
      }
      text += '" id="taskComplete' + item +'"/><span class="taskTitle" ';
      text += 'id="taskTitle' + item + '">' + tasks[item].title;
      text += '</span><button class="delete" id="delete';
      text += item + '">&#x2717;</button></p>';
      text += '<p class="task2ndline"><span class="dueDate">Due Date: </span>';
      text += '<span class="dueDateDate" id="dueDateDate' + item + '">';
      text += tasks[item].dueDate.toDateString() + '</span>'; // convert readable form
      text += '<button class="btnUpx" id="btnUp' + item + '">&#x25B2;</button>';
      text += '<button class="btnDownx" id="btnDown' + item;
      text += '">&#x25BC;</button></p>';
    });
    document.getElementById('projectDisplay').innerHTML = text;

    // loop though items on task section and set ALL listeners
    tasksInProject.forEach(function(item) {
      let taskId = "taskComplete" + item;
      document.getElementById(taskId).addEventListener("click", function(e) {
        toggleCompleteTask(e); // id is "taskCompleteNN"
      });
      taskId = "delete" + item;
      document.getElementById(taskId).addEventListener("click", function(e) {
        delTask(e); // id is "deleteNN"
      });
      taskId = "taskTitle" + item;
      document.getElementById(taskId).addEventListener("click", function(e) {
        // edit task
        // show current values
        let currentTask = e.target.id.substring(9); // id is "taskTitleNN"
        updateEditTaskForm(currentTask);
        toggleModalET();
      });
      taskId = "btnDown" + item;
      document.getElementById(taskId).addEventListener("click", function(e) {
        adjPriority(e, 1); // id is "btnDownNN" 1 = up
      });
      taskId = "btnUp" + item;
      document.getElementById(taskId).addEventListener("click", function(e) {
        adjPriority(e, -1); // id is "btnUpNN" -1 = down
      });
    });

    // current project delete button
    document.getElementById("delProj").addEventListener("click", function() {
      delProject(currentProject);
    });

    // set listener for edit project function
    document.getElementById("currentProject").addEventListener("click", function(e) {
      // edit project details
      // show current values
      document.getElementById("projectEP").value = projects[currentProject][0];
      document.getElementById("projDescEP").value = projects[currentProject][1];
      toggleModalEP();
    });
    // set listener for new task button
    document.getElementById("newTask").addEventListener("click", toggleModal);
  }
}

export function displayBlankProject() {
  document.getElementById('projectDisplay').innerHTML = "";
}

document.getElementById('submitTask').addEventListener("click", function(e) {
  newTask(e);
});
document.getElementById('submitTaskET').addEventListener("click", function(e) {
  editTask(e);
});
document.getElementById('submitProj').addEventListener("click", function(e) {
  newProject(e);
});
document.getElementById('submitProjEP').addEventListener("click", function(e) {
  editProject(e);
});

export function toggleModal() {
  document.getElementById("taskErr").innerText = "";
  document.getElementById("tdateErr").innerText = "";
  document.getElementById("newTaskForm").reset();
  modal.classList.toggle("show-modal");
}
export function toggleModalET() {
  document.getElementById("taskErrET").innerText = "";
  document.getElementById("tdateErrET").innerText = "";
  modalET.classList.toggle("show-modal");
}
export function toggleModalP() {
  document.getElementById("titleErr").innerText = "";
  document.getElementById("newProjForm").reset();
  modalP.classList.toggle("show-modal");
}
export function toggleModalEP() {
  document.getElementById("titleErrEP").innerText = "";
  modalEP.classList.toggle("show-modal");
}

const modal = document.querySelector(".modal");
const modalET = document.querySelector(".modalET");
const modalP = document.querySelector(".modalP");
const modalEP = document.querySelector(".modalEP");
const closeButton = document.querySelector(".close-button");
const closeButtonET = document.querySelector(".close-buttonET");
const closeButtonP = document.querySelector(".close-buttonP");
const closeButtonEP = document.querySelector(".close-buttonEP");

function windowOnClick(event) {
  if (event.target === modal) {
    toggleModal();
  } else {
    if (event.target === modalP) {
      toggleModalP();
    } else {
      if (event.target === modalET) {
        toggleModalET();
      } else {
        if (event.target === modalEP) {
          toggleModalEP();
        }
      }
    }
  }
}

document.getElementById("newProject").addEventListener("click", toggleModalP);
closeButton.addEventListener("click", toggleModal);
closeButtonET.addEventListener("click", toggleModalET);
closeButtonP.addEventListener("click", toggleModalP);
closeButtonEP.addEventListener("click", toggleModalEP);
window.addEventListener("click", windowOnClick);

const picker = datepicker('#dueDateF');
const picker2 = datepicker('#dueDateET');

// bubbling test
// document.getElementById('calendarBody').addEventListener("click", function(e) {
//   alert("calendar element clicked");
//   alert(e.target);
//   console.log(e.target.id);
// });
