import { ApiProperty } from "@nestjs/swagger";
import { CartStatus } from "src/entities/cart.entity";
import { User } from "src/entities/user.entity";



export class CreateCartDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    user_id: User['id'];

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    status: CartStatus;

    
}