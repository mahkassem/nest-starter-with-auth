export interface IConfig {
    app: IAppConfig;
    database: IDataBaseConfig;
    cache: ICacheConfig;
    storage: IStorageConfig;
    s3: IAWSS3Config;
}

export interface IAppConfig {
    name: string;
    env: string;
    port: number;
    host: string;
    key: string;
}

export interface IDataBaseConfig {
    connection: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}

export interface ICacheConfig {
    type: "database" | "redis" | "ioredis" | "ioredis/cluster";
    duration: number;
}

export interface IStorageConfig {
    type: "local" | "s3";
    baseUrl: string;
}

export interface IAWSS3Config {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucket: string;
}