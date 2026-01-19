import { Controller, Get, Param } from '@nestjs/common';
import { InterviewService } from './interview.service';

@Controller('interview')
export class InterviewController {
  constructor(private readonly service: InterviewService) {}
  @Get()
  findAll() {
    return this.service.getAll();
  }
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.service.getInterview(id);
  }
}
