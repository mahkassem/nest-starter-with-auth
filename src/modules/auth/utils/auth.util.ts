import { RegisterRequest } from "../dto/requests/register.request";
import * as sharp from 'sharp';
import { ConfigService } from "@nestjs/config";
import { StorageService } from '@codebrew/nestjs-storage/dist';
import { Inject, Injectable } from "@nestjs/common";
import { User } from "src/modules/users/entities/user.entity";

@Injectable()
export class AuthUtil {
    constructor(
        @Inject(StorageService) private readonly storage: StorageService,
        @Inject(ConfigService) private readonly config: ConfigService,
    ) { }

    async uploadAvatar(req: RegisterRequest): Promise<User> {
        const baseUrl = this.config.get('storage.baseUrl');
        let fileLocation = `${baseUrl}/avatars/default.png`;
        if (req.avatarFile) {
            const ext = req.avatarFile.originalname.split('.').pop();
            const randName = req.avatarFile.originalname.split('.').shift() + '-' + new Date().getTime();
            fileLocation = `${baseUrl}/avatars/${randName}.${ext}`;
            // use sharp to resize image
            const resizedImage = await sharp(req.avatarFile.buffer)
                .resize(300, 300, {
                    fit: sharp.fit.cover,
                    position: sharp.strategy.entropy,
                })
                .toBuffer();
            await this.storage.getDisk().put(fileLocation, resizedImage);
        }
        delete req.avatarFile;
        return new User({ ...req, avatar: fileLocation });
    }
}
