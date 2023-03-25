import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import PagingDto from '../../common/dtos/paging';
import { ReqUser } from '../../decorator/req-user';
import Concern from '../orm/entities/concern';
import Good from '../orm/entities/good';

@Injectable()
export default class ConcernService {
  constructor(
    @InjectRepository(Good)
    private readonly goodRepository: EntityRepository<Good>,
    @InjectRepository(Concern)
    private readonly concernRepository: EntityRepository<Concern>,
  ) {}
  async changeMyConcern(reqUser: ReqUser, goodId: string) {
    await this.goodRepository.findOneOrFail(
      { id: goodId, isOnShelf: true },
      { fields: ['id'] },
    );
    const concern = await this.concernRepository.findOne(
      { user: reqUser.id, good: goodId },
      { fields: ['enable'] },
    );
    if (concern) {
      concern.enable = !concern.enable;
      return this.concernRepository.flush();
    }
    const newConcern = this.concernRepository.create({
      enable: true,
      user: reqUser.id,
      good: goodId,
    });
    return this.concernRepository.persistAndFlush(newConcern);
  }

  async getMyConcerns(reqUser: ReqUser, { page, perPage }: PagingDto) {
    const concerns = await this.concernRepository.find(
      { user: reqUser.id, enable: true },
      {
        offset: (page - 1) * perPage,
        limit: perPage,
        fields: [
          'good',
          'good.id',
          'good.title',
          'good.price',
          'good.region',
          'good.preview',
          'good.category',
        ],
        populate: ['good'],
      },
    );
    return concerns;
  }
}
