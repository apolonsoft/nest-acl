import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('ServiceMutation')
export class ServiceMutationType {
    @Field()
    mutation?: string

    @Field(() => [String], { nullable: 'itemsAndList' })
    inputs?: string[]
}
