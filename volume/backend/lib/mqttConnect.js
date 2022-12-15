const mqtt = require("mqtt");
const deviceDao = require("../dao/deviceDao");
let start = false;
let isRunning = false;
let reset = false;

let dataObj = {
  userId: null,
  deviceId: null,
  work: 0,
  good: 0,
  bad: 0,
};
let startDate = null;

exports.mqttConnect = () => {
  const client = mqtt.connect("mqtt://192.168.0.63");

  // 메인페이지에 들어왔을때 최초 연결 시 subscirbe 해줌
  client.on("connect", function () {
    console.log("Connection Success");
    // 각각의 토픽에 대해 subscirbe 해줌
    client.subscribe("myEdukit", (error) => {
      if (error) console.log(error);
    });
    client.subscribe("pubmyEdukit", (error) => {
      if (error) console.log(error);
    });
  });

  // 메세지 처리
  client.on("message", async function (topic, message) {
    // topic을 조건문으로 비교하여 메세지를 처리
    if (topic === "pubmyEdukit") {
      const data = JSON.parse(message.toString());
      dataObj.userId = data.userId;
      dataObj.deviceId = data.deviceId;
    } else if (topic === "myEdukit") {
      console.log("Device Connected");
      console.log(dataObj);
      // 받은 데이터를 json 형태로 바꾸어줌
      const dataJSON = JSON.parse(message.toString()).Wrapper;
      // 시작값 초기화
      dataJSON.forEach((data) => {
        switch (data.tagId) {
          case "1":
            start = data.value;
            break;
          case "8":
            dataObj.work = 0;
            dataObj.bad = 0;
            dataObj.good = 0;
        }
        if (data.tagId == 1) {
          start = data.value;
        }
      });
      // 작업중일 때
      if (start) {
        // 작업 시작할 때 한번만
        if (!isRunning) {
          console.log("device running!");
          isRunning = true;
          // 작업 시작 시간
          dataObj.start = dataJSON.forEach((data) => {
            if (data.tagId == 0) {
              startDate = data.value;
              console.log("Start Time: ", startDate);
            }
          });
        }
        // 멈추고 이전에 작동하고 있었으면
      } else if (!start && isRunning) {
        // 받은 데이터들을 모두 추가해줌
        if (!dataObj.userId) dataObj.userId = 1;
        if (!dataObj.deviceId) dataObj.deviceId = 1;
        dataJSON.forEach((data) => {
          switch (data.tagId) {
            // 총 양품량
            case "17":
              dataObj.good = parseInt(data.value);
              break;
            // 총 작업량
            case "15":
              dataObj.work = parseInt(data.value);
              break;
            // 작업 완료 시간
            case "0":
              dataObj.end = data.value;
          }
        });
        // 불량품 = 작업량 - 양품
        dataObj.bad = parseInt(dataObj.work) - parseInt(dataObj.good);
        dataObj.start = startDate;
        console.log("Data per One Cycle: ", dataObj);
        // 작업이 끝나면 false
        isRunning = false;

        // Cycle Data DB에 추가
        try {
          const insert = await deviceDao.insertCycleData(dataObj);
          console.log(JSON.stringify(insert));
        } catch (error) {
          console.log(error);
        }
      }
    }
  });
};
