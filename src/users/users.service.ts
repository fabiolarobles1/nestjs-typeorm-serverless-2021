import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { UsersEntity } from '../entities/users.entity';
import { SubmitFormDTO } from './dto/submitForm.dto';
import { FormEntity } from '../entities/form.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UsersEntity) private readonly usersRepo: Repository<UsersEntity>,
		@InjectRepository(FormEntity) private readonly formRepo: Repository<FormEntity>
	) {}
	public async getUsers() {
		return await this.usersRepo.find();
	}

	public async insertDivorceType(
		userAnswers: SubmitFormDTO,
		user_id: number
	): Promise<{ message: string; status: number }> {
		const newFormRecord = new FormEntity(userAnswers, user_id);
		try {
			await this.formRepo.save(newFormRecord);
			return { message: 'success!', status: HttpStatus.OK };
		} catch (err) {
			console.log(err);
			return { message: 'internal server error', status: HttpStatus.INTERNAL_SERVER_ERROR };
		}
	}

	public async acceptDivorceRequest(attorney_id: number, form_id: number) {
		try {
			const record = await this.formRepo.findOne({ where: { attorney_id, id: form_id } });

			if (!record) {
				throw new InternalServerErrorException('Something went wrong updating the record');
			}

			record.form_status = 3;
			await this.formRepo.save(record);
			return { message: 'success!', status: HttpStatus.OK };
		} catch (error) {
			console.log(error);
			return { message: 'internal server error', status: HttpStatus.INTERNAL_SERVER_ERROR };
		}
	}

	public async getUserRequests(user_id: number) {
		try {
			const query = `
				SELECT
					CONCAT(first_name, ' ', last_name) as lawyer,
					f.id as form_id,
					d1 as divorce_1,
					d2 as divorce_2,
					d3 as divorce_3,
					status,
					added_on as sent_date
				FROM form f
				LEFT JOIN users on f.attorney_id = users.id
				LEFT JOIN form_status fs on f.form_status = fs.id
				WHERE user_id = ${user_id};
			`;
			const results = await getManager().query(query);
			return { results, status: HttpStatus.OK };
		} catch (err) {
			console.log(err);
			return { message: 'internal server error', status: HttpStatus.INTERNAL_SERVER_ERROR };
		}
	}

	public async getAttorneyRequest(user_id: number): Promise<{ results?: []; message?: string; status: number }> {
		try {
			const query = `
			SELECT
				CONCAT(first_name, ' ', last_name) as name,
				f.id as form_id,
				d1 as divorce_1,
				d2 as divorce_2,
				d3 as divorce_3,
				status,
				added_on as sent_date
			FROM form f
			LEFT JOIN users on f.user_id = users.id
			LEFT JOIN form_status fs on f.form_status = fs.id
			WHERE attorney_id = ${user_id};
			`;
			const results = await getManager().query(query);
			return { results, status: HttpStatus.OK };
		} catch (err) {
			console.log(err);
			return { message: 'internal server error', status: HttpStatus.INTERNAL_SERVER_ERROR };
		}
	}
}
