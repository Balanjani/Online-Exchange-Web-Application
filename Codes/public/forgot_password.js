document.getElementById('forgotPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var email = document.getElementById('email').value;
    var newPassword = document.getElementById('newPassword').value;
    var confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
    }

    // Here you can add JavaScript code to handle the form submission, like sending a reset password link
    console.log('Reset password requested for email: ' + email + ', with new password: ' + newPassword);
    // For demonstration purpose, let's just log the email and new password

    // Show success message
    showSuccessMessage();
});

function showSuccessMessage() {
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = 'Password changed successfully';

    document.body.appendChild(toast);

    // Remove the toast after 3 seconds
    setTimeout(function() {
        toast.remove();
    }, 3000);
}
