import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PermissionsService } from './permissions.service'
import { PermissionResolver } from './permission.resolver'
import { PermissionEntity } from './permission.entity'
import { RulesModule } from 'src/rules/rules.module'
import { UsersModule } from 'src/users/users.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([PermissionEntity]),
        RulesModule,
        UsersModule,
    ],
    providers: [PermissionsService, PermissionResolver],
    exports: [PermissionsService],
})
export class PermissionsModule {}
