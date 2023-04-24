
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from 'src/entities/cart-item.entity';
import { Cart } from 'src/entities/cart.entity';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';


@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [Cart, CartItem, Order, Product, User],
            namingStrategy: new SnakeNamingStrategy(),
            logging: false,
        }),
        TypeOrmModule.forFeature([Cart, CartItem, Order, Product, User]),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}