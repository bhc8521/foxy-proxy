import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StatsService} from '../stats.service';
import {LocalStorageService} from '../local-storage.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Input() proxies: any[];

  @Input()
  get currentlySelectedProxy() {
    return this._currentlySelectedProxy;
  }
  @Output() currentlySelectedProxyChange = new EventEmitter<any>();
  set currentlySelectedProxy(proxy: any) {
    this._currentlySelectedProxy = proxy;
    this.currentlySelectedProxyChange.emit(proxy);
  }

  private _currentlySelectedProxy = null;

  constructor(
    private statsService: StatsService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
  }

  getProxies() {
    return this.proxies;
  }

  resetLocalConfig() {
    this.localStorageService.clearHideItems();
  }

  async logout() {
    this.localStorageService.clearAuthData();
    await this.statsService.reconnect();
  }

  showSideBySide() {
    const usableSpace = window.innerWidth - 314;
    const proxyCount = this.proxies.length;

    return proxyCount * 120 <= usableSpace;
  }
}