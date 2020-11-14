import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import { GroupEntity } from './group.entity'
import { CreateInfoInput } from 'src/shared/inputs/create-info.input'
import { UpdateInfoInput } from 'src/shared/inputs/update-info.input'
import { AttachPermissionToGroupInput } from './graphql/inputs/attach-permission-to-group.input'
import { AttachRuleToGroupInput } from './graphql/inputs/attach-rule-to-group.input'
import { GroupsInput } from './graphql/inputs/groups.input'
import { InjectRepository } from '@nestjs/typeorm'
import { FindConditions, In, Repository } from 'typeorm'
import { PermissionsService } from 'src/permissions/permissions.service'
import { RulesService } from 'src/rules/rules.service'
import { IPaginated } from 'src/shared/types/paginated.type'
import { queryBuilderLikeExpression } from 'src/shared/helpers/query-builder-like-expression.helper'

@Injectable()
export class GroupsService {
    constructor(
        @InjectRepository(GroupEntity)
        private _groupsRepository: Repository<GroupEntity>,
        private _permissionsService: PermissionsService,
        private _rulesService: RulesService,
    ) {}

    async getGroupsByIds(ids: string[]): Promise<GroupEntity[]> {
        const groups = await this._groupsRepository.findByIds(ids)

        return groups
    }

    async createGroup(createInfoInput: CreateInfoInput): Promise<GroupEntity> {
        const { info } = createInfoInput

        const group = new GroupEntity()
        group.info = info

        try {
            await group.save()

            return group
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    }

    async updateGroup(updateInfoInput: UpdateInfoInput): Promise<GroupEntity> {
        const {
            id,
            info: { name, description },
        } = updateInfoInput

        const group = await this._groupsRepository.findOne(id)

        if (group == null) {
            throw new NotFoundException(`group with #${id} not found.`)
        }

        group.name = name
        group.description = description ?? group.description

        await group.save()

        return group
    }

    async getGroupById(id: string): Promise<GroupEntity> {
        const group = await this._groupsRepository.findOne({
            relations: ['permissions', 'rules'],
            where: {
                id,
            },
        })

        if (!group) {
            throw new NotFoundException(`group with #${id} not found.`)
        }

        return group
    }

    async attachPermissionToGroup(
        attachPermissionToGroup: AttachPermissionToGroupInput,
    ): Promise<GroupEntity> {
        const { groupId, permissionId, attach } = attachPermissionToGroup

        const group = await this.getGroupById(groupId)
        const permission = await this._permissionsService.getPermissionById(
            permissionId,
        )

        if (attach) {
            group.permissions.push(permission)
        } else {
            group.permissions = group.permissions.filter(
                permission => permission.id !== permissionId,
            )
        }

        return group.save()
    }

    async attachRuleToGroup(
        attachRuleToGroupInput: AttachRuleToGroupInput,
    ): Promise<GroupEntity> {
        const { groupId, ruleId, attach } = attachRuleToGroupInput

        const group = await this.getGroupById(groupId)
        const rule = await this._rulesService.getRuleById(ruleId)

        if (attach) {
            group.rules.push(rule)
        } else {
            group.rules = group.rules.filter(rule => rule.id !== ruleId)
        }

        return group.save()
    }

    async getGroups(
        groupsInput: GroupsInput,
    ): Promise<IPaginated<GroupEntity>> {
        const {
            filter: infoFilter,
            ruleIds,
            permissionIds,
            userId,
            roleId,
        } = groupsInput

        const { filter, infoQuery } = infoFilter
        const { limit, skip, ids } = filter

        const alias = 'condition'
        const queryBuilder = this._groupsRepository.createQueryBuilder(alias)

        const whereConditions: FindConditions<GroupEntity> = {}
        if (ids != null) {
            whereConditions.id = In(ids)
        }
        queryBuilder.where(whereConditions)

        if (infoQuery != null) {
            const fields: (keyof GroupEntity)[] = [`name`, `description`]

            const likeExpression = queryBuilderLikeExpression(
                infoQuery,
                alias,
                fields,
            )
            queryBuilder.andWhere(likeExpression)
        }

        if (userId != null) {
            queryBuilder.innerJoin(
                `${alias}.users`,
                'user',
                'user.id = :userId',
                { userId },
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

        if (ruleIds) {
            queryBuilder.innerJoin(
                `${alias}.rules`,
                'rule',
                'rule.id IN (:...ruleIds)',
                { ruleIds },
            )
        }

        if (permissionIds) {
            queryBuilder.innerJoin(
                `${alias}.permissions`,
                'permission',
                'permission.id IN (:...permissionIds)',
                { permissionIds },
            )
        }

        const [groups, count] = await queryBuilder
            .skip(skip)
            .take(limit)
            .getManyAndCount()

        return { nodes: groups, count }
    }
}
