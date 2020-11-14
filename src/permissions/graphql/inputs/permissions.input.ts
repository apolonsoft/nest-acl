import { Field, ID, InputType } from '@nestjs/graphql'
import { InfoFilter } from '../../../shared/inputs/info-filter.input'

@InputType()
export class PermissionsInput {
    @Field()
    filter: InfoFilter

    @Field(() => [ID], {
        nullable: 'itemsAndList',
        description: 'filter by rule ids',
    })
    ruleIds?: string[]

    userId?: string

    roleId?: string

    groupId?: string
}
