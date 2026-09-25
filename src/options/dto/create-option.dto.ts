import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateOptionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  text: string;
}