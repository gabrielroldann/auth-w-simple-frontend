
const btnSubmit = document.getElementById('btnSubmit');
const username = document.getElementById('username');
const password = document.getElementById('password');
const msgError = document.getElementById('msgError');
const msgSuccess = document.getElementById('msgSuccess');
const url = 'http://localhost:3000'

btnSubmit.addEventListener('click', (event) => {
    event.preventDefault();

    login();
})


async function login() {
    // localStorage.clear();

    if (!username.value) {
        msgError.style.display = 'block';
        msgError.innerHTML = '<strong>Preencha o campo usuário</strong>';
        username.focus();
        return false;
    }

    if (!password.value) {
        msgError.style.display = 'block';
        msgError.innerHTML = '<strong>Preencha o campo senha</strong>';
        password.focus();
        return false;
    }

    const user = {
        username: username.value,
        password: password.value
    }

    const response = await fetch(`${url}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    

    const data = await response.json();
    const msg = await data.msg;
    const status = response.status;


    if (status == 200 || status == 201) {

        msgError.style.display = 'none';
        msgError.innerHTML = ``;

        msgSuccess.style.display = 'block';
        msgSuccess.innerHTML = `<strong>${msg}</strong>`;

        const token = data.token;
        localStorage.setItem('username', data.username);
        localStorage.setItem('token', token);
        // console.log(token);

        setTimeout(() => {
            window.location.href = 'logado.html';
        }, 2000)

    } else {

        msgError.style.display = 'block';
        msgError.innerHTML = `<strong>${msg}</strong>`;
        
    }
};