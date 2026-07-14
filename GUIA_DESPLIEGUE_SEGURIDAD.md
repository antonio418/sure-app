# Guía de despliegue — Cambios de seguridad

Sigue los pasos **en este orden**. El SQL de Supabase va al final, no antes.

---

## Paso 1 — Probar en local (antes de subir nada)

En una terminal, dentro de la carpeta del proyecto (`sure-app`):

```
npm run dev
```

Abre `http://localhost:3000` y comprueba:

- **Panel VIP** (`/admin/vip`): crear y borrar un cupón funciona (con tu sesión iniciada).
- **Plan de contingencia** (`/rma/plan/<algún-id>`): la página carga el plan con normalidad.
- **Escáner de admin** (`/admin/rma`): subir un PDF funciona; si subes un archivo raro (por ejemplo un .zip) debe rechazarlo.

Si algo falla estando con sesión, páramelo y lo reviso antes de continuar.

---

## Paso 2 — Subir el código a producción

En la misma terminal (los 3 comandos, uno por uno):

```
git add -A
git commit -m "Seguridad: proteger vip-tokens, servir planes desde backend, endurecer registro y subidas"
git push
```

Qué hace cada uno:

- `git add -A` → marca todos los archivos cambiados para guardarlos.
- `git commit -m "..."` → guarda una "foto" de esos cambios con un título.
- `git push` → los envía a GitHub. Vercel detecta el cambio y despliega solo.

> Si usas **GitHub Desktop** en vez de la terminal: pega el título del commit
> ("Seguridad: proteger vip-tokens...") en el campo *Summary*, pulsa
> **Commit to main** y luego **Push origin**. Es lo mismo.

---

## Paso 3 — Esperar el despliegue y verificar

1. En Vercel → pestaña **Deployments**, espera a que el último aparezca como **Ready**.
2. Abre en el navegador un plan de producción (`https://sureforensic.com/rma/plan/<id>`)
   y confirma que **carga correctamente**. Esto es importante hacerlo ANTES del paso 4.

---

## Paso 4 — Ejecutar el SQL en Supabase (solo después del paso 3)

Este paso quita la lectura pública de la tabla de planes. Hay que hacerlo **después**
de que el nuevo código esté desplegado (si se hace antes, la web dejaría de leer los planes).

1. Entra a tu proyecto en Supabase → **SQL Editor** → **New query**.
2. Pega y ejecuta este script:

```sql
-- Quitar la lectura pública de los planes de contingencia.
-- Ahora los planes se leen desde el backend (/api/rma/get-plan) con Service Role.

DROP POLICY IF EXISTS "Allow public read access to plans by ID" ON public.contingency_plans;

REVOKE SELECT ON TABLE public.contingency_plans FROM anon;
```

3. Vuelve a abrir un plan en producción y confirma que **sigue cargando**.
   (El backend lo lee con Service Role, así que debe funcionar igual.)

> El mismo script está guardado en el proyecto como `supabase_contingency_plans_lock.sql`.

---

## Resultado

Tras estos pasos quedan cerrados: protección de `vip-tokens`, lectura de planes
solo desde el backend, registro con límite de intentos y validación, y validación
de tipo/tamaño en las subidas de archivos.

Pendientes futuros (sin urgencia): blindaje total de subidas (URLs firmadas) y,
cuando definas el cobro real de RMA, enforcar el pago en el servidor.
