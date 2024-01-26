import { DocumentBuilder } from '@nestjs/swagger'

const swaggerConfig = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build()

export default swaggerConfig
