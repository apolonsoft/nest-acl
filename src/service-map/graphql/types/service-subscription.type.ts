import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('ServiceSubscription')
export class ServiceSubscriptionType {
    @Field()
    subscription?: string

    @Field(() => [String], { nullable: 'itemsAndList' })
    inputs?: string[]
}
