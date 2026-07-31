$.validator.addMethod("numeros", function(value, element) {
    return this.optional(element) || /^[0-9.]+$/.test(value);
}, "Por favor, ingresa solo números.");

$.validator.addMethod("integer", function(value, element) {
    return this.optional(element) || /^\d+$/.test(value);
}, "Por favor, ingresa un número entero.");

$.validator.addMethod("noSpaces", function (value, element) {
    return this.optional(element) || /^\S*$/i.test(value.toLowerCase())
}, "Por favor, no ingrese espacios");

$.validator.addMethod("letters", function (value, element) {
    return this.optional(element) || /^[a-záéíóúñ ]+$/i.test(value.toLowerCase())
}, "Por favor, ingrese solo letras");

$.validator.addMethod("alphanumeric", function (value, element) {
    return this.optional(element) || /^[0-9a-záéíóúñ]+$/i.test(value.toLowerCase())
}, "Por favor, solo ingrese letras y números");

// Validación del formulario
$("#insertarEstudiante").validate({
    errorClass: "v_error",
    validClass: "v_correcto",
    messages: {
        matricula: {
            required: "Por favor, llene este campo",
            minlength: "Por favor, ingrese más de 8 caracteres",
            maxlength: "Por favor, no ingrese más de 20 caracteres",
            numeros: "Por favor, ingresa solo números",
            noSpaces: "Por favor, no ingrese espacios",
            integer: "Por favor, ingresa un número entero"
        },
        nombre: {
            required: "Por favor, llene este campo",
            minlength: "Por favor, ingrese más de 10 caracteres",
            maxlength: "Por favor, no ingrese más de 50 caracteres",
            letters: "Por favor, ingrese solo letras"
        },
        grado: {
            required: "Por favor, llene este campo",
            minlength: "Por favor, ingrese más de 1 caracter",
            maxlength: "Por favor, no ingrese más de 2 caracteres",
            numeros: "Por favor, ingresa solo números",
            noSpaces: "Por favor, no ingrese espacios",
            integer: "Por favor, ingresa un número entero"
        },
        seccion: {
            required: "Por favor, llene este campo",
            minlength: "Por favor, ingrese más de 1 caracter",
            maxlength: "Por favor, no ingrese más de 2 caracteres",
            letters: "Por favor, ingrese solo letras",
            noSpaces: "Por favor, no ingrese espacios"
        },
        genero: {
            required: "Por favor, llene este campo",
            minlength: "Por favor, ingrese más de 1 caracter",
            maxlength: "Por favor, no ingrese más de 2 caracteres",
            letters: "Por favor, ingrese solo letras",
            noSpaces: "Por favor, no ingrese espacios"
        },
        carrera: {
            required: "Por favor, llene este campo",
            maxlength: "Por favor, no ingrese más de 100 caracteres",
            letters: "Por favor, ingrese solo letras",
            noSpaces: "Por favor, no ingrese espacios"
        },
        contacto: {
            required: "Por favor, llene este campo",
            minlength: "Por favor, ingrese más de 10 caracteres",
            maxlength: "Por favor, no ingrese más de 50 caracteres",
            alphanumeric: "Por favor, solo ingrese letras y números",
            noSpaces: "Por favor, no ingrese espacios"
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
