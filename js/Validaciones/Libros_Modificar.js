// Agregar nuevas validaciones personalizadas
$.validator.addMethod("email", function(value, element) {
    return this.optional(element) || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(value);
}, "Por favor, ingrese un correo válido");

$.validator.addMethod("numeros", function(value, element) {
    return this.optional(element) || /^[0-9.]+$/.test(value);
}, "Por favor, ingresa solo números");

$.validator.addMethod("endsWithDotZeroZero", function(value, element) {
    return this.optional(element) || /^[0-9]+\.00$/.test(value);
}, "Por favor, ingresa un número que termine en .00");

$.validator.addMethod("decimal", function(value, element) {
    return this.optional(element) || /^[0-9]*\.?[0-9]+$/.test(value);
}, "Por favor, ingresa un número válido");

$.validator.addMethod("integer", function(value, element) {
    return this.optional(element) || /^\d+$/.test(value);
}, "Por favor, ingresa un número entero");

$.validator.addMethod("multipleSpaces", function (value, element) {
    return this.optional(element) || /^(?!.*\s{2,}).*$/i.test(value.toLowerCase())
}, "Por favor, no ingrese múltiples espacios");

$.validator.addMethod("noSpaces", function (value, element) {
    return this.optional(element) || /^\S*$/i.test(value.toLowerCase())
}, "Por favor, no ingrese espacios");

$.validator.addMethod("letters", function (value, element) {
    return this.optional(element) || /^[a-záéíóúñ ]+$/i.test(value.toLowerCase())
}, "Por favor, ingrese solo letras");

$.validator.addMethod("alphanumeric", function (value, element) {
    return this.optional(element) || /^[0-9a-záéíóúñ]+$/i.test(value.toLowerCase())
}, "Por favor, solo ingrese letras y números");

$.validator.addMethod("letrasYCaracteres", function(value, element) {
  return this.optional(element) || /^[a-záéíóúüñ .\-_]+$/i.test(value);
}, "Por favor, solo se permiten letras, espacios, punto, guiones");


// Validación del formulario
$("#modificarLib").validate({
    errorClass: "v_error", // Estilo para errores
    validClass: "v_correcto",   // Estilo para válidos
    messages: {
        titulo: {
            required: "Por favor, llene este campo",
            minlength: "Por favor, ingrese más de 3 caracteres",
            maxlength: "Por favor, no ingrese más de 200 caracteres",
            multipleSpaces: "Por favor, no ingrese múltiples espacios"
        },
        fecha_edi: {
            required: "Por favor, llene este campo",
            minlength: "Por favor, ingrese más de 4 caracteres",
            maxlength: "Por favor, no ingrese más de 30 caracteres",
            multipleSpaces: "Por favor, no ingrese múltiples espacios"
        },
        autores: {
            required: "Por favor, llene este campo",
            minlength: "Por favor, ingrese más de 5 caracteres",
            maxlength: "Por favor, no ingrese más de 200 caracteres",
            multipleSpaces: "Por favor, no ingrese múltiples espacios",
            letrasYCaracteres: "Por favor, solo se permiten letras, espacios, punto, guiones"
        },
        res_cus: {
            required: "Por favor, llene este campo",
            minlength: "Por favor, ingrese más de 10 caracteres",
            maxlength: "Por favor, no ingrese más de 200 caracteres",
            multipleSpaces: "Por favor, no ingrese múltiples espacios",
            letrasYCaracteres: "Por favor, solo se permiten letras, espacios, punto, guiones"
        },
        dep_res: {
            required: "Por favor, llene este campo",
            minlength: "Por favor, ingrese más de 5 caracteres",
            maxlength: "Por favor, no ingrese más de 100 caracteres",
            multipleSpaces: "Por favor, no ingrese múltiples espacios",
            letters: "Por favor, ingrese solo letras"
        },
        estado: {
            required: "Por favor, llene este campo"
        },
        tipo: {
            required: "Por favor, llene este campo",
            minlength: "Por favor, ingrese más de 5 caracteres",
            maxlength: "Por favor, no ingrese más de 50 caracteres",
            multipleSpaces: "Por favor, no ingrese múltiples espacios",
            letters: "Por favor, ingrese solo letras"
        },
        editora: {
            required: "Por favor, llene este campo",
            minlength: "Por favor, ingrese más de 5 caracteres",
            maxlength: "Por favor, no ingrese más de 50 caracteres",
            multipleSpaces: "Por favor, no ingrese múltiples espacios",
            letrasYCaracteres: "Por favor, solo se permiten letras, espacios, punto, guiones"
        },
        isbn: {
            required: "Por favor, llene este campo",
            minlength: "Por favor, ingrese más de 1 caracteres",
            maxlength: "Por favor, no ingrese más de 20 caracteres",
            noSpaces: "Por favor, no ingrese espacios",
            integer: "Por favor, ingresa un número entero"
        },
        area: {
            required: "Por favor, llene este campo",
            minlength: "Por favor, ingrese más de 5 caracteres",
            maxlength: "Por favor, no ingrese más de 50 caracteres",
            letters: "Por favor, ingrese solo letras"
        },
        cantidad: {
            required: "Por favor, llene este campo",
            minlength: "Por favor, ingrese más de 1 caracteres",
            maxlength: "Por favor, no ingrese más de 5 caracteres",
            noSpaces: "Por favor, no ingrese espacios",
            numeros: "Por favor, ingresa solo números",
            integer: "Por favor, ingresa un número entero"
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
