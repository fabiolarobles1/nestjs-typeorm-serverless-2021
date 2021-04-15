import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../entities/users.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { UsersController } from './users.controller';
import { FormEntity } from '../entities/form.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([ UsersEntity, FormEntity ]),
		JwtModule.register({
			secret: 'asdasdaswdasdas',
			signOptions: { expiresIn: '2 days' }
		})
	],
	exports: [ TypeOrmModule, UsersService ],
	controllers: [ UsersController ],
	providers: [ UsersService, AuthService ]
})
export class UsersModule {}
