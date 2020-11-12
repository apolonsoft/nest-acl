import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('Info')
export class InfoType {
    @Field(() => ID)
    id?: string

    @Field()
    name: string

    @Field({ nullable: true })
    description?: string

    @Field()
    isDeleted?: boolean
}
