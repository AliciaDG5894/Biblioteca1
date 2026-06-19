const API = "https://temple-momentum-unique-chorus.trycloudflare.com/test/api/index.php";
const API_ESTUDIANTES = "https://temple-momentum-unique-chorus.trycloudflare.com/test/api/Estudiantes.php";

function cargarCarreras() {
  fetch(`${API}?accion=listar`)
    .then(res => res.json())
    .then(data => {
      const filas = data.map(dato => [
        dato.Id_carrera,
        dato.Nombre,
        `<a href="ModificarCarrera.html?id=${dato.Id_carrera}">
           <i class="fas fa-edit"></i> <span class='d-none d-md-inline'>Modificar
         </a>`,
        `<a href="#" onclick="eliminarCarrera(${dato.Id_carrera}, this)">
           <i class="fas fa-trash"></i> <span class='d-none d-md-inline'>Eliminar
         </a>`
      ]);

      if ($.fn.DataTable.isDataTable('#dataTable')) {
        let tabla = $('#dataTable').DataTable();
        tabla.clear();
        tabla.rows.add(filas).draw();
      } else {
        $('#dataTable').DataTable({
          data: filas,
          columns: [
            { title: 'ID' },
            { title: 'Nombre' },
            { title: 'Modificar' },
            { title: 'Eliminar' }
          ],
          pageLength: 10,
          language: {
            search: "Buscar:",
            lengthMenu: "Mostrar _MENU_ registros",
            info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
            paginate: { previous: "Anterior", next: "Siguiente" }
          }
        });
      }
    })
    .catch(err => console.error("Error cargando carreras:", err));
}

function cargarEstudiantes() {
  fetch(`${API_ESTUDIANTES}?accion=listar`)
    .then(res => res.json())
    .then(data => {
      const filas = data.map(dato => [
        dato.Id_estudiante,
        dato.Matricula,
        dato.Nombre,
        dato.Grado,
        dato.Seccion,
        dato.Genero,
        dato.Carrera,
        dato.Contacto,
        `<a href="ModificarEstudiantes.html?id=${dato.Id_estudiante}">
           <i class="fas fa-edit"></i> <span class='d-none d-md-inline'>Modificar
         </a>`,
        `<a href="#" onclick="eliminarEstudiante(${dato.Id_estudiante}, this)">
           <i class="fas fa-trash"></i> <span class='d-none d-md-inline'>Eliminar
         </a>`
      ]);

      if ($.fn.DataTable.isDataTable('#dataTableEst')) {
        let tabla = $('#dataTableEst').DataTable();
        tabla.clear();
        tabla.rows.add(filas).draw();
      } else {
        $('#dataTableEst').DataTable({
          data: filas,
          columns: [
            { title: 'ID' },
            { title: 'Matrícula' },
            { title: 'Nombre' },
            { title: 'Grado' },
            { title: 'Sección' },
            { title: 'Género' },
            { title: 'Carrera' },
            { title: 'Contacto' },
            { title: 'Modificar' },
            { title: 'Eliminar' }
          ],
          pageLength: 10,
          language: {
            search: "Buscar:",
            lengthMenu: "Mostrar _MENU_ registros",
            info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
            paginate: { previous: "Anterior", next: "Siguiente" }
          }
        });
      }
    })
    .catch(err => console.error("Error cargando estudiantes:", err));
}

function cargarPrestamos() {
  fetch(`${API}?accion=prestamos`)
    .then(res => res.json())
    .then(data => {
      const filas = data.map(dato => {
      let clase = "";
      switch ((dato.Estado || "").toLowerCase()) {
        case "entregado":
          clase = "text-success";
          break;
        case "prestado":
          clase = "text-warning";
          break;
        case "retrasado":
          clase = "text-danger";
          break;
      }
      return [
        dato.Id_prestamo,
        dato.Estudiante,
        dato.Fecha_prestamo,
        dato.Fecha_entrega,
        dato.Fecha_devolucion,
        `<span class="${clase}"><strong>${dato.Estado}</strong></span>`,
        `<a href="ModificarPrestamos.html?id=${dato.Id_prestamo}">
            <i class="fas fa-edit"></i>
            <span class='d-none d-md-inline'>Modificar</span>
        </a>`,
        `<a href="#" onclick="eliminarPrestamo(${dato.Id_prestamo})">
            <i class="fas fa-trash"></i>
            <span class='d-none d-md-inline'>Eliminar</span>
        </a>`
      ];

    });
      // const filas = data.map(dato => [
      //   dato.Id_prestamo,
      //   dato.Estudiante,
      //   dato.Fecha_prestamo,
      //   dato.Fecha_entrega,
      //   dato.Fecha_devolucion,
      //   dato.Estado,
      //   `<a href="ModificarPrestamos.html?id=${dato.Id_prestamo}">
      //      <i class="fas fa-edit"></i> <span class='d-none d-md-inline'>Modificar
      //    </a>`,
      //   `<a href="#" onclick="eliminarPrestamo(${dato.Id_prestamo}, this)">
      //      <i class="fas fa-trash"></i> <span class='d-none d-md-inline'>Eliminar
      //    </a>`
      // ]);

      if ($.fn.DataTable.isDataTable('#dataTablePrest')) {
        let tabla = $('#dataTablePrest').DataTable();
        tabla.clear();
        tabla.rows.add(filas).draw();
      } else {
        $('#dataTablePrest').DataTable({
          data: filas,
          columns: [
            { title: 'ID' },
            { title: 'Estudiante' },
            { title: 'Fecha de Préstamo' },
            { title: 'Fecha de Entrega' },
            { title: 'Fecha de Devolución' },
            { title: 'Estado' },
            { title: 'Modificar' },
            { title: 'Eliminar' }
          ],
          pageLength: 10,
          language: {
            search: "Buscar:",
            lengthMenu: "Mostrar _MENU_ registros",
            info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
            paginate: { previous: "Anterior", next: "Siguiente" }
          }
        });
      }
    })
    .catch(err => console.error("Error cargando préstamos:", err));
}

// Insertar carreras
function insertarCarrera(event) {
  event.preventDefault();
  let nombre = document.getElementById("nombre").value;

  fetch(`${API}?accion=insertar`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "Nombre=" + encodeURIComponent(nombre)
  })
    .then(res => res.json())
    .then(data => {
      console.log("Respuesta insertar:", data);
      cargarCarreras();
      document.getElementById("insertarCarrera").reset();
    })
    .catch(err => console.error("Error insertando carrera:", err));
}

function insertarEstudiante(event) {
  event.preventDefault();

  let matricula = document.getElementById("matricula").value;
  let nombre = document.getElementById("nombre").value;
  let grado = document.getElementById("grado").value;
  let seccion = document.getElementById("seccion").value;
  let genero = document.getElementById("genero").value;
  let carrera = document.getElementById("carrera").value;
  let contacto = document.getElementById("contacto").value;

  fetch(`${API_ESTUDIANTES}?accion=insertar`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `matricula=${encodeURIComponent(matricula)}&nombre=${encodeURIComponent(nombre)}&grado=${encodeURIComponent(grado)}&seccion=${encodeURIComponent(seccion)}&genero=${encodeURIComponent(genero)}&carrera=${encodeURIComponent(carrera)}&contacto=${encodeURIComponent(contacto)}`
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      cargarEstudiantes();
      document.getElementById("insertarEstudiante").reset();
    })
    .catch(err => console.error("Error insertando estudiante:", err));
}

// PRESTAMOS
function insertarPrestamo(event) {
  event.preventDefault();

  let estudiante = document.getElementById("id_estudiante").value;
  let fecha_prestamo = new Date().toISOString().split("T")[0];
  let fecha_entrega = document.getElementById("fecha_entrega").value;
  let fecha_devolucion = document.getElementById("fecha_devolucion").value;
  let estado = document.getElementById("estado").value;

  fetch(`${API}?accion=insertar_prestamo`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `estudiante=${encodeURIComponent(estudiante)}&fecha_prestamo=${encodeURIComponent(fecha_prestamo)}&fecha_entrega=${encodeURIComponent(fecha_entrega)}&fecha_devolucion=${encodeURIComponent(fecha_devolucion)}&estado=${encodeURIComponent(estado)}`
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      cargarPrestamos();
      document.getElementById("insertarPrestamo").reset();
    })
    .catch(err => console.error("Error insertando prestamo:", err));
}

// MODIFICAR PRESTAMOS Y ELIMINAR
function modificarPrestamos(event) {
  event.preventDefault();

  let id = document.getElementById("id_prestamo").value;
  let estudiante = document.getElementById("id_estudiante_real").value;
  let fecha_prestamo = document.getElementById("fecha_prestamo").value;
  let fecha_entrega = document.getElementById("fecha_entrega").value;
  let fecha_devolucion = document.getElementById("fecha_devolucion").value;
  let estado = document.getElementById("estado").value;

  fetch(`${API}?accion=modificar_prestamo`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `id_prestamo=${encodeURIComponent(id)}&estudiante=${encodeURIComponent(estudiante)}&fecha_prestamo=${encodeURIComponent(fecha_prestamo)}&fecha_entrega=${encodeURIComponent(fecha_entrega)}&fecha_devolucion=${encodeURIComponent(fecha_devolucion)}&estado=${encodeURIComponent(estado)}`
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      window.location.href = "Prestamos.html";
    })
    .catch(err => console.error("Error modificando préstamo:", err));
}

function eliminarPrestamo(id_prestamo) {
  if (!confirm("¿Seguro que deseas eliminar este préstamo?")) return;

  fetch(`${API}?accion=eliminar_prestamo`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "id_prestamo=" + encodeURIComponent(id_prestamo)
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      cargarPrestamos();
    })
    .catch(err => console.error("Error eliminando préstamo:", err));
}

// --- CARGAR DATOS PARA MODIFICAR PRESTAMOS ---
function cargarDatosModificarPrestamo() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
 
  if (id) {
    fetch(`${API}?accion=get_prestamo&id=${id}`)
      .then(res => res.json())
      .then(data => {
        document.getElementById("id_prestamo").value = data.Id_prestamo;
        document.getElementById("id_estudiante_real").value = data.Estudiante;
        document.getElementById("id_estudiante").value = data.Nombre;
        document.getElementById("fecha_prestamo").value = data.Fecha_prestamo;
        document.getElementById("fecha_entrega").value = data.Fecha_entrega;
        document.getElementById("fecha_devolucion").value =
          data.Fecha_devolucion !== "0000-00-00"
              ? data.Fecha_devolucion
              : "";
        document.getElementById("estado").value = data.Estado;
      })
      .catch(err => console.error("Error cargando datos del préstamo:", err));
  }
}

// Modificar carreras
function cargarDatosModificar() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (id) {
    fetch(`${API}?accion=carrera&id=${id}`)
      .then(res => res.json())
      .then(data => {
        document.getElementById("id").value = data.Id_carrera;
        document.getElementById("nombre").value = data.Nombre;
      });
  }
}

function cargarDatosModificarEstudiante() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (id) {
    fetch(`${API_ESTUDIANTES}?accion=estudiante&id=${id}`)
      .then(res => res.json())
      .then(data => {
        document.getElementById("id").value = data.Id_estudiante;
        document.getElementById("matricula").value = data.Matricula;
        document.getElementById("nombre").value = data.Nombre;
        document.getElementById("grado").value = data.Grado;
        document.getElementById("seccion").value = data.Seccion;
        document.getElementById("genero").value = data.Genero;
        document.getElementById("carrera").value = data.Carrera;
        document.getElementById("contacto").value = data.Contacto;
      });
  }
}

function buscarPorMatricula() {
  let matricula = document.getElementById("matricula").value;

  if (matricula) {
    fetch(`${API_ESTUDIANTES}?accion=buscarMatricula`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "matricula=" + encodeURIComponent(matricula)
    })
      .then(res => res.json())
      .then(data => {
        console.log("JSON parseado:", data);

        if (Array.isArray(data) && data.length >= 2) {
          const datosPersonales = data[0];
          const datosAcademicos = data[1];

          document.getElementById("nombre").value = datosPersonales.nombreCompleto || "";
          document.getElementById("genero").value = datosPersonales.genero || "";
          document.getElementById("grado").value = datosAcademicos.grado || "";
          document.getElementById("seccion").value = datosAcademicos.seccion || "";
          document.getElementById("carrera").value = datosAcademicos.carrera || "";
          document.getElementById("contacto").value = "";
        } else {
          alert("No se encontraron datos para esa matrícula");
        }
      })
      .catch(err => console.error("Error buscando matrícula:", err));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const matriculaInput = document.getElementById("matricula");
  if (matriculaInput) {
    matriculaInput.addEventListener("blur", buscarPorMatricula);
  }
});

function modificarEstudiante(event) {
  event.preventDefault();

  let id = document.getElementById("id").value;
  let matricula = document.getElementById("matricula").value;
  let nombre = document.getElementById("nombre").value;
  let grado = document.getElementById("grado").value;
  let seccion = document.getElementById("seccion").value;
  let genero = document.getElementById("genero").value;
  let carrera = document.getElementById("carrera").value;
  let contacto = document.getElementById("contacto").value;

  fetch(`${API_ESTUDIANTES}?accion=modificar`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `Id_estudiante=${encodeURIComponent(id)}&matricula=${encodeURIComponent(matricula)}&nombre=${encodeURIComponent(nombre)}&grado=${encodeURIComponent(grado)}&seccion=${encodeURIComponent(seccion)}&genero=${encodeURIComponent(genero)}&carrera=${encodeURIComponent(carrera)}&contacto=${encodeURIComponent(contacto)}`
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      window.location.href = "Estudiantes.html";
    })
    .catch(err => console.error("Error modificando estudiante:", err));
}

function eliminarEstudiante(id) {
  if (!confirm("¿Seguro que deseas eliminar este estudiante?")) return;

  fetch(`${API_ESTUDIANTES}?accion=eliminar`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "Id_estudiante=" + encodeURIComponent(id)
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      cargarEstudiantes();
    })
    .catch(err => console.error("Error eliminando estudiante:", err));
}

function eliminarCarrera(id) {
  if (!confirm("¿Seguro que deseas eliminar esta carrera?")) return;

  fetch(`${API}?accion=eliminar`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "Id_carrera=" + encodeURIComponent(id)
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      cargarCarreras();
    })
    .catch(err => console.error("Error eliminando carrera:", err));
}

// Cargar plantillas sidebar y topbar
function cargarPartials() {
  fetch("../partials/sidebar.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("sidebar").outerHTML = html;
    });

  fetch("../partials/topbar.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("topbar").outerHTML = html;
      const toggleBtn = document.getElementById("sidebarToggleTop");
      if (toggleBtn) {
        toggleBtn.addEventListener("click", function () {
          document.body.classList.toggle("sidebar-toggled");
          document.querySelector(".sidebar").classList.toggle("toggled");
          console.log("Toggle ejecutado");
        });
      }
    });
}

// SERVICIOS

function cargarServicios() {
  fetch(`${API}?accion=listar_servicios`)
    .then(res => res.json())
    .then(data => {
      const filas = data.map(dato => [
        dato.Id_servicio,
        dato.Nombre,
        `<a href="ModificarServicio.html?id=${dato.Id_servicio}">
           <i class="fas fa-edit"></i><span class='d-none d-md-inline'> Modificar</span>
         </a>`,
        `<a href="#" onclick="eliminarServicio(${dato.Id_servicio}, this)">
           <i class="fas fa-trash"></i> <span class='d-none d-md-inline'>Eliminar</span>
         </a>`
      ]);
 
      if ($.fn.DataTable.isDataTable('#dataTableServicios')) {
        let tabla = $('#dataTableServicios').DataTable();
        tabla.clear();
        tabla.rows.add(filas).draw();
      } else {
        $('#dataTableServicios').DataTable({
          data: filas,
          columns: [
            { title: 'ID' },
            { title: 'Nombre' },
            { title: 'Modificar' },
            { title: 'Eliminar' }
          ],
          pageLength: 10,
          language: {
            search: "Buscar:",
            lengthMenu: "Mostrar _MENU_ registros",
            info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
            paginate: { previous: "Anterior", next: "Siguiente" }
          }
        });
      }
    })
    .catch(err => console.error("Error cargando servicios:", err));
}
 
// --- INSERTAR SERVICIO ---
function insertarServicio(event) {
  event.preventDefault();
  let nombre = document.getElementById("nombre").value;
 
  fetch(`${API}?accion=insertar_servicio`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "Nombre=" + encodeURIComponent(nombre)
  })
    .then(res => res.json())
    .then(data => {
      console.log("Respuesta insertar servicio:", data);
      alert(data.message);
      window.location.href = "Servicios.html";
    })
    .catch(err => console.error("Error insertando servicio:", err));
}
 
// --- CARGAR DATOS PARA MODIFICAR ---
function cargarDatosModificarServicio() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
 
  if (id) {
    fetch(`${API}?accion=get_servicio&id=${id}`)
      .then(res => res.json())
      .then(data => {
        document.getElementById("id").value = data.Id_servicio;
        document.getElementById("nombreSrv").value = data.Nombre;
      })
      .catch(err => console.error("Error cargando datos del servicio:", err));
  }
}
 
// --- ELIMINAR SERVICIO ---
function eliminarServicio(id) {
  if (!confirm("¿Seguro que deseas eliminar este servicio?")) return;
 
  fetch(`${API}?accion=eliminar_servicio`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "Id_servicio=" + encodeURIComponent(id)
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      cargarServicios();
    })
    .catch(err => console.error("Error eliminando servicio:", err));
}

// LIBROS

function cargarLibros() {
  fetch(`${API}?accion=listar_libro`)
    .then(res => res.json())
    .then(data => {
      const filas = data.map(dato => [
        dato.Id_libro,
        dato.Titulo,               
        dato.Fecha_edicion,            
        dato.Autores,
        dato.Responsable_custodia,
        dato.Departamento_responsable,
        dato.Tipo,
        dato.Editora,
        dato.ISBN,
        dato.Area,
        dato.Cantidad,

        `<a href="ModificarLibro.html?id=${dato.Id_libro}">
           <i class="fas fa-edit"></i><span class='d-none d-md-inline'>Modificar</span>
         </a>`,
        `<a href="#" onclick="eliminarLibro(${dato.Id_libro}, this)">
           <i class="fas fa-trash"></i> <span class='d-none d-md-inline'>Eliminar</span>
         </a>`

      ]);
 
      if ($.fn.DataTable.isDataTable('#dataTableLibros')) {
        let tabla = $('#dataTableLibros').DataTable();
        tabla.clear();
        tabla.rows.add(filas).draw();
      } else {
        $('#dataTableLibros').DataTable({
          data: filas,
          columns: [
            { title: 'ID' },
            { title: 'titulo' },
            { title: 'fecha_edi' },
            { title: 'autores' },
            { title: 'res_cus' },
            { title: 'dep_res' },
            { title: 'tipo' },
            { title: 'editora' },
            { title: 'isbn' },
            { title: 'area' },
            { title: 'cantididad' },
            { title: 'Modificar' },
            { title: 'Eliminar' }
          ],
          pageLength: 10,
          language: {
            search: "Buscar:",
            lengthMenu: "Mostrar _MENU_ registros",
            info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
            paginate: { previous: "Anterior", next: "Siguiente" }
          }
        });
      }
    })
    .catch(err => console.error("Error cargando servicios:", err));
}
 
// --- INSERTAR LIBRO ---
function insertarLibro(event) {
  event.preventDefault();
  let Titulo = document.getElementById("titulo").value;
  let Fecha_edi = document.getElementById("fecha_edi").value;
  let Autores = document.getElementById("autores").value;
  let Res_cus = document.getElementById("res_cus").value;
  let Dep_res = document.getElementById("dep_res").value;
  let Tipo = document.getElementById("tipo").value;
  let Editora = document.getElementById("editora").value;
  let ISBN = document.getElementById("ISBN").value;
  let Area = document.getElementById("area").value;
  let Cantidad = document.getElementById("cantidad").value;

  fetch(`${API}?accion=insertar_libro`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "titulo=" + encodeURIComponent(Titulo) + "&fecha_edi=" + encodeURIComponent(Fecha_edi) + "&autores=" + encodeURIComponent(Autores) + "&res_cus=" + encodeURIComponent(Res_cus) + "&dep_res=" + encodeURIComponent(Dep_res) + "&tipo=" + encodeURIComponent(Tipo) + "&editora=" + encodeURIComponent(Editora) + "&ISBN=" + encodeURIComponent(ISBN) + "&area=" + encodeURIComponent(Area) + "&cantidad=" + encodeURIComponent(Cantidad)
  })
    .then(res => res.json())
    .then(data => {
      console.log("Respuesta insertar libro:", data);
      alert(data.message);
      window.location.href = "Libros.html";
    })
    .catch(err => console.error("Error insertando libro:", err));
}
 
// --- CARGAR DATOS PARA MODIFICAR ---
function cargarDatosModificarLibro() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
 
  if (id) {
    fetch(`${API}?accion=get_libro&id=${id}`)
      .then(res => res.json())
      .then(data => {
        document.getElementById("id").value = data.Id_libro;
        document.getElementById("titulo").value = data.titulo;
        document.getElementById("fecha_edi").value = data.fecha_edi;
        document.getElementById("autores").value = data.autores;
        document.getElementById("res_cus").value = data.res_cus;
        document.getElementById("dep_res").value = data.dep_res;
        document.getElementById("tipo").value = data.tipo;
        document.getElementById("editora").value = data.editora;
        document.getElementById("ISBN").value = data.ISBN;
        document.getElementById("area").value = data.area;
        document.getElementById("cantidad").value = data.cantidad;
      })
      .catch(err => console.error("Error cargando datos del libro:", err));
  }
}
 
// --- ELIMINAR LIBRO ---
function eliminarLibro(id) {
  if (!confirm("¿Seguro que deseas eliminar este libro?")) return;
 
  fetch(`${API}?accion=eliminar_libro`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "Id_libro=" + encodeURIComponent(id)
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      cargarLibros();
    })
    .catch(err => console.error("Error eliminando libro:", err));
}

document.addEventListener("DOMContentLoaded", () => {
  cargarPartials();
  cargarCarreras();
  cargarServicios();
  cargarEstudiantes();
  cargarPrestamos();
  cargarLibros();

  if (document.getElementById("modificarCarr")) {
    cargarDatosModificar();
  }

  if (document.getElementById("modificarSrv")) {
      cargarDatosModificarServicio();
  }

  if (document.getElementById("modificarEst")) {
      cargarDatosModificarEstudiante();
  }

  if (document.getElementById("modificarPrestamo")) {
      cargarDatosModificarPrestamo();
  }

  if (document.getElementById("modificarLibros")) {
      cargarDatosModificarLibro();
  }

  const formInsertar = document.getElementById("insertarCarrera");
  if (formInsertar) {
    formInsertar.addEventListener("submit", insertarCarrera);
  }

  const formInsertarEst = document.getElementById("insertarEstudiante");
  if (formInsertarEst) {
    formInsertarEst.addEventListener("submit", insertarEstudiante);
  }

  const formModificarEst = document.getElementById("modificarEst");
  if (formModificarEst) {
    formModificarEst.addEventListener("submit", modificarEstudiante);
  }

  const formInsertarPrestamo = document.getElementById("insertarPrestamo");
  if (formInsertarPrestamo) {
    formInsertarPrestamo.addEventListener("submit", insertarPrestamo);
  }

  const formInsertarSrv = document.getElementById("insertarSrv");
  if (formInsertarSrv) {
    formInsertarSrv.addEventListener("submit", insertarServicio);
  }

  const formInsertarLibro = document.getElementById("insertarLibro");
  if (formInsertarLibro) {
    formInsertarLibro.addEventListener("submit", insertarLibro);
  }

  const formModificar = document.getElementById("modificarCarr");
  if (formModificar) {
    formModificar.addEventListener("submit", function (event) {
      event.preventDefault();
      let id = document.getElementById("id").value;
      let nombre = document.getElementById("nombre").value;

      fetch(`${API}?accion=modificar`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "Id_carrera=" + encodeURIComponent(id) + "&Nombre=" + encodeURIComponent(nombre)
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message);
          window.location.href = "Carreras.html";
        });
    });
  }

  const formModificarSrv = document.getElementById("modificarSrv");
  if (formModificarSrv) {
    formModificarSrv.addEventListener("submit", function(event) {
      event.preventDefault();
      let id     = document.getElementById("id").value;
      let nombre = document.getElementById("nombreSrv").value;

      fetch(`${API}?accion=modificar_servicio`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "Id_servicio=" + encodeURIComponent(id) + "&Nombre=" + encodeURIComponent(nombre)
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message);
          window.location.href = "Servicios.html";
        })
        .catch(err => console.error("Error modificando servicio:", err));
    });
  }

  const formModificarPrestamo = document.getElementById("modificarPrestamo");
  if (formModificarPrestamo) {
      formModificarPrestamo.addEventListener("submit", modificarPrestamos);
  }

  const formModificarLib = document.getElementById("modificarLibro");
  if (formModificarLib) {
    formModificarLib.addEventListener("submit", function(event) {
      event.preventDefault();
      let titulo = document.getElementById("titulo").value;
      let fecha_edi = document.getElementById("fecha_edi").value;
      let autores = document.getElementById("autores").value;
      let res_cus = document.getElementById("res_cus").value;
      let dep_res = document.getElementById("dep_res").value;
      let tipo = document.getElementById("tipo").value;
      let editora = document.getElementById("editora").value;
      let isbn = document.getElementById("isbn").value;
      let area = document.getElementById("area").value;
      let cantidad = document.getElementById("cantidad").value;

      fetch(`${API}?accion=modificar_libro`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "titulo=" + encodeURIComponent(titulo) + "&fecha_edi=" + encodeURIComponent(fecha_edi) + "&autores=" + encodeURIComponent(autores) + "&res_cus=" + encodeURIComponent(res_cus) + "&dep_res=" + encodeURIComponent(dep_res) + "&tipo=" + encodeURIComponent(tipo) + "&editora=" + encodeURIComponent(editora) + "&ISBN=" + encodeURIComponent(isbn) + "&area=" + encodeURIComponent(area) + "&cantidad=" + encodeURIComponent(cantidad)

      })
        .then(res => res.json())
        .then(data => {
          alert(data.message);
          window.location.href = "Libros.html";
        })
        .catch(err => console.error("Error modificando libro:", err));
    });
  }

});
