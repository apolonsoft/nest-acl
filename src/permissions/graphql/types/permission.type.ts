import { Field, ObjectType } from '@nestjs/graphql'
import { InfoType } from '../../../shared/types/info.type'
import { RulesType } from '../../../rules/graphql/types/rule.type'
import { UsersType } from '../../../users/graphql/types/user.type'
import { Paginated } from 'src/shared/types/paginated.type'

@ObjectType('Permission')
export class PermissionType {
    @Field(type => InfoType)
    info: InfoType

    @Field(() => RulesType, { name: 'rules' })
    _rules?: RulesType

    @Field(() => UsersType, { name: 'users' })
    _users?: UsersType
}

@ObjectType('Permissions')
export class PermissionsType extends Paginated(PermissionType) {}
