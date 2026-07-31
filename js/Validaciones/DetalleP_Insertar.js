$.validator.addMethod("numeros", function(value, element) {
    return this.optional(element) || /^[0-9.]+$/.test(value);
}, "Por favor, ingresa solo números.");

$.validator.addMethod("integer", function(value, element) {
    return this.optional(element) || /^\d+$/.test(value);
}, "Por favor, ingresa un número entero.");

$.validator.addMethod("noSpaces", function (value, element) {
    return this.optional(element) || /^\S*$/i.test(value.toLowerCase())
}, "Por favor, no ingrese espacios");

// Validación del formulario
$("#insertarDetalleP").validate({
    errorClass: "v_error",
    validClass: "v_correcto",
    messages: {
        prestamo: {
            required: "Por favor, seleccione un préstamo"
        },
        libro: {
            required: "Por favor, seleccione un libro"
        },
        cantidad: {
            required: "Por favor, llene este campo",
            minlength: "Por favor, ingrese más de 1 caracter",
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
