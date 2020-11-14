import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class AttachPermissionToGroupInput {
    @Field(type => ID)
    groupId: string

    @Field(type => ID)
    permissionId: string

    @Field({ description: 'if true - attach, else - detach' })
    attach: boolean
}
