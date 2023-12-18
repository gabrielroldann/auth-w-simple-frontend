
const titleLogado = document.getElementById('titleLogado');
const btnLogout = document.getElementById('btnLogout');
const btnInicio = document.getElementById('btnInicio');
const textLogout = document.getElementById('textLogout');

const token = localStorage.getItem('token');

if (!token) {

    btnLogout.style.display = 'none';

    titleLogado.innerHTML = 'Você precisa estar logado para acessar essa pagina.';

    btnInicio.style.display = 'block';
    
    btnInicio.addEventListener('click', () => {

        textLogout.style.textAlign = 'center';
        textLogout.style.width = '300px';
        textLogout.style.padding = '10px';
        textLogout.style.backgroundColor = 'rgba(207, 119, 119, 0.747)';
        textLogout.style.color = 'red';
        textLogout.innerHTML = '<strong>Retornando a página de Login...</strong>';
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000)
    })
    
} else {
    fetch(`http://localhost:3000/auth/logado`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        
        const username = localStorage.getItem('username');
        titleLogado.style.display = 'block';
        titleLogado.innerHTML = `Welcome ${username}`;
    
    })
    .catch(err => {
        console.log(err);
    });
}

btnLogout.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    textLogout.style.textAlign = 'center';
    textLogout.style.width = '200px';
    textLogout.style.padding = '10px';
    textLogout.style.backgroundColor = 'rgba(207, 119, 119, 0.747)';
    textLogout.style.color = 'red';
    textLogout.innerHTML = '<strong>Deslogando usuário...</strong>';
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000)
})
