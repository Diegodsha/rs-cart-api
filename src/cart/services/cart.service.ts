import { Injectable } from '@nestjs/common';
import { Cart, CartItem } from '../models';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CartItem as CartItemE} from 'src/entities/cart-item.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { Cart as CartE, CartStatus } from 'src/entities/cart.entity';

@Injectable()
export class CartService {
  constructor (
    @InjectRepository(CartE) private readonly cartRepository: Repository<CartE>,
    @InjectRepository(CartItemE) private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
) {}

  async findByUserId (userId: string): Promise<Cart> {
    return await this.cartRepository.findOne({
      where: { user: { id: userId }, status: CartStatus.OPEN },    });
  }

  async createByUserId(userId: string) {
    const user = await this.userRepository.findOne(userId as FindOneOptions<User>);
    const cart = this.cartRepository.create({
      user: user,
      status: CartStatus.OPEN,
    });


    return await this.cartRepository.save(cart);
  }

  async findOrCreateByUserId(userId: string): Promise<Cart>  {
    const userCart = await this.findByUserId(userId);
    if (userCart) {
      return userCart;
    }
    return this.createByUserId(userId);
  }

  async updateByUserId (userId: string, itemToUpdate: CartItem): Promise<Cart> {
    const cart = await this.findOrCreateByUserId(userId);
    const item = cart.items.find(it => it.product.id === itemToUpdate.product.id);

    if (!item) {
      let product = await this.productRepository.findOne(itemToUpdate.product.id as FindOneOptions<Product>);

      if (!product) {
        product = this.productRepository.create(itemToUpdate.product);
        product = await this.productRepository.save(product);
      }

      const newItem = this.cartItemRepository.create({
        count: itemToUpdate.count,
        product: product,
      });

      cart.items.push(newItem);
    } else if (itemToUpdate.count === 0) {
      await this.cartItemRepository.delete(item);
      cart.items = cart.items.filter(it => it.product.id !== itemToUpdate.product.id);
    } else {
      item.count = itemToUpdate.count;
    }


    return await this.cartRepository.save(cart);
  }

  async update (userId: string, { status }: { status: CartStatus }) {
    const userCart = await this.cartRepository.findOne({
      where: { user: { id: userId }, status: CartStatus.OPEN },
      relations: ['items', 'items.product'],
    });

    userCart.status = status;

    return await this.cartRepository.save(userCart);
  }

  async removeByUserId(userId): Promise<void> {
    await this.cartRepository.delete({ user: { id: userId } });
  }

}
