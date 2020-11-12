import { Field, InputType } from '@nestjs/graphql'
import { InfoInput } from './info.input'

@InputType()
export class CreateInfoInput {
    @Field(type => InfoInput)
    info: InfoInput
}
