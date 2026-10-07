# Controller-bound Authoritative State

Prepublication candidate for OpenClaw 2026.9.8. This package is not the authoritative-state service and contains no production installer. It is the OpenClaw-side admission adapter for a separately reviewed privilege-separated Controller.

Security invariants: no wire-supplied Controller identity; no serializable capability token; no model-facing tool; no authoritative store below an OpenClaw-writable path; one active in-memory generation binding; revocation on stop; fail-closed gates when the Controller is absent or fails.

Publication, installation, registration, activation, configuration, service creation, and production use require separate Owner approval.
