import { ServiceEntity } from 'src/services/service.entity'
import { Entity, Column, PrimaryColumn, BaseEntity, OneToOne } from 'typeorm'
import { ServiceMutationType } from './graphql/types/service-mutation.type'
import { ServiceQueryType } from './graphql/types/service-query.type'
import { ServiceSubscriptionType } from './graphql/types/service-subscription.type'
import { ServiceTypeType } from './graphql/types/service-type.type'

@Entity('ServiceMap')
export class ServiceMapEntity extends BaseEntity {
    @PrimaryColumn('uuid')
    id: string

    @OneToOne(
        type => ServiceEntity,
        service => service.id,
    )
    service: ServiceEntity

    @Column('jsonb', { nullable: true })
    queries?: ServiceQueryType[]

    @Column('jsonb', { nullable: true })
    mutations?: ServiceMutationType[]

    @Column('jsonb', { nullable: true })
    subscriptions?: ServiceSubscriptionType[]

    @Column('jsonb', { nullable: true })
    types?: ServiceTypeType[]

    @Column('jsonb', { nullable: true })
    actions?: string[]

    @Column('jsonb', { nullable: true })
    typeReadActions?: string[]

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date
}
