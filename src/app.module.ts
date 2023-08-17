import { Global, Module } from '@nestjs/common';
import { FightersModule } from './routes/fighters/fighters.module';
import { FightsModule } from './routes/fights/fights.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RankingsModule } from './routes/rankings/rankings.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { imageFileFilter } from './utils/file-filter.utils';
import { EventsModule } from './routes/events/events.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
        type: config.get<any>('TYPEORM_CONNECTION'),
        host: config.get<string>('TYPEORM_HOST'),
        port: config.get<number>('TYPEORM_PORT'),
        username: config.get<string>('TYPEORM_USERNAME'),
        password: config.get<string>('TYPEORM_PASSWORD'),
        database: config.get<string>('TYPEORM_DATABASE'),
        entities: [join(__dirname, '**', '*.entity.js')],
        synchronize: true,
        logging: config.get<boolean>('TYPEORM_LOGGING'),
      }),
      inject: [ConfigService],
    }),
    MulterModule.register({
      dest: './uploads',
      fileFilter: imageFileFilter,
    }),
    ServeStaticModule.forRoot({
      rootPath: join('./uploads'),
      serveStaticOptions: {
        index: false,
      },
      serveRoot: '/',
    }),
    FightersModule,
    FightsModule,
    RankingsModule,
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
