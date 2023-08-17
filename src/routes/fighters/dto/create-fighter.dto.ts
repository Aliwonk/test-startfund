export class CreateFighterDTO {
  nickname: string;
  surname: string;
  name: string;
  patronymic?: string;
  height: number;
  weight: number;
  nationality: string;
  gender: 'male' | 'female';
  dateofbirth: string;
}
