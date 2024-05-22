document.addEventListener('DOMContentLoaded', function() {
    // Get a reference to the auth service and Firestore
    const auth = firebase.auth();
    const db = firebase.firestore();

    document.getElementById('registrationForm').addEventListener('submit', function(event) {
        event.preventDefault();  // Prevent form from submitting the traditional way

        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Validate form fields
        if (!name || !email || !password) {
            alert('All fields are required');
            return;
        }

        // Register user with Firebase Authentication
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;

                // Store additional user details in Firestore
                return db.collection('users').doc(user.uid).set({
                    name: name,
                    email: email
                });
            })
            .then(() => {
                alert('Registration successful');
                // Optionally, redirect to another page or reset form
                document.getElementById('registrationForm').reset();
            })
            .catch((error) => {
                if (error.code === 'auth/email-already-in-use') {
                    alert('The email address is already in use by another account.');
                } else {
                    console.error('Error during registration', error);
                    alert('Error: ' + error.message);
                }
            });
    });
});
