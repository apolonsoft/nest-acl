import { Field, ObjectType } from '@nestjs/graphql'
import { RuleType } from 'src/rules/graphql/types/rule.type'

@ObjectType('RuleWithInfo')
export class RuleWithInfoType {
    @Field(type => RuleType)
    rule: RuleType

    @Field()
    info: string
}
