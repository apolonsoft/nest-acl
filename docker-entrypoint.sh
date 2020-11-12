#!/bin/bash
./wait-for-it.sh $PSQL_HOST:$PSQL_PORT --timeout=60 --strict

if [ $? -ne 0  ]; then
  echo "PostgreSQL service is not starting up."
  exit 124
fi

exec "$@"
