import { GqlModuleAsyncOptions } from '@nestjs/graphql'
import { ConfigModule, ConfigService } from '@nestjs/config'

export const graphQLConfig: GqlModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
        typePaths: ['schema.graphql'],
        playground: configService.get('NODE_ENV') === 'development',
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        context: ({ req, res }): { req; res } => ({ req, res }),
    }),
    inject: [ConfigService],
}
