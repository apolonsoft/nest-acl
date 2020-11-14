import { Field, ObjectType } from '@nestjs/graphql'
import { RuleType } from 'src/rules/graphql/types/rule.type'
import { RuleWithInfoType } from './rule-with-info.type'

@ObjectType('RulesInfo')
export class RulesInfoType {
    @Field(type => [RuleType])
    passedRules: RuleType[]

    @Field(type => [RuleWithInfoType], { nullable: 'items' })
    notPassedRules: RuleWithInfoType[]
}
