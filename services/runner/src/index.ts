import { Worker, Job } from 'bullmq';
import { ExecutionJobData, ExecutionJobResult } from '@codequest/shared';
import { executeInSandbox } from './sandbox/executor';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6380', 10);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;

console.log(`[CodeQuest Runner Daemon] Démarrage...`);
console.log(`[CodeQuest Runner] Connexion au broker BullMQ sur ${REDIS_HOST}:${REDIS_PORT}`);

const runnerWorker = new Worker<ExecutionJobData, ExecutionJobResult>(
  'execution',
  async (job: Job<ExecutionJobData, ExecutionJobResult>) => {
    console.log(`[Runner] Traitement soumission ${job.data.submissionId} (Langage: ${job.data.language})`);
    const result = await executeInSandbox(job.data);
    console.log(
      `[Runner] Soumission ${job.data.submissionId} terminée — Médiane CPU: ${result.medianCpuTimeMs.toFixed(2)} ms, Succès tests: ${result.allTestsPassed}`
    );
    return result;
  },
  {
    connection: {
      host: REDIS_HOST,
      port: REDIS_PORT,
      password: REDIS_PASSWORD,
    },
    concurrency: parseInt(process.env.RUNNER_CONCURRENCY || '2', 10),
  }
);

runnerWorker.on('completed', (job) => {
  console.log(`[Runner] Job ${job.id} acquitté avec succès`);
});

runnerWorker.on('failed', (job, err) => {
  console.error(`[Runner] Échec du job ${job?.id} :`, err.message);
});

runnerWorker.on('error', (err) => {
  console.error('[Runner] Erreur de connexion au broker BullMQ :', err.message);
});

