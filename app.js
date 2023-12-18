require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

// acessando models
const User = require('./models/User');

// configurando JSON response
app.use(express.json());
app.use(cors())

// rota public (quaquer um pode acessar)
app.get('/', async(req, res) => {
    res.status(200);
    res.send({ msg: "Public page!" })
});

// rota privada (user logged)
app.get('/auth/logado', checkToken, async(req, res) => {
    res.status(200);
    res.send({ msg: "Este usuário está logado" })
})

// rota privada (apenas logado)
app.get('/user/:id', checkToken, async(req, res) => {

    const id = req.params.id;

    //user existe
    const user = await User.findById(id, '-password');

    if (!user) {
        res.status(404);
        return res.send({msg: "Usuário não encontrado"})
    }

    res.status(200);
    res.send({ user });
});

function checkToken( req, res, next ) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) {
        console.log(authHeader)
        return res.status(401).json({ msg: "Acesso negado" })
    }

    try {
        
        const secret = process.env.SECRET

        jwt.verify(token, secret)

        next()
    } catch(error) {
        res.status(400).json({ msg: "Token inválido" })
    }
};

// registrar user
app.post('/auth/register', async(req, res) => {

    const {username, email, password, confirmPassword} = req.body;

    if (!username) {
        res.status(422);
        console.log("O usuario é obrigatório.")
        return res.send({ msg: "O usuario é obrigatório." })
    }

    if (!email) {
        res.status(422);
        return res.send({ msg: "O email é obrigatório." })
    }

    if (!password) {
        res.status(422);
        return res.send({ msg: "A senha é obrigatória." })
    }

    if (confirmPassword !== password) {
        res.status(422);
        return res.send({ msg: "As senhas não conferem." })
    }

    // verificar se usuario existe (mesmo de 'where' SQL)
    const userExists = await User.findOne({ username: username });

    if (userExists) {
        res.status(422);
        return res.send({ msg: "Nome de usuário já existe." })
    }
    
    const salt = await bcrypt.genSalt(12);
    const passHash = await bcrypt.hash(password, salt);

    const user = new User({
        username,
        email,
        password: passHash
    });

    try {

        user.save();

        res.status(201);
        return res.send({ msg: "Registrando usuário...", user })

    } catch (err) {
        console.log(err);

        res.status(404);
        return res.send({ msg: "Erro no servidor. Tente novamente." })
    }
    
});

// login user
app.post('/auth/login', async(req, res) => {

    const { username, password } = req.body;

    if (!username) {
        res.status(422);
        return res.send({ msg: "Usuário obrigatório." })
    }

    if (!password) {
        res.status(422);
        return res.send({ msg: "Senha obrigatória." })
    }

    // usuario existe
    const user = await User.findOne({ username: username });

    if (!user) {
        res.status(422);
        return res.send({ msg: "Usuário não encontrado." })
    }

    // validar password
    const checkPass = await bcrypt.compare(password, user.password);

    if (!checkPass) {
        res.status(422);
        return res.send({ msg: "Senha incorreta." })
    }

    try {

        const secret = process.env.SECRET

        const token = jwt.sign({
            id: user._id
        }, secret);
        
        res.status(200)
        res.send({ msg: "Logando usuário...", token, username});
    } catch (err) {

        console.log(err);

        res.status(500);
        res.send({ msg: "Erro no servidor. Tente novamente." })
    }
});

// credenciais banco
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

// conect banco
mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.y53dr6p.mongodb.net/`)
    .then(() => {
        app.listen(3000);
        console.log("Conectado ao banco!");
    })
    .catch((err) => {
        console.log(err);
    });
