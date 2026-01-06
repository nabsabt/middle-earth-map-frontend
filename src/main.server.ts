import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { MapRootComponent } from './app/@Component/map/map.root.component';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(MapRootComponent, config, context);

export default bootstrap;
