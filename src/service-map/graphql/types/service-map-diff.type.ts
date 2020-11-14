import { Field, ObjectType } from '@nestjs/graphql'
import { ServiceMapType } from './service-map.type'

@ObjectType('ServiceMapDiff')
export class ServiceMapDiffType {
    @Field()
    serviceMap: ServiceMapType

    @Field({ nullable: true })
    diff: ServiceMapType
}
