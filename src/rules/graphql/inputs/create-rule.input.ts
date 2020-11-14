import { Field, ID, InputType, Int } from '@nestjs/graphql'
import { InfoInput } from '../../../shared/inputs/info.input'
import { Effects } from '../enums/effect.enum'

@InputType()
export class CreateRuleInput {
    @Field(type => InfoInput)
    info: InfoInput

    @Field(type => Effects)
    effect: Effects

    @Field(() => [ID])
    actionIds: string[]

    @Field(() => [ID])
    conditionIds: string[]

    @Field(type => Int)
    priority?: number
}
