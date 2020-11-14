import { Field, ObjectType } from '@nestjs/graphql'
import { InfoType } from '../../../shared/types/info.type'
import GraphQLJSON from 'graphql-type-json'
import { Paginated } from 'src/shared/types/paginated.type'

@ObjectType('Condition')
export class ConditionType {
    @Field(type => InfoType)
    info: InfoType

    @Field(() => GraphQLJSON)
    condition: Record<string, unknown>
}

@ObjectType('Conditions')
export class ConditionsType extends Paginated(ConditionType) {}
