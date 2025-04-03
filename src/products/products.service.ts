import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      await firstValueFrom(
        this.client.send('FIND_USER_BY_ID', { term: createProductDto.userId }),
      );

      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);

      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async findAllById(id: string) {
    const products = await this.productRepository.find({
      where: { userId: id },
    });

    return products;
  }
}
