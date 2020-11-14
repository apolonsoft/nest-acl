import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class AttachRuleToPermissionInput {
    @Field(type => ID)
    ruleId: string

    @Field(type => ID)
    permissionId: string

    @Field({ description: 'if true - attach, else - detach' })
    attach: boolean
}
