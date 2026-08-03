document.addEventListener("DOMContentLoaded", () => {

    const txtNombre = document.getElementById("nombre");
    const sugerencias = document.getElementById("sugerencias");
    const idEstudiante = document.getElementById("id_estudiante");

    if (!txtNombre) return;

    txtNombre.addEventListener("keyup", async () => {

        const nombre = txtNombre.value.trim();

        if (nombre.length < 2) {
            sugerencias.innerHTML = "";
            return;
        }

        try {
            const jwt = localStorage.getItem("jwt");
            const respuesta = await fetch(
                `${API}?accion=buscar_estudiantes&nombre=` + encodeURIComponent(nombre),
                {
                    headers: {
                        Authorization: `Bearer ${jwt || ""}`
                    }
                }
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
                    
                    if (idEstudiante) idEstudiante.value = estudiante.Id_estudiante;
                    
                    const idReal = document.getElementById("id_estudiante_real");
                    if (idReal) idReal.value = estudiante.Id_estudiante;
                    
                    sugerencias.innerHTML = "";
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