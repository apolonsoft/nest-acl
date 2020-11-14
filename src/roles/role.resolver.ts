import {
    Args,
    Resolver,
    Mutation,
    Query,
    Parent,
    ResolveField,
} from '@nestjs/graphql'
import { RolesService } from './roles.service'
import { CreateInfoInput } from 'src/shared/inputs/create-info.input'
import { UpdateInfoInput } from 'src/shared/inputs/update-info.input'
import { AttachGroupToRoleInput } from './graphql/inputs/attach-group-to-role.input'
import { AttachRuleToRoleInput } from './graphql/inputs/attach-rule-to-role.input'
import { AttachPermissionToRoleInput } from './graphql/inputs/attach-permission-to-role.input'
import { RolesInput } from './graphql/inputs/roles.input'
import { RolesType, RoleType } from 'src/roles/graphql/types/role.type'
import { RoleEntity } from './role.entity'
import { GroupsInput } from 'src/groups/graphql/inputs/groups.input'
import { GroupsType } from 'src/groups/graphql/types/group.type'
import { PermissionsInput } from 'src/permissions/graphql/inputs/permissions.input'
import { PermissionsType } from 'src/permissions/graphql/types/permission.type'
import { RulesInput } from 'src/rules/graphql/inputs/rules.input'
import { RulesType } from 'src/rules/graphql/types/rule.type'
import { GetUsersInput } from 'src/users/graphql/inputs/get-users.input'
import { UsersType } from 'src/users/graphql/types/user.type'
import { GroupsService } from 'src/groups/groups.service'
import { PermissionsService } from 'src/permissions/permissions.service'
import { RulesService } from 'src/rules/rules.service'
import { UsersService } from 'src/users/users.service'

@Resolver(type => RoleType)
export class RoleResolver {
    constructor(
        private _rolesService: RolesService,
        private _groupService: GroupsService,
        private _permissionService: PermissionsService,
        private _ruleService: RulesService,
        private _userService: UsersService,
    ) {}

    @Query(() => RolesType, { description: '[ACL] get existing roles' })
    async roles(@Args('input') rolesInput: RolesInput): Promise<RolesType> {
        return this._rolesService.getRoles(rolesInput)
    }

    @Mutation(() => RoleType, { description: '[ACL] create new role' })
    async createRole(
        @Args('input') createInfoInput: CreateInfoInput,
    ): Promise<RoleEntity> {
        return this._rolesService.createRole(createInfoInput)
    }

    @Mutation(() => RoleType, { description: '[ACL] update existing role' })
    async updateRole(
        @Args('input') updateInfoInput: UpdateInfoInput,
    ): Promise<RoleEntity> {
        return this._rolesService.updateRole(updateInfoInput)
    }

    @Mutation(() => RoleType, {
        description: '[ACL] attach/detach group to/from role',
    })
    async attachGroupToRole(
        @Args('input') attachGroupToRole: AttachGroupToRoleInput,
    ): Promise<RoleEntity> {
        return this._rolesService.attachGroupToRole(attachGroupToRole)
    }

    @Mutation(() => RoleType, {
        description: '[ACL] attach/detach rule to/from role',
    })
    async attachRuleToRole(
        @Args('input') attachRuleToRoleInput: AttachRuleToRoleInput,
    ): Promise<RoleEntity> {
        return this._rolesService.attachRuleToRole(attachRuleToRoleInput)
    }

    @Mutation(() => RoleType, {
        description: '[ACL] attach/detach permission to/from role',
    })
    async attachPermissionToRole(
        @Args('input') attachRuleToPermissionInput: AttachPermissionToRoleInput,
    ): Promise<RoleEntity> {
        return this._rolesService.attachPermissionToRole(
            attachRuleToPermissionInput,
        )
    }

    @ResolveField(type => GroupsType)
    async groups(
        @Parent() role: RoleType,
        @Args('input') groupsInput: GroupsInput,
    ): Promise<GroupsType> {
        const roleId = role.info.id
        groupsInput.roleId = roleId
        return this._groupService.getGroups(groupsInput)
    }

    @ResolveField(type => PermissionsType)
    async permissions(
        @Parent() role: RoleType,
        @Args('input') permissionsInput: PermissionsInput,
    ): Promise<PermissionsType> {
        const roleId = role.info.id
        permissionsInput.roleId = roleId

        return this._permissionService.getPermissions(permissionsInput)
    }

    @ResolveField(type => RulesType)
    async rules(
        @Parent() role: RoleType,
        @Args('input') rulesInput: RulesInput,
    ): Promise<RulesType> {
        const roleId = role.info.id
        rulesInput.roleId = roleId

        return this._ruleService.getRules(rulesInput)
    }

    @ResolveField(type => UsersType)
    async users(
        @Parent() role: RoleType,
        @Args('input') getUsersInput: GetUsersInput,
    ): Promise<UsersType> {
        const roleId = role.info.id
        getUsersInput.roleId = roleId

        return this._userService.getUsers(getUsersInput)
    }
}
