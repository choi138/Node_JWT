import express, { Request, Response, NextFunction } from 'express';
import bodyParser from "body-parser";
import jwt from 'jsonwebtoken';
import cors from 'cors';
import mysql from 'mysql';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors());
app.use(express.json()); 

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    data: 'my_db'
})

connection.connect();

connection.query('SELECT * FROM userTable', (err: Error, rows, fields) => {
    if (err) throw err;
    console.log('The solution is: ', rows[0].solution);
});

connection.end();

const sercret_key = 'asdfghjkl';

const users = [
    {
        "name": "John",
        "id": "John123",
        "password": "1234",
        "email": "John@gamil.com",
        "phone": "010-1234-5678"
    }
]

const encode_jwt = (user: any) => {
    const playload = {
        "id": user.id,
        "name": user.name,
    }
    return jwt.sign(playload, sercret_key, {
        algorithm: "HS256",
        expiresIn: '1h',
    });
}

// id로 유저찾기, 만약 없으면 null 반환
const get_user = (id: String) => {
    return users.find(user => user.id === id) || null;
}


// 회원가입
app.post('/register', (req: Request, res: Response) => {
    // 이미 존재하는 아이디인지 확인
    const user = get_user(req.body.id);
    if (user) {
        // json 형식으로 보내기
        res.json({"message": "이미 존재하는 아이디입니다."});
        return;
    }
    // 새로운 유저 생성
    const new_user = {
        "name": req.body.name,
        "id": req.body.id,
        "password": req.body.password,
        "email": req.body.email,
        "phone": req.body.phone
    }
    users.push(new_user);
    const message = {
        "token": encode_jwt(new_user),
        "message": "회원가입에 성공하였습니다."
    }
    res.status(200).send(message);
})

// 로그인
app.post('/login', (req: Request, res: Response) => {
    const user = get_user(req.body.id)
    if (!user) {
        res.json({"message": "존재하지 않는 아이디입니다."});
        return;
    }

    // 비밀번호 확인
    if (user?.password !== req.body.password) {
        res.json({"message": "비밀번호가 일치하지 않습니다."});
        return;
    }

    // jwt 발급
    const message = {
        "token": encode_jwt(user),
        "message": "로그인에 성공하였습니다."
    }
    res.status(200).send(message);
})

// 유저 정보 가져오기
app.post('/user', (req: Request, res: Response) => {
    //  토큰을 secret_key로 HS256 알고리즘으로 해석해라
    const payload = jwt.verify(req.body.token, sercret_key) as any;
    try {
        payload
    }
    catch (err) {
        // json 형식으로 보내기
        res.json({"message": "토큰이 유효하지 않습니다."});
        return;
    }

    // id로 유저 찾기
    // payload의 id를 가진 유저를 찾아라
    const user = get_user(payload.id);
    console.log(user);
    if (!user) {
        // json 형식으로 보내기
        res.json({"message": "존재하지 않는 유저입니다."});
        return;
    }

    // 유저 정보 반환
    const message = {
        "name": user?.name,
        "id": user?.id,
        "email": user?.email,
        "phone": user?.phone
    }
    res.status(200).send(message);
})

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello World!' });
    throw new Error('BROKEN');
})

app.get('/error', (req: Request, res: Response) => {
    throw new Error('BROKEN');
})
app.listen(3050, () => {
    console.log('Server is running on port 3050');
})

