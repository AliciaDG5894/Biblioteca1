const API = "https://dfhash.com/temporal/practicasDDI/biblioteca/api/index.php";

// Bloquear navegación hacia atrás
history.pushState(null, null, location.href);
window.addEventListener('popstate', function() {
    history.pushState(null, null, location.href);
});

let idEstudianteActual = null;

// Escuchar el input de matrícula
document.getElementById("matricula").addEventListener("input", function() {
    if (this.value.length >= 8) {
        const matricula = this.value;
        this.value = "";
        verificarEstudiante(matricula);
    }
});

function verificarEstudiante(matricula) {
    const jwt = localStorage.getItem("jwt");
    fetch(`${API}?accion=verificar_estudiante&matricula=${encodeURIComponent(matricula)}`, {
        headers: {
            Authorization: `Bearer ${jwt || ""}`
        }
    })
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
    const jwt = localStorage.getItem("jwt");
    fetch(`${API}?accion=listar_servicios_estudiante`, {
        headers: {
            Authorization: `Bearer ${jwt || ""}`
        }
    })
        .then(res => res.json())
        .then(servicios => {
            const contenedor = document.getElementById("contenedorServicios");
            contenedor.innerHTML = "";

            servicios.forEach(s => {
                const card = document.createElement("div");
                card.className = "estudiante-card";
                card.innerHTML = `
                    <i class="fas fa-book-open" style="font-size:22px; color:#1E3A8A; margin-bottom:12px;"></i>
                    <h3 style="font-size:0.95rem; font-weight:700; color:#1a1a1a; margin:0 0 8px 0;">${s.Nombre}</h3>
                    <p style="font-size:0.78rem; color:#6b7280; margin:0;">Haz clic para seleccionar este servicio.</p>
                `;
                card.addEventListener("click", () => {
                    registrarEntrada(idEstudiante, s.Id_servicio);
                });
                contenedor.appendChild(card);
            });

            mostrarPantalla("pantallaServicios");
        });
}

function registrarEntrada(idEstudiante, idServicio) {
    const jwt = localStorage.getItem("jwt");
    fetch(`${API}?accion=registrar_entrada`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${jwt || ""}`
        },
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
    const jwt = localStorage.getItem("jwt");
    fetch(`${API}?accion=registrar_salida`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${jwt || ""}`
        },
        body: "Id_entrada_salida=" + encodeURIComponent(idEntrada)
    })
    .then(res => res.json())
    .then(data => {
        mostrarMensaje("success", "Salida registrada", 
                       nombre + " <p>Hora de salida: " + data.hora + "</p>", true);
    });
}

function mostrarMensaje(tipo, titulo, texto, regresar) {
    const esExito = tipo === "success";
    const icono = esExito 
        ? `<i class="fas fa-check-circle" style="font-size:32px; color:#28a745;"></i>` 
        : `<i class="fas fa-times-circle" style="font-size:32px; color:#dc3545;"></i>`;

    document.getElementById("pantallaMensaje").innerHTML = `
        <div class="estudiante-mensaje">
            <div class="estudiante-mensaje-caja">
                <div class="encabezado">
                    ${icono}
                    <p><h2 class="${tipo}">${titulo}</h2></p>
                </div>
                <p><h5>${texto}</h5></p>
                <p><h5>Redirigiendo en 3 segundos...</h5></p>
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
