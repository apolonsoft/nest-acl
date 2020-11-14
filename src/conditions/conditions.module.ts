import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConditionsService } from './conditions.service'
import { ConditionResolver } from './condition.resolver'
import { ConditionEntity } from './condition.entity'

@Module({
    imports: [TypeOrmModule.forFeature([ConditionEntity])],
    providers: [ConditionsService, ConditionResolver],
    exports: [ConditionsService],
})
export class ConditionsModule {}
