import { Entity, Column, ManyToMany, JoinTable } from 'typeorm'
import { GroupEntity } from 'src/groups/group.entity'
import { PermissionEntity } from 'src/permissions/permission.entity'
import { RuleEntity } from 'src/rules/rule.entity'
import { EntityWithInfo } from 'src/shared/entities/enitity-with-info.entity'
import { UserEntity } from 'src/users/entities/user.entity'

@Entity('Role')
export class RoleEntity extends EntityWithInfo {
    @ManyToMany(
        type => GroupEntity,
        group => group.roles,
    )
    @JoinTable()
    groups: GroupEntity[]

    @ManyToMany(
        type => PermissionEntity,
        permission => permission.roles,
    )
    @JoinTable()
    permissions: PermissionEntity[]

    @ManyToMany(
        type => RuleEntity,
        rule => rule.roles,
    )
    @JoinTable()
    rules: RuleEntity[]

    @ManyToMany(
        type => UserEntity,
        user => user.roles,
    )
    users: UserEntity[]

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date
}
