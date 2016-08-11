import { browserDynamicPlatform } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { enableProdMode } from '@angular/core';

if (process.env.ENV === 'production') {
  enableProdMode();
}

browserDynamicPlatform().bootstrapModule(AppModule);
