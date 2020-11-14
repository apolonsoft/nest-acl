import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RulesService } from './rules.service'
import { RuleResolver } from './rule.resolver'
import { RuleEntity } from './rule.entity'
import { ConditionsModule } from 'src/conditions/conditions.module'
import { ActionsModule } from 'src/actions/actions.module'
import { UsersModule } from 'src/users/users.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([RuleEntity]),
        ConditionsModule,
        ActionsModule,
        forwardRef(() => UsersModule),
    ],
    providers: [RulesService, RuleResolver],
    exports: [RulesService],
})
export class RulesModule {}
