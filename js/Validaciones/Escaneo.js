document.getElementById("matricula").addEventListener("input", function() {
    const valor = this.value.trim();
    
    // Solo números
    if (!/^\d*$/.test(valor)) {
        this.value = valor.replace(/\D/g, "");
        return;
    }
    
    if (valor.length >= 8) {
        // Validar que sean exactamente 8 dígitos
        if (valor.length > 8) {
            this.value = valor.substring(0, 8);
            return;
        }
        const matricula = this.value;
        this.value = "";
        verificarEstudiante(matricula);
    }
});