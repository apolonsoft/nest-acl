import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ActionsService } from './actions.service'
import { ActionResolver } from './action.resolver'
import { ActionEntity } from './action.entity'

@Module({
    imports: [TypeOrmModule.forFeature([ActionEntity])],
    providers: [ActionsService, ActionResolver],
    exports: [ActionsService],
})
export class ActionsModule {}
