import { Entity, Column, ManyToMany, JoinTable } from 'typeorm'
import { Effects } from 'src/rules/graphql/enums/effect.enum'
import { ConditionEntity } from 'src/conditions/condition.entity'
import { ActionEntity } from 'src/actions/action.entity'
import { EntityWithInfo } from 'src/shared/entities/enitity-with-info.entity'
import { UserEntity } from 'src/users/entities/user.entity'
import { RoleEntity } from 'src/roles/role.entity'
import { PermissionEntity } from 'src/permissions/permission.entity'
import { GroupEntity } from 'src/groups/group.entity'

@Entity('Rule')
export class RuleEntity extends EntityWithInfo {
    @Column({
        type: 'enum',
        enum: Effects,
    })
    effect: Effects

    @Column({ nullable: true })
    priority?: number

    @ManyToMany(type => ActionEntity)
    @JoinTable()
    actions: ActionEntity[]

    @ManyToMany(type => ConditionEntity)
    @JoinTable()
    conditions: ConditionEntity[]

    @ManyToMany(
        type => UserEntity,
        user => user.rules,
    )
    users: UserEntity[]

    @ManyToMany(
        type => RoleEntity,
        role => role.rules,
    )
    roles: RoleEntity[]

    @ManyToMany(
        type => PermissionEntity,
        permission => permission.rules,
    )
    permissions: RuleEntity[]

    @ManyToMany(
        type => GroupEntity,
        group => group.rules,
    )
    groups: GroupEntity[]

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date
}
