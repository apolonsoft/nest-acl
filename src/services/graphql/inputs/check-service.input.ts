import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class CheckServiceInput {
    @Field(type => ID)
    id: string
}
