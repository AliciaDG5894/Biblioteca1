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

$.validator.addMethod("multipleSpaces", function (value, element) {
    return this.optional(element) || /^(?!.*\s{2,}).*$/i.test(value.toLowerCase())
}, "Por favor, no ingrese múltiples espacios");


// Validación del formulario
$("#modificarEst").validate({
    errorClass: "v_error",
    validClass: "v_correcto",
    messages: {
        matricula: {
            required: "Por favor, llene este campo",
            minlength: "Por favor, ingrese más de 8 caracteres",
            maxlength: "Por favor, no ingrese más de 8 caracteres",
            numeros: "Por favor, ingresa solo números",
            noSpaces: "Por favor, no ingrese espacios",
            integer: "Por favor, solo ingrese números enteros"
        },
        nombre: {
            required: "Por favor, llene este campo",
            minlength: "Por favor, ingrese más de 10 caracteres",
            maxlength: "Por favor, no ingrese más de 50 caracteres",
            letters: "Por favor, ingrese solo ingrese letras",
            multipleSpaces: "Por favor, no ingrese múltiples espacios"
        },
        grado: {
            required: "Por favor, llene este campo",
            minlength: "Por favor, ingrese más de 1 caracter",
            maxlength: "Por favor, no ingrese más de 2 caracteres",
            max: "Por favor, no ingrese un número mayor a 11",
            numeros: "Por favor, ingresa solo números",
            noSpaces: "Por favor, no ingrese espacios",
            integer: "Por favor, solo ingrese números enteros"
        },
        seccion: {
            required: "Por favor, llene este campo",
            minlength: "Por favor, ingrese más de 1 caracter",
            maxlength: "Por favor, no ingrese más de 1 caracter",
            letters: "Por favor, ingrese solo letras",
            noSpaces: "Por favor, no ingrese espacios"
        },
        genero: {
            required: "Por favor, llene este campo",
            minlength: "Por favor, ingrese más de 1 caracter",
            maxlength: "Por favor, no ingrese más de 1 caracter",
            letters: "Por favor, ingrese solo letras",
            noSpaces: "Por favor, no ingrese espacios"
        },
        carrera: {
            required: "Por favor, llene este campo",
            minlength: "Por favor, ingrese más de 10 caracteres",
            maxlength: "Por favor, no ingrese más de 100 caracteres",
            letters: "Por favor, ingrese solo letras"
        },
        contacto: {
            required: "Por favor, llene este campo",
            minlength: "Por favor, ingrese más de 10 caracteres",
            maxlength: "Por favor, no ingrese más de 50 caracteres",
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
