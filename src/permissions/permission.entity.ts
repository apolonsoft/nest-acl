import { Entity, Column, ManyToMany, JoinTable } from 'typeorm'
import { RuleEntity } from 'src/rules/rule.entity'
import { EntityWithInfo } from 'src/shared/entities/enitity-with-info.entity'
import { UserEntity } from 'src/users/entities/user.entity'
import { RoleEntity } from 'src/roles/role.entity'
import { GroupEntity } from 'src/groups/group.entity'

@Entity('Permission')
export class PermissionEntity extends EntityWithInfo {
    @ManyToMany(
        type => RuleEntity,
        rule => rule.permissions,
    )
    @JoinTable()
    rules: RuleEntity[]

    @ManyToMany(
        type => UserEntity,
        user => user.permissions,
    )
    users: UserEntity[]

    @ManyToMany(
        type => RoleEntity,
        role => role.permissions,
    )
    roles: RoleEntity[]

    @ManyToMany(
        type => GroupEntity,
        group => group.permissions,
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
