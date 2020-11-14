import { Field, InputType } from '@nestjs/graphql'
import { InfoInput } from '../../../shared/inputs/info.input'
import GraphQLJSON from 'graphql-type-json'

@InputType()
export class CreateConditionInput {
    @Field(type => InfoInput)
    info: InfoInput

    @Field(() => GraphQLJSON, { description: 'condition data' })
    condition: Record<string, unknown>
}
