
import { describe, it, expect, vi, afterEach } from 'vitest';

function obtenerNombreUsuario() {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return null;

    try {
        const payloadBase64 = jwt.split(".")[1];
        const payload = JSON.parse(
            atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"))
        );
        const partes = payload.sub.split("|");
        return partes[1];
    } catch (error) {
        return null;
    }
}

describe('obtenerNombreUsuario', () => {
    afterEach(() => {
        localStorage.clear();
    });

    it('devuelve null si no existe un token', () => {
        expect(obtenerNombreUsuario()).toBeNull();
    });

    it('obtiene el nombre del token JWT', () => {
        const payload = btoa(JSON.stringify({
            sub: '123|Alicia'
        }));

        localStorage.setItem('jwt', `header.${payload}.firma`);

        expect(obtenerNombreUsuario()).toBe('Alicia');
    });
});
