import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InterviewService {
  constructor(private readonly prisma: PrismaService) {}

  getAll() {
    return this.prisma.interview.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
  async getInterview(id: string) {
    return this.prisma.interview.findUnique({
      where: { id },
    });
  }
}
