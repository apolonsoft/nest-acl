import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('ServiceType')
export class ServiceTypeType {
    @Field()
    type: string

    @Field(() => [String], { nullable: 'itemsAndList' })
    fields: string[]
}
