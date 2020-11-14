import { forwardRef, Inject } from '@nestjs/common'
import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { GroupsInput } from 'src/groups/graphql/inputs/groups.input'
import { GroupsType } from 'src/groups/graphql/types/group.type'
import { GroupsService } from 'src/groups/groups.service'
import { PermissionsInput } from 'src/permissions/graphql/inputs/permissions.input'
import { PermissionsType } from 'src/permissions/graphql/types/permission.type'
import { PermissionsService } from 'src/permissions/permissions.service'
import { RolesInput } from 'src/roles/graphql/inputs/roles.input'
import { RolesType } from 'src/roles/graphql/types/role.type'
import { RolesService } from 'src/roles/roles.service'
import { RulesInput } from 'src/rules/graphql/inputs/rules.input'
import { RulesType } from 'src/rules/graphql/types/rule.type'
import { RulesService } from 'src/rules/rules.service'
import { AttachToUserInput } from './graphql/inputs/attach-to-user.input'
import { UserType } from './graphql/types/user.type'
import { UsersService } from './users.service'

@Resolver(type => UserType)
export class UserResolver {
    constructor(
        private _userService: UsersService,
        @Inject(forwardRef(() => RolesService))
        private _rolesService: RolesService,
        private _groupsService: GroupsService,
        private _permissionsService: PermissionsService,
        private _rulesService: RulesService,
    ) {}

    @Mutation(() => UserType, {
        description: '[ACL] change access control rights for user',
    })
    async attachToUser(
        @Args('input') input: AttachToUserInput,
    ): Promise<UserType> {
        const user = await this._userService.attachToUser(input)

        return user
    }

    @ResolveField(type => RolesType)
    async roles(
        @Parent() user: UserType,
        @Args('input') rolesInput: RolesInput,
    ): Promise<RolesType> {
        const userId = user.id
        rolesInput.userId = userId

        return this._rolesService.getRoles(rolesInput)
    }

    @ResolveField(type => GroupsType)
    async groups(
        @Parent() user: UserType,
        @Args('input') groupsInput: GroupsInput,
    ): Promise<GroupsType> {
        const userId = user.id
        groupsInput.userId = userId

        return this._groupsService.getGroups(groupsInput)
    }

    @ResolveField(type => PermissionsType)
    async permissions(
        @Parent() user: UserType,
        @Args('input') permissionsInput: PermissionsInput,
    ): Promise<PermissionsType> {
        const userId = user.id
        permissionsInput.userId = userId

        return this._permissionsService.getPermissions(permissionsInput)
    }

    @ResolveField(type => RulesType)
    async rules(
        @Parent() user: UserType,
        @Args('input') rulesInput: RulesInput,
    ): Promise<RulesType> {
        const userId = user.id
        rulesInput.userId = userId

        return this._rulesService.getRules(rulesInput)
    }
}
