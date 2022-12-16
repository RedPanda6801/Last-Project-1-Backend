const mqtt = require("mqtt");
const logDao = require("../dao/logDao");
const logger = require("./logger");

// 작업 상태 변수 선언
let start = false;
let isRunning = false;
let diceChecking = [false, false]; // 주시 & 판별여부

// DB에 넣을 값 선언
let dataObj = {
  userId: null, // 현재 작업자
  deviceId: null, // 현재 작업 기기
  start: null, // 시작시간
  work: 0, // 총 작업량
  good: 0, // 양품 개수
  bad: 0, // 불량품 개수
  dice: [0, 0, 0, 0, 0, 0], // 판별된 다이스 숫자
};

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
    switch (topic) {
      // 제어 시에 클라이언트와 장치 정보 받아오기
      case "pubmyEdukit":
        const data = JSON.parse(message.toString());
        dataObj.userId = data.userId;
        dataObj.deviceId = data.deviceId;
        break;
      // 작동 시에 데이터 받아오기
      case "myEdukit":
        console.log(`Device Connected ${start} ${isRunning}`);
        // 받은 데이터를 json 형태로 바꾸어줌
        const dataJSON = JSON.parse(message.toString()).Wrapper;
        // 연결 시에 지속적으로 데이터 받아오기
        dataJSON.forEach((data) => {
          switch (data.tagId) {
            // 시작 여부 주시
            case "1":
              start = data.value;
              break;
            // 1호기 작동 시에 다이스 체크 false로 세팅
            case "3":
              if (data.value && diceChecking[1]) diceChecking[1] = false;
              break;
            // 주사위 0이 아니면 다이스 체크중
            case "37":
              if (data.value != 0) {
                diceChecking[0] = true;
              } else {
                diceChecking[0] = false;
              }
              break;
          }
        });
        // 작업 시작
        if (start) {
          // 작업 시작할 때 한번만
          if (!isRunning) {
            // 작업 변수 세팅
            isRunning = true;
            console.log("device run :", isRunning);

            // 작업 시작 시에 해야할 일
            dataJSON.forEach((data) => {
              switch (data.tagId) {
                // 작업 시작 시간
                case "0":
                  dataObj.start = data.value;
                  console.log("Start Time: ", dataObj.start);
                  break;
                case "15":
                  // 시작했을 때 리셋되어 있다면 object 초기화
                  if (data.value == 0) {
                    console.log(data.name, data.value);
                    dataObj.good = 0;
                    dataObj.bad = 0;
                    dataObj.work = 0;
                    dataObj.dice = [0, 0, 0, 0, 0, 0];
                  }
              }
            });
          }
          // 다이스에 처음 값이 들어왔을 때 (주시 O, 체크 X)
          if (diceChecking[0] && !diceChecking[1]) {
            console.log("Dice Check Success");
            dataJSON.forEach((data) => {
              switch (data.tagId) {
                case "37":
                  diceChecking[1] = true; // 체크 확인
                  // 배열에 다이스 값 추가 (한번만)
                  dataObj.dice[data.value - 1]++;
                  console.log(`다이스 확인: ${data.value} / ${dataObj.dice}`);
              }
            });
          }
        }
        // 멈추고 이전에 작동하고 있었으면
        else if (!start && isRunning) {
          // 작업이 끝나면 false
          isRunning = false;
          console.log("device run :", isRunning);
          // 수동 조작 시에 관리자 및 1번 기기 값을 넣음
          if (!dataObj.userId) dataObj.userId = 1;
          if (!dataObj.deviceId) dataObj.deviceId = 1;

          // 작업 종료 시에 데이터 정제 및 저장
          dataJSON.forEach((data) => {
            // 데이터 정제 작업
            switch (data.tagId) {
              // 사이클 작업 완료 시간
              case "0":
                dataObj.end = data.value;
                break;
              // 사이클 작업량 = 총 작업량 - 이전 사이클 작업량
              case "15":
                console.log(data.value);
                dataObj.work = parseInt(data.value) - dataObj.work;
                break;
              // 사이클 양품량 = 총 작업량 - 이전 사이클 작업량
              case "17":
                dataObj.good = parseInt(data.value) - dataObj.good;
                break;
            }
          });
          // 불량품 = 총 작업량 - 양품
          dataObj.bad = dataObj.work - dataObj.good;
          // 사이클 당 작업 데이터 로그
          logger.info("Data per One Cycle: ", dataObj);
          try {
            // 데이터 추가
            const insertDice = await logDao.setDiceNum(dataObj.dice);
            const insertData = await logDao.insertCycleData(dataObj);

            (dataObj.dice = [0, 0, 0, 0, 0, 0]), // 판별된 다이스 숫자
              logger.info(
                `(mqttConnect.logDao.setDiceNum)${JSON.stringify(insertDice)}`
              );
            logger.info(
              `(mqttConnect.logDao.insertCycleData)${JSON.stringify(
                insertData
              )}`
            );
          } catch (error) {
            console.log(error);
          }
        }
        break;
    }
  });
};
