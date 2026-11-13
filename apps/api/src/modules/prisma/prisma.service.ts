import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      datasources: {
        db: {
          url:
            process.env.DATABASE_URL ||
            'postgresql://codequest:codequest_secret@localhost:5432/codequest?schema=public',
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Connecté à la base de données PostgreSQL avec succès.');
    } catch (error: any) {
      this.logger.warn(
        `Connexion PostgreSQL en attente : ${error.message}. L'API démarre en mode autonome (démarrez Docker pour la persistance complète).`
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
