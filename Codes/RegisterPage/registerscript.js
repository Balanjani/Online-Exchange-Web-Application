//document.getElementById('registrationForm').addEventListener('submit', function(event) {
   // event.preventDefault();

   document.getElementById('registrationForm').addEventListener('submit', function(event) {
    // Here you could add form validation if needed
    // Display the success message
    //document.getElementById('successMessage');
    //.style.display = 'block';
    alert('Registration successful');


    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const dob = document.getElementById('dob').value;

    // Validate form fields
    if (!name || !email || !password || !dob) {
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
                email: email,
                dob: dob
            });
        })
        .then(() => {
            alert('Registration successful');
            // Optionally, redirect to another page or reset form
            document.getElementById('registrationForm').reset();
        })
        .catch((error) => {
            console.error('Error during registration', error);
            alert('Error: ' + error.message);
        });
});
