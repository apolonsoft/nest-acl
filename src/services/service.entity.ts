import { EntityWithInfo } from 'src/shared/entities/enitity-with-info.entity'
import { Column, Entity } from 'typeorm'

@Entity('Service')
export class ServiceEntity extends EntityWithInfo {
    @Column()
    url: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt?: Date
}
