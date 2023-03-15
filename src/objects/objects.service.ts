import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { PaginationDto, PaginationResultDto } from 'common/pagination';

import { CreateObjectDto } from './dto/create-object.dto';
import { UpdateObjectDto } from './dto/update-object.dto';
import { ObjectEntity } from './entities/object.entity';
import { OwnerEntity } from './entities/owner.entity';
import { ObjectNotFoundException } from './exceptions/object-not-found.exception';
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
          create: [{ id: ownerId, author: true }]
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

  async findByOwner(
    ownerId: string,
    { skip, take }: PaginationDto
  ): Promise<PaginationResultDto<ObjectEntity>> {
    const filter = {
      owners: {
        some: { id: ownerId }
      }
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.object.findMany({
        where: filter,
        orderBy: {
          id: 'asc'
        },
        skip,
        take
      }),
      this.prisma.object.count({
        where: filter
      })
    ]);

    return { data, total };
  }

  async findOne(id: number): Promise<ObjectEntity> {
    const result = await this.prisma.object.findUnique({
      where: { id }
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
    try {
      return await this.prisma.object.update({
        where: { id },
        data: updateObjectDto
      });
    } catch {
      throw new ObjectNotFoundException();
    }
  }

  async remove(id: number): Promise<ObjectEntity> {
    try {
      return await this.prisma.object.delete({
        where: { id }
      });
    } catch {
      throw new ObjectNotFoundException();
    }
  }

  async findOwner(id: string, objectId: number): Promise<OwnerEntity> {
    const result = this.prisma.ownersOnObject.findUnique({
      where: {
        id_objectId: {
          id,
          objectId
        }
      }
    });

    if (!result) {
      throw new OwnerNotFoundException();
    }

    return result;
  }

  async findAllOwners(
    id: number,
    { skip, take }: PaginationDto
  ): Promise<PaginationResultDto<OwnerEntity>> {
    try {
      const [data, total] = await this.prisma.$transaction([
        this.prisma.ownersOnObject.findMany({
          where: {
            objectId: id
          },
          select: {
            id: true,
            author: true
          },
          skip,
          take
        }),
        this.prisma.ownersOnObject.count()
      ]);

      return {
        data,
        total
      };
    } catch (e) {
      throw new ObjectNotFoundException();
    }
  }

  async addOwner(id: string, objectId: number): Promise<OwnerEntity> {
    try {
      return await this.prisma.ownersOnObject.create({
        data: {
          id,
          objectId
        }
      });
    } catch {
      throw new ObjectNotFoundException();
    }
  }

  async removeOwner(id: string, objectId: number): Promise<OwnerEntity> {
    try {
      return await this.prisma.ownersOnObject.delete({
        where: {
          id_objectId: {
            id,
            objectId
          }
        }
      });
    } catch {
      throw new OwnerNotFoundException();
    }
  }
}
