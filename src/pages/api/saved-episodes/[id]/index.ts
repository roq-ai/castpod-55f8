import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { savedEpisodeValidationSchema } from 'validationSchema/saved-episodes';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.saved_episode
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getSavedEpisodeById();
    case 'PUT':
      return updateSavedEpisodeById();
    case 'DELETE':
      return deleteSavedEpisodeById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSavedEpisodeById() {
    const data = await prisma.saved_episode.findFirst(convertQueryToPrismaUtil(req.query, 'saved_episode'));
    return res.status(200).json(data);
  }

  async function updateSavedEpisodeById() {
    await savedEpisodeValidationSchema.validate(req.body);
    const data = await prisma.saved_episode.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteSavedEpisodeById() {
    const data = await prisma.saved_episode.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
