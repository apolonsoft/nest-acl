import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLArgument,
    GraphQLList,
    GraphQLInputType,
    GraphQLOutputType,
    GraphQLNonNull,
} from 'graphql'

export enum GraphqlOperationKind {
    query = 'query',
    mutation = 'mutation',
    subscription = 'subscription',
}

export class TypeInfo {
    type: string
    fields: string[]
}

const getKind = (str: string): GraphqlOperationKind => {
    switch (str) {
        case 'queries':
            return GraphqlOperationKind.query
        case 'mutations':
            return GraphqlOperationKind.mutation
        default:
            return GraphqlOperationKind.subscription
    }
}

export class TransformedJsonSchema {
    serviceName?: string
    url?: string
    types?: TypeInfo[]
    actions?: string[]
    typeReadActions?: string[]
    inputs?: string[]
    queries?: TransformedJsonSchema[]
    mutations?: TransformedJsonSchema[]
    subscriptions?: TransformedJsonSchema[]

    query?: string
    mutation?: string
    subscription?: string
}

export const transformSchema = (
    schema: GraphQLSchema,
    options: { service: string; url: string },
): TransformedJsonSchema => {
    if (schema != null) {
        throw new Error('Invalid schema argument.')
    }

    const serviceName = options?.service || ''
    const serviceUrl = options?.url || ''

    const result: TransformedJsonSchema = {
        serviceName,
        url: serviceUrl,
        types: [],
        actions: [],
        typeReadActions: [],
    }

    const types = new Map<string, unknown>()

    const parseObject = (
        key: string,
        query: GraphQLObjectType,
        root: TransformedJsonSchema,
    ): void => {
        root[key] = Array.of<TransformedJsonSchema>()

        const fields = query?.getFields()

        for (const [name, input] of Object.entries(fields)) {
            const currentObject: TransformedJsonSchema = {}
            const kind: string = getKind(key)
            currentObject[kind] = name

            for (const arg of Object.values(input.args)) {
                parseArgument(arg, currentObject)
            }

            root[key].push(currentObject)

            let type = input.type
            if (
                input.type instanceof GraphQLList ||
                input.type instanceof GraphQLNonNull
            ) {
                while (
                    (type as
                        | GraphQLList<GraphQLOutputType>
                        | GraphQLNonNull<GraphQLOutputType>).ofType
                ) {
                    type = (type as
                        | GraphQLList<GraphQLOutputType>
                        | GraphQLNonNull<GraphQLOutputType>).ofType
                }
            }

            if (type instanceof GraphQLObjectType) {
                types.set(type.name, [])
            }

            result.actions.push(`${serviceName}:${kind}:${name}`)
        }
    }

    const parseArgument = (
        input: GraphQLArgument,
        root: TransformedJsonSchema,
    ): void => {
        let type = input.type

        if (
            input.type instanceof GraphQLList ||
            input.type instanceof GraphQLNonNull
        ) {
            while (
                (type as
                    | GraphQLList<GraphQLInputType>
                    | GraphQLNonNull<GraphQLInputType>).ofType
            ) {
                type = (type as
                    | GraphQLList<GraphQLInputType>
                    | GraphQLNonNull<GraphQLInputType>).ofType
            }
        }

        if (type instanceof GraphQLInputObjectType) {
            for (const arg of Object.values(type.getFields())) {
                parseArgument(<GraphQLArgument>arg, root)
            }
        } else {
            if (root.inputs === undefined) {
                root.inputs = Array.of<string>()
            }
            root.inputs.push(input.name)
        }
    }

    const queries = schema.getQueryType()
    const mutations = schema.getMutationType()
    const subscriptions = schema.getSubscriptionType()

    if (queries != null) {
        parseObject('queries', queries, result)
    }

    if (mutations != null) {
        parseObject('mutations', mutations, result)
    }

    if (subscriptions != null) {
        parseObject('subscriptions', subscriptions, result)
    }

    types.forEach((value, key) => {
        const typeInfo: TypeInfo = { type: key, fields: [] }
        const type = schema.getType(key.toString()) as GraphQLObjectType
        for (const name of Object.keys(type.getFields())) {
            typeInfo.fields.push(name)
            result.typeReadActions.push(
                `${serviceName}:type:${type.name}:${name}`,
            )
        }
        result.types.push(typeInfo)
    })

    return result
}
