import { Field, InputType } from '@nestjs/graphql'
import { InfoFilter } from '../../../shared/inputs/info-filter.input'

@InputType()
export class ConditionsInput {
    @Field()
    filter: InfoFilter

    @Field({ nullable: true, description: 'filter through conditions data' })
    conditionQuery?: string

    ruleId?: string
}
