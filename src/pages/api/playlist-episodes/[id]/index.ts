import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { playlistEpisodeValidationSchema } from 'validationSchema/playlist-episodes';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.playlist_episode
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getPlaylistEpisodeById();
    case 'PUT':
      return updatePlaylistEpisodeById();
    case 'DELETE':
      return deletePlaylistEpisodeById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPlaylistEpisodeById() {
    const data = await prisma.playlist_episode.findFirst(convertQueryToPrismaUtil(req.query, 'playlist_episode'));
    return res.status(200).json(data);
  }

  async function updatePlaylistEpisodeById() {
    await playlistEpisodeValidationSchema.validate(req.body);
    const data = await prisma.playlist_episode.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deletePlaylistEpisodeById() {
    const data = await prisma.playlist_episode.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
