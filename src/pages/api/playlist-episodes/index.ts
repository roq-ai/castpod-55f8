import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { playlistEpisodeValidationSchema } from 'validationSchema/playlist-episodes';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getPlaylistEpisodes();
    case 'POST':
      return createPlaylistEpisode();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPlaylistEpisodes() {
    const data = await prisma.playlist_episode
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'playlist_episode'));
    return res.status(200).json(data);
  }

  async function createPlaylistEpisode() {
    await playlistEpisodeValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.playlist_episode.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
