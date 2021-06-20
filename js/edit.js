function getToken() {
    return localStorage.getItem('token');
}

async function getUserByToken(token) {
    try {
        const res = await axios.get('https://api.marktube.tv/v1/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log('getUserByToken error', error);
        return null;
    }
}

async function getBooks(bookId) {
    const token = getToken();
    if (token === null) {
        location.href = '../login.html';
        return null;
    }

    try {
        const res = await axios.get(`https://api.marktube.tv/v1/book/${bookId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log('getBook error', error);
        return null;
    }
}

function render(book) {
    const titleElement = document.querySelector('#title');
    titleElement.value = book.title;

    const messageElement = document.querySelector('#message');
    messageElement.value = book.message;

    const authorElement = document.querySelector('#author');
    authorElement.value = book.author;

    const urlElement = document.querySelector('#url');
    urlElement.value = book.url;

    const form = document.querySelector('#form-edit-book');
    form.addEventListener('submit', async event => {
        event.preventDefault();
        event.stopPropagation();
        event.target.classList.add('was-validated');

        try {
            await updateBook(book.bookId);
            location.href = `book.html?id=${book.bookId}`;
        } catch (error) {
            console.log(error);
        }
    });

    const cancelButtonElement = document.querySelector('#btn-cancel');
    cancelButtonElement.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();

        location.href = `book.html?id=${book.bookId}`;
    });
}

async function updateBook(bookId) {
    const titleElement = document.querySelector('#title');
    const messageElement = document.querySelector('#message');
    const authorElement = document.querySelector('#author');
    const urlElement = document.querySelector('#url');

    const title = titleElement.value;
    const message = messageElement.value;
    const author = authorElement.value;
    const url = urlElement.value;

    if (title === '' || message === '' || author === '' || url === '') {
        return;
    }

    const token = getToken();
    if (token === null) {
        location = '../login.html';
        return;
    }

    await axios.patch(
        `https://api.marktube.tv/v1/book/${bookId}`,
        {
            title,
            message,
            author,
            url,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
}

async function main() {
    //브라우저에서 id 가져오기
    const bookId = new URL(location.href).searchParams.get('id');
    //토큰 체크
    const token = getToken();
    if (token === null) {
        location.assign('../login.html');
        return;
    }
    // 토큰으로 서버에서 나의 정보 받아오기
    const user = getUserByToken(token);
    if (user === null) {
        localStorage.clear();
        location.assign('../login.html');
        return;
    }
    // 책을 서버에서 받아오기
    const book = await getBooks(bookId);
    if (book == null) {
        alert('책 가져오기 실패');
        return;
    }
    //받아온책 그리기
    render(book);
}

document.addEventListener('DOMContentLoaded', main);