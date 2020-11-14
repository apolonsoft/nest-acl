import { Field, Int, ObjectType } from '@nestjs/graphql'
import { InfoType } from '../../../shared/types/info.type'
import { Effects } from 'src/rules/graphql/enums/effect.enum'
import { ActionsType } from 'src/actions/graphql/types/action.type'
import { ConditionsType } from 'src/conditions/graphql/types/condition.type'
import { UsersType } from 'src/users/graphql/types/user.type'
import { Paginated } from 'src/shared/types/paginated.type'

@ObjectType('Rule')
export class RuleType {
    @Field(type => InfoType)
    info: InfoType

    @Field(type => Effects)
    effect: Effects

    @Field(() => ActionsType, { name: 'actions' })
    _actions?: ActionsType

    @Field(() => ConditionsType, { name: 'conditions' })
    _conditions?: ConditionsType

    @Field(type => Int, { nullable: true })
    priority?: number

    @Field(type => UsersType, { name: 'users' })
    _users?: UsersType
}

@ObjectType('Rules')
export class RulesType extends Paginated(RuleType) {}
