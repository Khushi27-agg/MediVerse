---
name: Backend binding fix
description: Express servers must bind to 0.0.0.0 (not "localhost") for Replit workflow port health checks to pass.
---

## Rule
Call `app.listen(PORT)` without a host argument (or explicitly `"0.0.0.0"`). Never pass `"localhost"` as the host.

**Why:** The Replit workflow health checker verifies the port is open by connecting from outside the process. When bound to `127.0.0.1`/`"localhost"` only, the check times out and the workflow is marked FAILED even though the server actually started correctly (you can see it in the logs).

**How to apply:** Any new Express/Fastify/etc. backend in this project — omit the host argument from the listen call so Node defaults to 0.0.0.0. The Vite proxy (`proxy: { '/api': 'http://localhost:8080' }`) still works fine because the proxy connects from the same machine.
