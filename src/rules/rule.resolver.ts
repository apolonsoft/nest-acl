import {
    Args,
    Resolver,
    Mutation,
    Query,
    Parent,
    ResolveField,
} from '@nestjs/graphql'
import { RulesService } from './rules.service'
import { RulesType, RuleType } from 'src/rules/graphql/types/rule.type'
import { CreateRuleInput } from './graphql/inputs/create-rule.input'
import { UpdateRuleInput } from './graphql/inputs/update-rule.input'
import { RulesInput } from './graphql/inputs/rules.input'
import { RuleEntity } from './rule.entity'
import { ConditionsType } from 'src/conditions/graphql/types/condition.type'
import { ConditionsInput } from 'src/conditions/graphql/inputs/conditions.input'
import { ActionsInput } from 'src/actions/graphql/inputs/actions.input'
import { ActionsType } from 'src/actions/graphql/types/action.type'
import { UsersType } from 'src/users/graphql/types/user.type'
import { GetUsersInput } from 'src/users/graphql/inputs/get-users.input'
import { ActionsService } from 'src/actions/actions.service'
import { ConditionsService } from 'src/conditions/conditions.service'
import { UsersService } from 'src/users/users.service'

@Resolver(type => RuleType)
export class RuleResolver {
    constructor(
        private _ruleService: RulesService,
        private _actionsService: ActionsService,
        private _conditionsService: ConditionsService,
        private _usersService: UsersService,
    ) {}

    @Mutation(() => RuleType, { description: '[ACL] create new rule' })
    async createRule(
        @Args('input') createRuleInput: CreateRuleInput,
    ): Promise<RuleEntity> {
        return this._ruleService.createRule(createRuleInput)
    }

    @Mutation(() => RuleType, { description: '[ACL] update existing rule' })
    async updateRule(
        @Args('input') updateRuleInput: UpdateRuleInput,
    ): Promise<RuleEntity> {
        return this._ruleService.updateRule(updateRuleInput)
    }

    @Query(() => RulesType, { description: '[ACL] get existing rules' })
    async rules(@Args('input') rulesInput: RulesInput): Promise<RulesType> {
        return this._ruleService.getRules(rulesInput)
    }

    @ResolveField(type => ActionsType)
    async actions(
        @Parent() rule: RuleType,
        @Args('input') actionsInput: ActionsInput,
    ): Promise<ActionsType> {
        const ruleId = rule.info.id
        actionsInput.ruleId = ruleId

        return this._actionsService.getActions(actionsInput)
    }

    @ResolveField(type => ConditionsType)
    async conditions(
        @Parent() rule: RuleType,
        @Args('input') conditionsInput: ConditionsInput,
    ): Promise<ConditionsType> {
        const ruleId = rule.info.id
        conditionsInput.ruleId = ruleId

        return this._conditionsService.getConditions(conditionsInput)
    }

    @ResolveField(type => UsersType)
    async users(
        @Parent() rule: RuleType,
        @Args('input') usersInput: GetUsersInput,
    ): Promise<UsersType> {
        const ruleId = rule.info.id
        usersInput.ruleId = ruleId

        return this._usersService.getUsers(usersInput)
    }
}
