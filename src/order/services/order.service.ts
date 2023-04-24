import { Injectable } from '@nestjs/common';

import { Order } from '../models';
import { InjectRepository } from '@nestjs/typeorm';
import { Order as OrderE, OrderStatus } from 'src/entities/order.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor (
    @InjectRepository(OrderE) private readonly orderRepository: Repository<OrderE>,
) {}

async create (data: any): Promise<Order> {
  const order = this.orderRepository.create({
    user_id:data.userId,
    cart_id:data.cartId,
    payment: data.payment,
    delivery: data.delivery,
    comments: data.comments,
    status: OrderStatus.OPEN,
    total: data.total,
  });

  return await this.orderRepository.save(order);
}

  async findById(orderId: string): Promise<Order> {
    return await this.orderRepository.findOne(orderId as FindOneOptions<OrderE>);
  }

  async update(orderId, data): Promise<Order> {
    const order = await this.orderRepository.findOne(orderId as FindOneOptions<OrderE>);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    this.orderRepository.merge(order, data);

    return await this.orderRepository.save(order);
  }
}
