import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class CheckRequestInput {
    @Field()
    requestId: string

    @Field(type => ID)
    userId: string

    @Field()
    query: string
}
