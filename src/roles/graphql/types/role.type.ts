import { Field, ObjectType } from '@nestjs/graphql'
import { InfoType } from '../../../shared/types/info.type'
import { GroupsType } from '../../../groups/graphql/types/group.type'
import { PermissionsType } from '../../../permissions/graphql/types/permission.type'
import { RulesType } from '../../../rules/graphql/types/rule.type'
import { UsersType } from '../../../users/graphql/types/user.type'
import { Paginated } from 'src/shared/types/paginated.type'

@ObjectType('Role')
export class RoleType {
    @Field(type => InfoType)
    info: InfoType

    @Field(() => GroupsType, { name: 'groups' })
    _groups?: GroupsType

    @Field(() => PermissionsType, { name: 'permissions' })
    _permissions?: PermissionsType

    @Field(() => RulesType, { name: 'rules' })
    _rules?: RulesType

    @Field(() => UsersType, { name: 'users' })
    _users?: UsersType
}

@ObjectType('Roles')
export class RolesType extends Paginated(RoleType) {}
