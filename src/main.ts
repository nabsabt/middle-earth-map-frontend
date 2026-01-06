import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { MapRootComponent } from './app/@Component/map/map.root.component';

bootstrapApplication(MapRootComponent, appConfig).catch((err) => console.error(err));
