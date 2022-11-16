import { IStorageConfig } from "./interfaces/IConfig";
import env from '../utils/helpers/env.helper';

export default (): IStorageConfig => ({
    type: env('STORAGE_TYPE') as "local" | "s3",
    baseUrl: env('STORAGE_PATH'),
})