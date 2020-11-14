import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateInfoInput } from 'src/shared/inputs/create-info.input'
import { FindConditions, In, Repository } from 'typeorm'
import { RoleEntity } from './role.entity'
import { UpdateInfoInput } from 'src/shared/inputs/update-info.input'
import { AttachPermissionToRoleInput } from './graphql/inputs/attach-permission-to-role.input'
import { AttachGroupToRoleInput } from './graphql/inputs/attach-group-to-role.input'
import { RolesInput } from './graphql/inputs/roles.input'
import { GroupsService } from 'src/groups/groups.service'
import { PermissionsService } from 'src/permissions/permissions.service'
import { RulesService } from 'src/rules/rules.service'
import { IPaginated } from 'src/shared/types/paginated.type'
import { queryBuilderLikeExpression } from 'src/shared/helpers/query-builder-like-expression.helper'
import { AttachRuleToRoleInput } from './graphql/inputs/attach-rule-to-role.input'

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(RoleEntity)
        private _rolesRepository: Repository<RoleEntity>,
        private _groupsService: GroupsService,
        private _permissionsService: PermissionsService,
        private _rulesService: RulesService,
    ) {}

    async getRolesByIds(ids: string[]): Promise<RoleEntity[]> {
        const roles = await this._rolesRepository.findByIds(ids)

        return roles
    }

    async createRole(createInfoInput: CreateInfoInput): Promise<RoleEntity> {
        const { info } = createInfoInput

        const role = new RoleEntity()
        role.info = info

        try {
            await role.save()
            return role
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    }

    async getRoleById(id: string): Promise<RoleEntity> {
        const role = await this._rolesRepository.findOne({
            relations: ['groups', 'permissions', 'rules'],
            where: {
                id,
            },
        })

        if (!role) {
            throw new NotFoundException(`role with #${id} not found.`)
        }

        return role
    }

    async updateRole(updateInfoInput: UpdateInfoInput): Promise<RoleEntity> {
        const {
            id,
            info: { name, description },
        } = updateInfoInput

        const role = await this.getRoleById(id)

        role.name = name
        role.description = description ?? role.description

        await role.save()

        return role
    }

    async attachGroupToRole(
        attachGroupToRole: AttachGroupToRoleInput,
    ): Promise<RoleEntity> {
        const { groupId, roleId, attach } = attachGroupToRole

        const role = await this.getRoleById(roleId)

        const group = await this._groupsService.getGroupById(groupId)

        if (attach) {
            role.groups.push(group)
        } else {
            role.groups = role.groups.filter(group => group.id !== groupId)
        }

        return role.save()
    }

    async attachPermissionToRole(
        attachPermissionToRoleInput: AttachPermissionToRoleInput,
    ): Promise<RoleEntity> {
        const { permissionId, roleId, attach } = attachPermissionToRoleInput

        const role = await this.getRoleById(roleId)
        const permission = await this._permissionsService.getPermissionById(
            permissionId,
        )

        if (attach) {
            role.permissions.push(permission)
        } else {
            role.permissions = role.permissions.filter(
                permission => permission.id !== permissionId,
            )
        }

        return role.save()
    }

    async attachRuleToRole(
        attachRuleToRoleInput: AttachRuleToRoleInput,
    ): Promise<RoleEntity> {
        const { ruleId, roleId, attach } = attachRuleToRoleInput

        const role = await this.getRoleById(roleId)

        const rule = await this._rulesService.getRuleById(ruleId)

        if (attach) {
            role.rules.push(rule)
        } else {
            role.rules = role.rules.filter(rule => rule.id !== ruleId)
        }

        return role.save()
    }

    async getRoles(rolesInput: RolesInput): Promise<IPaginated<RoleEntity>> {
        const {
            filter: infoFilter,
            groupIds,
            ruleIds,
            permissionIds,
            userId,
        } = rolesInput

        const { infoQuery, filter } = infoFilter

        const { limit, skip, ids } = filter

        const alias = 'role'
        const queryBuilder = this._rolesRepository.createQueryBuilder(alias)

        const whereCondition: FindConditions<RoleEntity> = {}
        if (ids != null) {
            whereCondition.id = In(ids)
        }
        queryBuilder.where(whereCondition)

        if (infoQuery != null) {
            const fields: (keyof RoleEntity)[] = [`name`, `description`]

            const likeExpression = queryBuilderLikeExpression(
                infoQuery,
                alias,
                fields,
            )
            queryBuilder.andWhere(likeExpression)
        }

        if (groupIds != null) {
            queryBuilder.innerJoin(
                `${alias}.groups`,
                'group',
                'group.id IN (:...groupIds)',
                { groupIds },
            )
        }

        if (ruleIds != null) {
            queryBuilder.innerJoin(
                `${alias}.rules`,
                'rule',
                'rule.id IN (:...ruleIds)',
                { ruleIds },
            )
        }

        if (permissionIds != null) {
            queryBuilder.innerJoin(
                `${alias}.permissions`,
                'permission',
                'permission.id IN (:...permissionIds)',
                { permissionIds },
            )
        }

        if (userId != null) {
            queryBuilder.innerJoin(
                `${alias}.users`,
                'users',
                'user.id = :userId',
                { userId },
            )
        }

        const [roles, count] = await queryBuilder
            .skip(skip)
            .take(limit)
            .getManyAndCount()

        return { nodes: roles, count }
    }
}
