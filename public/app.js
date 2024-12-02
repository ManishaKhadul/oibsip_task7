// Show register form
function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

// Show login form
function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}

// Handle user registration
function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    if (username && password) {
        // Send data to the backend (Node.js with MongoDB)
        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            alert('Registration successful!');
            showLogin();
        })
        .catch(err => alert('Error registering user: ' + err));
    } else {
        alert('Please fill in both fields.');
    }
}

// Handle user login
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (username && password) {
        // Send login request to the backend
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (response.status === 200) {
                alert('Login successful!');
                document.getElementById('login-form').style.display = 'none';
                document.getElementById('secured-page').style.display = 'block';
            } else {
                alert('Invalid credentials!');
            }
        })
        .catch(err => alert('Login failed: ' + err));
    } else {
        alert('Please fill in both fields.');
    }
}

// Logout and show login form
function logout() {
    document.getElementById('secured-page').style.display = 'none';
    showLogin();
}
