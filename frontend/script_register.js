
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');

const msgError = document.getElementById('msgError');
const msgSuccess = document.getElementById('msgSuccess');

const btnSubmit = document.querySelector('#btnSubmit');

const url = 'http://localhost:3000';

btnSubmit.addEventListener('click', (event) => {
    event.preventDefault();

    cadastrar()
})

async function cadastrar() {

    if (!username.value) {
        msgError.style.display = 'block';
        msgError.innerHTML = '<strong>Preencha o campo usuário</strong>';
        username.focus();
        return false;
    }

    if (!email.value) {
        msgError.style.display = 'block';
        msgError.innerHTML = '<strong>Preencha o campo email</strong>';
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
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value
    }

    const response = await fetch(`${url}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    });
    const status = response.status;

    const data = await response.json();
    const msg = await data.msg;

    if (status == 200 || status == 201) {

        msgError.style.display = 'none';
        msgError.innerHTML = ``;

        msgSuccess.style.display = 'block';
        msgSuccess.innerHTML = `<strong>${msg}</strong>`;

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000)
        
    } else {
        msgSuccess.style.display = 'none';
        msgSuccess.innerHTML = ``;

        msgError.style.display = 'block';
        msgError.innerHTML = `<strong>${msg}</strong>`;
    }
}