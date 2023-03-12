import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import {
  ApiOkPaginatedResponse,
  Pagination,
  PaginationDto,
  PaginationResultDto
} from 'common/pagination';
import { Authorized } from 'logto';
import { UserNotFoundException } from 'logto/exceptions';

import { CreateObjectDto } from './dto/create-object.dto';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateObjectDto } from './dto/update-object.dto';
import { ObjectEntity } from './entities/object.entity';
import { CoOwnerEntity, WithOwnerEntity } from './entities/owner.entity';
import { ObjectNotFoundException } from './exceptions/object-not-found.exception';
import { OwnerDeletionException } from './exceptions/owner-deletion.exception';
import { OwnerNotFoundException } from './exceptions/owner-not-found.exception';
import { ObjectsService } from './objects.service';

@ApiTags('objects')
@Controller('objects')
@Authorized()
export class ObjectsController {
  constructor(private readonly objectsService: ObjectsService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Объект успешно создан.',
    type: ObjectEntity
  })
  // TODO: ApiUnprocessableEntityResponse()
  create(@Body() createObjectDto: CreateObjectDto): Promise<ObjectEntity> {
    return this.objectsService.create('1', createObjectDto);
  }

  @Get()
  @ApiOkPaginatedResponse({
    description: 'Возвращает список объектов.',
    type: ObjectEntity
  })
  find(
    @Pagination() pagination: PaginationDto
  ): Promise<PaginationResultDto<ObjectEntity>> {
    return this.objectsService.find(pagination);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Возвращает объект по указанному id.',
    type: ObjectEntity
  })
  @ApiException(() => ObjectNotFoundException, {
    description: 'Объект с указанным id не найден.'
  })
  findOne(@Param('id', new ParseIntPipe()) id: number): Promise<ObjectEntity> {
    return this.objectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Обновляет объект с указанным id.',
    type: ObjectEntity
  })
  @ApiException(() => ObjectNotFoundException, {
    description: 'Объект с указанным id не найден.'
  })
  // TODO: ApiUnprocessableEntityResponse()
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateObjectDto: UpdateObjectDto
  ): Promise<ObjectEntity> {
    return this.objectsService.update(id, updateObjectDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Удаляет объект с указанным id.',
    type: ObjectEntity
  })
  @ApiException(() => ObjectNotFoundException, {
    description: 'Объект с указанным id не найден.'
  })
  remove(@Param('id', new ParseIntPipe()) id: number): Promise<ObjectEntity> {
    return this.objectsService.remove(id);
  }

  @Get(':id/owners')
  @ApiOkPaginatedResponse({
    description: 'Возвращает список пользователей.',
    type: WithOwnerEntity
  })
  @ApiException(() => ObjectNotFoundException, {
    description: 'Объект с указанным id не найден.'
  })
  getOwners(
    @Param('id', new ParseIntPipe()) id: number,
    @Pagination() pagination: PaginationDto
  ): Promise<PaginationResultDto<WithOwnerEntity>> {
    return this.objectsService.getOwners(id, pagination);
  }

  @Post(':id/owners')
  @ApiCreatedResponse({
    description: 'Добавляет пользователя к объекту.',
    type: CoOwnerEntity
  })
  @ApiException(() => ObjectNotFoundException, {
    description: 'Объект с указанным id не найден.'
  })
  @ApiException(() => UserNotFoundException, {
    description: 'Пользователь с указанным id не найден.'
  })
  addOwner(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() { id: userId }: CreateOwnerDto
  ): Promise<CoOwnerEntity> {
    return this.objectsService.addOwner(id, userId);
  }

  @Delete(':id/owners/:userId')
  @ApiOkResponse({
    description: 'Открепляет пользователя от объекта.',
    type: CoOwnerEntity
  })
  @ApiException(() => ObjectNotFoundException, {
    description: 'Объект с указанным id не найден.'
  })
  @ApiException(() => OwnerNotFoundException, {
    description: 'Совладелец с указанным id не найден.'
  })
  @ApiException(() => OwnerDeletionException, {
    description: 'Нельзя открепить автора.'
  })
  removeOwner(
    @Param('id', new ParseIntPipe()) id: number,
    @Param('userId') userId: string
  ): Promise<CoOwnerEntity> {
    return this.objectsService.removeOwner(id, userId);
  }
}
