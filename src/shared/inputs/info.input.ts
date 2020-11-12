import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class InfoInput {
    @Field()
    name: string

    @Field({ nullable: true })
    description?: string
}
