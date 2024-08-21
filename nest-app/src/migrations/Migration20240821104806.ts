import { Migration } from '@mikro-orm/migrations';

export class Migration20240821104806 extends Migration {

  override async up(): Promise<void> {
    this.addSql('create table `attachments` (`id` int unsigned not null auto_increment primary key, `key` varchar(255) not null, `original_name` varchar(255) not null, `mime_type` varchar(255) not null, `attachable_type` varchar(255) not null, `attachable_id` int not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `users` (`id` int unsigned not null auto_increment primary key, `email` varchar(255) not null, `username` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `users` add unique `users_email_unique`(`email`);');

    this.addSql('create table `projects` (`id` int unsigned not null auto_increment primary key, `title` varchar(255) not null, `github_link` varchar(255) not null, `owner_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `projects` add index `projects_owner_id_index`(`owner_id`);');

    this.addSql('alter table `projects` add constraint `projects_owner_id_foreign` foreign key (`owner_id`) references `users` (`id`) on update cascade;');
  }

  override async down(): Promise<void> {
    this.addSql('alter table `projects` drop foreign key `projects_owner_id_foreign`;');

    this.addSql('drop table if exists `attachments`;');

    this.addSql('drop table if exists `users`;');

    this.addSql('drop table if exists `projects`;');
  }

}
