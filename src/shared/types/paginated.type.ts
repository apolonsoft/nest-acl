import { Type } from '@nestjs/common'
import { ObjectType, Field, Int } from '@nestjs/graphql'

export interface IPaginated<T> {
    nodes: T[]
    count: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Paginated = <T>(classRef: Type<T>): Type<IPaginated<T>> => {
    @ObjectType({ isAbstract: true })
    class PaginatedType {
        @Field(type => [classRef])
        nodes: T[]

        @Field(type => Int)
        count: number
    }

    return PaginatedType
}
