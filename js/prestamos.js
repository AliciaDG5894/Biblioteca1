document.addEventListener("DOMContentLoaded", () => {

    const txtMatricula = document.getElementById("matricula");
    const sugerencias = document.getElementById("sugerencias");
    const idEstudiante = document.getElementById("id_estudiante");

    if (!txtMatricula) return;

    txtMatricula.addEventListener("keyup", async () => {

        const matricula = txtMatricula.value.trim();

        if (matricula.length < 2) {
            sugerencias.innerHTML = "";
            return;
        }

        try {
            const jwt = localStorage.getItem("jwt");
            const respuesta = await fetch(
                `${API}?accion=buscar_estudiantes&matricula=` + encodeURIComponent(matricula),
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

                item.textContent = estudiante.Matricula;

                item.addEventListener("click", () => {
                    txtMatricula.value = estudiante.Matricula;

                    $(txtMatricula).valid();
                    
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