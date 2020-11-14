import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ServiceType } from 'src/services/graphql/types/service.type'
import { Paginated } from 'src/shared/types/paginated.type'

@ObjectType('Action')
export class ActionType {
    @Field(() => ID)
    id: string

    @Field(type => ServiceType)
    service: ServiceType

    @Field()
    objectTypeName: string

    @Field()
    objectName: string

    @Field({ nullable: true })
    objectField?: string

    @Field()
    stringValue: string
}

@ObjectType('Actions')
export class ActionsType extends Paginated(ActionType) {}
