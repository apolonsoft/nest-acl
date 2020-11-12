import { Brackets, WhereExpression } from 'typeorm'

export const queryBuilderLikeExpression = (
    likeValue: string,
    alias: string,
    fieldNames: string[],
): Brackets => {
    const likeCondition = `%${likeValue}%`
    const fields: string[] = fieldNames.map(field => `${alias}.${field}`)

    const whereExpressionBuilder = (qb: WhereExpression): WhereExpression =>
        fields.reduce((qb, queryField, index) => {
            const condition = `${queryField} like :${queryField}Value`
            const parameters = { [`${queryField}Value`]: likeCondition }

            if (index === 0) {
                qb.where(condition, parameters)
            } else {
                qb.orWhere(condition, parameters)
            }

            return qb
        }, qb)

    return new Brackets(qb => whereExpressionBuilder(qb))
}
