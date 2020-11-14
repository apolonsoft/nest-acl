import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import { PermissionEntity } from './permission.entity'
import { CreateInfoInput } from 'src/shared/inputs/create-info.input'
import { UpdateInfoInput } from 'src/shared/inputs/update-info.input'
import { InjectRepository } from '@nestjs/typeorm'
import { FindConditions, In, Repository } from 'typeorm'
import { AttachRuleToPermissionInput } from './graphql/inputs/attach-rule-to-permission.input'
import { PermissionsInput } from './graphql/inputs/permissions.input'
import { RulesService } from 'src/rules/rules.service'
import { IPaginated } from 'src/shared/types/paginated.type'
import { queryBuilderLikeExpression } from 'src/shared/helpers/query-builder-like-expression.helper'

@Injectable()
export class PermissionsService {
    constructor(
        @InjectRepository(PermissionEntity)
        private _permissionsRepository: Repository<PermissionEntity>,
        private _rulesService: RulesService,
    ) {}

    async getPermissionsByIds(ids: string[]): Promise<PermissionEntity[]> {
        const permissions = await this._permissionsRepository.findByIds(ids)

        return permissions
    }

    async getPermissionById(id: string): Promise<PermissionEntity> {
        const permission = await this._permissionsRepository.findOne({
            relations: ['rules'],
            where: {
                id,
            },
        })

        if (!permission) {
            throw new NotFoundException(`permission with #${id} not found.`)
        }

        return permission
    }

    async getPermissions(
        permissionsInput: PermissionsInput,
    ): Promise<IPaginated<PermissionEntity>> {
        const {
            filter: infoFilter,
            ruleIds,
            userId,
            roleId,
            groupId,
        } = permissionsInput

        const { infoQuery, filter } = infoFilter

        const { limit, skip, ids } = filter

        const alias = 'permission'
        const queryBuilder = this._permissionsRepository.createQueryBuilder(
            alias,
        )

        const whereConditions: FindConditions<PermissionEntity> = {}
        if (ids != null) {
            whereConditions.id = In(ids)
        }
        queryBuilder.where(whereConditions)

        if (infoQuery != null) {
            const fields: (keyof PermissionEntity)[] = [`name`, `description`]

            const likeExpression = queryBuilderLikeExpression(
                infoQuery,
                alias,
                fields,
            )
            queryBuilder.andWhere(likeExpression)
        }

        if (ruleIds != null) {
            queryBuilder.innerJoin(
                `${alias}.rules`,
                'rule',
                'rule.id IN (:...ruleIds)',
                { ruleIds },
            )
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

        if (groupId != null) {
            queryBuilder.innerJoin(
                `${alias}.groups`,
                'group',
                'group.id = :groupId',
                { groupId },
            )
        }

        const [permissions, count] = await queryBuilder
            .skip(skip)
            .take(limit)
            .getManyAndCount()

        return { nodes: permissions, count }
    }

    async createPermission(
        createInfoInput: CreateInfoInput,
    ): Promise<PermissionEntity> {
        const { info } = createInfoInput

        const permission = new PermissionEntity()
        permission.info = info

        try {
            await permission.save()
            return permission
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    }

    async updatePermission(
        updateInfoInput: UpdateInfoInput,
    ): Promise<PermissionEntity> {
        const {
            id,
            info: { name, description },
        } = updateInfoInput

        const permission = await this.getPermissionById(id)

        permission.name = name
        permission.description = description ?? permission.description

        await permission.save()

        return permission
    }

    async attachRuleToPermission(
        attachRuleToPermission: AttachRuleToPermissionInput,
    ): Promise<PermissionEntity> {
        const { permissionId, ruleId, attach } = attachRuleToPermission

        const permission = await this.getPermissionById(permissionId)

        const rule = await this._rulesService.getRuleById(ruleId)

        if (attach) {
            permission.rules.push(rule)
        } else {
            permission.rules = permission.rules.filter(
                rule => rule.id !== ruleId,
            )
        }

        return permission.save()
    }
}
