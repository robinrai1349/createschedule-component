document.addEventListener("DOMContentLoaded", function() {
    const createProfileBtn = document.getElementById('createProfileBtn');
    const profileForm = document.getElementById('profileForm');
    const submitProfileBtn = document.getElementById('submitProfileBtn');
    const cancelProfileBtn = document.getElementById('cancelProfileBtn');

    createProfileBtn.addEventListener('click', function() {
        profileForm.style.display = 'flex';
    });

    cancelProfileBtn.addEventListener('click', function() {
        profileForm.style.display = 'none';
    });

    submitProfileBtn.addEventListener('click', function(e) {
        const semesterId = document.getElementById('semesterId').value;
        const dataFile = document.getElementById('dataFile').files[0];

        if (!semesterId || !dataFile) {
            alert("Please enter a semester identifier and upload a data file.");
            return;
        }

        // Simulate data file validation
        if (!dataFile.name.endsWith('.csv')) {
            alert("Invalid data file format. Please upload a CSV file.");
            return;
        }
        e.preventDefault();
        console.log("test1:")
        var reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            const data = csvToArray(text);
            console.log(data);
        };

        reader.readAsText(dataFile)
        // Simulate profile creation
        alert("Profile created successfully!");
        profileForm.style.display = 'none';
    });
});

function csvToArray(str, delimiter = ",") {
    // slice from start of string to first \n index
    // split will be used to create the array from the string with the ',' delimiter
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

    // slice from \n index + 1 to the end of the tet
    // splitwill be used to create an array of each .csv value row
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");

    // map the rows and split values from each row into an array
    // headers.reduce to create an object with its properties being extracted usin headers:values
    // object passed as an elemt of the array
    const arr = rows.map(function (row) {
        const values = row.split(delimiter);
        const el = headers.reduce(function (object, header, index) {
            object[header] = values[index];
            return object;
        }, {});
        return el;
    })

    // return the array
    return arr;
}