import { TransformedJsonSchema } from './schema-to-json'

enum Action {
    query = 'query',
    mutation = 'mutation',
    subscription = 'subscription',
    types = 'types',
}

enum InputType {
    inputs = 'inputs',
    fields = 'fields',
}

const difference = (a1: string[], a2: string[]): string[] => {
    const obj = {} as Record<string, number>

    a1.forEach(value => {
        const count = obj[value] ?? 0
        obj[value] = count + 1
    })

    a2.forEach(value => {
        const count = obj[value] ?? 0
        obj[value] = count - 1
    })

    return Object.keys(obj).reduce((arr, value) => {
        const length = obj[value]

        if (length > 0) {
            const values = Array.from({ length }).fill(value) as string[]
            arr = arr.concat(values)
        }

        return arr
    }, [] as string[])
}

const compareActions = <T>(
    leftActions: T[],
    rightActions: T[],
    action: Action,
    inputType: InputType = InputType.inputs,
): T[] => {
    const diff = []
    for (const x of rightActions) {
        const exactAction = leftActions.find(i => i[action] === x[action])
        if (!exactAction) {
            diff.push(x)
        } else {
            if (
                JSON.stringify(exactAction[inputType]) !==
                JSON.stringify(x[inputType])
            ) {
                diff.push(x)
            }
        }
    }
    return diff
}

export const schemaDiff = (
    currentSchema: TransformedJsonSchema,
    downloadedSchema: TransformedJsonSchema,
): TransformedJsonSchema => {
    return {
        queries: compareActions(
            currentSchema.queries || [],
            downloadedSchema.queries || [],
            Action.query,
        ),
        mutations: compareActions(
            currentSchema.mutations || [],
            downloadedSchema.mutations || [],
            Action.mutation,
        ),
        subscriptions: compareActions(
            currentSchema.subscriptions || [],
            downloadedSchema.subscriptions || [],
            Action.subscription,
        ),
        types: compareActions(
            currentSchema.types || [],
            downloadedSchema.types || [],
            Action.types,
            InputType.fields,
        ),
        actions: difference(downloadedSchema.actions, currentSchema.actions),
        typeReadActions: difference(
            downloadedSchema.typeReadActions || [],
            currentSchema.typeReadActions || [],
        ),
    }
}
