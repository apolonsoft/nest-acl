import { Field, ID, InputType } from '@nestjs/graphql'
import { InfoFilter } from 'src/shared/inputs/info-filter.input'

@InputType()
export class RolesInput {
    @Field()
    filter: InfoFilter

    @Field(() => [ID], { nullable: 'itemsAndList' })
    groupIds?: string[]

    @Field(() => [ID], { nullable: 'itemsAndList' })
    ruleIds?: string[]

    @Field(() => [ID], { nullable: 'itemsAndList' })
    permissionIds?: string[]

    userId?: string
}
