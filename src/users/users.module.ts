import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GroupsModule } from 'src/groups/groups.module'
import { PermissionsModule } from 'src/permissions/permissions.module'
import { RolesModule } from 'src/roles/roles.module'
import { RulesModule } from 'src/rules/rules.module'
import { UserEntity } from './entities/user.entity'
import { UserResolver } from './user.resolver'
import { UsersService } from './users.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        forwardRef(() => RolesModule),
        GroupsModule,
        forwardRef(() => PermissionsModule),
        forwardRef(() => RulesModule),
    ],
    providers: [UserResolver, UsersService],
    exports: [UserResolver, UsersService],
})
export class UsersModule {}
