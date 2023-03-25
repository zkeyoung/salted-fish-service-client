import { QueryOrder, wrap } from '@mikro-orm/core';
import { EntityRepository, ObjectId } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { GoodAuditStatus } from '../../common/enums/good';
import type { ReqUser } from '../../decorator/req-user';
import Concern from '../orm/entities/concern';
import Good from '../orm/entities/good';
import User from '../orm/entities/user';
import CreateGoodDto from './dto/create-good';
import PatchGoodsDto from './dto/patch-goods';
import QueryGoodsDto from './dto/query-goods';

@Injectable()
export default class GoodService {
  constructor(
    @InjectRepository(Good)
    private readonly goodRepository: EntityRepository<Good>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Concern)
    private readonly concernRepository: EntityRepository<Concern>,
  ) {}

  async publishOneGood(reqUser: ReqUser, createGoodDto: CreateGoodDto) {
    const good = this.goodRepository.create(createGoodDto);
    good.user = this.userRepository.getReference(reqUser.id);
    await this.goodRepository.persistAndFlush(good);
    return good.id;
  }

  async getMyGoods(reqUser: ReqUser, queryGoodsDto: QueryGoodsDto) {
    const { page, perPage } = queryGoodsDto;
    return this.goodRepository.find(
      {
        user: new ObjectId(reqUser.id),
      },
      {
        fields: [
          'auditMessage',
          'auditStatus',
          'category',
          'createdAt',
          'preview',
          'isOnShelf',
          'price',
          'region',
          'title',
        ],
        limit: perPage,
        offset: (page - 1) * perPage,
        orderBy: { createdAt: QueryOrder.DESC },
      },
    );
  }

  getGoods(queryGoodsDto: QueryGoodsDto) {
    const { page, perPage, ...filters } = queryGoodsDto;
    if (!filters.title) Reflect.deleteProperty(filters, 'title');
    return this.goodRepository.find(
      Object.assign<Omit<QueryGoodsDto, 'page' | 'perPage'>, Partial<Good>>(
        filters,
        {
          auditStatus: GoodAuditStatus.PASS,
          isOnShelf: true,
        },
      ),
      {
        fields: [
          'category',
          'preview',
          'price',
          'region',
          'title',
          'updatedAt',
        ],
        limit: perPage,
        offset: (page - 1) * perPage,
        orderBy: { updatedAt: QueryOrder.DESC },
      },
    );
  }

  async getOneGood(
    reqUser: ReqUser,
    id: string,
  ): Promise<Good & { concerned: boolean }> {
    const goodInfo = await this.goodRepository.findOneOrFail(id, {
      fields: [
        'category',
        'auditStatus',
        'createdAt',
        'isOnShelf',
        'desc',
        'fileUrls',
        'preview',
        'price',
        'region',
        'title',
        'user',
        'user.id',
        'user.avatar',
        'user.nickname',
      ],
      populate: ['user'],
    });
    const concern = await this.concernRepository.findOne(
      { user: reqUser.id, good: goodInfo.id },
      { fields: ['enable'] },
    );
    return {
      id: goodInfo.id,
      ...goodInfo,
      concerned: concern?.enable || false,
    };
  }

  async modifyOneGood(
    reqUser: ReqUser,
    goodId: string,
    patchGoodsDto: PatchGoodsDto,
  ) {
    const good = await this.goodRepository.findOneOrFail(
      { id: goodId, user: reqUser.id },
      {
        fields: ['id', 'user', 'user.id'],
        populate: ['user'],
      },
    );
    if (typeof patchGoodsDto.isOnShelf != 'boolean') {
      Object.assign(patchGoodsDto, {
        auditStatus: GoodAuditStatus.WAIT,
      });
    }
    wrap(good).assign(patchGoodsDto);
    return this.goodRepository.flush();
  }

  async deleteOneGood(reqUser: ReqUser, goodId: string) {
    const good = await this.goodRepository.findOneOrFail(
      { id: goodId, user: reqUser.id },
      { fields: ['id', 'user', 'user.id'], populate: ['user'] },
    );
    wrap(good).assign({ deletedAt: new Date() });
    return this.goodRepository.flush();
  }
}
