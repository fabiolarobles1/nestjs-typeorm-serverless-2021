import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from '../entities/users.entity';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UsersEntity) private readonly usersRepo: Repository<UsersEntity>,
		private readonly jwtService: JwtService
	) {}

	public async validateUser(email: string, password: string) {
		return await this.usersRepo
			.findOne({ where: { user_email: email } })
			.then(async (user) => {
				const isValid = await user.comparePassword(password);
				if (isValid) {
					return user.toJSON();
				}
			})
			.catch(() => null);
	}

	public async login(payload: any) {
		const access_token = this.jwtService.sign(payload);
		return JSON.parse(`{ "access_token": "${access_token}" }`);
	}

	public async signup(payload: any) {
		const newUser = new UsersEntity();

		newUser.first_name = payload.first_name.trim();
		newUser.last_name = payload.last_name.trim();
		newUser.user_email = payload.email.toLowerCase().trim();
		newUser.lawyer = payload.lawyer;
		newUser.rua = payload.rua;
		newUser.user_password = payload.password;

		try {
			const user = await this.usersRepo.save(newUser);
			const token = this.login(user.toJSON());
			return token;
		} catch (error) {
			console.log(error);
			return null;
		}
	}
}
