import { ArgumentsHost, Catch, WsExceptionFilter } from "@nestjs/common";


@Catch()
export class WebsocketExceptionFilter implements WsExceptionFilter{
    catch(_exception: any, host: ArgumentsHost) {
      const socket = host.switchToWs().getClient();
      socket.emit('exception',{
        status: 'error',
        message:'Ws message is invalid',
      })
    }



}