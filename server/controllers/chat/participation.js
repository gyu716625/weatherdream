module.exports = (req) => {
  // const { chatRooms } = require('../../models');
  // const { users } = require('../../models');
  const { io } = require('../../app');
  // 모듈 밖에서 선언하니깐 signin이나 up에서 되면 lint들이 안되서 일단 off시켜놨습니다.
  // const insertDB = (objMsg) => {
  // 클라이언트가 보내준 정보 데이터 베이스로 insert
  //   console.log(objMsg);
  //   const {
  //     context, country, userId, weather,
  //   } = objMsg;

  //   chatRooms
  //     .create({
  //       context: context,
  //       country: country,
  //       user_id: userId,
  //       weather: weather,
  //       mypage: 0,
  //       chat_like: 0,
  //       chat_unlike: 0,
  //     })
  //     .then((result) => {
  //       console.log(result.get({ plain: true }));
  //     });
  // };

  console.log('params', req.params);
  // req.params.user_id
  // const sess = req.session;
  // if (!sess.username) {
  //   users
  //     .findOne({
  //       where: { id: req.params.user_id },
  //     })
  //     .then((data) => {
  //     // console.log(data);
  //       sess.username = data.username;
  //     });
  // }

  // res.sendFile(__dirname + '/index.html');

  io.on('connection', (socket) => {
    console.log('사용자 접속: ', socket.client.id);
    socket.on('chat-msg', (msg) => {
      console.log('message: ', msg);
      io.emit('chat-msg', msg);
    });
  });
};
