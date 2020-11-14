import { Entity, Column, ManyToMany, JoinTable } from 'typeorm'
import { PermissionEntity } from '../permissions/permission.entity'
import { RuleEntity } from 'src/rules/rule.entity'
import { EntityWithInfo } from 'src/shared/entities/enitity-with-info.entity'
import { UserEntity } from 'src/users/entities/user.entity'
import { RoleEntity } from 'src/roles/role.entity'

@Entity()
export class GroupEntity extends EntityWithInfo {
    @ManyToMany(
        type => PermissionEntity,
        permission => permission.groups,
    )
    @JoinTable()
    permissions: PermissionEntity[]

    @ManyToMany(
        type => RuleEntity,
        rule => rule.groups,
    )
    @JoinTable()
    rules: RuleEntity[]

    @ManyToMany(
        type => UserEntity,
        user => user.groups,
    )
    users: UserEntity[]

    @ManyToMany(
        type => RoleEntity,
        role => role.groups,
    )
    roles: RoleEntity[]

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date
}
