import { Field, ID, ObjectType } from '@nestjs/graphql'
import { RulesInfoType } from './rules-info.type'

@ObjectType('RequestInfo')
export class RequestInfoType {
    @Field()
    requestId: string

    @Field(() => ID, { nullable: true })
    userId?: string

    @Field()
    valid: boolean

    @Field(type => RulesInfoType)
    info: RulesInfoType
}
