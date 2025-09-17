import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Helper method for soft delete
  async softDelete(model: string, id: string) {
    return this[model].update({
      where: { id },
      data: { isActive: false },
    });
  }

  // Helper method for pagination
  async paginate(model: string, page: number = 1, limit: number = 10, where: any = {}) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this[model].findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this[model].count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
