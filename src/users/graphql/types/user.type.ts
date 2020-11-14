import { Directive, Field, ID, ObjectType } from '@nestjs/graphql'
import { GroupsType } from 'src/groups/graphql/types/group.type'
import { PermissionsType } from 'src/permissions/graphql/types/permission.type'
import { RolesType } from 'src/roles/graphql/types/role.type'
import { RulesType } from 'src/rules/graphql/types/rule.type'
import { Paginated } from 'src/shared/types/paginated.type'
import {ObjectExtendType} from "custom-schema-printer"

@ObjectExtendType('User')
@Directive('@key(fields: "id")')
export class UserType {
    @Field(() => ID)
    @Directive('@external')
    id: string

    @Field(type => RolesType, { name: 'roles' })
    _roles?: RolesType

    @Field(type => GroupsType, { name: 'groups' })
    _groups?: GroupsType

    @Field(type => PermissionsType, { name: 'permissions' })
    _permissions?: PermissionsType

    @Field(type => RulesType, { name: 'rules' })
    _rules?: RulesType
}

@ObjectType('Users')
export class UsersType extends Paginated(UserType) {}
