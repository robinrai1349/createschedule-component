let dataFormat = ["courseID",
                        "courseName",
                        "deadlineName",
                        "deadlineDate",
                        "deadlineGrade"
                    ]

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
        e.preventDefault()

        const semesterId = document.getElementById('semesterId').value;
        const dataFile = document.getElementById('dataFile').files[0];

        if (!semesterId || !dataFile) {
            alert("Please enter a semester identifier and upload a data file.");
            return;
        }

        // Simulate data file validation
        if (!dataFile.name.endsWith('.csv')) {
            alert("Invalid data file format. Please upload a valid CSV file.");
            return;
        }

        var reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            if (correctHeaders(text)) {
                const data = csvToArray(text);
                sendDataToServer(semesterId, data)
            } else {
                alert("Invalid data file format. Please upload a valid CSV file.");
            }
            
        };

        reader.readAsText(dataFile)
        // Simulate profile creation

        // Hide form after submission
        profileForm.style.display = 'none';
    });
});

function correctHeaders(str, delimiter = ",") {
    let valid = true

    const headers = str.slice(0, str.indexOf("\n")).replace(/(\r)/gm, "").split(delimiter);
    headers.forEach(h => {
        if (!dataFormat.includes(h)) {
            valid = false;
        }
    });
    return valid;
}

function csvToArray(str, delimiter = ",") {
    // slice from start of string to first \n index
    // split will be used to create the array from the string with the ',' delimiter
    const headers = str.slice(0, str.indexOf("\n")).replace(/(\r)/gm, "").split(delimiter);

    // slice from \n index + 1 to the end of the tet
    // splitwill be used to create an array of each .csv value row
    const rows = str.slice(str.indexOf("\n") + 1).replace(/(\r)/gm, "").split("\n");

    // map the rows and split values from each row into an array
    // headers.reduce to create an object with its properties being extracted using headers:values
    // object passed as an element of the array
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
};

function sendDataToServer(semesterId, dataArray) {
    // Prepare data to send to the server
    const requestData = {
        semesterId: semesterId,
        data: dataArray
    };
    // Send data to the server using fetch API
    fetch('/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message)
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        alert("Failed to create profile. Please try again later.");
    })
};