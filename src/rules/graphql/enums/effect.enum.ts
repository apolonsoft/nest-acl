import { registerEnumType } from '@nestjs/graphql'

export enum Effects {
    ALLOW = 'ALLOW',
    DENY = 'DENY',
}

registerEnumType(Effects, {
    name: 'Effects',
})
