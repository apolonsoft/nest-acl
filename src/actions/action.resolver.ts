import { Query, Resolver } from '@nestjs/graphql'
import { ActionsService } from './actions.service'
import { ActionsInput } from './graphql/inputs/actions.input'
import { ActionsType, ActionType } from './graphql/types/action.type'

@Resolver('actions')
export class ActionResolver {
    constructor(private _actionService: ActionsService) {}

    @Query(type => [ActionType], { description: '[ACL] get existing actions' })
    async actions(actionsInput: ActionsInput): Promise<ActionsType> {
        return this._actionService.getActions(actionsInput)
    }
}
