let snapShot;
const sendImg = "kth/dm2518/yolo3/dm2518lab5cy/imgb4"
const sendJson= "kth/dm2518/reply/yolo3/dm2518lab5cy/json"

function take_snapshot() {
    Webcam.snap(function(data_uri) {
        snapShot = data_uri;
    });
    client.send(sendImg, snapShot);
}

function onConnect() {
    console.log("connection is successful!")
    client.subscribe(sendImg)
    client.subscribe(sendJson)
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
    console.log("Got message on topic " + message.destinationName + " with payload: " + message.payloadString);
    let el= document.createElement('div')
    el.innerHTML = message.payloadString
    document.body.appendChild(el)
}

//    const client = new Paho.MQTT.Client("ws://mqtt.eclipse.org/mqtt", "myJSClientId" + new Date().getTime());
const client = new Paho.MQTT.Client("ws://test.mosquitto.org:8080/mqtt", "myJSClientId" + new Date().getTime());
const myTopic = "testTopic";
client.onMessageArrived = onMessageArrived;
client.onConnectionLost = onConnectionLost;
client.connect({ onSuccess: onConnect });