import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { PaginationDto, PaginationResultDto } from 'common/pagination';

import { CreateObjectDto } from './dto/create-object.dto';
import { UpdateObjectDto } from './dto/update-object.dto';
import { ObjectEntity } from './entities/object.entity';
import { WithOwnerEntity } from './entities/owner.entity';
import { ObjectNotFoundException } from './exceptions/object-not-found.exception';
import { OwnerDeletionException } from './exceptions/owner-deletion.exception';
import { OwnerNotFoundException } from './exceptions/owner-not-found.exception';

@Injectable()
export class ObjectsService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    ownerId: string,
    createObjectDto: CreateObjectDto
  ): Promise<ObjectEntity> {
    return this.prisma.object.create({
      data: {
        ...createObjectDto,
        owners: {
          create: [{ userId: ownerId, author: true }]
        }
      }
    });
  }

  async find({
    skip,
    take
  }: PaginationDto): Promise<PaginationResultDto<ObjectEntity>> {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.object.findMany({
        orderBy: {
          id: 'asc'
        },
        skip,
        take
      }),
      this.prisma.object.count()
    ]);

    return { data, total };
  }

  async findOne(id: number): Promise<ObjectEntity> {
    const result = await this.prisma.object.findUnique({
      where: {
        id
      }
    });

    if (!result) {
      throw new ObjectNotFoundException();
    }

    return result;
  }

  async update(
    id: number,
    updateObjectDto: UpdateObjectDto
  ): Promise<ObjectEntity> {
    const result = await this.prisma.object.update({
      where: {
        id
      },
      data: updateObjectDto
    });

    if (!result) {
      throw new ObjectNotFoundException();
    }

    return result;
  }

  async remove(id: number): Promise<ObjectEntity> {
    const result = await this.prisma.object.delete({
      where: {
        id
      }
    });

    if (!result) {
      throw new ObjectNotFoundException();
    }

    return result;
  }

  async getOwners(
    id: number,
    { skip, take }: PaginationDto
  ): Promise<PaginationResultDto<WithOwnerEntity>> {
    const result = await this.prisma.object.findUnique({
      where: {
        id
      },
      include: {
        _count: true,
        owners: {
          skip,
          take,
          orderBy: {
            userId: 'asc'
          }
        }
      }
    });

    if (!result) {
      throw new ObjectNotFoundException();
    }

    return {
      data: result.owners.map((owner) => ({
        id: owner.userId,
        author: owner.author
      })),
      total: result._count.owners
    };
  }

  async addOwner(id: number, userId: string): Promise<WithOwnerEntity> {
    //TODO: Logto managment API request to check if user exists

    const result = await this.prisma.object.update({
      where: {
        id
      },
      data: {
        owners: {
          create: [{ userId }]
        }
      }
    });

    if (!result) {
      throw new ObjectNotFoundException();
    }

    return { id: userId };
  }

  async removeOwner(id: number, userId: string): Promise<WithOwnerEntity> {
    //TODO: Logto managment API request to check if user exists

    const ownerOnObject = await this.prisma.ownersOnObject.findUnique({
      where: {
        userId_objectId: { objectId: id, userId }
      }
    });

    if (!ownerOnObject) {
      const object = await this.prisma.object.findUnique({
        where: { id }
      });

      if (!object) {
        throw new ObjectNotFoundException();
      }

      throw new OwnerNotFoundException();
    }

    if (ownerOnObject.author) {
      throw new OwnerDeletionException();
    }

    return { id: ownerOnObject.userId };
  }
}
