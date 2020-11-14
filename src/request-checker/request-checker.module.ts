import { Module } from '@nestjs/common'
import { RequestCheckerService } from './request-checker.service'
import { RequestCheckerController } from './request-checker.controller'
import { RulesModule } from 'src/rules/rules.module'
import { RequestInfoResolver } from './graphql/request-info.resolver'

@Module({
    imports: [RulesModule],
    controllers: [RequestCheckerController],
    providers: [RequestCheckerService, RequestInfoResolver],
})
export class RequestCheckerModule {}
