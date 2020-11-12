import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class InfoFilter {
    @Field({ nullable: true })
    infoQuery?: string

    @Field(type => FilterInput, { nullable: true, defaultValue: {} })
    filter: FilterInput
}
