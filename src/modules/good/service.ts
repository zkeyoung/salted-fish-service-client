import { QueryOrder, wrap } from '@mikro-orm/core';
import { EntityRepository, ObjectId } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { GoodAuditStatus } from '../../common/enums/good';
import type { ReqUser } from '../../decorator/req-user';
import Good from '../orm/entities/good';
import User from '../orm/entities/user';
import CreateGoodDto from './dto/create-good';
import QueryGoodsDto from './dto/query-goods';

@Injectable()
export default class GoodService {
  constructor(
    @InjectRepository(Good)
    private readonly goodRepository: EntityRepository<Good>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
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

  getOneGood(id: string) {
    return this.goodRepository.findOne(id, {
      fields: [
        'category',
        'createdAt',
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
  }

  async deleteOneGood(id: string) {
    const good = await this.goodRepository.findOne(id);
    wrap(good).assign({ deletedAt: new Date() });
    return this.goodRepository.flush();
  }
}
