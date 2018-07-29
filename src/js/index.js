// //////////////////////////////////////////////////////////////////////////
// To do
//
import {addDummyData} from "./dummyData.js";
import {dislayTasksInCalendar, toggleModalET, showProjectList, displayProject,
  displayBlankProject, toggleModalEP, toggleModalP, toggleModal}
  from "./DOMstuff.js";

require("../style.css");

let projects = [];
let tasks = [];
let currentProject = 0;
let nextKey;

checkForLocalStorage();
// addDummyData();  // used in testing
showProjectList();
displayProject(currentProject);
dislayTasksInCalendar();

// Constructor Pattern for Creating Objects
function Task(project, title, dueDate, complete, taskKey, notes, calDay) {
  this.project = project;
  this.title = title;
  this.dueDate = new Date(dueDate);
  this.complete = complete; // true/false
  this.taskKey = taskKey;
  this.notes = notes;
  this.calDay = calDay; // for calendar view
}

export function getTasksInProject(index) {
  // loop through tasks and create a new array that includes index number of tasks with this "index" as a project
  let projectTasks = [];
  let i = 0;
  for (i = 0; i < tasks.length; i++) {
    if (tasks[i].project === projects[index][0]) {
      projectTasks.push(i);
    }
  }
  return projectTasks;
}

// get tasks in the calndar. First first 10 that are dueDate
export function getTasksInCalendar(numTasksInCal) {
  // make a copy of the tasks array
  let tasksInCalendar = tasks.map(function(item) {
    return item;
  });
  // replace taskKey with the element number so you can look up
  for (let i = 0; i < tasksInCalendar.length; i++) {
    tasksInCalendar[i].taskKey = i;
  }
  // filter out completed tasks
  tasksInCalendar = tasksInCalendar.filter(function(item) {
    return item.complete === false;
  });
  // sort tasks array of objects by the due date key and keep the first num tasks
  function compare(a, b) {
    const dueDateA = a.dueDate;
    const dueDateB = b.dueDate;
    let comparison = 0;
    if (dueDateA > dueDateB) {
      comparison = 1;
    } else if (dueDateA < dueDateB) {
      comparison = -1;
    }
    return comparison;
  }
  tasksInCalendar.sort(compare);

  // keep first 'number of Tasks in Calendar' items
  if (tasksInCalendar.length > numTasksInCal) {
    tasksInCalendar.splice(numTasksInCal);
  }

  tasksInCalendar.forEach(function(item) {
    let today = new Date();
    today = new Date(today.toDateString()); // remove time
    today.setHours(3); // 3am on all tasks
    if (item.dueDate < today) {
      item.calDay = "Overdue";
    } else if (item.dueDate - today == 0) {
      item.calDay = "Today";
    } else if (item.dueDate - today == 86400000) { //86400000 = 24 hours
      item.calDay = "Tomorrow";
    } else item.calDay = item.dueDate;
  });
  return tasksInCalendar;
}

export function toggleCompleteTask(e) {
  // taskCompleteNN
  const task = e.target.id.substring(12);
  tasks[task].complete = !tasks[task].complete;
  displayProject(currentProject);
  dislayTasksInCalendar();
  clearLocalStorage();
  saveTaskToLocalStorage();
}

// need to delete all the task in the project as well
export function delProject(index) {
  // loop through tasks and delete any task with this "index" as a project
  const check = confirm("Are you sure?");
  if (check) {
    let i = 0;
    for (i = 0; i < tasks.length; i++) {
      if (tasks[i].project === projects[index][0]) {
        tasks.splice(i, 1);
        i--;
      }
    }
    // delete project from project array
    projects.splice(index, 1);
    showProjectList();
    dislayTasksInCalendar();
    displayBlankProject();
    currentProject = null;
    clearLocalStorage();
    saveTaskToLocalStorage();
  }
}

export function delTask(e) {
  tasks.splice(e.target.id.substring(6), 1);
  displayProject(currentProject);
  dislayTasksInCalendar();
  clearLocalStorage();
  saveTaskToLocalStorage();
}

export function editProject(e) {
  // validation of entries is done by HTML 5 form (on file version)
  e.preventDefault(); // prevents submitting to server and causing errors
  let projectTitle = document.getElementById("projectEP").value;
  let projectDesc = document.getElementById("projDescEP").value;
  if (projectTitle === "") {
    document.getElementById("titleErrEP").innerText = 'Please enter title';
  } else {
    // need to change the description on all other tasks in this project
    let tasksInProject = getTasksInProject(currentProject);
    tasksInProject.forEach(function(item) {
      tasks[item].project = projectTitle;
    });
    projects[currentProject][0] = projectTitle;
    projects[currentProject][1] = projectDesc;
    toggleModalEP();
    document.getElementById("editProjForm").reset();
    showProjectList();
    displayProject(currentProject);
    dislayTasksInCalendar();
    clearLocalStorage();
    saveTaskToLocalStorage();
  }
}

export function newProject(e) {
  // validation of entries is done by HTML 5 form (on file version)
  e.preventDefault(); // prevents submitting to server and causing errors
  let projectTitle = document.getElementById("projectFN").value;
  let projectDesc = document.getElementById("projDescFN").value;
  if (projectTitle === "") {
    document.getElementById("titleErr").innerText = 'Please enter title';
  } else {
    projects.push([projectTitle, projectDesc]);
    toggleModalP();
    showProjectList();
    clearLocalStorage();
    saveTaskToLocalStorage();
  }
}

export function newTask(e) {
  // validation of entries is done by HTML 5 form (on file version)
  e.preventDefault(); // prevents submitting to server and causing errors
  let taskTitle = document.getElementById("taskF").value;
  let dueDate = new Date(document.getElementById("dueDateF").value);
  dueDate = new Date(dueDate.toDateString()); // remove time
  dueDate.setHours(3); // 3am on all tasks
  let notes = document.getElementById("notesF").value;
  if (taskTitle === "" || isNaN(dueDate)) {
    if (taskTitle === "") {
      document.getElementById("taskErr").innerText = 'Please enter title';
    } else {document.getElementById("taskErr").innerText = "";}
    if (isNaN(dueDate)) {
      document.getElementById("tdateErr").innerText = "Please enter date";
    } else {document.getElementById("tdateErr").innerText = "";}
  } else {
    console.log("adding task");
    let tempTask = new Task(
      projects[currentProject][0],
      taskTitle,
      dueDate,
      false,
      nextKey,
      notes
    );
    nextKey++;
    tasks.push(tempTask);
    toggleModal();
    displayProject(currentProject);
    dislayTasksInCalendar();
    clearLocalStorage();
    saveTaskToLocalStorage();
  }
}

export function editTask(e) {
  // validation of entries is done by HTML 5 form (on file version)
  e.preventDefault(); // prevents submitting to server and causing errors
  let currentTask = document.getElementById("taskNo").value;
  let taskTitle = document.getElementById("taskET").value;
  let dueDate = new Date(document.getElementById("dueDateET").value);
  dueDate = new Date(dueDate.toDateString()); // remove time
  dueDate.setHours(3); // 3am on all tasks
  let complete = document.getElementById("completeET").checked;
  let notes = document.getElementById("notesET").value;
  if (taskTitle === "" || isNaN(dueDate)) {
    if (taskTitle === "") {
      document.getElementById("taskErrET").innerText = 'Please enter title';
    } else {document.getElementById("taskErrET").innerText = "";}
    if (isNaN(dueDate)) {
      document.getElementById("tdateErrET").innerText = "Please enter date";
    } else {document.getElementById("tdateErrET").innerText = "";}
  } else {
    tasks[currentTask].project = projects[currentProject][0];
    tasks[currentTask].title = taskTitle;
    tasks[currentTask].dueDate = dueDate;
    tasks[currentTask].complete = complete;
    tasks[currentTask].notes = notes;
    toggleModalET();
    document.getElementById("editTaskForm").reset();
    displayProject(currentProject);
    dislayTasksInCalendar();
    clearLocalStorage();
    saveTaskToLocalStorage();
  }
}

// move tasks up or down the page
export function adjPriority(e, direction) {
  // direction: 1 = down, -1 = up
  const task = e.target.id.substring(6 + direction);
  let tasksInProject = getTasksInProject(currentProject);
  tasksInProject.forEach(function(item, index, arr) {
    let tempTaskDetails = tasks[task];
    if (task == item) {
      if (arr[index + direction] !== undefined) {
        tasks[task] = tasks[arr[index + direction]];
        tasks[arr[index + direction]] = tempTaskDetails;
      }
    }
  });
  displayProject(currentProject);
  dislayTasksInCalendar();
  clearLocalStorage();
  saveTaskToLocalStorage();
}

// used because import makes imported variables readonly in other modules
export function setCurrentProject(proj) {
  currentProject = proj;
}
export function setNextKey(nextK) {
  nextKey = nextK;
}

// ///////////////////////////// LocaStorage functions ////////////////////////

function clearLocalStorage() {
  if (storageAvailable("localStorage")) {
    localStorage.removeItem("tasks");
    localStorage.removeItem("projects");
    localStorage.removeItem("currentProject");
    localStorage.removeItem("nextKey");
  }
}

function saveTaskToLocalStorage() {
  if (storageAvailable("localStorage")) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("projects", JSON.stringify(projects));
    localStorage.setItem("currentProject", JSON.stringify(currentProject));
    localStorage.setItem("nextKey", JSON.stringify(nextKey));
  }
}

function checkForLocalStorage() {
  if (storageAvailable('localStorage')) {
    // Yippee! We can use localStorage awesomeness
    console.log("LocalStorage available");
    if (localStorage.getItem("tasks")) {
      tasks = JSON.parse(localStorage.getItem('tasks'));
      projects = JSON.parse(localStorage.getItem('projects'));
      currentProject = JSON.parse(localStorage.getItem('currentProject'));
      nextKey = JSON.parse(localStorage.getItem('nextKey'));
      // loop through tasks and convert datestrings to Date Objects
      tasks.forEach(function(item) {
        item.dueDate = new Date(item.dueDate);
      });
    } else {
      // add dummy project
      projects[0] = ["General", "Basic project for miscellaneous tasks"];
      nextKey = 0;
      // add dummy task
      tasks[0] = new Task(
        projects[0][0],
        "do stuff",
        new Date(2018, 7, 25, 3),
        false,
        nextKey,
        "notes on stuff"
      );
      nextKey++;
      saveTaskToLocalStorage();
    }
  }
  else {
    // Too bad, no localStorage for us
    console.log("LocalStorage NOT available");
    // Some sample tasks/projects when localStorage not available
    if (tasks.length == 0) {
      addDummyData();
    }
  }
}

function storageAvailable(type) {
  try {
    var storage = window[type];
    var x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch (e) {
    return e instanceof DOMException && (
      // everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage.length !== 0;
  }
}

// /////////////////////// exports
export {projects, tasks, currentProject, nextKey, Task};
