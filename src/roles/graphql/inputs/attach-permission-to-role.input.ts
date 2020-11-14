import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class AttachPermissionToRoleInput {
    @Field()
    roleId: string

    @Field()
    permissionId: string

    @Field({ description: 'if true - attach, else - detach' })
    attach: boolean
}
