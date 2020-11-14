import { Field, ID, InputType } from '@nestjs/graphql'
import { InfoInput } from '../../../shared/inputs/info.input'
import { Effects } from '../enums/effect.enum'

@InputType()
export class UpdateRuleInput {
    @Field(type => ID)
    id: string

    @Field(type => InfoInput)
    info: InfoInput

    @Field(type => Effects)
    effect: Effects

    @Field(() => [ID])
    actionIds: string[]

    @Field(() => [ID])
    conditionIds: string[]
}
