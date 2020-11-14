import { Field, ID, InputType, Int } from '@nestjs/graphql'
import { InfoFilter } from '../../../shared/inputs/info-filter.input'
import { Effects } from '../enums/effect.enum'

@InputType()
export class RulesInput {
    @Field()
    filter: InfoFilter

    @Field(type => Effects)
    effect: Effects

    @Field(() => [ID], { nullable: 'itemsAndList' })
    actionsIds?: string[]

    @Field(() => [ID], { nullable: 'itemsAndList' })
    conditionsIds?: string[]

    @Field(() => Int, { nullable: true })
    priority?: number

    userId?: string

    roleId?: string

    groupId?: string

    permissionId?: string
}
