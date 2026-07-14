// const API = "https://therefore-lawn-drama-determination.trycloudflare.com/test/api/index.php";

$.ajaxSetup({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`
    }
})

// opcional para que no deje al ususario esperando checar

$.get(API + "?sesion", function (sesion) {
    if ((sesion.length == 0) && (location.pathname.indexOf("login.html") == -1)) {
        localStorage.removeItem("jwt")
        setTimeout(function() {
            window.location.href = "../Usuarios/login.html"
        }, 100)
    }
    else if (sesion.length && (location.pathname.indexOf("login.html") != -1)) {
        window.location.href = "../index.html"
    }
 
})


$(document).on("click", "#btnCerrarSesion", function(event) {
    if (confirm("¿Está seguro que desea cerrar sesión?")) {
        localStorage.removeItem("jwt");
        setTimeout(function() {
            window.location.href = "../Usuarios/login.html"
        }, 500)
    }
})

// $.get(`${API}?sesion`, function (sesion) {
//     if (sesion.length) {
//         return
//     }
// })