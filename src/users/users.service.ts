import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { GroupsService } from 'src/groups/groups.service'
import { PermissionsService } from 'src/permissions/permissions.service'
import { RolesService } from 'src/roles/roles.service'
import { RulesService } from 'src/rules/rules.service'
import { IPaginated } from 'src/shared/types/paginated.type'
import { FindConditions, Repository } from 'typeorm'
import { AttachToUserDto } from './dtos/attach-to-user.dto'
import { UserEntity } from './entities/user.entity'
import { GetUsersInput } from './graphql/inputs/get-users.input'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private _usersRepository: Repository<UserEntity>,
        private _rolesService: RolesService,
        private _groupsService: GroupsService,
        private _permissionsService: PermissionsService,
        private _rulesService: RulesService,
    ) {}

    async getUsers(usersInput: GetUsersInput): Promise<IPaginated<UserEntity>> {
        const { id, ruleId, roleId, groupId, permissionId } = usersInput

        const alias = 'user'
        const queryBuilder = this._usersRepository.createQueryBuilder(alias)

        const whereConditions: FindConditions<UserEntity> = {}
        if (id != null) {
            whereConditions.id = id
        }
        queryBuilder.where(whereConditions)

        if (ruleId != null) {
            queryBuilder.innerJoin(
                `${alias}.rules`,
                'rule',
                'rule.id = :ruleId',
                { ruleId },
            )
        }

        if (roleId != null) {
            queryBuilder.innerJoin(
                `${alias}.roles`,
                'role',
                'role.id = :roleId',
                { roleId },
            )
        }

        if (groupId != null) {
            queryBuilder.innerJoin(
                `${alias}.groups`,
                'group',
                'group.id = :groupId',
                { groupId },
            )
        }

        if (permissionId != null) {
            queryBuilder.innerJoin(
                `${alias}.permissions`,
                'permission',
                'permission.id = :permissionId',
                { permissionId },
            )
        }

        const [users, count] = await queryBuilder
            // .skip(skip)
            // .take(limit)
            .getManyAndCount()

        return { nodes: users, count }
    }

    async getOrCreateUserById(id: string): Promise<UserEntity> {
        let user = await this._usersRepository.findOne()
        if (user == null) {
            user = new UserEntity(id)
            await user.save()
        }

        return user
    }

    async attachToUser(attachToUserDto: AttachToUserDto): Promise<UserEntity> {
        const {
            userId,
            roleIds,
            groupIds,
            permissionIds,
            ruleIds,
        } = attachToUserDto

        const user = await this.getOrCreateUserById(userId)

        if (roleIds != null) {
            const notAttachedRolesIds = roleIds.filter(
                id => !user.roles.some(role => role.id === id),
            )
            const roles = await this._rolesService.getRolesByIds(
                notAttachedRolesIds,
            )

            user.roles.push(...roles)
        }

        if (groupIds != null) {
            const notAttachedGroupsIds = groupIds.filter(
                id => !user.groups.some(group => group.id === id),
            )
            const groups = await this._groupsService.getGroupsByIds(
                notAttachedGroupsIds,
            )

            user.groups.push(...groups)
        }

        if (permissionIds != null) {
            const notAttachedPermissionsIds = permissionIds.filter(
                id =>
                    !user.permissions.some(permission => permission.id === id),
            )
            const permissions = await this._permissionsService.getPermissionsByIds(
                notAttachedPermissionsIds,
            )

            user.permissions.push(...permissions)
        }

        if (ruleIds != null) {
            const notAttachedRulesIds = ruleIds.filter(
                id => !user.rules.some(rule => rule.id === id),
            )
            const rules = await this._rulesService.getRulesByIds(
                notAttachedRulesIds,
            )

            user.rules.push(...rules)
        }

        await user.save()

        return user
    }
}
