import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('ServiceQuery')
export class ServiceQueryType {
    @Field()
    query?: string

    @Field(() => [String], { nullable: 'itemsAndList' })
    inputs?: string[]
}
