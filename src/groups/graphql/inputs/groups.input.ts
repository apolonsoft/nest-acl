import { Field, ID, InputType } from '@nestjs/graphql'
import { InfoFilter } from '../../../shared/inputs/info-filter.input'

@InputType()
export class GroupsInput {
    @Field()
    filter: InfoFilter

    @Field(() => [ID], { nullable: 'itemsAndList' })
    ruleIds?: string[]

    @Field(() => [ID], { nullable: 'itemsAndList' })
    permissionIds?: string[]

    userId?: string

    roleId?: string
}
