import { Field, ObjectType } from '@nestjs/graphql'
import { InfoType } from 'src/shared/types/info.type'
import { Paginated } from 'src/shared/types/paginated.type'

@ObjectType('Service')
export class ServiceType {
    @Field(type => InfoType)
    info: InfoType

    @Field()
    url: string

    @Field()
    createdAt: Date

    @Field({ nullable: true })
    updatedAt?: Date
}

@ObjectType('Services')
export class ServicesType extends Paginated(ServiceType) {}
