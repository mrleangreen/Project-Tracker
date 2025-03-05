$(document).ready(function () {
    var submitBtn = $("#formSubmit");
    var tableBody = $("#project-table-body");
    var pName = $("#projName");
    var pType = $("#projType");
    var pDate = $("#projDate");

    // Function to update time every second
    function updateTime() {
        $("#currDateTime").text(dayjs().format("MMM DD, YYYY [at] hh:mm:ss A"));
    }
    setInterval(updateTime, 1000);
    updateTime();

    // Function to load projects from localStorage
    function displayProjects() {
        let projects = JSON.parse(localStorage.getItem("projects")) || [];
        tableBody.empty(); // Clear table before updating

        projects.forEach((project, index) => {
            let dueDate = dayjs(project.date);
            let today = dayjs().startOf("day");
            let rowClass = dueDate.isBefore(today) ? "table-danger" : dueDate.isSame(today, "day") ? "table-warning" : "";

            let row = `
                <tr class="${rowClass}">
                    <td>${project.name}</td>
                    <td>${project.type}</td>
                    <td>${dueDate.format("MMM DD, YYYY")}</td>
                    <td><button class="btn btn-danger btn-sm delete-btn" data-index="${index}">Delete</button></td>
                </tr>
            `;
            tableBody.append(row);
        });
    }

    // Submit form event
    $("#projForm").on("submit", function (event) {
        event.preventDefault();

        let projectName = pName.val().trim();
        let projectType = pType.val();
        let projectDate = pDate.val();

        // Prevent submission if any field is empty
        if (!projectName || projectType === "Select Project Type" || !projectDate) {
            alert("Please fill in all fields correctly before submitting!");
            return;
        }

        let projects = JSON.parse(localStorage.getItem("projects")) || [];
        projects.push({ name: projectName, type: projectType, date: projectDate });
        localStorage.setItem("projects", JSON.stringify(projects));

        // Refresh project list
        displayProjects();

        // Clear form and close modal
        $("#projForm")[0].reset();
        $("#projectModal").modal("hide");
    });

    // Delete project
    tableBody.on("click", ".delete-btn", function () {
        let index = $(this).data("index");
        let projects = JSON.parse(localStorage.getItem("projects")) || [];

        if (index !== undefined) {
            projects.splice(index, 1);
            localStorage.setItem("projects", JSON.stringify(projects));
        }

        displayProjects(); // Refresh the table after deletion
    });

    // Load saved projects on page load
    displayProjects();
});
