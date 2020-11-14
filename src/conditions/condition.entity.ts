import { EntityWithInfo } from 'src/shared/entities/enitity-with-info.entity'
import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('Condition')
export class ConditionEntity extends EntityWithInfo {
    @PrimaryColumn('uuid')
    id: string

    @Column('json')
    condition: Record<string, unknown>

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date
}
