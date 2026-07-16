document.addEventListener("DOMContentLoaded", () => {

    const txtNombre = document.getElementById("nombre");
    const sugerencias = document.getElementById("sugerencias");
    const idEstudiante = document.getElementById("id_estudiante");

    txtNombre.addEventListener("keyup", async () => {

        const nombre = txtNombre.value.trim();

        if (nombre.length < 2) {
            sugerencias.innerHTML = "";
            return;
        }

        try {

            const respuesta = await fetch(
                "https://marker-important-connection-tennessee.trycloudflare.com/test/api/index.php?accion=buscar_estudiantes&nombre=" + encodeURIComponent(nombre)

            );

            const estudiantes = await respuesta.json();

            sugerencias.innerHTML = "";

            estudiantes.forEach(estudiante => {

                const item = document.createElement("li");

                item.classList.add(
                    "list-group-item",
                    "list-group-item-action"
                );

                item.textContent = estudiante.Nombre;

                item.addEventListener("click", () => {

                    txtNombre.value = estudiante.Nombre;

                    idEstudiante.value =
                        estudiante.Id_estudiante;

                    sugerencias.innerHTML = "";

                    // cargarDatosAlumno(
                    //     estudiante.Id_estudiante
                    // );

                });

                sugerencias.appendChild(item);

            });

        } catch (error) {

            console.error(
                "Error al buscar estudiantes:",
                error
            );

        }

    });

    const fechaEntrega = document.getElementById("fecha_entrega");

    const hoy = new Date();

    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');

    const fechaActual = `${anio}-${mes}-${dia}`;

    fechaEntrega.min = fechaActual;
    fechaEntrega.value = fechaActual;

});