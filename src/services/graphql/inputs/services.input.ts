import { Field, InputType } from '@nestjs/graphql'
import { InfoFilter } from 'src/shared/inputs/info-filter.input'

@InputType()
export class ServicesInput {
    @Field(type => InfoFilter)
    filter: InfoFilter

    @Field({ nullable: true })
    url?: string
}
