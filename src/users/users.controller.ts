import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	UseGuards,
	Request,
	Req,
	Query,
	ParseIntPipe,
	NotAcceptableException,
	Delete,
	Put
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/guards/local.auth.guard';
import { SubmitFormDTO } from './dto/submitForm.dto';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService, private readonly authService: AuthService) {}

	@Post('signup')
	public async signUp(@Body() payload: any) {
		return await this.authService.signup(payload);
	}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	public async login(@Request() req) {
		console.log(req.user);
		return this.authService.login(req.user);
	}

	@UseGuards(JwtAuthGuard)
	@Get('attorneys/requests')
	public async attorneysRequests(@Request() { user: { id } }) {
		return await this.usersService.getAttorneyRequest(id);
	}

	@UseGuards(JwtAuthGuard)
	@Get('requests')
	public async getUserRequests(@Request() { user: { id } }) {
		return await this.usersService.getUserRequests(id);
	}

	@UseGuards(JwtAuthGuard)
	@Put('attorneys/accept/:form_id')
	public async acceptRequest(
		@Request() { user: { id } },
		@Param('form_id', ParseIntPipe)
		form_id: number
	) {
		return await this.usersService.acceptDivorceRequest(id, form_id);
	}

	@UseGuards(JwtAuthGuard)
	@Post('submitForm')
	public async submitForm(@Request() { user: { id } }, @Body() body: SubmitFormDTO) {
		return this.usersService.insertDivorceType(body, id);
	}
}
