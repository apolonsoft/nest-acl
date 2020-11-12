import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import { AppModule, AppModuleForSchemaGeneration } from './app.module'
import { Logger } from '@nestjs/common'
import * as path from 'path'

const logger = new Logger('ACLInstance')

async function bootstrap(): Promise<void> {
    await ExtendedSchemaPrinter.createSchemaFile(
        AppModuleForSchemaGeneration,
        path.join(process.cwd(), 'schema.graphql'),
    )

    const app = await NestFactory.create(AppModule)
    const microservice = app.connectMicroservice({
        transport: Transport.TCP,
        options: {
            host: process.env.HOST,
            port: process.env.MICROSERVICE_PORT,
        },
    })

    await microservice.listen(() =>
        logger.log(
            `microservice is listening on ${process.env.HOST}:${process.env.MICROSERVICE_PORT}`,
        ),
    )

    await app.startAllMicroservicesAsync()

    await app.listen(process.env.PORT, process.env.HOST, () =>
        logger.log(`Listening on ${process.env.HOST}:${process.env.PORT}`),
    )
}
bootstrap()
