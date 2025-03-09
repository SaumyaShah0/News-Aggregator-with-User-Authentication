// Handle signup
document.getElementById('signupForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Get existing users or create empty array
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if user exists
    if(users.some(user => user.username === username)) {
        showMessage('Username already exists!');
        return;
    }

    // Store user (insecure - for demonstration only)
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));

    showMessage('Account created successfully!', 'green');
    setTimeout(() => window.location.href = 'login.html', 1500);
});

// Handle login
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === username);

    if(user && user.password === password) {
        // Store current user in session
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'index.html';
    } else {
        showMessage('Invalid username or password!');
    }
});

function showMessage(text, color = 'red') {
    const messageDiv = document.getElementById('message');
    messageDiv.style.color = color;
    messageDiv.textContent = text;
    setTimeout(() => messageDiv.textContent = '', 3000);
}

// Check if user is logged in (for index.html)
if(window.location.pathname.endsWith('index.html')) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(!currentUser) {
        window.location.href = 'login.html';
    } else {
        document.body.innerHTML = `
            <h1>Welcome, ${currentUser.username}!</h1>
            <button onclick="logout()">Logout</button>
        `;
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}
