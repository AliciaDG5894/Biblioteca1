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

function onDeviceReady() {

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}

// PUSHER

function fb() {
    decoradorObtenerFBToken()
 
    window.FirebasexMessaging.onTokenRefresh(function (token) {
        localStorage.setItem("helloFBToken", token)
    }, function (error) {
        // Error al refrescar el Firebase Token
    })
 
    window.FirebasexMessaging.onMessageReceived(function (message) {
        let mensaje = (message.body || "Sin mensaje")
 
        fbOnPushNotification(mensaje)
    })
 
    window.FirebasexMessaging.onNotificationOpen(function (notification) {
        let mensaje = (notification.body)
                ||    (notification.notification ? notification.notification.body : "Sin mensaje")
 
        fbOnPushNotification(mensaje)
    })
}
 
function obtenerFBToken() {
    window.FirebasexMessaging.getToken(function (token) {
        if (token) {
            console.log("Firebase Token", token)
            localStorage.setItem("helloFBToken", token)
 
            return
            // Tabla de token hacer un insert que no nos metamos en auteticacion porque te metes con json web token y es mucho pedo, despues hacer un .post qu envie el token
            // crea una tabla de token en bd, se recomineda con post, crea un end point 
            // hacer un selct consultando los tokens
            // copiar este codigo
            // crear una tabla de token
            // crear un end point que reciba el token y lo guarde en la tabla/ de ID Y TOKEN

            // PRESENTACION
            // Cuales son los mecanismos 
            // rescribir una notificaccion
            // hacer una diferencia de push notification
        }
    }, function (error) {
        // Error al obtener Firebase Token
    })
}
 
function decoradorObtenerFBToken() {
    window.FirebasexMessaging.hasPermission(function (granted) {
        if (!granted) {
            window.FirebasexMessaging.grantPermission(function () {
                obtenerFBToken()
            }, function (error) {
                // Error al solicitar permiso
            })
 
            return
        }
 
        obtenerFBToken()
    })
}
 
function esperarFirebasePlugin() {
    if (window.FirebasexMessaging) {
        console.log("FirebasePlugin disponible, obteniendo token...")
        fb()
    } else {
        console.log("FirebasePlugin aún no disponible, reintentando...")
        setTimeout(esperarFirebasePlugin, 1000)
    }
}
 
let fbOnPushNotification = function (mensaje) {
    alert(mensaje)
}
 
esperarFirebasePlugin()
