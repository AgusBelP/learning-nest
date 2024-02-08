import { Module } from '@nestjs/common';
import { axiosAdapter } from './http-adapters/axios.adapter';

@Module({
  providers: [axiosAdapter],
  exports: [axiosAdapter],
})
export class CommonModule {}
