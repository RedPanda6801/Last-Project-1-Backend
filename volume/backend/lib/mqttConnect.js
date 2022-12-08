const mqtt = require("mqtt");

exports.mqttConnect = () => {
  const client = mqtt.connect("mqtt://192.168.0.63");
  // 메인페이지에 들어왔을때 최초 연결 시 subscirbe 해줌
  client.on("connect", function () {
    console.log("Connection Success");
    // 각각의 토픽에 대해 subscirbe 해줌
    client.subscribe("myEdukit", (error) => {
      if (error) console.log(error);
    });
  });
  client.on("message", function (topic, message) {
    // topic을 조건문으로 비교하여 메세지를 처리
    if (topic === "myEdukit") {
      console.log("Edukit Connected");
      const dataJSON = JSON.parse(message.toString()).Wrapper;
      // console.log(dataJSON[2], dataJSON[3], dataJSON[4]);
    }
  });
};
