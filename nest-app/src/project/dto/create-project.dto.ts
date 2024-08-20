import { IsNotEmpty, IsOptional, IsUrl, Min } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @Min(1)
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
