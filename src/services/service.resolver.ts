import { Query, Mutation, Args, Resolver } from '@nestjs/graphql'
import { AddServiceInput } from 'src/services/graphql/inputs/add-service.input'
import { ServiceMapDiffType } from 'src/service-map/graphql/types/service-map-diff.type'
import { ServiceMapType } from 'src/service-map/graphql/types/service-map.type'
import { ServicesService } from './services.service'
import { CheckServiceInput } from './graphql/inputs/check-service.input'
import { UpdateServiceInput } from './graphql/inputs/update-service.input'
import { ServicesType } from './graphql/types/service.type'
import { ServicesInput } from './graphql/inputs/services.input'

@Resolver('service')
export class ServiceResolver {
    constructor(private _servicesService: ServicesService) {}

    @Query(() => ServicesType, { description: '[ACL] get existing services' })
    async services(
        @Args('input') servicesInput: ServicesInput,
    ): Promise<ServicesType> {
        return this._servicesService.getServices(servicesInput)
    }

    @Mutation(() => ServiceMapType, { description: '[ACL] add new service' })
    async addService(
        @Args('input') addServiceInput: AddServiceInput,
    ): Promise<ServiceMapType> {
        return this._servicesService.addService(addServiceInput)
    }

    @Mutation(() => ServiceMapType, {
        description: '[ACL] request for updating service',
    })
    async updateService(
        @Args('input') updateServiceInput: UpdateServiceInput,
    ): Promise<ServiceMapType> {
        return this._servicesService.updateService(updateServiceInput)
    }

    @Mutation(() => ServiceMapDiffType, {
        description: '[ACL] get service schema changes',
    })
    async checkService(
        @Args('input') checkServiceInput: CheckServiceInput,
    ): Promise<ServiceMapDiffType> {
        return this._servicesService.checkService(checkServiceInput)
    }
}
