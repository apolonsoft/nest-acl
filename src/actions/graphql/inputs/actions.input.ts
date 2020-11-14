import { Field, ID, InputType } from '@nestjs/graphql'
import {FilterInput} from "@nest/shared";

@InputType()
export class ActionsInput {
    @Field(type => FilterInput, { nullable: true })
    filter?: FilterInput

    @Field(type => ID, {
        nullable: true,
        description: 'filter actions with service id',
    })
    serviceId?: string

    @Field({ nullable: true })
    query?: string

    ruleId?: string
}
