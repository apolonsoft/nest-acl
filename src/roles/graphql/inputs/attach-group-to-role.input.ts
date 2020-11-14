import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class AttachGroupToRoleInput {
    @Field(type => ID)
    groupId: string

    @Field(type => ID)
    roleId: string

    @Field({ description: 'if true - attach, else - detach' })
    attach: boolean
}
