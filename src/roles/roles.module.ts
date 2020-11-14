import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RolesService } from './roles.service'
import { RoleResolver } from './role.resolver'
import { RoleEntity } from './role.entity'
import { PermissionsModule } from 'src/permissions/permissions.module'
import { RulesModule } from 'src/rules/rules.module'
import { GroupsModule } from 'src/groups/groups.module'
import { UsersModule } from 'src/users/users.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([RoleEntity]),
        GroupsModule,
        PermissionsModule,
        RulesModule,
        UsersModule,
    ],
    providers: [RolesService, RoleResolver],
    exports: [RolesService],
})
export class RolesModule {}
