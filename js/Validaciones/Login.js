$.validator.addMethod("noSpaces", function(value, element) {
    return this.optional(element) || /^\S*$/i.test(value);
}, "Por favor, no ingrese espacios");

$.validator.addMethod("multipleSpaces", function (value, element) {
    return this.optional(element) || /^(?!.*\s{2,}).*$/i.test(value.toLowerCase())
}, "Por favor, no ingrese múltiples espacios");


$("#frmLogin").validate({
    errorClass: "v_error",
    validClass: "v_correcto",
    rules: {
        txtUsuario: {
            required: true,
            minlength: 10,
            maxlength: 50,
            multipleSpaces: true
        },
        txtContrasena: {
            required: function() {
                return $("#loginPassword").is(":visible");
            },
            minlength: 3,
            maxlength: 20,
            noSpaces: true
        },
        txtPIN: {
            required: function() {
                return $("#loginPIN").is(":visible");
            },
            minlength: 4,
            maxlength: 4
        }
    },
    messages: {
        txtUsuario: {
            required: "Por favor, ingrese su usuario",
            minlength: "El usuario debe tener al menos 10 caracteres",
            maxlength: "El usuario no puede tener más de 50 caracteres",
            multipleSpaces: "Por favor, no ingrese múltiples espacios"
        },
        txtContrasena: {
            required: "Por favor, ingrese su contraseña",
            minlength: "La contraseña debe tener al menos 5 caracteres",
            maxlength: "La contraseña no puede tener más de 20 caracteres",
            noSpaces: "Por favor, no ingrese espacios"
        },
        txtPIN: {
            required: "Por favor, ingrese su PIN",
            minlength: "El PIN debe tener exactamente 4 dígitos",
            maxlength: "El PIN debe tener exactamente 4 dígitos"
        }
    },
    errorPlacement: function(error, element) {
        error.addClass('text-danger');
        element.closest('.input-group').after(error);
    },
    highlight: function(element, errorClass, validClass) {
        $(element).removeClass(validClass).addClass(errorClass);
    },
    unhighlight: function(element, errorClass, validClass) {
        $(element).removeClass(errorClass).addClass(validClass);
    }
});