FROM danihodovic/celery-exporter:0.12.0 as builder

FROM python:3.13.5-alpine3.22 as alpine-builder

ENV PYTHONUNBUFFERED=1 \
    POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache


WORKDIR /app/
COPY --from=builder /app /app

RUN apk update
RUN apk upgrade
RUN pip install -U pip poetry
RUN poetry install --without dev --no-root

FROM python:3.13-slim-bookworm

ENV PYTHONUNBUFFERED=1 \
    VIRTUAL_ENV=/app/.venv \
    PATH="/app/.venv/bin:$PATH"

COPY --from=alpine-builder ${VIRTUAL_ENV} ${VIRTUAL_ENV}
COPY --from=alpine-builder /app /app

EXPOSE 9808

RUN adduser --disabled-password --no-create-home exporter

USER exporter

ENTRYPOINT ["python", "/app/cli.py"]
