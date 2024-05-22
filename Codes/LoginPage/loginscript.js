document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Here you can add your login logic, e.g., sending the data to the server
    console.log('Email:', email);
    console.log('Password:', password);

    // For now, just log the inputs
    alert('Login successful');
});
