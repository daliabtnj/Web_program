fetch('footer.html')
.then(response => response.text())
.then(data => {
    document.getElementById('footer-placeholder').innerHTML = data;
});

// Function to save admin login status
function saveAdmin() {
    localStorage.setItem("whoIsLogged", "admin");
}

// Function to save client login status
function saveCustomer() {
    localStorage.setItem("whoIsLogged", "client");
}

// Function to load the correct header based on login status
function loadHeader() {
    const whoIsIt = localStorage.getItem('whoIsLogged');
    let headerFile;

    if (whoIsIt === 'client') {
        headerFile = 'customer-header.html';
    } else if (whoIsIt === 'admin') {
        headerFile = 'admin-header.html';
    } else {
        headerFile = 'header.html'; // Default header for signed-out users
    }

    fetch(headerFile)
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            window.scrollTo(0, 0);  // Scroll to the top of the page
        })
        .catch(error => console.error('Error loading header:', error));
}

// Call loadHeader to dynamically load the header when the page loads
document.addEventListener("DOMContentLoaded", loadHeader);

function logout() {
    // Clear the login state
    localStorage.removeItem('whoIsLogged');
    // Optionally, redirect to the home page or login page after logging out
    // window.location.href = 'index.html'; // Uncomment if you want to redirect immediately
}