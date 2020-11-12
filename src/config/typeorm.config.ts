import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'

const DEFAULT_POSTGRES_HOST = 'localhost'
const DEFAULT_POSTGRES_PORT = 5432

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => {
        const database = configService.get('PSQL_DATABASE')
        if (database == null) {
            throw new Error(
                "Environment variable 'PSQL_DATABASE' cannot be undefined",
            )
        }

        return {
            type: 'postgres',
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            useUnifiedTopology: true,
            database,
            host: configService.get('PSQL_HOST') || DEFAULT_POSTGRES_HOST,
            port: configService.get('PSQL_PORT') || DEFAULT_POSTGRES_PORT,
            username: configService.get('PSQL_USERNAME'),
            password: configService.get('PSQL_PASSWORD'),
            synchronize: configService.get('NODE_ENV') !== 'production',
        }
    },
    inject: [ConfigService],
}
