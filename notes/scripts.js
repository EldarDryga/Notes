
let script = document.createElement('script');
document.body.appendChild(script);

let username;
let note;
function saveNote() {
  const messageInput = document.getElementById('message-input');
  note = messageInput.value;
  messageInput.value = '';
  // Adding note to the chat window
  const notesMessages = document.getElementById('chat-messages');
  const messageElement = document.createElement('div');
  messageElement.textContent = note;
  notesMessages.appendChild(messageElement);

  notesMessages.scrollTop = notesMessages.scrollHeight;

  fetch('/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, note }),
  })
    .then(response => response.json())

}

function clearChat() {
  const notesMessages = document.getElementById('chat-messages');
  notesMessages.innerHTML = '';
}
function login() {
  const usernameInput = document.getElementById('login-input');
  username = usernameInput.value;
  console.log(username)

  fetch(`/api/data/check-username?username=${username}`)
    .then(response => response.json())
    .then(responseData => {
      if (responseData.exists) {
        fetch(`/api/data/get-notes?username=${username}`)
        .then(response => response.json())
        .then(notesData => {
          // Displaying notes in the 'chat-messages' div
          const chatMessages = document.getElementById('chat-messages');
          chatMessages.innerHTML = ''; // Clear content before displaying new notes

          notesData.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.textContent = note.content;
            chatMessages.appendChild(noteElement);
          });
        })
        console.log('Никнейм существует в базе данных');
      } else {
        fetch('/api/data/username', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        })
          .then(response => response.json())
          .then(data => {
            console.log(data);
          })
      }
    })



  usernameInput.value = '';
}