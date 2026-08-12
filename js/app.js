const API = "https://sure-entirely-believes-recreational.trycloudflare.com/test/api/index.php";
const API_ESTUDIANTES = "https://sure-entirely-believes-recreational.trycloudflare.com/test/api/Estudiantes.php";

function fetchConAuth(url, opciones = {}) {
    const jwt = localStorage.getItem("jwt");

    if (jwt && !jwt.startsWith("eyJ")) {
        localStorage.removeItem("jwt");
        window.location.href = "../Usuarios/login.html";
        return;
    }

    const headers = {
        ...opciones.headers,
        Authorization: `Bearer ${jwt || ""}`
    };

    return fetch(url, { ...opciones, headers })
        .then(res => {
            if (!res.ok) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Intenta de nuevo.",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#4e73df",
                    customClass: { popup: 'swal-pequeno' }
                });
                throw new Error("Error: " + res.status);
            }
            return res;
        })
        .catch(err => {
            if (err.message === "Failed to fetch") {
                Swal.fire({
                    icon: "warning",
                    title: "Sin conexión",
                    text: "No se pudo conectar con la base de datos. Verifica tu conexión.",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#4e73df",
                    customClass: { popup: 'swal-pequeno' }
                });
            }
            throw err;
        });
}

function obtenerNombreUsuario() {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return null;

    try {
        const payloadBase64 = jwt.split(".")[1];
        const payload = JSON.parse(atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/")));
        const partes = payload.sub.split("|");
        return partes[1];
    } catch (error) {
        return null;
    }
}

function mostrarToast(mensaje, tipo = "info") {
    const $toast = $("#toastPIN");

    $toast.removeClass("bg-success bg-danger bg-info text-white");
    if (tipo === "success") $toast.addClass("bg-success text-white");
    else if (tipo === "error") $toast.addClass("bg-danger text-white");
    else $toast.addClass("bg-info text-white");

    $("#toastPINBody").text(mensaje);
    $toast.toast("show");
}

function manejarPIN() {
  let pin = document.getElementById("inputPIN").value;

  if (pin === "") {
    fetchConAuth(`${API}?eliminarPIN`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    })
    .then(res => res.json())
    .then(data => {
      mostrarToast(data.message, data.success ? "success" : "error");
      $('#modalPIN').modal('hide');
      // alert(data.message);
      // $('#modalPIN').modal('hide');
    })
    // .catch(err => console.error("Error eliminando PIN:", err));
    // return;
    .catch(err => {
      console.error("Error eliminando PIN:", err);
      mostrarToast("Ocurrió un error al eliminar el PIN.", "error");
    });
    return;
  }

  if(!/^\d{4}$/.test(pin)){
    alert("El PIN debe ser numérico y tener exactamente 4 dígitos.");
    return;
  }

  localStorage.setItem("pinSeguridad", pin);

  fetchConAuth(`${API}?guardarPIN`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "pin=" + encodeURIComponent(pin)
  })
  .then(res => res.json())
  .then(data => {
    mostrarToast(data.message, data.success ? "success" : "error");
    $('#modalPIN').modal('hide');
    // alert(data.message);
    // $('#modalPIN').modal('hide');
  })
  .catch(err => {
    console.error("Error guardando PIN:", err);
    mostrarToast("Ocurrió un error al guardar el PIN.", "error");
  });
  // .catch(err => console.error("Error guardando PIN:", err));
}


// Cargar plantillas sidebar y topbar
function cargarPartials() {
  fetch("../partials/sidebar.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("sidebar").outerHTML = html;

      const sidebarToggle = document.getElementById("sidebarToggle");
      if (sidebarToggle) {
        sidebarToggle.addEventListener("click", function () {
          document.body.classList.toggle("sidebar-toggled");
          document.querySelector(".sidebar").classList.toggle("toggled");
          if (document.querySelector(".sidebar").classList.contains("toggled")) {
            $('.sidebar .collapse').collapse('hide');
          }
        });
      }
    });

  fetch("../partials/topbar.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("topbar").outerHTML = html;

      const nombreUsuario = obtenerNombreUsuario();
      if (nombreUsuario) {
        document.getElementById("nombreUsuarioTopbar").textContent = nombreUsuario;
      }

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

// GRAFICAS
function graficarGenero() {

    $.get(API_ESTUDIANTES + "?accion=graficarGenero", function(respuesta) {

        let labels = [];
        let values = [];

        respuesta.forEach(function(item) {
            labels.push(item.Genero);
            values.push(parseInt(item.Total));
        });

        var data = [{
            values: values,
            labels: labels,
            type: "pie",

            hole: 0.75,

            marker: {
                colors: [
                    "#1cc88a",
                    "#36b9cc"
                ],
                line: {
                    color: "white",
                    width: 2
                }
            },

            textinfo: "none",

            hoverlabel: {
                bgcolor: "#ffffff",
                bordercolor: "#dddfeb",
                font: {
                    family: "Nunito, sans-serif",
                    size: 13,
                    color: "#858796"
                },
                align: "left"
            },

            hovertemplate:
                "<b>%{label}</b><br>" +
                "%{value} estudiantes<br>" +
                "%{percent}<extra></extra>"
        }];

        var layout = {

            height: 260,
            autosize: true,

            paper_bgcolor: "white",
            plot_bgcolor: "white",

            showlegend: false,

            autosize: true,
            margin: {
                l: 15,
                r: 15,
                t: 10,
                b: 10
            },

            font: {
                family: "Nunito, sans-serif",
                size: 13,
                color: "#858796"
            }
        };

        Plotly.newPlot(
            "divGraficaGenero",
            data,
            layout,
            {
                responsive: true,
                displayModeBar: false
            }
        )
    }, "json");
}

function graficarVisitas() {
    const mes = document.getElementById("filtroMes")?.value || "";
    const anio = document.getElementById("filtroAnio")?.value || "";
    $.get(API + "?accion=graficarVisitas&mes=" + mes + "&anio=" + anio, function(respuesta) {

        let labels = [];
        let values = [];

        respuesta.forEach(function(item) {
            labels.push(item.Fecha);
            values.push(parseInt(item.Total));
        })

        var data = [{
            x: labels,
            y: values,
            type: "scatter",
            mode: "lines+markers",
            name: "Visitas",
            line: {
                color: "#1cc88a",
                width: 3,
                shape: "spline"
            },
            marker: {
                size: 6,
                color: "#1cc88a",
                line: {
                    color: "#1cc88a",
                    width: 2
                }
            },
            fill: "tozeroy",
            fillcolor: "rgba(78,115,223,0.05)",

            hovertemplate:
                "<b>%{x}</b><br>" +
                "Visitas: %{y}" +
                "<extra></extra>"
        }]

        const movil = window.innerWidth < 768;

        var layout = {
            height: movil ? 230 : 300,
            autosize: true,
            paper_bgcolor: "white",
            plot_bgcolor: "white",
            showlegend: false,

            margin: {
                l: movil ? 40 : 55,
                r: 25,
                t: 25,
                b: movil ? 10 : 45
            },

            font: {
                family: "Nunito, sans-serif",
                size: 13,
                color: "#858796"
            },

            xaxis: {
                showgrid: false,
                zeroline: false,
                automargin: true,
                tickfont: {
                    color: "#858796",
                    size: movil ? 9 : 12
                },
                tickangle: movil ? -90 : -45,
            },

            yaxis: {
               automargin: true,
                title: {
                    text: "Cantidad de visitas",
                    font: {
                        size: movil ? 10 : 12,
                        color: "#858796"
                    }
                },

                showgrid: true,
                gridcolor: "rgba(234,236,244,1)",
                griddash: "dot",
                zeroline: false,
                tickfont: {
                    color: "#858796"
                }
            },

            hoverlabel: {
                bgcolor: "#ffffff",
                bordercolor: "#dddfeb",

                font: {
                    family: "Nunito, sans-serif",
                    size: 13,
                    color: "#858796"
                }
            }
        }

        Plotly.newPlot("divGraficaVisitas", data, layout, {
            responsive: true,
            displayModeBar: false
        })
    }, "json");
}

function graficarVisitasServicio() {
  $.get(API + "?accion=graficarVisitasServicio", function(respuesta) {

        let labels = [];
        let values = [];

        respuesta.forEach(function(item){
            labels.push(item.Servicio);
            values.push(parseInt(item.Total));
        });


        let colores = [
            "#e74a3b",
            "#e77a3b",
            "#f6c23e",
            "#4e73df",
            "#36b9cc",
            "#1cc88a"
        ];


        let shapes = [];
        let annotations = [];

        let coloresPorPunto = [];
        const movil = window.innerWidth < 768;

        values.forEach(function(valor, index){

            let color = colores[index % colores.length];
            let rowY = -index;

            coloresPorPunto.push(color);

            shapes.push({
                type: "rect",
                x0: 0,
                x1: valor,
                y0: rowY - 0.35,
                y1: rowY + 0.05,
                fillcolor: color,
                line: { width: 0 },
                layer: "below"
            });

            annotations.push({
                x: 0,
                y: rowY + 0.10,
                xref: "x",
                yref: "y",
                text: movil ? labels[index].substring(0, 20) + "..." : labels[index],
                showarrow: false,
                xanchor: "left",
                yanchor: "bottom",
                font: {
                    size: movil ? 9 : 11,
                    color: "#5a5c69"
                }
            });
        });

        var data = [{
            x: values,
            y: values.map((_, index) => -index),
            type: "bar",
            orientation: "h",
            marker: {
                color: "rgba(0,0,0,0)"
            },
            text: labels,

            // Un solo texto limpio: "Nombre: valor%"
            hovertemplate: "<b>%{text}</b><br>%{x}% de visitas<extra></extra>",

            // Borde del tooltip con el color de cada barra
            hoverlabel: {
                bgcolor: coloresPorPunto,
                bordercolor: coloresPorPunto,
                font: {
                    color: "white",
                    size: 12,
                    family: "Segoe UI, Arial, sans-serif"
                }
            }

        }];


        let n = labels.length;

        var layout = {
            height: n * 65 + 40,
            shapes: shapes,
            annotations: annotations,
            autosize: true,
            paper_bgcolor: "white",
            plot_bgcolor: "white",

            margin: {
                l: 10,
                r: movil ? 10 : 40,
                t: 0,
                b: 20
            },

            showlegend: false,

            xaxis: {
                visible: false,
                rangemode: "tozero",
                range: [0, Math.max(...values) * (movil ? 1.4 : 1.2)]
            },

            yaxis: {
                visible: false,
                range: [-(n - 1) - 0.6, 0.6]
            }
        };

        Plotly.newPlot(
            "divGraficaVisitasServicio",
            data,
            layout,
            {
                responsive: true,
                displayModeBar: false
            }
        );
    }, "json");
}

function cargarTotales() {
    $.get(API + "?accion=totalEntradas", function(data) {
        document.getElementById("cardEntradas").textContent = data.total;
    }, "json");

    $.get(API + "?accion=totalLibros", function(data) {
        document.getElementById("cardLibros").textContent = data.total;
    }, "json");

    $.get(API + "?accion=totalEstudiantes", function(data) {
        document.getElementById("cardEstudiantes").textContent = data.total;
    }, "json");

    $.get(API + "?accion=totalPrestamos", function(data) {
        document.getElementById("cardPrestamos").textContent = data.total;
    }, "json");
}

// Generar archivos
function exportarExcelVisitas() {
    try {
        const tabla = $('#dataTableVisitas').DataTable();
        const filas = tabla.rows({ search: 'applied' }).data().toArray();
        
        const datos = filas.map(d => ({
            ID: d[0],
            Estudiante: d[1],
            Servicio: d[2],
            Fecha: d[3],
            "Hora entrada": d[4],
            "Hora salida": d[5]
        }));

        const ws = XLSX.utils.json_to_sheet(datos);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Visitas");

        if (window.cordova && cordova.file && cordova.file.externalRootDirectory) {
            alert("Iniciando exportar en APK...");
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([wbout], { type: 'application/octet-stream' });
            window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(dir) {
                dir.getFile("Visitas.xlsx", { create: true }, function(file) {
                    file.createWriter(function(writer) {
                        writer.write(blob);
                        writer.onwriteend = function() {
                            alert("Archivo guardado, abriendo...");
                            cordova.plugins.fileOpener2.open(
                                cordova.file.externalRootDirectory + "Visitas.xlsx",
                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                            );
                        };
                        writer.onerror = function(e) { alert("Error escribiendo: " + e.toString()); };
                    });
                }, function(e) { alert("Error creando archivo: " + e.toString()); });
            }, function(e) { alert("Error directorio: " + e.toString()); });
        } else {
            // Browser
            XLSX.writeFile(wb, "Visitas.xlsx");
        }
    } catch(e) {
        alert("Error: " + e.toString());
    }
}

async function exportarPDFVisitas() {
    try {
        const tabla = $('#dataTableVisitas').DataTable();
        const filas = tabla.rows({ search: 'applied' }).data().toArray();

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text("Reporte de Visitas", 14, 15);
        doc.autoTable({
            startY: 20,
            head: [["ID", "Estudiante", "Servicio", "Fecha", "Hora entrada", "Hora salida"]],
            body: filas.map(d => [d[0], d[1], d[2], d[3], d[4], d[5]])
        });

        if (window.cordova && cordova.file && cordova.file.externalRootDirectory) {
            alert("Iniciando exportar PDF en APK...");
            const pdfBlob = new Blob([doc.output('arraybuffer')], { type: 'application/pdf' });
            window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(dir) {
                dir.getFile("Visitas.pdf", { create: true }, function(file) {
                    file.createWriter(function(writer) {
                        writer.write(pdfBlob);
                        writer.onwriteend = function() {
                            alert("PDF guardado, abriendo...");
                            cordova.plugins.fileOpener2.open(
                                cordova.file.externalRootDirectory + "Visitas.pdf",
                                'application/pdf'
                            );
                        };
                        writer.onerror = function(e) { alert("Error escribiendo PDF: " + e.toString()); };
                    });
                }, function(e) { alert("Error creando PDF: " + e.toString()); });
            }, function(e) { alert("Error directorio PDF: " + e.toString()); });
        } else {
            // Browser
            doc.save("Visitas.pdf");
        }
    } catch(e) {
        alert("Error PDF: " + e.toString());
    }
}

function exportarExcelDashboard() {
    const wb = XLSX.utils.book_new();

    $.when(
        $.get(API + "?accion=graficarVisitas"),
        $.get(API_ESTUDIANTES + "?accion=graficarGenero"),
        $.get(API + "?accion=graficarVisitasServicio")
    ).done(function(visitas, genero, servicios) {

        const wsVisitas = XLSX.utils.json_to_sheet(visitas[0].map(d => ({
            Fecha: d.Fecha,
            Total: d.Total
        })));

        const wsGenero = XLSX.utils.json_to_sheet(genero[0].map(d => ({
            Genero: d.Genero,
            Total: d.Total
        })));

        const wsServicios = XLSX.utils.json_to_sheet(servicios[0].map(d => ({
            Servicio: d.Servicio,
            Total: d.Total
        })));

        XLSX.utils.book_append_sheet(wb, wsVisitas, "Visitas por Día");
        XLSX.utils.book_append_sheet(wb, wsGenero, "Género");
        XLSX.utils.book_append_sheet(wb, wsServicios, "Servicios");

        XLSX.writeFile(wb, "Graficas_Biblioteca.xlsx");
    });
}

async function exportarPDFDashboard() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('l', 'mm', 'a4');

    doc.setFontSize(20);
    doc.text("Graficas Biblioteca", 14, 15);

    const graficas = [
        { id: "divGraficaVisitas", titulo: "Visitas por Día" },
        { id: "divGraficaGenero", titulo: "Género Estudiantes" },
        { id: "divGraficaVisitasServicio", titulo: "Servicios" }
    ];

    let y = 25;

    for (const g of graficas) {
        const el = document.getElementById(g.id);
        const canvas = await html2canvas(el, { scale: 1.5 });
        const img = canvas.toDataURL("image/png");

        doc.setFontSize(12);
        doc.text(g.titulo, 14, y);
        y += 5;

        const ancho = 130;
        const alto = (canvas.height * ancho) / canvas.width;

        if (y + alto > 195) {
            doc.addPage();
            y = 15;
        }

        doc.addImage(img, "PNG", 14, y, ancho, alto);
        y += alto + 10;
    }

    doc.save("Graficas_Biblioteca.pdf");
}

// Carreras
function cargarCarreras() {
  fetchConAuth(`${API}?accion=listar`)
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

function insertarCarrera(event) {
  event.preventDefault();
  let nombre = document.getElementById("nombre").value;

  fetchConAuth(`${API}?accion=insertar`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "Nombre=" + encodeURIComponent(nombre)
  })
    .then(res => res.json())
    .then(data => {
      console.log("Respuesta registrar carrera:", data);
      Swal.fire({
          icon: data.status === "success" ? "success" : "error", 
          title: data.status === "success" ? "¡Éxito!" : "Error", text: data.message, confirmButtonText: "Aceptar",
          confirmButtonColor: "#4e73df",
          customClass: {popup: 'swal-pequeno'}
      })
      .then(() => {
        if (data.status === "success") {
          window.location.href = "Carreras.html";
        }
      });
    })
    .catch(err => console.error("Error insertando carrera:", err));
}

function cargarDatosModificar() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (id) {
    fetchConAuth(`${API}?accion=carrera&id=${id}`)
      .then(res => res.json())
      .then(data => {
        document.getElementById("id").value = data.Id_carrera;
        document.getElementById("nombre").value = data.Nombre;
      });
  }
}

function eliminarCarrera(id) {
  Swal.fire({
    icon: "warning", title: "¿Eliminar carrera?", text: "Esta acción no se puede deshacer.", showCancelButton: true, confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar",
    confirmButtonColor: "#4e73df",
    cancelButtonColor: "#e53935",
    customClass: { popup: 'swal-pequeno' }
  }).then((result) => {
    if (!result.isConfirmed) return;

    fetchConAuth(`${API}?accion=eliminar`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "Id_carrera=" + encodeURIComponent(id)
    })
      .then(res => res.json())
      .then(data => {
        Swal.fire({
          icon: data.status === "success" ? "success" : "error",
          title: data.status === "success" ? "¡Eliminado!" : "Error",
          text: data.message, confirmButtonText: "Aceptar",
          confirmButtonColor: "#4e73df",
          customClass: { popup: 'swal-pequeno' }
        }).then(() => cargarCarreras());
      })
      .catch(err => console.error("Error eliminando carrera:", err));
  });
}

// ESTUDIANTES
function cargarEstudiantes() {
  fetchConAuth(`${API_ESTUDIANTES}?accion=listar`)
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

function insertarEstudiante(event) {
  event.preventDefault();

  let matricula = document.getElementById("matricula").value;
  let nombre = document.getElementById("nombre").value;
  let grado = document.getElementById("grado").value;
  let seccion = document.getElementById("seccion").value;
  let genero = document.getElementById("genero").value;
  let carrera = document.getElementById("carrera").value;
  let contacto = document.getElementById("contacto").value;

  fetchConAuth(`${API_ESTUDIANTES}?accion=insertar`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `matricula=${encodeURIComponent(matricula)}&nombre=${encodeURIComponent(nombre)}&grado=${encodeURIComponent(grado)}&seccion=${encodeURIComponent(seccion)}&genero=${encodeURIComponent(genero)}&carrera=${encodeURIComponent(carrera)}&contacto=${encodeURIComponent(contacto)}`
  })
    .then(res => res.json())
    .then(data => {
      console.log("Respuesta registrar estudiante:", data);
      Swal.fire({
          icon: data.status === "success" ? "success" : "error", 
          title: data.status === "success" ? "¡Éxito!" : "Error", text: data.message, confirmButtonText: "Aceptar",
          confirmButtonColor: "#4e73df",
          customClass: {popup: 'swal-pequeno'}
      })
      .then(() => {
        if (data.status === "success") {
          window.location.href = "Estudiantes.html";
        }
      });
    })
    .catch(err => console.error("Error insertando estudiante:", err));
}

function buscarPorMatricula() {
  let matricula = document.getElementById("matricula").value;

  if (matricula) {
    fetchConAuth(`${API_ESTUDIANTES}?accion=buscarMatricula`, {
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
    matriculaInput.addEventListener("change", buscarPorMatricula);
  }
});


function cargarDatosModificarEstudiante() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (id) {
    fetchConAuth(`${API_ESTUDIANTES}?accion=estudiante&id=${id}`)
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

function modificarEstudiante(event) {
  event.preventDefault();
  if (!$(this).valid()) return;

  let id = document.getElementById("id").value;
  let matricula = document.getElementById("matricula").value;
  let nombre = document.getElementById("nombre").value;
  let grado = document.getElementById("grado").value;
  let seccion = document.getElementById("seccion").value;
  let genero = document.getElementById("genero").value;
  let carrera = document.getElementById("carrera").value;
  let contacto = document.getElementById("contacto").value;

  fetchConAuth(`${API_ESTUDIANTES}?accion=modificar`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `Id_estudiante=${encodeURIComponent(id)}&matricula=${encodeURIComponent(matricula)}&nombre=${encodeURIComponent(nombre)}&grado=${encodeURIComponent(grado)}&seccion=${encodeURIComponent(seccion)}&genero=${encodeURIComponent(genero)}&carrera=${encodeURIComponent(carrera)}&contacto=${encodeURIComponent(contacto)}`
  })
    .then(res => res.json())
    .then(data => {
        Swal.fire({
            icon: data.status === "success" ? "success" : "error", 
            title: data.status === "success" ? "¡Éxito!" : "Error", text: data.message, confirmButtonText: "Aceptar",
            confirmButtonColor: "#4e73df",
            customClass: { popup: 'swal-pequeno' }
        }).then(() => {
            if (data.status === "success") {
                window.location.href = "Estudiantes.html";
            }
        });
    })
    .catch(err => console.error("Error modificando estudiante:", err));
}

function eliminarEstudiante(id) {
  Swal.fire({
    icon: "warning", title: "¿Eliminar estudiante?", text: "Esta acción no se puede deshacer.", showCancelButton: true, confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar",
    confirmButtonColor: "#4e73df",
    cancelButtonColor: "#e53935",
    customClass: { popup: 'swal-pequeno' }
  }).then((result) => {
    if (!result.isConfirmed) return;

    fetchConAuth(`${API_ESTUDIANTES}?accion=eliminar`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "Id_estudiante=" + encodeURIComponent(id)
    })
      .then(res => res.json())
      .then(data => {
        Swal.fire({
          icon: data.status === "success" ? "success" : "error",
          title: data.status === "success" ? "¡Eliminado!" : "Error",
          text: data.message, confirmButtonText: "Aceptar",
          confirmButtonColor: "#4e73df",
          customClass: { popup: 'swal-pequeno' }
        }).then(() => cargarEstudiantes());
      })
      .catch(err => console.error("Error eliminando estudiante:", err));
  });
}

// PRESTAMOS
function cargarPrestamos() {
  fetchConAuth(`${API}?accion=prestamos`)
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

function insertarPrestamo(event) {
  event.preventDefault();

  let estudiante = document.getElementById("id_estudiante").value;
  let fecha_prestamo = new Date().toISOString().split("T")[0];
  let fecha_entrega = document.getElementById("fecha_entrega").value;
  let fecha_devolucion = document.getElementById("fecha_devolucion").value;
  let estado = document.getElementById("estado").value;

  fetchConAuth(`${API}?accion=insertar_prestamo`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `estudiante=${encodeURIComponent(estudiante)}&fecha_prestamo=${encodeURIComponent(fecha_prestamo)}&fecha_entrega=${encodeURIComponent(fecha_entrega)}&fecha_devolucion=${encodeURIComponent(fecha_devolucion)}&estado=${encodeURIComponent(estado)}`
  })
    .then(res => res.json())
    .then(data => {
      console.log("Respuesta registrar prestamos:", data);
      Swal.fire({
          icon: data.status === "success" ? "success" : "error", 
          title: data.status === "success" ? "¡Éxito!" : "Error", text: data.message, confirmButtonText: "Aceptar",
          confirmButtonColor: "#4e73df",
          customClass: {popup: 'swal-pequeno'}
      })
      .then(() => {
        if (data.status === "success") {
          window.location.href = "Prestamos.html";
        }
      });
    })
    .catch(err => console.error("Error insertando prestamo:", err));
}

// --- CARGAR DATOS PARA MODIFICAR PRESTAMOS ---
function cargarDatosModificarPrestamo() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
 
  if (id) {
    fetchConAuth(`${API}?accion=get_prestamo&id=${id}`)
      .then(res => res.json())
      .then(data => {
        document.getElementById("id_prestamo").value = data.Id_prestamo;
        document.getElementById("id_estudiante_real").value = data.Estudiante;
        document.getElementById("nombre").value = data.Nombre;
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

function modificarPrestamos(event) {
  event.preventDefault();
  if (!$(this).valid()) return;

  let id = document.getElementById("id_prestamo").value;
  let estudiante = document.getElementById("id_estudiante_real").value;
  let fecha_prestamo = document.getElementById("fecha_prestamo").value;
  let fecha_entrega = document.getElementById("fecha_entrega").value;
  let fecha_devolucion = document.getElementById("fecha_devolucion").value;
  let estado = document.getElementById("estado").value;

  fetchConAuth(`${API}?accion=modificar_prestamo`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `id_prestamo=${encodeURIComponent(id)}&estudiante=${encodeURIComponent(estudiante)}&fecha_prestamo=${encodeURIComponent(fecha_prestamo)}&fecha_entrega=${encodeURIComponent(fecha_entrega)}&fecha_devolucion=${encodeURIComponent(fecha_devolucion)}&estado=${encodeURIComponent(estado)}`
  })
    .then(res => res.json())
    .then(data => {
            Swal.fire({
                icon: data.status === "success" ? "success" : "error", 
                title: data.status === "success" ? "¡Éxito!" : "Error", text: data.message, confirmButtonText: "Aceptar",
                confirmButtonColor: "#4e73df",
                customClass: { popup: 'swal-pequeno' }
            }).then(() => {
                if (data.status === "success") {
                    window.location.href = "Prestamos.html";
                }
            });
        })
    .catch(err => console.error("Error modificando préstamo:", err));
}

function eliminarPrestamo(id_prestamo) {
  Swal.fire({
    icon: "warning", title: "¿Eliminar préstamo?", text: "Esta acción no se puede deshacer. <p>Tambien eliminarias los libros prestados y los reportes de daños</p>", showCancelButton: true, confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar",
    confirmButtonColor: "#4e73df",
    cancelButtonColor: "#e53935",
    customClass: { popup: 'swal-pequeno' }
  }).then((result) => {
    if (!result.isConfirmed) return;

    fetchConAuth(`${API}?accion=eliminar_prestamo`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "id_prestamo=" + encodeURIComponent(id_prestamo)
    })
      .then(res => res.json())
      .then(data => {
        Swal.fire({
          icon: data.status === "success" ? "success" : "error",
          title: data.status === "success" ? "¡Eliminado!" : "Error",
          text: data.message, confirmButtonText: "Aceptar",
          confirmButtonColor: "#4e73df",
          customClass: { popup: 'swal-pequeno' }
        }).then(() => cargarPrestamos());
      })
      .catch(err => console.error("Error eliminando préstamos:", err));
  });
}

// SERVICIOS
function cargarServicios() {
  fetchConAuth(`${API}?accion=listar_servicios`)
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
 
function insertarServicio(event) {
  event.preventDefault();
  let nombre = document.getElementById("nombre").value;
 
  fetchConAuth(`${API}?accion=insertar_servicio`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "Nombre=" + encodeURIComponent(nombre)
  })
    .then(res => res.json())
    .then(data => {
      console.log("Respuesta registrar servicio:", data);
      Swal.fire({
          icon: data.status === "success" ? "success" : "error", 
          title: data.status === "success" ? "¡Éxito!" : "Error", text: data.message, confirmButtonText: "Aceptar",
          confirmButtonColor: "#4e73df",
          customClass: {popup: 'swal-pequeno'}
      })
      .then(() => {
        if (data.status === "success") {
          window.location.href = "Servicios.html";
        }
      });
    })
    .catch(err => console.error("Error insertando servicio:", err));
}

function cargarDatosModificarServicio() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
 
  if (id) {
    fetchConAuth(`${API}?accion=get_servicio&id=${id}`)
      .then(res => res.json())
      .then(data => {
        document.getElementById("id").value = data.Id_servicio;
        document.getElementById("nombreSrv").value = data.Nombre;
      })
      .catch(err => console.error("Error cargando datos del servicio:", err));
  }
}

function eliminarServicio(id) {
  Swal.fire({
    icon: "warning", title: "¿Eliminar servicio?", text: "Esta acción no se puede deshacer.", showCancelButton: true, confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar",
    confirmButtonColor: "#4e73df",
    cancelButtonColor: "#e53935",
    customClass: { popup: 'swal-pequeno' }
  }).then((result) => {
    if (!result.isConfirmed) return;

    fetchConAuth(`${API}?accion=eliminar_servicio`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "Id_servicio=" + encodeURIComponent(id)
    })
      .then(res => res.json())
      .then(data => {
        Swal.fire({
          icon: data.status === "success" ? "success" : "error",
          title: data.status === "success" ? "¡Eliminado!" : "Error",
          text: data.message, confirmButtonText: "Aceptar",
          confirmButtonColor: "#4e73df",
          customClass: { popup: 'swal-pequeno' }
        }).then(() => cargarServicios());
      })
      .catch(err => console.error("Error eliminando servicio:", err));
  });
}

// LIBROS
function cargarLibros() {
  fetchConAuth(`${API}?accion=listar_libro`)
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

        `<a href="ModificarLibros.html?id=${dato.Id_libro}">
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
            { title: 'Título' },
            { title: 'Fecha Edición' },
            { title: 'Autores' },
            { title: 'Responsable de Custodia' },
            { title: 'Departamento del Responsable' },
            { title: 'Tipo' },
            { title: 'Editorial' },
            { title: 'ISBN' },
            { title: 'Área' },
            { title: 'Cantidad' },
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
    .catch(err => console.error("Error cargando libros:", err));
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

  fetchConAuth(`${API}?accion=insertar_libro`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "Titulo=" + encodeURIComponent(Titulo) + "&Fecha_edicion=" + encodeURIComponent(Fecha_edi) + "&Autores=" + encodeURIComponent(Autores) + "&Responsable_custodia=" + encodeURIComponent(Res_cus) + "&Departamento_responsable=" + encodeURIComponent(Dep_res) + "&Tipo=" + encodeURIComponent(Tipo) + "&Editora=" + encodeURIComponent(Editora) + "&ISBN=" + encodeURIComponent(ISBN) + "&Area=" + encodeURIComponent(Area) + "&Cantidad=" + encodeURIComponent(Cantidad)
  })
    .then(res => res.json())
    .then(data => {
      console.log("Respuesta registrar libro:", data);
      Swal.fire({
          icon: data.status === "success" ? "success" : "error", 
          title: data.status === "success" ? "¡Éxito!" : "Error", text: data.message, confirmButtonText: "Aceptar",
          confirmButtonColor: "#4e73df",
          customClass: {popup: 'swal-pequeno'}
      })
      .then(() => {
        if (data.status === "success") {
          window.location.href = "Libros.html";
        }
      });
    })  
    .catch(err => console.error("Error insertando libro:", err));
}
 
// --- CARGAR DATOS PARA MODIFICAR ---
function cargarDatosModificarLibro() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
 
  if (id) {
    fetchConAuth(`${API}?accion=get_libro&id=${id}`)
      .then(res => res.json())
      .then(data => {
        document.getElementById("id").value = data.Id_libro;
        document.getElementById("titulo").value = data.Titulo;
        document.getElementById("fecha_edi").value = data.Fecha_edicion;
        document.getElementById("autores").value = data.Autores;
        document.getElementById("res_cus").value = data.Responsable_custodia;
        document.getElementById("dep_res").value = data.Departamento_responsable;
        document.getElementById("tipo").value = data.Tipo;
        document.getElementById("editora").value = data.Editora;
        document.getElementById("ISBN").value = data.ISBN;
        document.getElementById("area").value = data.Area;
        document.getElementById("cantidad").value = data.Cantidad;
      })
      .catch(err => console.error("Error cargando datos del libro:", err));
  }
}
 
// --- ELIMINAR LIBRO ---
function eliminarLibro(id) {
  Swal.fire({
    icon: "warning", title: "¿Eliminar libro?", text: "Esta acción no se puede deshacer.", showCancelButton: true, confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar",
    confirmButtonColor: "#4e73df",
    cancelButtonColor: "#e53935",
    customClass: { popup: 'swal-pequeno' }
  }).then((result) => {
    if (!result.isConfirmed) return;
 
  fetchConAuth(`${API}?accion=eliminar_libro`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "Id_libro=" + encodeURIComponent(id)
  })
    .then(res => res.json())
    .then(data => {
      Swal.fire({
        icon: data.status === "success" ? "success" : "error",
        title: data.status === "success" ? "¡Eliminado!" : "Error",
        text: data.message, confirmButtonText: "Aceptar",
        confirmButtonColor: "#4e73df",
        customClass: { popup: 'swal-pequeno' }
      }).then(() => cargarLibros());
    })
    .catch(err => console.error("Error eliminando libro:", err));
  });
}

// Historial_Prestamos
function cargarHistorialP() {
  fetchConAuth(`${API}?accion=listar_HistorialP`)
    .then(res => res.json())
    .then(data => {
      const filas = data.map(dato => [
        dato.Id_historial,
        dato.Nombre,               
        dato.Descripcion,            
        dato.Fecha,
        dato.Estado,

        `<a href="ModificarHistorialP.html?id=${dato.Id_historial}">
           <i class="fas fa-edit"></i><span class='d-none d-md-inline'>Modificar</span>
         </a>`,
        `<a href="#" onclick="eliminarHistorialP(${dato.Id_historial}, this)">
           <i class="fas fa-trash"></i> <span class='d-none d-md-inline'>Eliminar</span>
         </a>`

      ]);
 
      if ($.fn.DataTable.isDataTable('#dataTableHistorialP')) {
        let tabla = $('#dataTableHistorialP').DataTable();
        tabla.clear();
        tabla.rows.add(filas).draw();
      } else {
        $('#dataTableHistorialP').DataTable({
          data: filas,
          columns: [
            { title: 'ID' },
            { title: 'Préstamo' },
            { title: 'Descripción' },
            { title: 'Fecha' },
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
    .catch(err => console.error("Error cargando Reporte de Daños:", err));
}

// --- INSERTAR HistorialP ---
function insertarHistorialP(event) {
  event.preventDefault();
  let Prestamo = document.getElementById("prestamo").value;
  let Descripcion = document.getElementById("descripcion").value;
  let Fecha = document.getElementById("fecha").value;
  let Estado = document.getElementById("estado").value;

  fetchConAuth(`${API}?accion=insertar_HistorialP`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "Prestamo=" + encodeURIComponent(Prestamo) + "&Descripcion=" + encodeURIComponent(Descripcion) + "&Fecha=" + encodeURIComponent(Fecha) + "&Estado=" + encodeURIComponent(Estado)
  })
    .then(res => res.json())
    .then(data => {
      console.log("Respuesta registrar reporte de daños:", data);
      Swal.fire({
          icon: data.status === "success" ? "success" : "error", 
          title: data.status === "success" ? "¡Éxito!" : "Error", text: data.message, confirmButtonText: "Aceptar",
          confirmButtonColor: "#4e73df",
          customClass: {popup: 'swal-pequeno'}
      })
      .then(() => {
        if (data.status === "success") {
          window.location.href = "HistorialP.html";
        }
      });
    })
    .catch(err => console.error("Error insertando reporte de daños:", err));
}

// Select
function cargarPrestamosSelect() {
    fetchConAuth(`${API}?accion=listar_prestamos_select`)
        .then(res => res.json())
        .then(data => {
            const select = document.getElementById("prestamo");
            data.forEach(p => {
                const option = document.createElement("option");
                option.value = p.Id_prestamo;
                option.textContent = p.Id_prestamo + " - " + p.Nombre;
                select.appendChild(option);
            });
        })
        .catch(err => console.error("Error cargando préstamos:", err));
}

// --- CARGAR DATOS PARA MODIFICAR ---
function cargarDatosModificarHistorialP() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
 
  if (id) {
    fetchConAuth(`${API}?accion=get_HistorialP&id=${id}`)
      .then(res => res.json())
      .then(data => {
        document.getElementById("id").value = data.Id_historial;
        document.getElementById("prestamo").value = data.Prestamo;
        document.getElementById("descripcion").value = data.Descripcion;
        document.getElementById("fecha").value = data.Fecha;
        document.getElementById("estado").value = data.Estado;
      })
      .catch(err => console.error("Error cargando datos del historial de préstamo:", err));
  }
}
 
// --- ELIMINAR HISTORIAL PRÉSTAMO ---
function eliminarHistorialP(id) {
  Swal.fire({
    icon: "warning", title: "¿Eliminar historial de préstamo?", text: "Esta acción no se puede deshacer.", showCancelButton: true, confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar",
    confirmButtonColor: "#4e73df",
    cancelButtonColor: "#e53935",
    customClass: { popup: 'swal-pequeno' }
  }).then((result) => {
    if (!result.isConfirmed) return;

    fetchConAuth(`${API}?accion=eliminar_HistorialP`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "Id_historial=" + encodeURIComponent(id)
    })
      .then(res => res.json())
      .then(data => {
        Swal.fire({
          icon: data.status === "success" ? "success" : "error",
          title: data.status === "success" ? "¡Eliminado!" : "Error",
          text: data.message, confirmButtonText: "Aceptar",
          confirmButtonColor: "#4e73df",
          customClass: { popup: 'swal-pequeno' }
        }).then(() => cargarHistorialP());
      })
      .catch(err => console.error("Error eliminando reporte de daños:", err));
  });
}

// DETALLE PRESTAMOS
function cargarDetalleP() {
  fetchConAuth(`${API}?accion=listar_DetalleP`)
    .then(res => res.json())
    .then(data => {
      const filas = data.map(dato => [
        dato.Id_detalle_prestamo,
        dato.Nombre,               
        dato.Titulo,            
        dato.Cantidad,

        `<a href="ModificarDetalleP.html?id=${dato.Id_detalle_prestamo}">
           <i class="fas fa-edit"></i><span class='d-none d-md-inline'>Modificar</span>
         </a>`,
        `<a href="#" onclick="eliminarDetalleP(${dato.Id_detalle_prestamo}, this)">
           <i class="fas fa-trash"></i> <span class='d-none d-md-inline'>Eliminar</span>
         </a>`

      ]);
 
      if ($.fn.DataTable.isDataTable('#dataTableDetalleP')) {
        let tabla = $('#dataTableDetalleP').DataTable();
        tabla.clear();
        tabla.rows.add(filas).draw();
      } else {
        $('#dataTableDetalleP').DataTable({
          data: filas,
          columns: [
            { title: 'ID' },
            { title: 'Préstamo' },
            { title: 'Libro' },
            { title: 'Cantidad' },
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
    .catch(err => console.error("Error cargando detalle de préstamos:", err));
}

// --- INSERTAR DETALLEP ---
function insertarDetalleP(event) {
  event.preventDefault();
  let Prestamo = document.getElementById("prestamo").value;
  let Libro = document.getElementById("libro").value;
  let Cantidad = document.getElementById("cantidad").value;

  fetchConAuth(`${API}?accion=insertar_DetalleP`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "Prestamo=" + encodeURIComponent(Prestamo) + "&Libro=" + encodeURIComponent(document.getElementById("libroId").value) + "&Cantidad=" + encodeURIComponent(Cantidad)
  })
    .then(res => res.json())
    .then(data => {
          console.log("Respuesta registrar libro prestado:", data);
          Swal.fire({
              icon: data.status === "success" ? "success" : "error", 
              title: data.status === "success" ? "¡Éxito!" : "Error", text: data.message, confirmButtonText: "Aceptar",
              confirmButtonColor: "#4e73df",
              customClass: {popup: 'swal-pequeno'}
          })
          .then(() => {
            if (data.status === "success") {
              window.location.href = "DetalleP.html";
            }
          });
        })
    .catch(err => console.error("Error insertando libro prestado:", err));
}

function cargarLibrosDatalist() {
    fetchConAuth(`${API}?accion=listar_libro`)
        .then(res => res.json())
        .then(data => {
            const datalist = document.getElementById("listaLibros");
            data.forEach(libro => {
                const option = document.createElement("option");
                option.value = libro.Titulo;
                option.dataset.id = libro.Id_libro;
                datalist.appendChild(option);
            });

            // Cuando el usuario selecciona una opción, guarda el ID en el hidden
            document.getElementById("libro").addEventListener("input", function() {
                const opciones = datalist.querySelectorAll("option");
                opciones.forEach(op => {
                    if (op.value === this.value) {
                        document.getElementById("libroId").value = op.dataset.id;
                    }
                });
            });
        });
}

// --- CARGAR DATOS PARA MODIFICAR ---
function cargarDatosModificarDetalleP() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (id) {
        fetchConAuth(`${API}?accion=get_DetalleP&id=${id}`)
            .then(res => res.json())
            .then(data => {
                document.getElementById("id").value       = data.Id_detalle_prestamo;
                document.getElementById("prestamo").value = data.Prestamo;  // select por ID
                document.getElementById("cantidad").value = data.Cantidad;

                // Para el libro, primero carga el datalist y luego pon el título
                fetchConAuth(`${API}?accion=listar_libro`)
                    .then(res => res.json())
                    .then(libros => {
                        const libro = libros.find(l => l.Id_libro == data.Libro);
                        if (libro) {
                            document.getElementById("libro").value   = libro.Titulo;
                            document.getElementById("libroId").value = libro.Id_libro;
                        }
                    });
            })
            .catch(err => console.error("Error cargando datos:", err));
    }
}

// --- ELIMINAR DETALLE PRÉSTAMO ---
function eliminarDetalleP(id) {
  Swal.fire({
    icon: "warning", title: "¿Eliminar libro prestado?", text: "Esta acción no se puede deshacer.", showCancelButton: true, confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar",
    confirmButtonColor: "#4e73df",
    cancelButtonColor: "#e53935",
    customClass: { popup: 'swal-pequeno' }
  }).then((result) => {
    if (!result.isConfirmed) return;

    fetchConAuth(`${API}?accion=eliminar_DetalleP`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "Id_detalle_prestamo=" + encodeURIComponent(id)
    })
      .then(res => res.json())
      .then(data => {
        Swal.fire({
          icon: data.status === "success" ? "success" : "error",
          title: data.status === "success" ? "¡Eliminado!" : "Error",
          text: data.message, confirmButtonText: "Aceptar",
          confirmButtonColor: "#4e73df",
          customClass: { popup: 'swal-pequeno' }
        }).then(() => cargarDetalleP());
      })
      .catch(err => console.error("Error eliminando libro prestado:", err));
  });
}

// USUARIOS
function cargarUsuarios() {
  fetchConAuth(`${API}?accion=listar_Usuarios`)
    .then(res => res.json())
    .then(data => {
      const filas = data.map(dato => [
        dato.Id_Usuario,
        dato.Nombre_Usuario,
        dato.Contrasena,
        dato.PIN,
        dato.Token,

        `<a href="ModificarUsuarios.html?id=${dato.Id_Usuario}">
          <i class="fas fa-edit"></i><span class='d-none d-md-inline'>Modificar</span>
        </a>`,
        `<a href="#" onclick="eliminarUsuario(${dato.Id_Usuario}, this)">
          <i class="fas fa-trash"></i> <span class='d-none d-md-inline'>Eliminar</span>
        </a>`

      ]);
 
      if ($.fn.DataTable.isDataTable('#dataTableUsuarios')) {
        let tabla = $('#dataTableUsuarios').DataTable();
        tabla.clear();
        tabla.rows.add(filas).draw();
      } else {
        $('#dataTableUsuarios').DataTable({
          data: filas,
          columns: [
            { title: 'ID' },
            { title: 'Nombre' },
            { title: 'Contraseña' },
            { title: 'Pin' },
            { title: 'Token' },
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
    .catch(err => console.error("Error cargando usuarios:", err));
}

function insertarUsuario(event) {
  event.preventDefault();
  let nombre = document.getElementById("nombre").value;
  let contrasena = document.getElementById("contrasena").value;

  fetchConAuth(`${API}?accion=insertar_usuario`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "Nombre_Usuario=" + encodeURIComponent(nombre) + "&Contrasena=" + encodeURIComponent(contrasena)
  })
    .then(res => res.json())
    .then(data => {
      console.log("Respuesta registrar usuario:", data);
      Swal.fire({
          icon: data.status === "success" ? "success" : "error", 
          title: data.status === "success" ? "¡Éxito!" : "Error", text: data.message, confirmButtonText: "Aceptar",
          confirmButtonColor: "#4e73df",
          customClass: {popup: 'swal-pequeno'}
      })
      .then(() => {
        if (data.status === "success") {
          window.location.href = "Usuarios.html";
        }
      });
    })
    .catch(err => console.error("Error insertando usuario:", err));
}

function cargarDatosModificarUsuario() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
 
  if (id) {
    fetchConAuth(`${API}?accion=get_usuario&id=${id}`)
      .then(res => res.json())
      .then(data => {
        document.getElementById("id").value = data.Id_Usuario;
        document.getElementById("nombre").value = data.Nombre_Usuario;
        document.getElementById("contrasena").value = data.Contrasena;
      })
      .catch(err => console.error("Error cargando datos del usuario:", err));
  }
}

function eliminarUsuario(id) {
    Swal.fire({
        icon: "warning",
        title: "¿Eliminar usuario?",
        text: "Esta acción no se puede deshacer.",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#4e73df",
        cancelButtonColor: "#e53935",
        customClass: { popup: 'swal-pequeno' }
    }).then((result) => {
        if (!result.isConfirmed) return;
        fetchConAuth(`${API}?accion=eliminar_usuario`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "Id_Usuario=" + encodeURIComponent(id)
        })
        .then(res => res.json())
        .then(data => {
            Swal.fire({
                icon: data.status === "success" ? "success" : "error",
                title: data.status === "success" ? "¡Eliminado!" : "Error",
                text: data.message,
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#4e73df",
                customClass: { popup: 'swal-pequeno' }
            }).then(() => cargarUsuarios());
        })
        .catch(err => console.error("Error eliminando usuario:", err));
    });
}

// VISITAS
function cargarVisitas() {
  fetchConAuth(`${API}?accion=listar_Visitas`)
    .then(res => res.json())
    .then(data => {
      const filas = data.map(dato => [
        dato.Id_entrada_salida,
        dato.NE,               
        dato.NS,            
        dato.Fecha,
        dato.Hora_entrada,
        dato.Hora_salida,

        `<a href="#" onclick="eliminarVisitas(${dato.Id_entrada_salida}, this)">
           <i class="fas fa-trash"></i> <span class='d-none d-md-inline'>Eliminar</span>
         </a>`

      ]);
 
      if ($.fn.DataTable.isDataTable('#dataTableVisitas')) {
        let tabla = $('#dataTableVisitas').DataTable();
        tabla.clear();
        tabla.rows.add(filas).draw();
      } else {
        $('#dataTableVisitas').DataTable({
          data: filas,
          columns: [
            { title: 'ID' },
            { title: 'Estudiante' },
            { title: 'Servicio' },
            { title: 'Fecha' },
            { title: 'Hora de entrada' },
            { title: 'Hora de salida' },
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
    .catch(err => console.error("Error cargando historial de prestamos:", err));
}

// // --- ELIMINAR VISITAS ---
// function eliminarVisitas(id) {
//   Swal.fire({
//     icon: "warning", title: "¿Eliminar visita?", text: "Esta acción no se puede deshacer.", showCancelButton: true, confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar",
//     confirmButtonColor: "#4e73df",
//     cancelButtonColor: "#e53935",
//     customClass: { popup: 'swal-pequeno' }
//   }).then((result) => {
//     if (!result.isConfirmed) return;

//   fetchConAuth(`${API}?accion=eliminar_Visitas`, {
//     method: "POST",
//     headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     body: "Id_entrada_salida=" + encodeURIComponent(id)
//   })
//     .then(res => res.json())
//     .then(data => {
//       alert(data.message);
//       cargarVisitas();
//     })
//     .catch(err => console.error("Error eliminando visita:", err));
// }
//       .then(res => res.json())
//       .then(data => {
//         Swal.fire({
//           icon: data.status === "success" ? "success" : "error",
//           title: data.status === "success" ? "¡Eliminado!" : "Error",
//           text: data.message, confirmButtonText: "Aceptar",
//           confirmButtonColor: "#4e73df",
//           customClass: { popup: 'swal-pequeno' }
//         }).then(() => cargarVisitas());
//       })
//       .catch(err => console.error("Error eliminando visita:", err));
//   });
// }

// window.addEventListener("resize", () => {
//     graficarVisitas();
// });

// --- ELIMINAR VISITAS ---
function eliminarVisitas(id) {
  Swal.fire({
    icon: "warning",
    title: "¿Eliminar visita?",
    text: "Esta acción no se puede deshacer.",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#4e73df",
    cancelButtonColor: "#e53935",
    customClass: { popup: 'swal-pequeno' }
  }).then((result) => {
    if (!result.isConfirmed) return;

    fetchConAuth(`${API}?accion=eliminar_Visitas`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "Id_entrada_salida=" + encodeURIComponent(id)
    })
      .then(res => res.json())
      .then(data => {
        Swal.fire({
          icon: data.status === "success" ? "success" : "error",
          title: data.status === "success" ? "¡Eliminado!" : "Error",
          text: data.message,
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#4e73df",
          customClass: { popup: 'swal-pequeno' }
        }).then(() => cargarVisitas());
      })
      .catch(err => console.error("Error eliminando visita:", err));
  });
}

window.addEventListener("resize", () => {
  graficarVisitas();
});


document.addEventListener("DOMContentLoaded", () => {  
  cargarPartials();
  if (document.getElementById("dataTableCarreras")) cargarCarreras();
  if (document.getElementById("dataTableServicios")) cargarServicios();
  if (document.getElementById("dataTableEst")) cargarEstudiantes();
  if (document.getElementById("dataTablePrest")) cargarPrestamos();
  if (document.getElementById("dataTableLibros")) cargarLibros();
  if (document.getElementById("dataTableHistorialP")) cargarHistorialP();
  if (document.getElementById("dataTableDetalleP")) cargarDetalleP();
  if (document.getElementById("dataTableUsuarios")) cargarUsuarios();
  if (document.getElementById("dataTableVisitas")) cargarVisitas();
  if (document.getElementById("divGraficaGenero")) graficarGenero();
  if (document.getElementById("divGraficaVisitas")) graficarVisitas();
  if (document.getElementById("divGraficaVisitasServicio")) graficarVisitasServicio();

  const btnPIN = document.getElementById("btnPINSeguridad");
    $(document).on("click", "#btnPINSeguridad", function() {
        $('#modalPIN').modal('show');
    });

  document.addEventListener("click", function(event) {
    if (event.target && event.target.id === "guardarPIN") {
      manejarPIN();
      }
  });

  const fbToken = localStorage.getItem("FBToken");
  if (fbToken && typeof enviarToken === "function") {
      enviarToken(fbToken);
  }

  //Manejo de cajas
  const btnUsarPIN = document.getElementById("btnUsarPIN");
  if (btnUsarPIN) {
      btnUsarPIN.addEventListener("click", () => {
          document.getElementById("loginPassword").style.display = "none";
          document.getElementById("loginPIN").style.display = "block";
          document.getElementById("txtContrasena").value = "";
          document.getElementById("btnUsarPIN").style.display = "none";
          document.getElementById("btnUsarPassword").style.display = "block";
      });
  }

  const btnUsarPassword = document.getElementById("btnUsarPassword");
  if (btnUsarPassword) {
      btnUsarPassword.addEventListener("click", () => {
          document.getElementById("loginPassword").style.display = "block";
          document.getElementById("loginPIN").style.display = "none";
          document.getElementById("txtPIN").value = "";
          document.getElementById("btnUsarPassword").style.display = "none";
          document.getElementById("btnUsarPIN").style.display = "block";
      });
  }

  if (document.getElementById("insertarHistorialP")) {
      cargarPrestamosSelect();

      // Restricción de fecha: no permitir fechas pasadas
      const inputFecha = document.getElementById("fecha");
      if (inputFecha) {
          const hoy = new Date().toISOString().split("T")[0];
          inputFecha.min = hoy;
      }
  }

  if (document.getElementById("insertarDetalleP")) {
      cargarPrestamosSelect();
      cargarLibrosDatalist();
  }

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

  if (document.getElementById("modificarHistorialP")) {
      cargarDatosModificarHistorialP();
      cargarPrestamosSelect();

      const inputFecha = document.getElementById("fecha");
      if (inputFecha) {
          const hoy = new Date().toISOString().split("T")[0];
          inputFecha.min = hoy;
      }
  }

  if (document.getElementById("modificarDetalleP")) {
      cargarPrestamosSelect();
      cargarLibrosDatalist();  
      cargarDatosModificarDetalleP();
  }

  if (document.getElementById("modificarUsuarios")) {
      cargarDatosModificarUsuario();
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

  const formInsertarHistorialP = document.getElementById("insertarHistorialP");
  if (formInsertarHistorialP) {
    formInsertarHistorialP.addEventListener("submit", insertarHistorialP);
  }  

  const formInsertarDetalleP = document.getElementById("insertarDetalleP");
  if (formInsertarDetalleP) {
    formInsertarDetalleP.addEventListener("submit", insertarDetalleP);
  } 

  const formInsertarUsuario = document.getElementById("insertarUsuario");
  if (formInsertarUsuario) {
    formInsertarUsuario.addEventListener("submit", insertarUsuario);
  } 
  
  const formModificar = document.getElementById("modificarCarr");
  if (formModificar) {
    formModificar.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!$(this).valid()) return;
      let id = document.getElementById("id").value;
      let nombre = document.getElementById("nombre").value;

      fetchConAuth(`${API}?accion=modificar`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "Id_carrera=" + encodeURIComponent(id) + "&Nombre=" + encodeURIComponent(nombre)
      })
        .then(res => res.json())
        .then(data => {
            Swal.fire({
                icon: data.status === "success" ? "success" : "error", 
                title: data.status === "success" ? "¡Éxito!" : "Error", text: data.message, confirmButtonText: "Aceptar",
                confirmButtonColor: "#4e73df",
                customClass: { popup: 'swal-pequeno' }
            }).then(() => {
                if (data.status === "success") {
                    window.location.href = "Carreras.html";
                }
            });
        })
        .catch(err => console.error("Error modificando carrera:", err));
    });
  }

  const formModificarSrv = document.getElementById("modificarSrv");
  if (formModificarSrv) {
    formModificarSrv.addEventListener("submit", function(event) {
      event.preventDefault();
      if (!$(this).valid()) return;
      let id     = document.getElementById("id").value;
      let nombre = document.getElementById("nombreSrv").value;

      fetchConAuth(`${API}?accion=modificar_servicio`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "Id_servicio=" + encodeURIComponent(id) + "&Nombre=" + encodeURIComponent(nombre)
      })
        .then(res => res.json())
        .then(data => {
            Swal.fire({
                icon: data.status === "success" ? "success" : "error", 
                title: data.status === "success" ? "¡Éxito!" : "Error", text: data.message, confirmButtonText: "Aceptar",
                confirmButtonColor: "#4e73df",
                customClass: { popup: 'swal-pequeno' }
            }).then(() => {
                if (data.status === "success") {
                    window.location.href = "Servicios.html";
                }
            });
        })
        .catch(err => console.error("Error modificando servicio:", err));
    });
  }

  const formModificarPrestamo = document.getElementById("modificarPrestamo");
  if (formModificarPrestamo) {
      formModificarPrestamo.addEventListener("submit", modificarPrestamos);
  }

  const formModificarLib = document.getElementById("modificarLibros");
  if (formModificarLib) {
    formModificarLib.addEventListener("submit", function(event) {
      event.preventDefault();
      if (!$(this).valid()) return;
      let id = document.getElementById("id").value;
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

      fetchConAuth(`${API}?accion=modificar_libro`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "Id_libro=" + encodeURIComponent(id) +"&Titulo=" + encodeURIComponent(Titulo) + "&Fecha_edicion=" + encodeURIComponent(Fecha_edi) + "&Autores=" + encodeURIComponent(Autores) + "&Responsable_custodia=" + encodeURIComponent(Res_cus) + "&Departamento_responsable=" + encodeURIComponent(Dep_res) + "&Tipo=" + encodeURIComponent(Tipo) + "&Editora=" + encodeURIComponent(Editora) + "&ISBN=" + encodeURIComponent(ISBN) + "&Area=" + encodeURIComponent(Area) + "&Cantidad=" + encodeURIComponent(Cantidad)

      })
        .then(res => res.json())
        .then(data => {
            Swal.fire({
                icon: data.status === "success" ? "success" : "error", 
                title: data.status === "success" ? "¡Éxito!" : "Error", text: data.message, confirmButtonText: "Aceptar",
                confirmButtonColor: "#4e73df",
                customClass: { popup: 'swal-pequeno' }
            }).then(() => {
                if (data.status === "success") {
                    window.location.href = "Libros.html";
                }
            });
        })
        .catch(err => console.error("Error modificando libro:", err));
    });
  }

  const formModificarHistorialP = document.getElementById("modificarHistorialP");
  if (formModificarHistorialP) {
    formModificarHistorialP.addEventListener("submit", function(event) {
      event.preventDefault();
      if (!$(this).valid()) return;
      let id = document.getElementById("id").value;
      let Prestamo = document.getElementById("prestamo").value;
      let Descripcion = document.getElementById("descripcion").value;
      let Fecha = document.getElementById("fecha").value;
      let Estado = document.getElementById("estado").value;
      
      fetchConAuth(`${API}?accion=modificar_HistorialP`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "Id_historial=" + encodeURIComponent(id) + "&Prestamo=" + encodeURIComponent(Prestamo) + "&Descripcion=" + encodeURIComponent(Descripcion) + "&Fecha=" + encodeURIComponent(Fecha) + "&Estado=" + encodeURIComponent(Estado)
      })
        .then(res => res.json())
        .then(data => {
            Swal.fire({
                icon: data.status === "success" ? "success" : "error", 
                title: data.status === "success" ? "¡Éxito!" : "Error", text: data.message, confirmButtonText: "Aceptar",
                confirmButtonColor: "#4e73df",
                customClass: { popup: 'swal-pequeno' }
            }).then(() => {
                if (data.status === "success") {
                    window.location.href = "HistorialP.html";
                }
            });
        })
        .catch(err => console.error("Error modificando reporte de daños:", err));
    });
  }

  const formModificarDetalleP = document.getElementById("modificarDetalleP");
  if (formModificarDetalleP) {
    formModificarDetalleP.addEventListener("submit", function(event) {
      event.preventDefault();
      if (!$(this).valid()) return;
      let id = document.getElementById("id").value;
      let Prestamo = document.getElementById("prestamo").value;
      let Libro = document.getElementById("libro").value;
      let Cantidad = document.getElementById("cantidad").value;
      
      fetchConAuth(`${API}?accion=modificar_DetalleP`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "Id_detalle_prestamo=" + encodeURIComponent(id) + "&Prestamo=" + encodeURIComponent(Prestamo) + "&Libro=" + encodeURIComponent(document.getElementById("libroId").value) + "&Cantidad=" + encodeURIComponent(Cantidad)
      })
        .then(res => res.json())
        .then(data => {
            Swal.fire({
                icon: data.status === "success" ? "success" : "error", 
                title: data.status === "success" ? "¡Éxito!" : "Error", text: data.message, confirmButtonText: "Aceptar",
                confirmButtonColor: "#4e73df",
                customClass: { popup: 'swal-pequeno' }
            }).then(() => {
                if (data.status === "success") {
                    window.location.href = "DetalleP.html";
                }
            });
        })
        .catch(err => console.error("Error modificando libro prestado:", err));
    });
  }

  const formModificarUsuario = document.getElementById("modificarUsuarios");
  if (formModificarUsuario) {
    formModificarUsuario.addEventListener("submit", function(event) {
      event.preventDefault();
      if (!$(this).valid()) return;
      let id     = document.getElementById("id").value;
      let nombre = document.getElementById("nombre").value;
      let contrasena = document.getElementById("contrasena").value;

      fetchConAuth(`${API}?accion=modificar_usuario`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "Id_Usuario=" + encodeURIComponent(id) + "&Nombre_Usuario=" + encodeURIComponent(nombre) + "&Contrasena=" + encodeURIComponent(contrasena)
      })
        .then(res => res.json())
        .then(data => {
            Swal.fire({
                icon: data.status === "success" ? "success" : "error", 
                title: data.status === "success" ? "¡Éxito!" : "Error", text: data.message, confirmButtonText: "Aceptar",
                confirmButtonColor: "#4e73df",
                customClass: { popup: 'swal-pequeno' }
            }).then(() => {
                if (data.status === "success") {
                    window.location.href = "Usuarios.html";
                }
            });
        })
        .catch(err => console.error("Error modificando usuario:", err));
    });
  }

if (document.getElementById("cardEntradas")) {
    cargarTotales();
}
});
