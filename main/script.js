// Stores all the tasks
const tasks = [];

// Adds each task based on user input
function addTask() {

  // Input for task name and due date
  var taskName = document.getElementById("taskName").value;
  var taskDueDate = document.getElementById("taskDueDate").value;
  var taskPriority = document.getElementById("taskPriority").value;

  // Formats the time the task was created
  let taskDateCreated = new Date(Date.now()).toLocaleDateString("en-US") + " " + new Date(Date.now()).toLocaleTimeString("en-US");

  // Store information about task in dictionary, then add to tasks array
  taskData = [
    { key: "taskName", value: taskName },
    { key: "taskDueDate", value: taskDueDate },
    { key: "taskDateCreated", value: taskDateCreated },
    { key: "taskPriority", value: taskPriority },
    { key: "isComplete", value: false },
    { key: "DateCompleted", value: 0 },
  ];
  tasks.push(taskData);

  // Must fill out all fields to make a task
  if (taskName == "" || taskDueDate == "") {
    alert("Please fill in task name and due date.");
    return;
  }

  // Create the first three columns of the table along with the last
  var table = document.getElementById("taskTable").getElementsByTagName("tbody")[0];
  var newRow = table.insertRow(table.rows.length);

  for (var i = 0; i < 4; i++) {
    var cell = newRow.insertCell(i);


    // Allow user to change value by clicking of name and due date (time created can not be changed)
    if (i != 2) {
      cell.addEventListener('click', function() {
        cell.title = "Click to Edit!";
        var oldValue = this.innerHTML;
        var newValue = prompt("Edit the cell:", oldValue);
        this.innerHTML = newValue;
        if (i == 0) {
          taskData[0] = { key: "taskName", value: newValue };
        }
        if (i == 1) {
          taskData[1] = { key: "taskDueDate", value: newValue };
        }
        if (i == 3) {
          if (0 <= newValue <= 9) {
            taskData[1] = { key: "priority", value: newValue }
          }
        }
      });
      document.getElementById(taskData[i].key).value = "";
    }
    // Sets actual HTML of each cell, pulling from the taskData dicitionary.
    cell.innerHTML = taskData[i].value;
  }

  // Adds checkbox to the table
  var checkboxCell = newRow.insertCell(3);
  checkboxCell.innerHTML = '<input type="checkbox" >';

  // Adds the last column of the table, which tells the time when the checkbox was clicked
  var timeCompleted = newRow.insertCell(4);
  timeCompleted.innerHTML = "Not Completed";
  timeCompleted.id = taskData[0].value;

  // Checks when the checkbox is checked, then changes the date completed in the dictionary and table
  checkboxCell.addEventListener('change', function() {
    timeCompleted.innerHTML = new Date(Date.now()).toLocaleDateString("en-US");
    taskData[3] = true;
    taskData[4] = Date.now();
  });

  // Adds the urgency ranking to the table as an integer input between zero and nine

}

function thirtyDays() {
  // Generate data in retreivable format
  var table = document.getElementById("taskTable");
  var rows = table.rows;
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var rowData = [];
    for (var j = 0; j < row.cells.length; j++) {
      var cell = row.cells[j];
      rowData.push(cell.innerHTML);
    }

    // Check the ones which are completed
    if (rowData[4] != "Not Completed") {
      var due = new Date();
      var comp = new Date();
      due = due.setFullYear(rowData[1].substring(0, 4), rowData[1].substring(5, 7) - 1, rowData[1].substring(8, 10));
      comp = comp.setFullYear(rowData[4].substring(6, 10), rowData[4].substring(0, 2) - 1, rowData[4].substring(3, 5));
      if (Date.now() - comp <= 30) {
        if (due > comp) {
          row.style.backgroundColor = "yellow";
        } else {
          row.style.backgroundColor = '#FB5A62';
        }
      }
    }
  }
}

// Sets all rows back to a white background
function resetColor() {
  var table = document.getElementById("taskTable");
  var rows = table.rows;
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    row.style.backgroundColor = "white";
  }
}


// Dowloads a file with the current date and infomraton about tasks completed in the last 24 hours
function daily() {

  var table = document.getElementById("taskTable");
  var rows = table.rows;


  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var rowData = [];
    for (var j = 0; j < row.cells.length; j++) {
      var cell = row.cells[j];
      rowData.push(cell.innerHTML);
    }
  }

  // Adds the current date and time
  var text = new Date(Date.now()).toLocaleDateString("en-US") + " " + new Date(Date.now()).toLocaleTimeString("en-US");
  text += "\n";

  for (var i = 1; i < rows.length; i++) {
    var completed = new Date();
    completed = completed.setFullYear(rows[i].cells[4].innerHTML.substring(6, 10), rows[i].cells[4].innerHTML.substring(0, 2) - 1, rows[i].cells[4].innerHTML.substring(3, 5))

    if (Date.now() - completed <= 86400000) {

      text += rows[i].cells[0].innerHTML + ", " + rows[i].cells[1].innerHTML + ", " + rows[i].cells[2].innerHTML + "\n";
    }
  }


  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', 'dailyupdate.txt');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Sorting functions
// Each follow a similar format:
//  - Create variables; pull table and rows
//  - Declare which column will be the sorting criteria with column index
//  - Sort the rows by doing repeated swaps

function sortByName() {
  var x, y, shouldSwitch;
  var table = document.getElementById("taskTable");
  var switching = true;

  while (switching) {

    var switching = false;
    var rows = table.rows;

    for (var i = 1; i < (rows.length - 1); i++) {

      shouldSwitch = false;

      x = rows[i].getElementsByTagName("td")[0];     // The 0 indicates it is sorting the left-most column
      y = rows[i + 1].getElementsByTagName("td")[0]; // The 0 indicates it is sorting the left-most column

      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {

      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

function sortByNameReverse() {
  var x, y, shouldSwitch;
  var table = document.getElementById("taskTable");
  var switching = true;

  while (switching) {

    switching = false;
    var rows = table.rows;

    for (var i = 1; i < (rows.length - 1); i++) {

      shouldSwitch = false;

      x = rows[i].getElementsByTagName("td")[0];
      y = rows[i + 1].getElementsByTagName("td")[0];

      if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {

      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

function sortByDueDate() {
  var x, y, shouldSwitch;
  var table = document.getElementById("taskTable");
  var switching = true;

  while (switching) {

    switching = false;
    var rows = table.rows;

    for (var i = 1; i < (rows.length - 1); i++) {

      shouldSwitch = false;

      x = rows[i].getElementsByTagName("td")[1];
      y = rows[i + 1].getElementsByTagName("td")[1];

      if (x.innerHTML > y.innerHTML) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {

      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

function sortByDueDateReverse() {
  var x, y, shouldSwitch;
  var table = document.getElementById("taskTable");
  var switching = true;

  while (switching) {

    switching = false;
    var rows = table.rows;

    for (var i = 1; i < (rows.length - 1); i++) {

      shouldSwitch = false;

      x = rows[i].getElementsByTagName("td")[1];
      y = rows[i + 1].getElementsByTagName("td")[1];

      if (x.innerHTML < y.innerHTML) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {

      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

function sortByTimeCreated() {
  var x, y, shouldSwitch;
  var table = document.getElementById("taskTable");
  var switching = true;

  while (switching) {

    switching = false;
    var rows = table.rows;

    for (var i = 1; i < (rows.length - 1); i++) {

      shouldSwitch = false;

      x = rows[i].getElementsByTagName("td")[2];
      y = rows[i + 1].getElementsByTagName("td")[2];

      if (x.innerHTML > y.innerHTML) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {

      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

function sortByTimeCreatedReverse() {
  var x, y, shouldSwitch;
  var table = document.getElementById("taskTable");
  var switching = true;

  while (switching) {

    switching = false;
    var rows = table.rows;

    for (var i = 1; i < (rows.length - 1); i++) {

      shouldSwitch = false;

      x = rows[i].getElementsByTagName("td")[2];
      y = rows[i + 1].getElementsByTagName("td")[2];

      if (x.innerHTML < y.innerHTML) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {

      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

function sortByPriority() {
  var x, y, shouldSwitch;
  var table = document.getElementById("taskTable");
  var switching = true;

  while (switching) {

    switching = false;
    var rows = table.rows;

    for (var i = 1; i < (rows.length - 1); i++) {

      shouldSwitch = false;

      x = rows[i].getElementsByTagName("td")[5];
      y = rows[i + 1].getElementsByTagName("td")[5];

      if (x.innerHTML > y.innerHTML) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {

      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

function sortByPriorityReverse() {
  var x, y, shouldSwitch;
  var table = document.getElementById("taskTable");
  var switching = true;

  while (switching) {

    switching = false;
    var rows = table.rows;

    for (var i = 1; i < (rows.length - 1); i++) {

      shouldSwitch = false;

      x = rows[i].getElementsByTagName("td")[5];
      y = rows[i + 1].getElementsByTagName("td")[5];

      if (x.innerHTML < y.innerHTML) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {

      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}