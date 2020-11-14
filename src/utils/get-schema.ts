import fetch from 'node-fetch'

import { getIntrospectionQuery, printSchema } from 'graphql/utilities'
import { buildClientSchema } from 'graphql/utilities/buildClientSchema'

const SPACES_IN_ERROR = 2

export const getRemoteSchema = async (endpoint: string): Promise<string> => {
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: getIntrospectionQuery() }),
    })

    const { data, errors } = await response.json()

    if (errors != null) {
        throw new Error(JSON.stringify(errors, null, SPACES_IN_ERROR))
    }

    const schema = buildClientSchema(data)
    return printSchema(schema)
}
