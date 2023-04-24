import { Column, Entity, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from './product.entity';

@Entity({ name: 'cart_items' })
export class CartItem {
    @ManyToOne(() => Cart, (card) => card.items, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    cart: Cart;

    @ManyToOne(() => Product, { eager: true })
    product: Product;

    @Column({ type: 'int', nullable: false })
    count: number;
}