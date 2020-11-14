import { InputType, Field, ID } from '@nestjs/graphql'

@InputType()
export class GetUsersInput {
    @Field(type => ID, { nullable: true })
    id: string

    ruleId?: string

    roleId?: string

    groupId?: string

    permissionId?: string
}
