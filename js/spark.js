/*global
setInterval, console,window,spark,sessionStorage,document, $
*/
/* this file is unused */
"use strict";

var token;
if (sessionStorage.getItem("token") !== null) {
    token = sessionStorage.getItem("token");
}
spark.login({accessToken: token});
/* turns on a device led (unused code) */
function TurnOn(devid) {
    spark.getDevice(devid, function (err, device) {
        console.log('Device name: ' + device.name);
        device.callFunction('digitalwrite', 'D7:HIGH', function (err, data) {
            if (err) {
                console.log('An error occurred:', err);
            } else {
                console.log('Function called succesfully:', data);
            }
        });
    });
}
/* turns off a device led (unused code) */
function TurnOff(devid) {
    spark.getDevice(devid, function (err, device) {
        console.log('Device name: ' + device.name);
        device.callFunction('digitalwrite', 'D7:LOW', function (err, data) {
            if (err) {
                console.log('An error occurred:', err);
            } else {
                console.log('Function called succesfully:', data);
            }
        });
    });
}

function list() {
    var devicesPr = spark.listDevices();
    var listdiv = document.getElementById("list");
    devicesPr.then(
        function (devices) {

            while (listdiv.hasChildNodes()) {
                listdiv.removeChild(listdiv.firstChild);
            }

    listdiv.innerHTML = "<h2><b>List All Devices :</b></h2>";
            devices.forEach(function (device) {
                var dev = document.createElement("h4");
                var subscribe = document.createElement("button");
                var turnon = document.createElement("button");
                var turnoff = document.createElement("button");
                var online = device.connected;
                var condition;
                if (online) {
                    dev.className = "greentext";
                    condition = "Online";
                } else {
                    dev.className = "redtext";
                    condition = "Offline";
                }
                dev.innerHTML = device.name + " - " + condition;
                subscribe.innerHTML = "Subscribe";
                subscribe.addEventListener("click", function(){
                    subscribeToDevice(device.id);
                }, false);
                turnon.innerHTML = "Turn On";
                turnon.addEventListener("click", function(){
                    TurnOn(device.id);
                }, false);
                turnoff.innerHTML = "Turn Off";
                turnoff.addEventListener("click", function(){
                    TurnOff(device.id);
                }, false);
                listdiv.appendChild(dev);
                listdiv.appendChild(subscribe);
                listdiv.appendChild(turnon);
                listdiv.appendChild(turnoff);
            });
            console.log('Devices: ', devices);
        },
        function (err) {
            console.log('List devices call failed: ', err);
        }
    );
}

function createSubscribeTable(){

}


function subscribeToDevice(devid) {
    var listdiv = document.getElementById("subscribed");
    listdiv.innerHTML = "<h2><b>Subscribe Result :</b></h2>";
    var tableresult = document.createElement("table");
    tableresult.className = "table table-stripped";
    var headerrow = document.createElement("th");
    tableresult.appendChild(headerrow);
    listdiv.appendChild(tableresult);
    var name;
    var eventname = "random";
    spark.getDevice(devid, function (err, device) {
        name = device.name;
    });
    spark.getEventStream(eventname, devid, function (data) {
        console.log(data);
        console.log(data.data);
        var event = document.createElement("h3");
//        var json = JSON.parse(data.data);
        if (listdiv.childNodes[1] != null) {
            listdiv.removeChild(listdiv.childNodes[1]);
        }
        event.innerHTML = name + " | " +eventname+ " : " +data.data;
        listdiv.appendChild(event);
    });
}

function subscribeAll() {
    var listdiv = document.getElementById("subscribed");
    listdiv.innerHTML = "<h2><b>Subscribe Result :</b></h2>";
    setInterval(publish, 500);
    spark.getEventStream('test', false, function (data) {
        console.log(data);
        console.log(data.data);
        var event = document.createElement("h1");
//        var json = JSON.parse(data.data);
        if (listdiv.childNodes[1] != null) {
            listdiv.removeChild(listdiv.childNodes[1]);
        }
        event.innerHTML = data.data;
        listdiv.appendChild(event);
    });
}

function LogOut() {
    sessionStorage.removeItem("token");
    window.location = "index.html";
}

function publish() {
    var publishEventPr = spark.publishEvent('test', Math.floor((Math.random() * 10) + 1));

    publishEventPr.then(
        function (data) {
            if (data.ok) {
                console.log("Event published succesfully : " + JSON.stringify(data));
            }
        },
        function (err) {
            console.log("Failed to publish event: " + err);
        }
    );
}
