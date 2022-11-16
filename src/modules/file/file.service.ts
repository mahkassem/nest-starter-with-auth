import { Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class FileService {
    getFileByDirAndFilename(dir: string, filename: string) {
        return join(__dirname, '../', '../', '../', 'storage', dir, filename);
    }
}
