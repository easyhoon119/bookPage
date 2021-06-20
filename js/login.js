async function login(event) {
    event.preventDefault();
    event.stopPropagation();

    const emailElement = document.querySelector('#email');
    const passwordElement = document.querySelector('#password');

    const email = emailElement.value;
    const password = passwordElement.value;

    try {
        const res = await axios.post('https://api.marktube.tv/v1/me', {
            email,
            password,
        });
        const token = res.data.token;
        if (token === null) {
            return;
        }
        localStorage.setItem('token', token);
        location.assign('../index.html');
    } catch (error) {
        const data = error.response.data;
        if (data) {
            const state = data.error;
            if (state === 'USER_NOT_EXIST') {
                alert('사용자가 존재하지 않습니다.')
            }
        }
    }
}

function bindLoginButton() {
    const form = document.querySelector('#form-login');
    form.addEventListener('submit', login);
}

function getToken() {
    return localStorage.getItem('token');
}

function main() {
    // 버튼의 이벤트 연결
    bindLoginButton();
    // 토큰 체크
    const token = getToken();
    if (token !== null) {
        location.assign('../');
        return;
    }
}

document.addEventListener('DOMContentLoaded', main);