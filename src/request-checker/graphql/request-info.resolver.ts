import { NotImplementedException } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { RequestCheckerService } from '../request-checker.service'
import { CheckRequestInput } from './inputs/check-request.input'
import { RequestInfoType } from './types/request-info.type'

@Resolver(type => RequestInfoType)
export class RequestInfoResolver {
    constructor(private _requestCheckerService: RequestCheckerService) {}

    @Mutation(() => RequestInfoType)
    async checkRequest(
        @Args('input') input: CheckRequestInput,
    ): Promise<RequestInfoType> {
        throw new NotImplementedException()
    }
}
