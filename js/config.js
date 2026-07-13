const API = "https://dfhash.com/temporal/practicasDDI/biblioteca/api/index.php";

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
            window.location.href = "login.html"
        }, 500)
    }
    else if (sesion.length && (location.pathname.indexOf("login.html") != -1)) {
        window.location.href = "index.html"
    }
 
})


$(".btnCerrarSesion").click(function(event) {
    if (confirm("¿Está seguro que desea cerrar sesión?")) {
        localStorage.removeItem("jwt");
        setTimeout(function() {
            window.location.href = "login.html"
        }, 500)
    }
})

// $.get(`${API}?sesion`, function (sesion) {
//     if (sesion.length) {
//         return
//     }
// })