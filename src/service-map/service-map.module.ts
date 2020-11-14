import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ServiceMapService } from './service-map.service'
import { ServiceMapEntity } from './service-map.entity'

@Module({
    imports: [TypeOrmModule.forFeature([ServiceMapEntity])],
    providers: [ServiceMapService],
    exports: [ServiceMapService],
})
export class ServiceMapModule {}
