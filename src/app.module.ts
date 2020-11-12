import { Module, ModuleMetadata } from '@nestjs/common'
import { GraphQLFederationModule, GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScheduleModule } from '@nestjs/schedule'
import { typeOrmConfig } from 'src/config/typeorm.config'
import { ConfigModule } from '@nestjs/config'
import { config } from './config/config'
import { graphQLConfig } from './config/graphql.config'

const getAppModuleMetadata = (withoutFederation = false): ModuleMetadata => ({
    imports: [
        ConfigModule.forRoot(config),
        withoutFederation
            ? GraphQLModule.forRoot({ autoSchemaFile: true })
            : GraphQLFederationModule.forRootAsync(graphQLConfig),
        TypeOrmModule.forRootAsync(typeOrmConfig),
        ScheduleModule.forRoot(),
    ],
})

@Module(getAppModuleMetadata(true))
export class AppModuleForSchemaGeneration {}

@Module(getAppModuleMetadata())
export class AppModule {}
