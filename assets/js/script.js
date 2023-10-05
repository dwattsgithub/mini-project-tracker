$(document).ready(function () {
  // Function to update the current date and time
  function updateCurrentDateTime() {
    var currentDateTime = dayjs().format('MMM DD, YYYY [at] hh:mm:ss a');
    $('#currDateTime').text(currentDateTime);
  }

  // Update the current date and time every second
  setInterval(updateCurrentDateTime, 1000);

  var submitBtn = $('#formSubmit');
  var table = $('#projTable');
  var pName = $('#projForm input[name="projName"]');
  var pType = $('#projType');
  var pDate = $('#projForm input[name="projDate"]');
  var projList = [];

  // Function to create new row in the table
  function createRow(project) {
    var newRow = $("<tr>");
    newRow.append($("<td>").text(project.name));
    newRow.append($("<td>").text(project.type));
    newRow.append($("<td>").text(project.date));

    // Check if the project is past due or due today
    var dueDate = dayjs(project.date);
    if (dueDate.isBefore(dayjs(), 'day')) {
      newRow.addClass('table-danger'); // Past due
    } else if (dueDate.isSame(dayjs(), 'day')) {
      newRow.addClass('table-warning'); // Due today
    }

    // Add a delete button (extra-credit task)
    var deleteButton = $("<button>").text("Delete").addClass("btn btn-danger btn-sm delete-button");
    newRow.append($("<td>").append(deleteButton));

    // Add a click event for the delete button (extra-credit task)
    deleteButton.on('click', function () {
      // Find the index of the project in the array
      var index = projList.indexOf(project);

      // Remove the project from the array
      projList.splice(index, 1);

      // Update local storage
      localStorage.setItem('projects', JSON.stringify(projList));

      // Remove the row from the table
      newRow.remove();
    });

    // Append the new row to the table's <tbody>
    table.find('tbody').append(newRow);
  }

  // Function to initialize the table with stored projects
  function initTable() {
    var storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      projList = JSON.parse(storedProjects);
      projList.forEach(function (project) {
        createRow(project);
      });
    }
  }

  // Call the initialization function when the page loads
  initTable();

  // On clicking the Submit button
  submitBtn.on('click', function (event) {
    event.preventDefault();
    console.log("submit button on form clicked");

    // Get the form values
    var projectName = pName.val();
    var projectType = pType.val();
    var projectDate = pDate.val();

    // Check if all fields are filled
    if (projectName === "" || projectType === "Select Project Type" || projectDate === "") {
      alert("Please fill in all fields.");
      return;
    }

    // Create a new project object
    var project = {
      name: projectName,
      type: projectType,
      date: projectDate
    };

    // Add the project to the project list
    projList.push(project);

    // Store the updated project list in local storage
    localStorage.setItem('projects', JSON.stringify(projList));

    // Clear the form
    pName.val("");
    pType.val("Select Project Type");
    pDate.val("");

    // Call a function to update the table with the new project
    createRow(project);
  });
});
