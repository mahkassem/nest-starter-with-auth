import { IAWSS3Config } from "./interfaces/IConfig";
import env from '../utils/helpers/env.helper';

export default (): IAWSS3Config => ({
    accessKeyId: env('AWS_ACCESS_KEY_ID'),
    secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
    region: env('AWS_REGION'),
    bucket: env('AWS_BUCKET'),
})