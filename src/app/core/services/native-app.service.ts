import { Injectable, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class NativeAppService {
  readonly isNative = signal<boolean>(Capacitor.isNativePlatform());
  readonly platform = signal<string>(Capacitor.getPlatform());

  constructor() {
    this.initNativeFeatures();
  }

  private async initNativeFeatures() {
    if (this.isNative()) {
      try {
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setOverlaysWebView({ overlay: false });
      } catch (err) {
        console.warn('Native status bar setup error or plugin not installed:', err);
      }
    }
  }
}
