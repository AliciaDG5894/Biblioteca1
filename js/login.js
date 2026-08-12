const API = "https://sure-entirely-believes-recreational.trycloudflare.com/test/api/index.php";

let modalErrorLogin = null;
if (document.getElementById("exampleModal")) {
    modalErrorLogin = new bootstrap.Modal("#exampleModal", {
        keyboard: false
    });
}

document.addEventListener("DOMContentLoaded", () => {
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

    const params = new URLSearchParams(location.search);
    const qrToken = params.get("QRToken");

    if (qrToken) {
        const jwtExistente = localStorage.getItem("jwt");
        if (jwtExistente && jwtExistente.startsWith("eyJ")) {
            confirmarTokenQR(qrToken, jwtExistente);
            return;
        }
    }

    $("#frmLogin").on("submit", function (event) {
        event.preventDefault();

        $.post(`${API}?iniciarSesion`, $(this).serialize(), function (respuesta) {
            respuesta = (respuesta || "").trim();

            if (respuesta === "error" || !respuesta.startsWith("eyJ")) {
                if (modalErrorLogin) modalErrorLogin.show();
                return;
            }

            localStorage.setItem("jwt", respuesta);

            const fbToken = localStorage.getItem("FBToken");
            if (fbToken && typeof enviarToken === "function") {
                enviarToken(fbToken);
            }

            if (qrToken) {
                confirmarTokenQR(qrToken, respuesta);
            } else {
                window.location = "../index.html";
            }
        });
    });

    if (!qrToken) {
        $(document).on("click", "#btnUsarQR", function () {
            $("#modalQR").modal("show");
            $("#divQR").html("<p>Cargando QR...</p>");

            $.get(API + "?qrIniciarSesion", function (qr) {
                if (typeof qr === "string") qr = JSON.parse(qr);

                $("#divQR").html(`<img src="${qr.src}" class="img-fluid" alt="Código QR">`);

                const qrTokenGenerado = qr.token;
                detenerPollingQR();

                qrPollingInterval = setInterval(() => {
                    $.post(`${API}?iniciarSesion&QRToken=${qrTokenGenerado}`, function (jwt) {
                        jwt = (jwt || "").trim();
                        if (jwt && jwt !== "error" && jwt.startsWith("eyJ")) {
                            detenerPollingQR();
                            localStorage.setItem("jwt", jwt);
                            window.location = "../index.html";
                        }
                    });
                }, 3000);

                qrPollingTimeout = setTimeout(() => {
                    detenerPollingQR();
                    $("#divQR").append("<p class='text-muted mt-2'>El código expiró, vuelve a intentarlo.</p>");
                }, 120000);
            });
        });

        $("#modalQR").on("hidden.bs.modal", function () {
            detenerPollingQR();
        });
    }
});

let qrPollingInterval = null;
let qrPollingTimeout  = null;

function detenerPollingQR() {
    if (qrPollingInterval) { clearInterval(qrPollingInterval); qrPollingInterval = null; }
    if (qrPollingTimeout)  { clearTimeout(qrPollingTimeout); qrPollingTimeout = null; }
}

function confirmarTokenQR(qrToken, jwt) {
    $.ajax({
        url: `${API}?confirmarQR`,
        method: "POST",
        data: { QRToken: qrToken },
        headers: { "Authorization": "Bearer " + jwt },
        success: function (r) {
            r = typeof r === "string" ? JSON.parse(r) : r;
            if (r.status === "ok") {
                $("body").html(`
                    <div class="text-center mt-5">
                        <h3>✅ Sesión confirmada</h3>
                        <p>Ya puedes volver a tu computadora.</p>
                    </div>
                `);
            } else {
                $("body").html(`
                    <div class="text-center mt-5">
                        <h3>❌ No se pudo confirmar</h3>
                        <p>${r.message}</p>
                    </div>
                `);
            }
        },
        error: function () {
            alert("Error al confirmar. Intenta de nuevo.");
        }
    });
}
