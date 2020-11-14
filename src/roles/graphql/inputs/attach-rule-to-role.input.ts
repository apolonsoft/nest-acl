import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class AttachRuleToRoleInput {
    @Field()
    ruleId: string

    @Field()
    roleId: string

    @Field()
    attach: boolean
}
