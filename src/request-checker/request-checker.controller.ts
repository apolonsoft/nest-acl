import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { RequestCheckerService } from './request-checker.service'
import { RequestInfoType } from './graphql/types/request-info.type'

@Controller('request-checker')
export class RequestCheckerController {
    constructor(private readonly _ruleCheckerService: RequestCheckerService) {}

    @MessagePattern({ cmd: 'checkRequest' })
    async checkRequest({ userId, query }): Promise<RequestInfoType> {
        return this._ruleCheckerService.checkRequest(userId, query)
    }
}
