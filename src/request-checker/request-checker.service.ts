import { Injectable } from '@nestjs/common'
import { RulesService } from 'src/rules/rules.service'
import { RequestInfoType } from './graphql/types/request-info.type'

@Injectable()
export class RequestCheckerService {
    constructor(private readonly _ruleService: RulesService) {}

    async checkRequest(
        userId: string,
        query: string,
    ): Promise<RequestInfoType> {
        const requestInfo = new RequestInfoType()
        requestInfo.requestId = 'Hello'
        requestInfo.valid = true
        return requestInfo
    }
}
