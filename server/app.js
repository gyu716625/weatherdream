const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MySQLStore = require('express-mysql-session')(session);
// const { urls } = require('./models');
// const morgan = require('morgan');
const app = express();
const port = 3001;

const http = require('http').createServer(app);
// const io = require('socket.io')(http);
const socketio = require('socket.io');

const io = socketio.listen(http);

io.on('connection', (socket) => {
  console.log('사용자 접속: ', socket.client.id);

  socket.on('chat-msg', (msg) => {
    console.log('message: ', msg);

    io.emit('chat-msg', msg);
  });
});

// routers
// const basicRouter = require('./routes/basic');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');

/*
 * session(option)
 * secret - session hijacking을 막기위해 hash값에 추가로 들어가는 값 (Salt와 비슷한 개념)
 * resave - session을 언제나 저장할지 정하는 값
 * saveUninitialize: true - 세션이 저장되기 전에 uninitialized 상태로 만들어 저장
 */
app.use(
  session({
    secret: '@codestates',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: process.env.DATABASE_PASSWORD,
      database: 'session',
    }),
  }),
);
/*
 * cookieParser() - 넘어온 Cookie 데이터를 관리하기 쉽게 JSON 객체로 변환해 주는 라이브러리
 */
app.use(cookieParser());
/*
 * bodyparser.json() - body로 넘어온 데이터를 JSON 객체로 변환
 */
app.use(bodyParser.json());
/*
 * bodyParser.urlencoded({ extended }) - 중첩 객체를 허용할지 말지를 결정하는 옵션
 * 참고 링크(https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0/45690436#45690436)
 */
app.use(bodyParser.urlencoded({ extended: false }));
/*
 * cors() - CORS를 대응하기 위한 라이브러리 ( Access-Control-Allow-Origin: * )
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
 */
app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PATCH'],
    credentials: true,
  }),
);
// ? POSTMAN을 통한 test에 필요할지도 모릅니다. logging을 활용하세요.
// app.use(morgan('dev'));
// TODO : GET / 요청에 대한 응답을 작성해주세요. (api 구현을 가볍게 시작해보세요.)
// app.get('/', (req, res) => {
//   res.status(200).send('Success');
// });
app.get('/D*', (req, res) => {
  res.send(req.params);
  // urls
  //   .findOne({
  //     where: {
  //       code: 'D' + req.params[0] // req.params는 url중 도메인 명 다음부터 쌓인다 ( https://naver.com/params[0]/params[1]/params[2])
  //     }
  //   })
  //   .then(result => {
  //     if (result) {
  //       result.update({
  //         // sequelize에서 반환되는 데이터는 단순히 결과값의 데이터 객체가 아니라 sequelize의 함수를 포함하고 있다.
  //         visits: result.visits + 1 // 다만 데이터에 접근할 경우에는 바로 접근 가능
  //       });
  //       res.redirect(result.url);
  //     } else {
  //       res.sendStatus(204); // No Content
  //     }
  //   })
  //   .catch(error => {
  //     console.log(error);
  //     res.sendStatus(500); // Server Error
  //   });
});

// base url routes
// app.use('/', basicRouter);
app.use('/user', userRouter);
app.use('/chat', chatRouter);

// app.get('/chat', (req, res)=>{
//   res.sendFile(__dirname + '/controllers/chat/index.html');

//     io.on('connection', (socket) => {
//         console.log('a user connected');
//         socket.on('disconnect', () => {
//           console.log('user disconnected');
//         });

//         socket.on('chat message', (msg) => {
//             console.log('message: ' + msg);
//             io.emit ( 'chat message' , msg);
//           });
//       });
// });

app.set('port', port);
http.listen(app.get('port'), () => {
  console.log(`app is listening in PORT ${app.get('port')}`);
});
// 테스트 코드에서 쓰기 위해
module.exports = { app: app, io: io };
