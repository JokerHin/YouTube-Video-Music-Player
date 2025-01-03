document.addEventListener('DOMContentLoaded', function() {
    displayUserInfo();
    setupModeToggle();
    displayHistory();
});

function displayUserInfo() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('user-picture').src = user.profilePictureUrl;
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-info').style.display = 'flex';
    }
}

function setupModeToggle() {
    const modeToggle = document.getElementById('mode-toggle');
    modeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-mode');
        const isLightMode = document.body.classList.contains('light-mode');
        localStorage.setItem('mode', isLightMode ? 'light' : 'dark');
    });

    const savedMode = localStorage.getItem('mode');
    if (savedMode === 'light') {
        document.body.classList.add('light-mode');
    }
}

document.getElementById('user-info').addEventListener('click', function() {
    document.getElementById('edit-profile-container').style.display = 'block';
    document.querySelector('.container').style.display = 'none';
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
                document.querySelector('.container').style.display = 'block';
            };
            reader.readAsDataURL(profilePicture);
        } else {
            localStorage.setItem('user', JSON.stringify(user));
            alert('Profile updated successfully!');
            displayUserInfo();
            document.getElementById('edit-profile-container').style.display = 'none';
            document.querySelector('.container').style.display = 'block';
        }
    } else {
        alert('Please enter a name.');
    }
});

document.getElementById('logout-button').addEventListener('click', function() {
    localStorage.removeItem('user');
    alert('Logged out successfully!');
    window.location.href = 'index.html';
});

document.getElementById('back-to-landing-from-edit').addEventListener('click', function() {
    document.getElementById('edit-profile-container').style.display = 'none';
    document.querySelector('.container').style.display = 'block';
});

// Existing code for conditions and history modals
const conditionsModal = document.getElementById("conditions-modal");
const conditionsBtn = document.getElementById("conditions-button");
const conditionsClose = document.getElementsByClassName("close")[0];

conditionsBtn.onclick = function() {
    conditionsModal.style.display = "block";
}

conditionsClose.onclick = function() {
    conditionsModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == conditionsModal) {
        conditionsModal.style.display = "none";
    }
}

const historyModal = document.getElementById("history-modal");
const historyBtn = document.getElementById("history-button");
const historyModalClose = document.getElementById("history-modal-close");

historyBtn.onclick = function() {
    displayHistory();
    historyModal.style.display = "block";
}

historyModalClose.onclick = function() {
    historyModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == historyModal) {
        historyModal.style.display = "none";
    }
}

function displayHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    let history = JSON.parse(localStorage.getItem('youtubeHistory')) || [];
    history.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'history-item';
        
        const a = document.createElement('a');
        a.textContent = item.name;
        a.href = "#";
        a.addEventListener('click', () => {
            playVideoFromHistory(item.url);
        });
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'edit-button';
        editBtn.addEventListener('click', () => {
            editHistoryItem(index);
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-button';
        deleteBtn.addEventListener('click', () => {
            deleteFromHistory(index);
        });
        
        buttonContainer.appendChild(editBtn);
        buttonContainer.appendChild(deleteBtn);
        
        div.appendChild(a);
        div.appendChild(buttonContainer);
        historyList.appendChild(div);
    });
}

function playVideoFromHistory(url) {
    const videoPlayer = document.getElementById('video-player');
    const videoId = extractVideoID(url);
    if (videoId) {
        videoPlayer.src = `https://www.youtube.com/embed/${videoId}`;
        document.getElementById('history-modal').style.display = 'none';
    } else {
        alert('Invalid YouTube URL');
    }
}

function deleteFromHistory(index) {
    let history = JSON.parse(localStorage.getItem('youtubeHistory')) || [];
    history.splice(index, 1);
    localStorage.setItem('youtubeHistory', JSON.stringify(history));
    displayHistory();
}

function editHistoryItem(index) {
    let history = JSON.parse(localStorage.getItem('youtubeHistory')) || [];
    const newName = prompt('Enter new name:', history[index].name);
    if (newName) {
        history[index].name = newName;
        localStorage.setItem('youtubeHistory', JSON.stringify(history));
        displayHistory();
    }
}

function extractVideoID(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : null;
}

document.getElementById('play-button').addEventListener('click', function() {
    const urlInput = document.getElementById('youtube-url');
    const videoPlayer = document.getElementById('video-player');
    const url = urlInput.value;
    
    const videoId = extractVideoID(url);
    if (videoId) {
        document.getElementById('title-modal').style.display = 'block';
        document.getElementById('save-title-button').onclick = function() {
            const title = document.getElementById('video-title').value;
            if (title) {
                videoPlayer.src = `https://www.youtube.com/embed/${videoId}`;
                saveToHistory(title, url);
                document.getElementById('title-modal').style.display = 'none';
            } else {
                alert('Please enter a title.');
            }
        };
    } else {
        alert('Invalid YouTube URL');
    }
});

function saveToHistory(title, url) {
    let history = JSON.parse(localStorage.getItem('youtubeHistory')) || [];
    history.push({ name: title, url: url });
    localStorage.setItem('youtubeHistory', JSON.stringify(history));
    displayHistory();
}

document.getElementById('title-modal-close').addEventListener('click', function() {
    document.getElementById('title-modal').style.display = 'none';
});

document.getElementById('search-button').addEventListener('click', function() {
    const query = document.getElementById('search-input').value.toLowerCase();
    filterHistory(query);
});

function filterHistory(query) {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    let history = JSON.parse(localStorage.getItem('youtubeHistory')) || [];
    history.forEach((item, index) => {
        if (item.name.toLowerCase().includes(query) || query === '') {
            const div = document.createElement('div');
            div.className = 'history-item';
            
            const a = document.createElement('a');
            a.textContent = item.name;
            a.href = "#";
            a.addEventListener('click', () => {
                playVideoFromHistory(item.url);
            });
            
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';
            
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'edit-button';
            editBtn.addEventListener('click', () => {
                editHistoryItem(index);
            });
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-button';
            deleteBtn.addEventListener('click', () => {
                deleteFromHistory(index);
            });
            
            buttonContainer.appendChild(editBtn);
            buttonContainer.appendChild(deleteBtn);
            
            div.appendChild(a);
            div.appendChild(buttonContainer);
            historyList.appendChild(div);
        }
    });
}

let autoPlayActive = false;
let currentVideoIndex = 0;

document.getElementById('auto-play-button').addEventListener('click', function() {
    autoPlayActive = !autoPlayActive;
    this.classList.toggle('active', autoPlayActive);
    if (autoPlayActive) {
        playNextVideo();
    }
});

function playNextVideo() {
    let history = JSON.parse(localStorage.getItem('youtubeHistory')) || [];
    if (history.length > 0) {
        currentVideoIndex = (currentVideoIndex + 1) % history.length;
        const nextVideo = history[currentVideoIndex];
        playVideoFromHistory(nextVideo.url);
    }
}

function playVideoFromHistory(url) {
    const videoPlayer = document.getElementById('video-player');
    const videoId = extractVideoID(url);
    if (videoId) {
        videoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
        document.getElementById('history-modal').style.display = 'none';
        videoPlayer.addEventListener('load', function() {
            const player = new YT.Player(videoPlayer, {
                events: {
                    'onStateChange': onPlayerStateChange
                }
            });
        });
    } else {
        alert('Invalid YouTube URL');
    }
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED && autoPlayActive) {
        playNextVideo();
    }
}

function extractVideoID(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : null;
}

document.getElementById('play-button').addEventListener('click', function() {
    const urlInput = document.getElementById('youtube-url');
    const videoPlayer = document.getElementById('video-player');
    const url = urlInput.value;
    
    const videoId = extractVideoID(url);
    if (videoId) {
        document.getElementById('title-modal').style.display = 'block';
        document.getElementById('save-title-button').onclick = function() {
            const title = document.getElementById('video-title').value;
            if (title) {
                videoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
                saveToHistory(title, url);
                document.getElementById('title-modal').style.display = 'none';
                videoPlayer.addEventListener('load', function() {
                    const player = new YT.Player(videoPlayer, {
                        events: {
                            'onStateChange': onPlayerStateChange
                        }
                    });
                });
            } else {
                alert('Please enter a title.');
            }
        };
    } else {
        alert('Invalid YouTube URL');
    }
});

function saveToHistory(title, url) {
    let history = JSON.parse(localStorage.getItem('youtubeHistory')) || [];
    history.push({ name: title, url: url });
    localStorage.setItem('youtubeHistory', JSON.stringify(history));
    displayHistory();
}

function displayHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    let history = JSON.parse(localStorage.getItem('youtubeHistory')) || [];
    history.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'history-item';
        
        const a = document.createElement('a');
        a.textContent = item.name;
        a.href = "#";
        a.addEventListener('click', () => {
            playVideoFromHistory(item.url);
        });
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'edit-button';
        editBtn.addEventListener('click', () => {
            editHistoryItem(index);
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-button';
        deleteBtn.addEventListener('click', () => {
            deleteFromHistory(index);
        });

        const downloadBtn = document.createElement('div');
        downloadBtn.className = 'download-button';
        downloadBtn.textContent = 'Download';
        
        const dropdownContent = document.createElement('div');
        dropdownContent.className = 'dropdown-content';
        
        const downloadMp3 = document.createElement('a');
        downloadMp3.href = '#';
        downloadMp3.textContent = 'MP3';
        downloadMp3.addEventListener('click', () => {
            downloadVideo(item.url, 'mp3');
        });
        
        const downloadMp4 = document.createElement('a');
        downloadMp4.href = '#';
        downloadMp4.textContent = 'MP4';
        downloadMp4.addEventListener('click', () => {
            downloadVideo(item.url, 'mp4');
        });
        
        dropdownContent.appendChild(downloadMp3);
        dropdownContent.appendChild(downloadMp4);
        downloadBtn.appendChild(dropdownContent);
        
        buttonContainer.appendChild(editBtn);
        buttonContainer.appendChild(deleteBtn);
        buttonContainer.appendChild(downloadBtn);
        
        div.appendChild(a);
        div.appendChild(buttonContainer);
        historyList.appendChild(div);
    });
}

function downloadVideo(url, format) {
    const videoId = extractVideoID(url);
    if (videoId) {
        // Example using y2mate.com
        const downloadUrl = `https://www.y2mate.com/youtube/${videoId}?format=${format}`;
        window.open(downloadUrl, '_blank');
    } else {
        alert('Invalid YouTube URL');
    }
}