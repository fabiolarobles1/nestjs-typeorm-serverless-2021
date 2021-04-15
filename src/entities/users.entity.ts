import { Exclude, classToPlain } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersResponseInterface } from '../users/interface/users.response.interface';
import { InternalServerErrorException } from '@nestjs/common';

@Entity('users')
export class UsersEntity {
	@PrimaryGeneratedColumn() id: number;

	@Column() first_name: string;

	@Column() last_name: string;

	@Column() user_email: string;

	@Column() lawyer: boolean;

	@Column() rua: number;

	@Column()
	@Exclude()
	user_password: string;

	@BeforeInsert()
	async hashPassword() {
		this.user_password = await new Promise((resolve, reject) => {
			bcrypt.hash(this.user_password, 10, (err, encrypted) => {
				if (err) {
					throw new InternalServerErrorException('Something went wrong hashing the password');
				}
				resolve(encrypted);
			});
		});
	}

	async comparePassword(input: string) {
		return await bcrypt.compare(input, this.user_password);
	}

	toJSON(): UsersResponseInterface {
		return <UsersResponseInterface>classToPlain(this);
	}
}
