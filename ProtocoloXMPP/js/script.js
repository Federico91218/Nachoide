document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const messagesDiv = document.getElementById('messages');
    const usernameSpan = document.getElementById('username');
    const usernameInput = document.getElementById('usernameInput');
    const setUsernameButton = document.getElementById('setUsernameButton');

    let username = '';

    setUsernameButton.addEventListener('click', () => {
        username = usernameInput.value.trim();
        if (username) {
            usernameSpan.textContent = username;
            usernameInput.disabled = true;
            setUsernameButton.disabled = true;
        }
    });

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const message = messageInput.value.trim();
        if (message && username) {
            sendMessage(message, username);
            messageInput.value = '';
        }
    });

    function sendMessage(message, username) {
        fetch('http://localhost:3000/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message, username: username }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to send message');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    const displayedMessages = new Set();

    function displayMessage(messages) {
        messages.forEach(messageData => {
            const { message, username } = messageData;
            const messageKey = `${username}: ${message}`;
            if (!displayedMessages.has(messageKey)) {
                const messageElement = document.createElement('div');
                messageElement.textContent = `${username}: ${message}`;
                messagesDiv.appendChild(messageElement);
                displayedMessages.add(messageKey);
            }
        });
    }

    setInterval(() => {
        fetch('http://localhost:3000/get-messages')
        .then(response => response.json())
        .then(data => {
            displayMessage(data.messages);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, 1000);
});
