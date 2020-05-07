let snapShot;
let intervalId;


function send_alarm(){
    speechSynthesis.speak(new SpeechSynthesisUtterance("Get off my lawm!"));
}


function take_snapshot() {
    intervalId = setInterval(function () {
        Webcam.snap(function(data_uri) {
            snapShot = data_uri;
        });
        client.send("kth/dm2518/yolo3/dm2518lab5cy/imgb64", snapShot);
    }, 10000);
}

function stop_snapshot() {
    clearInterval(intervalId);
}


function onConnect() {
    console.log("connection is successful!")
    client.subscribe("kth/dm2518/reply/yolo3/dm2518lab5cy/imgb64")
    client.subscribe("kth/dm2518/reply/yolo3/dm2518lab5cy/json")
}


const publish = (topic, msg) => {  //takes topic and message string
    let message = new Paho.MQTT.Message(msg);
    message.destinationName = topic;
    client.send(message);
}


function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
    client.connect({ onSuccess: onConnect });
}


function onMessageArrived(message) {
    if (message.destinationName == "kth/dm2518/reply/yolo3/dm2518lab5cy/json") {
        console.log(message.payloadString);
        let array = JSON.parse(message.payloadString);
        let alarm = false
        console.log(array);
        array.forEach(element => {
            if (element[0] == "person") {
                alarm = true;
            }
        });
        if (alarm) {
            send_alarm();
        }
    } else {
        document.getElementById("burglarImage").src = message.payloadString;
    }
}


//    const client = new Paho.MQTT.Client("ws://mqtt.eclipse.org/mqtt", "myJSClientId" + new Date().getTime());
const client = new Paho.MQTT.Client("ws://test.mosquitto.org:8080/mqtt", "myJSClientId" + new Date().getTime());
client.onMessageArrived = onMessageArrived;
client.onConnectionLost = onConnectionLost;
console.log("connecting...");
client.connect({ onSuccess: onConnect });