import { createServer } from 'http';
import { envs } from './config/envs';
import { Server } from './presentation/server';
import { WssService } from './presentation/services/wss.service';
import { AppRoutes } from './presentation/routes';


(async()=> {
  main();
})();


function main() {

  const server = new Server({
    port: envs.PORT,
  });

  const hhtpServer = createServer( server.app )
  WssService.initWss({ server: hhtpServer })

  server.setRoutes( AppRoutes.routes)
  
  hhtpServer.listen( envs.PORT, () => {

    console.log(`Server running on port: ${envs.PORT}`)
  })
}