import { Field, InputType } from '@nestjs/graphql'
import { InfoInput } from '../../../shared/inputs/info.input'

@InputType()
export class AddServiceInput {
    @Field(type => InfoInput)
    info: InfoInput

    @Field({ description: 'url to the service' })
    url: string
}
