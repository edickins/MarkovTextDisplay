import RequestConfigEnum from '../enums/RequestConfigEnum';

export default class RequestConfigObj {
  aiApologyRequestCount: number;

  aiSystemStatusRequestCount: number;

  aiInitialStartupRequestCount: number;

  isInitialised: boolean;

  isReset: boolean;

  constructor(config: RequestConfigEnum) {
    let apologyRequestCount;
    let systemStatusRequestCount;
    let initialStartupRequestCount;
    let isInitialised;
    let isReset;

    switch (config) {
      case RequestConfigEnum.DEFAULT:
        apologyRequestCount = Math.floor(Math.random() * 1 + 2);
        systemStatusRequestCount = Math.floor(Math.random() * 2 + 1);
        initialStartupRequestCount = 4;
        isReset = false;
        isInitialised = false;
        break;
      case RequestConfigEnum.RESET:
        apologyRequestCount = Math.floor(Math.random() * 1 + 1);
        systemStatusRequestCount = 1;
        initialStartupRequestCount = 2;
        isReset = true;
        isInitialised = true;
        break;
      default:
        apologyRequestCount = Math.floor(Math.random() * 1 + 2);
        systemStatusRequestCount = Math.floor(Math.random() * 2 + 1);
        initialStartupRequestCount = 4;
        isReset = false;
        isInitialised = false;
    }

    this.aiApologyRequestCount = apologyRequestCount;
    this.aiSystemStatusRequestCount = systemStatusRequestCount;
    this.aiInitialStartupRequestCount = initialStartupRequestCount;
    this.isInitialised = isInitialised;
    this.isReset = isReset;
  }
}
