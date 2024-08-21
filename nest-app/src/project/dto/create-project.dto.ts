import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsUrl, Min } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  ownerId: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsUrl()
  githubLink: string;

  @IsOptional()
  @IsUrl()
  deployedLink: string;
}
