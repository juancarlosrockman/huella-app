# HUELLA — beta técnica para Cloudflare Workers + D1

HUELLA es una PWA React/Vite servida por Cloudflare Workers. Usa Wrangler 4.20.0 o posterior para admitir el enrutamiento selectivo `assets.run_worker_first`. Esta versión agrega una API inicial conectada a D1 para probar persistencia de acciones.

## Preparación
1. `npm install`
2. Crear una base Cloudflare D1 llamada `huella-db`.
3. Ejecutar `schema.sql` en la consola D1.
4. Reemplazar `REPLACE_WITH_D1_DATABASE_ID` en `wrangler.jsonc` por el ID real de la base.
5. Vincular D1 al Worker con variable de binding `DB`.
6. `npm run build`; desplegar desde la integración Cloudflare/GitHub o con `npm run deploy` tras revisar configuración.

## API disponible
- `GET /api/health`: estado del Worker y si existe binding D1.
- `GET /api/actions`: lista las acciones asociadas al identificador de dispositivo del navegador.
- `POST /api/actions`: crea una acción (1–250 caracteres).
- `DELETE /api/actions/:id`: elimina una acción del mismo identificador de dispositivo.
- `GET /api/community`: recuentos diarios de acciones registradas.

## Límite crítico de seguridad
Esta es una beta técnica, NO un sistema de cuentas. El identificador aleatorio de dispositivo se guarda en localStorage y se envía al Worker; no es autenticación fuerte y puede perderse o ser suplantado. No guardar datos sensibles ni anunciar la bitácora como segura/privada. Antes de uso público hay que implementar autenticación real, autorización por usuario, controles de abuso/rate limiting y pruebas de seguridad.

Testimonios no se reciben ni publican todavía; no existe panel de moderación. No hay sincronización offline ni modo católico funcional. El contador actual es por registros/dispositivos, no por personas verificadas.
