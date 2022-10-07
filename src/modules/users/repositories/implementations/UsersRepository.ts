import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOneOrFail({
      relations: ['games'],
      where: {id: user_id}
    })

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query('SELECT * FROM USERS ORDER BY first_name');
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query(`
    SELECT u.email, u.first_name, u.last_name 
    FROM USERS u 
    where UPPER(u.first_name) = UPPER('${first_name}') and 
    UPPER(u.last_name) = UPPER('${last_name}')`
    ); 
  }
}
