import {
    Args,
    Resolver,
    Mutation,
    Query,
    Parent,
    ResolveField,
} from '@nestjs/graphql'
import { GroupsService } from './groups.service'
import { CreateInfoInput } from '../shared/inputs/create-info.input'
import { UpdateInfoInput } from '../shared/inputs/update-info.input'
import { GroupsType, GroupType } from 'src/groups/graphql/types/group.type'
import { AttachPermissionToGroupInput } from './graphql/inputs/attach-permission-to-group.input'
import { GroupsInput } from './graphql/inputs/groups.input'
import { GroupEntity } from './group.entity'
import { AttachRuleToGroupInput } from './graphql/inputs/attach-rule-to-group.input'
import { GetUsersInput } from 'src/users/graphql/inputs/get-users.input'
import { UsersType } from 'src/users/graphql/types/user.type'
import { PermissionsType } from 'src/permissions/graphql/types/permission.type'
import { PermissionsInput } from 'src/permissions/graphql/inputs/permissions.input'
import { RulesType } from 'src/rules/graphql/types/rule.type'
import { RulesInput } from 'src/rules/graphql/inputs/rules.input'
import { PermissionsService } from 'src/permissions/permissions.service'
import { RulesService } from 'src/rules/rules.service'
import { UsersService } from 'src/users/users.service'

@Resolver(type => GroupType)
export class GroupResolver {
    constructor(
        private _groupService: GroupsService,
        private _permissionService: PermissionsService,
        private _rulesService: RulesService,
        private _userService: UsersService,
    ) {}

    @Mutation(() => GroupType, { description: '[ACL] create new group' })
    async createGroup(
        @Args('input') createInfoInput: CreateInfoInput,
    ): Promise<GroupEntity> {
        return this._groupService.createGroup(createInfoInput)
    }

    @Mutation(() => GroupType, { description: '[ACL] update existing group' })
    async updateGroup(
        @Args('input') updateInfoInput: UpdateInfoInput,
    ): Promise<GroupEntity> {
        return this._groupService.updateGroup(updateInfoInput)
    }

    @Mutation(() => GroupType, {
        description: '[ACL] attach or detach permission to/from the group',
    })
    async attachPermissionToGroup(
        @Args('input')
        attachPermissionToGroupInput: AttachPermissionToGroupInput,
    ): Promise<GroupEntity> {
        return this._groupService.attachPermissionToGroup(
            attachPermissionToGroupInput,
        )
    }

    @Mutation(() => GroupType, {
        description: '[ACL] attach or detach rule to/from group',
    })
    async attachRuleToGroup(
        @Args('input') attachRuleToGroupInput: AttachRuleToGroupInput,
    ): Promise<GroupEntity> {
        return this._groupService.attachRuleToGroup(attachRuleToGroupInput)
    }

    @Query(() => GroupsType, { description: '[ACL] get existing groups' })
    async groups(@Args('input') groupsInput: GroupsInput): Promise<GroupsType> {
        return this._groupService.getGroups(groupsInput)
    }

    @ResolveField(type => PermissionsType)
    async permissions(
        @Parent() group: GroupType,
        @Args('input') permissionsInput: PermissionsInput,
    ): Promise<PermissionsType> {
        const groupId = group.info.id
        permissionsInput.groupId = groupId

        return this._permissionService.getPermissions(permissionsInput)
    }

    @ResolveField(type => RulesType)
    async rules(
        @Parent() group: GroupType,
        @Args('input') rulesInput: RulesInput,
    ): Promise<RulesType> {
        const groupId = group.info.id
        rulesInput.groupId = groupId

        return this._rulesService.getRules(rulesInput)
    }

    @ResolveField(type => UsersType)
    async users(
        @Parent() group: GroupType,
        @Args('input') usersInput: GetUsersInput,
    ): Promise<UsersType> {
        const groupId = group.info.id
        usersInput.groupId = groupId

        return this._userService.getUsers(usersInput)
    }
}
