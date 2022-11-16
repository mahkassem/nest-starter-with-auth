import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { FileService } from './file.service';

@ApiTags('Storage')
@Controller('storage')
export class FileController {
    constructor(private readonly fileService: FileService) { }
    @ApiProperty()
    @Get('/:dir/:filename')
    async get(@Param('dir') dir: string, @Param('filename') filename: string, @Res() res) {
        const filePath = this.fileService.getFileByDirAndFilename(dir, filename);
        res.sendFile(filePath);
    }
}
