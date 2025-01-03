document.getElementById('show-login-button').addEventListener('click', function() {
    document.getElementById('login-container').style.display = 'block';
    document.querySelector('.hero').style.display = 'none';
});

document.getElementById('back-to-landing').addEventListener('click', function() {
    document.getElementById('login-container').style.display = 'none';
    document.querySelector('.hero').style.display = 'block';
});

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const profilePicture = document.getElementById('profile-picture').files[0];
    
    if (name && password && profilePicture) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const profilePictureUrl = e.target.result;
            localStorage.setItem('user', JSON.stringify({ name, password, profilePictureUrl }));
            alert('Login successful!');
            displayUserInfo();
        };
        reader.readAsDataURL(profilePicture);
    } else {
        alert('Please fill in all fields.');
    }
});

document.getElementById('user-info').addEventListener('click', function() {
    document.getElementById('edit-profile-container').style.display = 'block';
    document.querySelector('.hero').style.display = 'none';
    document.getElementById('login-container').style.display = 'none';
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('edit-name').value = user.name;
    }
});

document.getElementById('edit-profile-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('edit-name').value;
    const profilePicture = document.getElementById('edit-profile-picture').files[0];
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (name) {
        user.name = name;
        if (profilePicture) {
            const reader = new FileReader();
            reader.onload = function(e) {
                user.profilePictureUrl = e.target.result;
                localStorage.setItem('user', JSON.stringify(user));
                alert('Profile updated successfully!');
                displayUserInfo();
                document.getElementById('edit-profile-container').style.display = 'none';
                document.querySelector('.hero').style.display = 'block';
            };
            reader.readAsDataURL(profilePicture);
        } else {
            localStorage.setItem('user', JSON.stringify(user));
            alert('Profile updated successfully!');
            displayUserInfo();
            document.getElementById('edit-profile-container').style.display = 'none';
            document.querySelector('.hero').style.display = 'block';
        }
    } else {
        alert('Please enter a name.');
    }
});

document.getElementById('logout-button').addEventListener('click', function() {
    localStorage.removeItem('user');
    alert('Logged out successfully!');
    window.location.href = 'landing.html';
});

document.getElementById('back-to-landing-from-edit').addEventListener('click', function() {
    document.getElementById('edit-profile-container').style.display = 'none';
    document.querySelector('.hero').style.display = 'block';
});

document.getElementById('get-started-button').addEventListener('click', function(event) {
    event.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        window.location.href = 'content.html';
    } else {
        document.getElementById('login-container').style.display = 'block';
        document.querySelector('.hero').style.display = 'none';
    }
});

document.getElementById('get-started-hero-button').addEventListener('click', function(event) {
    event.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        window.location.href = 'content.html';
    } else {
        document.getElementById('login-container').style.display = 'block';
        document.querySelector('.hero').style.display = 'none';
    }
});

function displayUserInfo() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('user-picture').src = user.profilePictureUrl;
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-info').style.display = 'flex';
        document.getElementById('show-login-button').style.display = 'none';
        document.getElementById('login-container').style.display = 'none';
        document.querySelector('.hero').style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    displayUserInfo();
});