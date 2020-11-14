import { GroupEntity } from 'src/groups/group.entity'
import { PermissionEntity } from 'src/permissions/permission.entity'
import { RoleEntity } from 'src/roles/role.entity'
import { RuleEntity } from 'src/rules/rule.entity'
import {
    BaseEntity,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('User')
export class UserEntity extends BaseEntity {
    constructor(id?: string) {
        super()
        if (id != null) {
            this.id = id
        }
    }

    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToMany(
        type => RoleEntity,
        role => role.users,
        { eager: true },
    )
    @JoinTable()
    roles: RoleEntity[]

    @ManyToMany(
        type => GroupEntity,
        group => group.users,
        { eager: true },
    )
    @JoinTable()
    groups: GroupEntity[]

    @ManyToMany(
        type => PermissionEntity,
        permission => permission.users,
        { eager: true },
    )
    @JoinTable()
    permissions: PermissionEntity[]

    @ManyToMany(
        type => RuleEntity,
        rule => rule.users,
        { eager: true },
    )
    @JoinTable()
    rules: RuleEntity[]
}
