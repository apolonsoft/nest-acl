import {
    Args,
    Resolver,
    Mutation,
    Query,
    ResolveField,
    Parent,
} from '@nestjs/graphql'
import { PermissionsService } from './permissions.service'
import { CreateInfoInput } from 'src/shared/inputs/create-info.input'
import { UpdateInfoInput } from 'src/shared/inputs/update-info.input'
import {
    PermissionsType,
    PermissionType,
} from 'src/permissions/graphql/types/permission.type'
import { AttachRuleToPermissionInput } from './graphql/inputs/attach-rule-to-permission.input'
import { PermissionEntity } from './permission.entity'
import { PermissionsInput } from './graphql/inputs/permissions.input'
import { RulesType } from 'src/rules/graphql/types/rule.type'
import { RulesInput } from 'src/rules/graphql/inputs/rules.input'
import { GetUsersInput } from 'src/users/graphql/inputs/get-users.input'
import { UsersType } from 'src/users/graphql/types/user.type'
import { RulesService } from 'src/rules/rules.service'
import { UsersService } from 'src/users/users.service'

@Resolver(type => PermissionType)
export class PermissionResolver {
    constructor(
        private _permissionService: PermissionsService,
        private _ruleService: RulesService,
        private _userService: UsersService,
    ) {}

    @Query(() => PermissionsType, {
        description: '[ACL] get existing permissions',
    })
    async permissions(
        @Args('input') permissionsInput: PermissionsInput,
    ): Promise<PermissionsType> {
        return this._permissionService.getPermissions(permissionsInput)
    }

    @Mutation(() => PermissionType, {
        description: '[ACL] create new permission',
    })
    async createPermission(
        @Args('input') createInfoInput: CreateInfoInput,
    ): Promise<PermissionEntity> {
        return this._permissionService.createPermission(createInfoInput)
    }

    @Mutation(() => PermissionType, {
        description: '[ACL] update existing permission',
    })
    async updatePermission(
        @Args('input') updateInfoInput: UpdateInfoInput,
    ): Promise<PermissionEntity> {
        return this._permissionService.updatePermission(updateInfoInput)
    }

    @Mutation(() => PermissionType, {
        description: '[ACL] attach/detach rule to/from permission',
    })
    async attachRuleToPermission(
        @Args('input') attachRuleToPermissionInput: AttachRuleToPermissionInput,
    ): Promise<PermissionEntity> {
        return this._permissionService.attachRuleToPermission(
            attachRuleToPermissionInput,
        )
    }

    @ResolveField(type => RulesType)
    async rules(
        @Parent() permission: PermissionType,
        @Args('input') rulesInput: RulesInput,
    ): Promise<RulesType> {
        const permissionId = permission.info.id
        rulesInput.permissionId = permissionId

        return this._ruleService.getRules(rulesInput)
    }

    @ResolveField(type => UsersType)
    async users(
        @Parent() permission: PermissionType,
        @Args('input') usersInput: GetUsersInput,
    ): Promise<UsersType> {
        const permissionId = permission.info.id
        usersInput.permissionId = permissionId

        return this._userService.getUsers(usersInput)
    }
}
