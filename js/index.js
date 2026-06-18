/**
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
*/

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
// document.addEventListener('deviceready', onDeviceReady, false);

document.addEventListener('deviceready', onDeviceReady, false);
document.addEventListener("pause", function() { console.log("App en segundo plano"); }, false);
document.addEventListener("online", function() { console.log("Conectado a internet"); }, false);
document.addEventListener("offline", function() { console.log("Sin conexión"); }, false);

function onDeviceReady() {

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');

    fb();
}

// PUSHER
function fb() {
    decoradorObtenerFBToken();

    window.FirebasexMessaging.onTokenRefresh(function (token) {
        console.log("Token refrescado:", token);
        localStorage.setItem("FBToken", token);

        enviarToken(token);
    }, function (error) {
        console.error("Error al refrescar el Firebase Token:", error);
    });

    window.FirebasexMessaging.onMessageReceived(function (message) {
        let mensaje = (message.body || "Sin mensaje");
        fbOnPushNotification(mensaje);
    }, function (error) {
        console.error("Error al recibir mensaje:", error);
    });

    window.FirebasexMessaging.onNotificationOpen(function (notification) {
        let mensaje = (notification.body)
            || (notification.notification ? notification.notification.body : "Sin mensaje");

        fbOnPushNotification(mensaje);
    }, function (error) {
        console.error("Error al abrir notificación:", error);
    });
}

function obtenerFBToken() {
    window.FirebasexMessaging.getToken(function (token) {
        if (token) {
            console.log("Firebase Token:", token);
            localStorage.setItem("FBToken", token);

            enviarToken(token);
        }
    }, function (error) {
        console.error("Error al obtener Firebase Token:", error);
    });
}

function decoradorObtenerFBToken() {
    window.FirebasexMessaging.hasPermission(function (granted) {
        if (!granted) {
            window.FirebasexMessaging.grantPermission(function () {
                obtenerFBToken();
            }, function (error) {
                console.error("Error al solicitar permiso:", error);
            });
            return;
        }
        obtenerFBToken();
    });
}

function esperarFirebasePlugin() {
    if (window.FirebasexMessaging) {
        console.log("FirebasePlugin disponible, obteniendo token...");
        fb();
    } else {
        console.log("FirebasePlugin aún no disponible, reintentando...");
        setTimeout(esperarFirebasePlugin, 1000);
    }
}

let fbOnPushNotification = function (mensaje) {
    alert(mensaje);
};

function enviarToken(token) {
    fetch(`${API}?accion=insertarToken`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fbtoken: token })
    })
    .then(res => res.json())
    .then(data => console.log("Token guardado en backend:", data))
    .catch(err => console.error("Error al guardar token:", err));
}

esperarFirebasePlugin();
