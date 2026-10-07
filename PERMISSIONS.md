# Permission declaration

Candidate publisher: `openclaw-owner-governance`.

- Read the five exact plugin configuration values.
- Connect only to `/var/run/openclaw-controller/authoritative-state.sock`.
- Read host-attested active process identity through the plugin-service context.
- Register one long-lived service, two Gateway methods, and two fail-closed gates.
- Use `operator.read` for status and `operator.admin` plus authenticated owner profile and live client authority for mutation.

No agent tool, shell, network, database, cron, credential-store, filesystem-store, or OpenClaw configuration write permission is requested. `operator.admin` alone is insufficient.
