$.validator.addMethod("noSpaces", function (value, element) {
    return this.optional(element) || /^\S*$/i.test(value.toLowerCase())
}, "Por favor, no ingrese espacios");

$.validator.addMethod("alphanumeric", function (value, element) {
    return this.optional(element) || /^[0-9a-záéíóúñ]+$/i.test(value.toLowerCase())
}, "Por favor, solo ingrese letras y números");

$.validator.addMethod("email", function(value, element) {
    return this.optional(element) || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(value);
}, "Por favor, ingrese un correo válido");

// Validación del formulario
$("#modificarUsuarios").validate({
    errorClass: "v_error",
    validClass: "v_correcto",
    messages: {
        nombre: {
            required: "Por favor, llene este campo",
            minlength: "Por favor, ingrese más de 3 caracteres",
            maxlength: "Por favor, no ingrese más de 50 caracteres",
            noSpaces: "Por favor, no ingrese espacios",
            alphanumeric: "Por favor, solo ingrese letras y números"
        },
        contrasena: {
            required: "Por favor, llene este campo",
            minlength: "Por favor, ingrese más de 6 caracteres",
            maxlength: "Por favor, no ingrese más de 20 caracteres",
            noSpaces: "Por favor, no ingrese espacios"
        },
        tipo: {
            required: "Por favor, llene este campo"
        }
    },
    errorPlacement: function(error, element) {
        error.addClass('text-danger');
        element.after(error);
    },
    highlight: function(element, errorClass, validClass) {
        $(element).removeClass(validClass).addClass(errorClass);
    },
    unhighlight: function(element, errorClass, validClass) {
        $(element).removeClass(errorClass).addClass(validClass);
    }
});
