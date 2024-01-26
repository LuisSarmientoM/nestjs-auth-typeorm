import { Params } from 'nestjs-pino'

import { CORRELATION_ID_HEADER } from '../common/middleware/correlation-id/correlation-id.middleware'
export const loggerOptions: Params = {
    pinoHttp: {
        transport:
            process.env.NODE_ENV === 'production'
                ? undefined
                : {
                      target: 'pino-pretty',
                      options: {},
                  },
        autoLogging: false,
        serializers: {
            res() {
                return
            },
            req() {
                return
            },
        },
        customProps: function (req) {
            return {
                correlationId: req.headers[CORRELATION_ID_HEADER],
            }
        },
    },
}
