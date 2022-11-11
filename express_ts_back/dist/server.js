"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
const sercret_key = 'asdfghjkl';
const users = [
    {
        "name": "John",
        "id": "John123",
        "password": "1234",
        "email": "John@gamil.com",
        "phone": "010-1234-5678"
    }
];
const encode_jwt = (user) => {
    const playload = {
        "id": user.id,
        "name": user.name,
    };
    return jsonwebtoken_1.default.sign(playload, sercret_key, {
        algorithm: "HS256",
        expiresIn: '1h',
    });
};
const get_user = (id) => {
    return users.find(user => user.id === id) || null;
};
app.post('/register', (req, res) => {
    const user = get_user(req.body.id);
    if (user) {
        res.status(409).send('이미 존재하는 아이디입니다.');
    }
    const new_user = {
        "name": req.body.name,
        "id": req.body.id,
        "password": req.body.password,
        "email": req.body.email,
        "phone": req.body.phone
    };
    users.push(new_user);
    const message = {
        "token": encode_jwt(new_user),
        "message": "회원가입에 성공하였습니다."
    };
    res.status(200).send(message);
});
app.post('/login', (req, res) => {
    const user = get_user(req.body.id);
    if (!user) {
        res.status(404).send('존재하지 않는 아이디입니다.');
    }
    if ((user === null || user === void 0 ? void 0 : user.password) !== req.body.password) {
        res.status(401).send('비밀번호가 일치하지 않습니다.');
    }
    const message = {
        "token": encode_jwt(user),
        "message": "로그인에 성공하였습니다."
    };
    res.status(200).send(message);
});
app.post('/user', (req, res) => {
    const payload = jsonwebtoken_1.default.verify(req.body.token, sercret_key);
    try {
        payload;
    }
    catch (err) {
        res.status(401).send('유효하지 않은 토큰입니다.');
    }
    const user = get_user(payload.id);
    console.log(user);
    if (!user) {
        res.status(404).send('존재하지 않는 아이디입니다.');
    }
    const message = {
        "name": user === null || user === void 0 ? void 0 : user.name,
        "id": user === null || user === void 0 ? void 0 : user.id,
        "email": user === null || user === void 0 ? void 0 : user.email,
        "phone": user === null || user === void 0 ? void 0 : user.phone
    };
    res.status(200).send(message);
});
app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
    throw new Error('BROKEN');
});
app.get('/error', (req, res) => {
    throw new Error('BROKEN');
});
app.listen(3050, () => {
    console.log('Server is running on port 3050');
});
//# sourceMappingURL=server.js.map