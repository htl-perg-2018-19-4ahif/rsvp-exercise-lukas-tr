# RSVP REST API

```bash
docker build -t node-rsvp .
docker run -p 1235:8080 -d node-rsvp
```

**IMPORTANT:** Records are not persisted when using the dockerfile by default. If you want to persist parties, mount `/usr/src/app/loki.json`.
