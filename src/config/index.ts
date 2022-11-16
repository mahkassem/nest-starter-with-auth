import { IConfig } from "./interfaces/IConfig";
import appConfig from "./app.config";
import cacheConfig from "./cache.config";
import databaseConfig from "./database.config";
import storageConfig from "./storage.config";
import s3Config from "./s3.config";

export default (): IConfig => ({
    app: appConfig(),
    database: databaseConfig(),
    cache: cacheConfig(),
    storage: storageConfig(),
    s3: s3Config(),
});