import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class AttachRuleToGroupInput {
    @Field()
    ruleId: string

    @Field()
    groupId: string

    @Field({ description: 'if true - attach, else - detach' })
    attach: boolean
}
