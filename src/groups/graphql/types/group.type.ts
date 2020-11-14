import { Field, ObjectType } from '@nestjs/graphql'
import { InfoType } from '../../../shared/types/info.type'
import { PermissionsType } from '../../../permissions/graphql/types/permission.type'
import { RulesType } from '../../../rules/graphql/types/rule.type'
import { UsersType } from '../../../users/graphql/types/user.type'
import { Paginated } from 'src/shared/types/paginated.type'

@ObjectType('Group')
export class GroupType {
    @Field(type => InfoType)
    info: InfoType

    @Field(() => PermissionsType, { name: 'permissions' })
    _permissions?: PermissionsType

    @Field(() => RulesType, { name: 'rules' })
    _rules?: RulesType

    @Field(() => UsersType, { name: 'users' })
    _users?: UsersType
}

@ObjectType('Groups')
export class GroupsType extends Paginated(GroupType) {}
