import { IAppConfig, ICacheConfig } from "./interfaces/IConfig";
import env from '../utils/helpers/env.helper';

export default (): ICacheConfig => ({
    type: env('CACHE_TYPE') as any || 'database',
    duration: parseInt(env('CACHE_DURATION'), 10) || 60,
})