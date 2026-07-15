const API = "https://touch-examining-chronicles-appeared.trycloudflare.com/test/api/index.php";

// Bloquear navegación hacia atrás
history.pushState(null, null, location.href);
window.addEventListener('popstate', function() {
    history.pushState(null, null, location.href);
});

let idEstudianteActual = null;

// Escuchar el input de matrícula
document.getElementById("matricula").addEventListener("input", function() {
    if (this.value.length >= 5) {
        const matricula = this.value;
        this.value = "";
        verificarEstudiante(matricula);
    }
});

function verificarEstudiante(matricula) {
    fetch(`${API}?accion=verificar_estudiante&matricula=${encodeURIComponent(matricula)}`)
        .then(res => res.json())
        .then(data => {
            if (data.status === "error") {
                mostrarMensaje("error", "Estudiante no encontrado", 
                               "La matrícula no está registrada.", true);
                return;
            }

            idEstudianteActual = data.Id_estudiante;

            if (data.tiene_entrada) {
                // Registrar salida
                registrarSalida(data.Id_entrada_salida, data.Nombre);
            } else {
                // Mostrar servicios
                document.getElementById("nombreEstudiante").textContent = data.Nombre;
                cargarServicios(data.Id_estudiante);
            }
        })
        .catch(err => {
            mostrarMensaje("error", "Error de conexión", 
                           "No se pudo conectar con el servidor.", true);
        });
}

function cargarServicios(idEstudiante) {
    fetch(`${API}?accion=listar_servicios_estudiante`)
        .then(res => res.json())
        .then(servicios => {
            const contenedor = document.getElementById("contenedorServicios");
            contenedor.innerHTML = "";

            servicios.forEach(s => {
                const card = document.createElement("div");
                card.className = "estudiante-card";
                card.innerHTML = `<i class="fas fa-book"></i><h3>${s.Nombre}</h3>`;
                card.addEventListener("click", () => {
                    registrarEntrada(idEstudiante, s.Id_servicio);
                });
                contenedor.appendChild(card);
            });

            mostrarPantalla("pantallaServicios");
        });
}

function registrarEntrada(idEstudiante, idServicio) {
    fetch(`${API}?accion=registrar_entrada`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "Estudiante=" + encodeURIComponent(idEstudiante) + 
              "&Servicio=" + encodeURIComponent(idServicio)
    })
    .then(res => res.json())
    .then(data => {
        mostrarMensaje("success", "Entrada registrada", 
                       "Hora de entrada: " + data.hora, true);
    });
}

function registrarSalida(idEntrada, nombre) {
    fetch(`${API}?accion=registrar_salida`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "Id_entrada_salida=" + encodeURIComponent(idEntrada)
    })
    .then(res => res.json())
    .then(data => {
        mostrarMensaje("success", "Salida registrada", 
                       nombre + " - Hora de salida: " + data.hora, true);
    });
}

function mostrarMensaje(tipo, titulo, texto, regresar) {
    const esExito = tipo === "success";

    document.getElementById("pantallaMensaje").innerHTML = `
        <div class="estudiante-mensaje">
            <div class="estudiante-mensaje-caja">
                <div class="encabezado">
                    <i class="fas ${esExito ? 'fa-check-circle success' : 'fa-times-circle error'}"></i>
                    <h2 class="${tipo}">${titulo}</h2>
                </div>
                <p>${texto}</p>
                <p>Redirigiendo en 3 segundos...</p>
            </div>
        </div>
    `;

    mostrarPantalla("pantallaMensaje");

    if (regresar) {
        setTimeout(() => {
            mostrarPantalla("pantallaEscanear");
            document.getElementById("matricula").focus();
        }, 3000);
    }
}

function mostrarPantalla(id) {
    ["pantallaEscanear", "pantallaServicios", "pantallaMensaje"].forEach(p => {
        document.getElementById(p).style.display = "none";
    });
    document.getElementById(id).style.display = "flex";
}