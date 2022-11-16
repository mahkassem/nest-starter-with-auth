import { IDataBaseConfig } from './interfaces/IConfig';
import env from '../utils/helpers/env.helper';

export default (): IDataBaseConfig => ({
  connection: env('DB_CONN') || 'mysql',
  host: env('DB_HOST') || 'localhost',
  port: parseInt(env('DB_PORT'), 10) || 3306,
  username: env('DB_USER'),
  password: env('DB_PASS'),
  database: env('DB_NAME'),
});
