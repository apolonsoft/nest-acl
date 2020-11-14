import { RuleEntity } from 'src/rules/rule.entity'
import { ServiceEntity } from 'src/services/service.entity'
import {
    Entity,
    Column,
    PrimaryColumn,
    BaseEntity,
    OneToOne,
    ManyToMany,
} from 'typeorm'

@Entity('Action')
export class ActionEntity extends BaseEntity {
    @PrimaryColumn('uuid')
    id: string

    @OneToOne(
        type => ServiceEntity,
        service => service.id,
    )
    service: ServiceEntity

    @ManyToMany(
        type => RuleEntity,
        rule => rule.actions,
    )
    rules: RuleEntity[]

    @Column('text')
    objectTypeName: string

    @Column('text')
    objectName: string

    @Column('text', { nullable: true })
    objectField?: string

    @Column('text')
    stringValue: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date
}
