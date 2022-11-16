import { FileController } from './file.controller';
import { FileService } from './file.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [
        FileController
    ],
    providers: [
        FileService
    ],
    exports: [
        FileService
    ]
})
export class FileModule { }
