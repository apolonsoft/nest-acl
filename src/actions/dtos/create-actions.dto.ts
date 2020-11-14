import { ServiceEntity } from 'src/services/service.entity'
import { InfoInput } from 'src/shared/inputs/info.input'

export class CreateActionsDto {
    info: InfoInput
    actions: string[]
    service: ServiceEntity
}
