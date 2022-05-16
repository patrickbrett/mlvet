import express, { Express } from 'express';
import router from './routes';

const startExpressServer: () => Express = () => {
  const app = express();
  app.use('/', router);

  const port = process.env.EXPRESS_PORT;

  if (port !== undefined) {
    app.listen(port, () => {
      console.log(`Express Server listening on port :${port}!\n`);
    });
  } else {
    app.listen(() => {
      console.log(`EXPRESS_PORT undefined`);
    });
  }

  return app;
};

export default startExpressServer;
