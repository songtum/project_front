// 프론트엔드 코드 수정 예시
const host = "http://127.0.0.1:8080";

const guestbookContainer = document.querySelector('.guestbook-container');
const guestbookForm = document.querySelector('.guestbook-form');
const guestNameInput = document.querySelector('.guest-name');
const messageInput = document.querySelector('.message');

function getEntries() {
    axios.get(`${host}/guestbook`)
        .then(response => {
            renderEntries(response.data.entries);
        })
        .catch(error => {
            console.error('Error fetching entries:', error);
        });
}

function renderEntries(entries) {
    guestbookContainer.innerHTML = ''; // 방명록 컨테이너 초기화
    entries.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('guestbook-entries');

        const entryContent = document.createElement('div');
        entryContent.innerHTML = `<strong>${entry.author}</strong>: ${entry.content} <br> <small>${new Date(entry.timestamp).toLocaleString()}</small>`;
        entryDiv.appendChild(entryContent);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'x';
        deleteBtn.addEventListener('click', function () {
            deleteEntry(entry.id);
        });
        entryDiv.appendChild(deleteBtn);

        guestbookContainer.appendChild(entryDiv);
    });
}

window.addEventListener('DOMContentLoaded', function () {
    getEntries();
});

guestbookForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addEntry();
});

function addEntry() {
    const author = guestNameInput.value.trim();
    const content = messageInput.value.trim();

    if (author === '' || content === '') return;

    const entryData = {
        id: 0,
        author: author,
        content: content,
        timestamp: new Date().toISOString()
    };

    axios.post(`${host}/guestbook`, entryData)
        .then(response => {
            guestNameInput.value = '';
            messageInput.value = '';
            getEntries();
        })
        .catch(error => {
            console.error('Error adding entry:', error);
        });
}

function deleteEntry(entryId) {
    axios.delete(`${host}/guestbook/${entryId}`)
        .then(response => {
            getEntries();
        })
        .catch(error => {
            console.error('Error deleting entry:', error);
        });
}
