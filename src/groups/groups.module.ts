import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GroupsService } from './groups.service'
import { GroupResolver } from './group.resolver'
import { GroupEntity } from './group.entity'
import { PermissionsModule } from 'src/permissions/permissions.module'
import { RulesModule } from 'src/rules/rules.module'
import { UsersModule } from 'src/users/users.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([GroupEntity]),
        forwardRef(() => PermissionsModule),
        forwardRef(() => RulesModule),
        forwardRef(() => UsersModule),
    ],
    providers: [GroupsService, GroupResolver],
    exports: [GroupsService],
})
export class GroupsModule {}
