import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ActionsModule } from 'src/actions/actions.module'
import { ServiceMapModule } from 'src/service-map/service-map.module'
import { ServiceEntity } from './service.entity'
import { ServiceResolver } from './service.resolver'
import { ServicesService } from './services.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([ServiceEntity]),
        ServiceMapModule,
        ActionsModule,
    ],
    providers: [ServicesService, ServiceResolver],
    exports: [ServicesService],
})
export class ServicesModule {}
