# CSRF SPA Attack POC

## Spawn service

```sh
docker compose up
```

## Create user

```sh
docker compose exec -it backend bash
poetry run ./manage.py createsuperuser --username=username --email=username@example.com
```

## Access true site

`http://localhost:7890/accounts/login/`

## Access attacker site

`http://localhost:6789/`
