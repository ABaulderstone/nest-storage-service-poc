# Storage Service Proof of Concept

## Purpose

Implementing some kind of simple storage (for example S3) is something most developers will need to do during the course of thier career. However development and testing often require a lot of reads and writes to this service, and this could incur a cost. This project is trying to find a solution to the problem of `I want s3 integration but not in dev/test environments`

## Running the app

Assuming you have docker running, testing the local service should be as simple as copying the .env example to an .env

```bash
 cp ./.env.example ./.env
```

and then editing the environment variables as you see fit
ensure the docker compose points to the right .env file(in all services)

```yml
env_file:
  - ./.env
```

and then running

```bash
docker compose up
```

By default the env file should run the app in development mode, feel free to create an as3 bucket, provide some api keys and change to running in staging mode to test the s3 storage service

## Implementation

There are a couple of aspects to this project

### Docker

For ease of running the various services in dev mode, and for a more seamless deployment this project uses docker and docker compose to run mysql, the express storage service(see below), and the nest application.

### Express Storage Service

A lightweight express app that handles file 'upload' (to a local file system) and retrieval.

```js
const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
const upload = multer({ dest: 'uploads/' });

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(express.json());
app.get('/test', (req, res) => {
  res.send('Hello, world');
});

app.post('/mock-s3/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const key = `${uuidv4()}-${file.originalname}`;
  const filePath = path.join(uploadDir, key);
  fs.renameSync(file.path, filePath);
  res.json({ key });
});

app.get('/mock-s3/presigned/:key', (req, res) => {
  const { key } = req.params;
  const filePath = path.join(uploadDir, key);
  if (fs.existsSync(filePath)) {
    return res.json({ url: `http://localhost:3001/mock-s3/download/${key}` });
  }
  return res.status(404).send('File not found');
});

app.get('/mock-s3/download/:key', (req, res) => {
  const { key } = req.params;
  const filePath = path.join(uploadDir, key);
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  return res.status(404).send('File not found');
});

app.listen(Number(process.env.PORT) || 3001, () => {
  console.log('Storage service running');
});
```

### Nest Application

The `storage` domain handles all upload logic.

#### Module

The module has a dynamic provider `STORAGE_SERVICE` which will either be a `LocalStorageService` in test or dev mode and a `S3StorageService` in any other mode

```ts
@Module({
  imports: [ConfigModule, HttpModule, MikroOrmModule.forFeature([Attachment])],
  providers: [
    {
      provide: 'STORAGE_SERVICE',
      useFactory: (configService: ConfigService, httpService: HttpService) => {
        const env = configService.get<string>('NODE_ENV', 'development');
        return env === 'development' || env === 'test'
          ? new LocalStorageService(httpService, configService)
          : new S3StorageService(configService);
      },
      inject: [ConfigService, HttpService],
    },
    AttachmentService,
  ],
  exports: [AttachmentService],
})
export class StorageModule {}
```

#### Attachment Service

The attachment service injects that `STORAGE_SERVICE` provider, which can be typed as the generic interface `StorageService` (see below)

```ts
export class AttachmentService {
  constructor(
    @InjectRepository(Attachment)
    private readonly repo: EntityRepository<Attachment>,
    @Inject('STORAGE_SERVICE') private readonly storageService: StorageService
  ) {}
  // rest of class
}
```

##### Storage Service Interface

Both `S3StorageService` and `LocalStorageService` implement these methods

```ts
export interface StorageService {
  getPresignedUrl(key: string): Promise<string>;
  upload(file: Express.Multer.File): Promise<{ key: string }>;
}
```

#### Attachment Entity

The attachment entity creates a polymorphic table so that files can be attached to various entities

```ts
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { AttachableType } from '../types';

@Entity({ tableName: 'attachments' })
export class Attachment {
  @PrimaryKey()
  id: number;

  @Property()
  key: string;

  @Property()
  originalName: string;
  @Property()
  mimeType: string;

  @Property()
  attachableType: AttachableType;

  @Property()
  attachableId: number;
}
```

Unfortunately mikro-orm doesn't support polymorphic relationships so a bit of work is required to attach entities in the service layer.
If interested have a look at the methods on attachment service to get an idea of how this might work

```ts
@Injectable()
export class AttachmentService {
  constructor(
    @InjectRepository(Attachment)
    private readonly repo: EntityRepository<Attachment>,
    @Inject('STORAGE_SERVICE') private readonly storageService: StorageService
  ) {}

  async create(
    file: Express.Multer.File,
    attachableType: string,
    attachableId: number
  ) {
    const { key } = await this.storageService.upload(file);
    const { mimetype, originalname } = file;
    const data = {
      key,
      mimeType: mimetype,
      originalName: originalname,
      attachableType,
      attachableId,
    };
    const newAttachment = plainToInstance(Attachment, data);
    await this.repo.getEntityManager().persistAndFlush(newAttachment);
    return newAttachment;
  }

  findOne(attachableType: AttachableType, attachableId: number) {
    return this.repo.findOne({ $and: [{ attachableId }, { attachableType }] });
  }

  findMany(attachableType: AttachableType, attachableTds: number[]) {
    return this.repo.find({
      $and: [{ attachableType }, { attachableId: { $in: attachableTds } }],
    });
  }

  getPresignedUrl(key: string) {
    return this.storageService.getPresignedUrl(key);
  }

  async getManyPresignedUrls(keys: string[]): Promise<PresignedUrlMap> {
    const promises = keys.map((key) => this.getPresignedUrl(key));
    const results = await Promise.allSettled(promises);
    const urls = results.reduce((list, result) => {
      if (result.status === 'fulfilled') {
        list.push(result.value);
      }
      return list;
    }, []);

    return keys.reduce((map, key, index) => {
      map[key] = { key, url: urls[index] };
      return map;
    }, {} as PresignedUrlMap);
  }
}
```
