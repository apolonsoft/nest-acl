import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class UpdateServiceInput {
    @Field(type => ID, { description: 'service id' })
    id: string
}
