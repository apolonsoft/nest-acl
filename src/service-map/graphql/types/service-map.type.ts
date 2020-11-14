import { Field, ObjectType } from '@nestjs/graphql'
import { ServiceType } from '../../../services/graphql/types/service.type'
import { ServiceQueryType } from './service-query.type'
import { ServiceMutationType } from './service-mutation.type'
import { ServiceSubscriptionType } from './service-subscription.type'
import { ServiceTypeType } from './service-type.type'

@ObjectType('ServiceMap')
export class ServiceMapType {
    @Field(type => ServiceType)
    service: ServiceType

    @Field(() => [ServiceQueryType], { nullable: 'itemsAndList' })
    queries?: ServiceQueryType[]

    @Field(() => [ServiceMutationType], { nullable: 'itemsAndList' })
    mutations?: ServiceMutationType[]

    @Field(() => [ServiceSubscriptionType], { nullable: 'itemsAndList' })
    subscriptions?: ServiceSubscriptionType[]

    @Field(() => [ServiceTypeType], { nullable: 'itemsAndList' })
    types?: ServiceTypeType[]

    @Field(() => [String], { nullable: 'itemsAndList' })
    actions?: string[]

    @Field(() => [String], { nullable: 'itemsAndList' })
    typeReadActions?: string[]
}
