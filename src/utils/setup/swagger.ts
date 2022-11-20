import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AuthModule } from "../../modules/auth/auth.module";
import { FileModule } from "../../modules/file/file.module";
import { AddressModule } from "../../modules/address/address.module";
import { UsersModule } from "../../modules/users/users.module";
import env from "../helpers/env.helper";

export default (app: INestApplication) => {
    const operationIdFactory = (
        controllerKey: string,
        methodKey: string,
    ) => methodKey

    const publicConfig = new DocumentBuilder()
        .addBearerAuth()
        .setTitle(`${env('APP_NAME')} API`)
        .setDescription(`${env('APP_NAME')} API description`)
        .setVersion('v1')
        .setContact('Contact', 'https://www.alexforprog.com', 'dev@alexforprog.com')
        .setLicense('Developed by AlexForProg', 'https://www.alexforprog.com')
        .addServer(env('APP_HOST'))
        .build();

    const publicDocument = SwaggerModule.createDocument(app, publicConfig, {
        include: [AuthModule, AddressModule, FileModule],
        operationIdFactory,
    });

    SwaggerModule.setup('swagger', app, publicDocument);

    const adminConfig = new DocumentBuilder()
        .addBearerAuth()
        .setTitle(`${env('APP_NAME')} API`)
        .setDescription(`${env('APP_NAME')} API description`)
        .setVersion('1.0')
        .build();

    const adminDocument = SwaggerModule.createDocument(app, adminConfig, {
        include: [UsersModule],
        operationIdFactory
    });

    SwaggerModule.setup('swagger/admin', app, adminDocument);
};