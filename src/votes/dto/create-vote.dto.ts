import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateVoteDto {
  @IsInt()
  @IsPositive()
  userId: number;

  @IsInt()
  @IsPositive()
  optionId: number;
}