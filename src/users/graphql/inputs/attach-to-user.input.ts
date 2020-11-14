import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class AttachToUserInput {
    @Field(type => ID)
    userId: string

    @Field(type => [ID], { nullable: 'itemsAndList' })
    roleIds?: string[]

    @Field(type => [ID], { nullable: 'itemsAndList' })
    groupIds?: string[]

    @Field(type => [ID], { nullable: 'itemsAndList' })
    permissionIds?: string[]

    @Field(type => [ID], { nullable: 'itemsAndList' })
    ruleIds?: string[]
}
