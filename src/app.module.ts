import { Module } from '@nestjs/common';
import { NatsModule } from './nats/nats.module';

@Module({
  imports: [NatsModule],
})
export class AppModule {}
