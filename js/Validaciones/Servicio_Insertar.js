$.validator.addMethod("multipleSpaces", function (value, element) {
    return this.optional(element) || /^(?!.*\s{2,}).*$/i.test(value.toLowerCase())
}, "Por favor, no ingrese múltiples espacios");

$.validator.addMethod("letters", function (value, element) {
    return this.optional(element) || /^[a-záéíóúñ ]+$/i.test(value.toLowerCase())
}, "Por favor, ingrese solo letras");

// Validación del formulario
$("#insertarSrv").validate({
    errorClass: "v_error",
    validClass: "v_correcto",
    messages: {
        nombre: {
            required: "Por favor, llene este campo",
            minlength: "Por favor, ingrese más de 10 caracteres",
            maxlength: "Por favor, no ingrese más de 50 caracteres",
            multipleSpaces: "Por favor, no ingrese múltiples espacios",
            letters: "Por favor, ingrese solo letras"
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
