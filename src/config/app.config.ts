import { IAppConfig } from "./interfaces/IConfig";
import env from '../utils/helpers/env.helper';

export default (): IAppConfig => ({
    name: env('APP_NAME'),
    env: env('APP_ENV') || 'local',
    host: env('APP_HOST') || `http://localhost:${env('APP_PORT')}`,
    port: parseInt(env('APP_PORT'), 10) || 3000,
    key: env('APP_KEY'),
})