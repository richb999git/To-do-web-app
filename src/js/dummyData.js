import {projects, tasks, Task, setNextKey} from "./index.js";

export function addDummyData() {
  // add dummy project titles
  alert("Adding dummy data");
  projects[0] = ["General", "Basic project for miscellaneous tasks"];
  projects.push(["ProjAwe", "Awesome project. Words cannot express just how awesome"]);
  projects.push(["projDel", "Project used to test the delete project function"]);
  projects.push(["projPump", "Pumpingly good project about pumping activity."]);
  projects.push(["projCakes", "A cake making project. Many designs to test"]);

  let nextK = 0;
  // add dummy tasks
  tasks[0] = new Task(
    projects[0][0],
    "get milk",
    new Date(2018, 6, 25, 3),
    false,
    nextK,
    "lots of notes lalala"
  );
  nextK++;
  tasks[1] = new Task(
    projects[0][0],
    "get potatoes",
    new Date(2018, 6, 26, 3),
    true,
    nextK,
    "lots of notes yipyip"
  );
  nextK++;
  tasks[2] = new Task(
    projects[1][0],
    "get diamonds",
    new Date(2018, 7, 31, 3),
    true,
    nextK,
    "lots of notes dosh"
  );
  nextK++;
  tasks[3] = new Task(
    projects[2][0],
    "get proj notes",
    new Date(2018, 7, 31, 3),
    true,
    nextK,
    "lots of notes proj"
  );
  nextK++;
  tasks[4] = new Task(
    projects[2][0],
    "get proj1 notes",
    new Date(2018, 7, 31, 3),
    false,
    nextK,
    "lots of notes proj2"
  );
  nextK++;
  tasks[5] = new Task(
    projects[0][0],
    "get veggies",
    new Date(2018, 6, 27, 3),
    false,
    nextK,
    "lots of notes on veggies"
  );
  nextK++;
  tasks[6] = new Task(
    projects[0][0],
    "get choc",
    new Date(2018, 6, 29, 3), // 29th Jul 2018 3am
    false,
    nextK,
    "lots of notes on chocolate"
  );
  nextK++;
  tasks[7] = new Task(
    projects[0][0],
    "get balloons",
    new Date(2018, 6, 30, 3),
    false,
    nextK,
    "lots of notes on balloons"
  );
  nextK++;
  setNextKey(nextK);
}
