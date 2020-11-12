import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { InfoType } from '../types/info.type'

export class EntityWithInfo extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true })
    name: string

    @Column({ nullable: true })
    description?: string

    @Column('bool')
    isDeleted = false

    get info(): InfoType {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            isDeleted: this.isDeleted,
        }
    }

    set info(value: InfoType) {
        this.name = value.name
        this.description = value.description
    }
}
