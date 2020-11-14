import { Field, InputType } from '@nestjs/graphql'
import {FilterInput} from "@nest/shared";

@InputType()
export class InfoFilter {
    @Field({ nullable: true })
    infoQuery?: string

    @Field(type => FilterInput, { nullable: true, defaultValue: {} })
    filter: FilterInput
}
