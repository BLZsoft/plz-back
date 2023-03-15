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
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Authorized, Scope, Token, TokenPayload } from 'auth';
import {
  ApiOkPaginatedResponse,
  Pagination,
  PaginationDto,
  PaginationResultDto
} from 'common/pagination';

import { CreateObjectDto } from './dto/create-object.dto';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateObjectDto } from './dto/update-object.dto';
import { ObjectEntity } from './entities/object.entity';
import { OwnerEntity } from './entities/owner.entity';
import { AuthorDeletionException } from './exceptions/author-deletion.exception';
import { ObjectNotFoundException } from './exceptions/object-not-found.exception';
import { OwnerAlreadyExistsException } from './exceptions/owner-already-exists.exception';
import { OwnerNotFoundException } from './exceptions/owner-not-found.exception';
import { ObjectsService } from './objects.service';

@ApiTags('objects')
@Controller('objects')
@Authorized()
export class ObjectsController {
  constructor(private readonly objectsService: ObjectsService) {
  }

  private async isOwner(userId: string, objectId: number): Promise<boolean> {
    try {
      await this.objectsService.findOwner(userId, objectId);

      return true;
    } catch (e) {
      return false;
    }
  }

  private async isAuthor(userId: string, objectId: number): Promise<boolean> {
    try {
      const owner = await this.objectsService.findOwner(userId, objectId);

      return owner.author;
    } catch (e) {
      return false;
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Создает объект.'
  })
  @ApiCreatedResponse({
    type: ObjectEntity,
    description: 'Объект успешно создан.'
  })
  create(
    @Token() token: TokenPayload,
    @Body() createObjectDto: CreateObjectDto
  ): Promise<ObjectEntity> {
    return this.objectsService.create(token.sub, createObjectDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Возвращает список объектов.'
  })
  @ApiOkPaginatedResponse({
    type: ObjectEntity,
    description: 'Список объектов.'
  })
  find(
    @Token() token: TokenPayload,
    @Pagination() pagination: PaginationDto
  ): Promise<PaginationResultDto<ObjectEntity>> {
    const canReadAll = token.scopes.some(
      (scope) => scope === Scope.ReadAllObjects
    );

    if (canReadAll) {
      return this.objectsService.find(pagination);
    }

    return this.objectsService.findByOwner(token.sub, pagination);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Возвращает указанный объект.'
  })
  @ApiOkResponse({
    type: ObjectEntity,
    description: 'Найденный объект.'
  })
  @ApiException(() => ObjectNotFoundException, {
    description: 'Объект с указанным id не найден.'
  })
  async findOne(
    @Token() token: TokenPayload,
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<ObjectEntity> {
    const canReadAll = token.scopes.some(
      (scope) => scope === Scope.ReadAllObjects
    );
    if (canReadAll) {
      return this.objectsService.findOne(id);
    }

    const isOwner = await this.isOwner(token.sub, id);
    if (isOwner) {
      return this.objectsService.findOne(id);
    }

    throw new ObjectNotFoundException();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновляет указанный объект' })
  @ApiOkResponse({
    description: 'Объект успешно обновлен.',
    type: ObjectEntity
  })
  @ApiException(() => ObjectNotFoundException, {
    description: 'Объект с указанным id не найден.'
  })
  async update(
    @Token() token: TokenPayload,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateObjectDto: UpdateObjectDto
  ): Promise<ObjectEntity> {
    const canWriteAll = token.scopes.some(
      (scope) => scope === Scope.WriteAllObjects
    );
    if (canWriteAll) {
      return this.objectsService.update(id, updateObjectDto);
    }

    const isOwner = await this.isOwner(token.sub, id);
    if (isOwner) {
      return this.objectsService.update(id, updateObjectDto);
    }

    throw new ObjectNotFoundException();
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Удаляет указанный объект.'
  })
  @ApiOkResponse({
    description: 'Объект успешно удален.',
    type: ObjectEntity
  })
  @ApiException(() => ObjectNotFoundException, {
    description: 'Объект с указанным id не найден.'
  })
  remove(
    @Token() token: TokenPayload,
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<ObjectEntity> {
    const canWriteAll = token.scopes.some(
      (scope) => scope === Scope.WriteAllObjects
    );
    if (canWriteAll) {
      return this.objectsService.remove(id);
    }

    const isOwner = this.isOwner(token.sub, id);
    if (isOwner) {
      return this.objectsService.remove(id);
    }
  }

  @Get(':objectId/owners')
  @ApiOperation({
    summary: 'Возвращает владельцев указанного объекта.'
  })
  @ApiOkPaginatedResponse({
    description: 'Список владельцев объекта.',
    type: OwnerEntity
  })
  @ApiException(() => ObjectNotFoundException, {
    description: 'Объект с указанным id не найден.'
  })
  getOwners(
    @Token() token: TokenPayload,
    @Param('objectId', new ParseIntPipe()) objectId: number,
    @Pagination() pagination: PaginationDto
  ): Promise<PaginationResultDto<OwnerEntity>> {
    const canReadAll = token.scopes.some(
      (scope) => scope === Scope.ReadAllObjects
    );
    if (canReadAll) {
      return this.objectsService.findAllOwners(objectId, pagination);
    }

    const isOwner = this.isOwner(token.sub, objectId);
    if (isOwner) {
      return this.objectsService.findAllOwners(objectId, pagination);
    }

    throw new ObjectNotFoundException();
  }

  @Post(':objectId/owners')
  @ApiOperation({
    summary: 'Добавляет владельца к объекту.'
  })
  @ApiCreatedResponse({
    description: 'Добавленный владелец.',
    type: OwnerEntity
  })
  @ApiException(() => OwnerAlreadyExistsException, {
    description: 'Владелец уже существует.'
  })
  @ApiException(() => ObjectNotFoundException, {
    description: 'Объект с указанным id не найден.'
  })
  addOwner(
    @Token() token: TokenPayload,
    @Param('objectId', new ParseIntPipe()) objectId: number,
    @Body() { id }: CreateOwnerDto
  ): Promise<OwnerEntity> {
    const canWriteAll = token.scopes.some(
      (scope) => scope === Scope.WriteAllObjects
    );
    if (canWriteAll) {
      return this.objectsService.addOwner(id, objectId);
    }

    const isOwner = this.isOwner(token.sub, objectId);
    if (isOwner) {
      return this.objectsService.addOwner(id, objectId);
    }

    throw new ObjectNotFoundException();
  }

  @Delete(':objectId/owners/:id')
  @ApiOperation({ summary: 'Удаляет владельца из объекта.' })
  @ApiOkResponse({
    type: OwnerEntity,
    description: 'Удаленный владелец.'
  })
  @ApiException(() => ObjectNotFoundException, {
    description: 'Объект с указанным id не найден.'
  })
  @ApiException(() => OwnerNotFoundException, {
    description: 'Владелец с указанным id не найден.'
  })
  @ApiException(() => AuthorDeletionException, {
    description: 'Нельзя удалить автора объекта.'
  })
  removeOwner(
    @Token() token: TokenPayload,
    @Param('objectId', new ParseIntPipe()) objectId: number,
    @Param('id') id: string
  ): Promise<OwnerEntity> {
    const isAuthorDelete = this.isAuthor(id, objectId);
    if (isAuthorDelete) {
      throw new AuthorDeletionException();
    }

    const canWriteAll = token.scopes.some(
      (scope) => scope === Scope.WriteAllObjects
    );
    if (canWriteAll) {
      return this.objectsService.removeOwner(id, objectId);
    }

    const isOwner = this.isOwner(token.sub, objectId);
    if (isOwner) {
      return this.objectsService.removeOwner(id, objectId);
    }

    throw new ObjectNotFoundException();
  }
}
