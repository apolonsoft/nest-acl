import { Field, ID, InputType } from '@nestjs/graphql'
import { InfoInput } from './info.input'

@InputType()
export class UpdateInfoInput {
    @Field(type => ID)
    id: string

    @Field(type => InfoInput)
    info: InfoInput
}
