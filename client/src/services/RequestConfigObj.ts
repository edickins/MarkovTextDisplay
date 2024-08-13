import RequestConfigEnum from '../enums/RequestConfigEnum';

export type RequestConfig = {
  aiStartupRequestCount: number;
  aiNameRequestCount: number;
  aiStatementRequestCount: number;
  isInitialized: boolean;
};

export default class RequestConfigObj {
  aiNameRequestCount: number;

  aiStatementRequestCount: number;

  aiStartupRequestCount: number;

  aiInitialStartupRequestCount: number;

  isInitialised: boolean;

  constructor(config: RequestConfigEnum) {
    let nameRequestCount;
    let statementRequestCount;
    let startupRequestCount;
    let initialStartupRequestCount;
    let isInitialised;

    switch (config) {
      case RequestConfigEnum.DEFAULT:
        nameRequestCount = Math.floor(Math.random() * 2);
        statementRequestCount = Math.floor(Math.random() * 2 + 1);
        startupRequestCount = Math.floor(Math.random() * 1 + 1);
        initialStartupRequestCount = 3;
        isInitialised = false;
        break;
      case RequestConfigEnum.STARTUP:
        nameRequestCount = 0;
        statementRequestCount = 0;
        startupRequestCount = Math.floor(Math.random() * 1 + 1);
        initialStartupRequestCount = 0;
        isInitialised = true;
        break;
      default:
        nameRequestCount = Math.floor(Math.random() * 2);
        statementRequestCount = Math.floor(Math.random() * 2 + 1);
        startupRequestCount = Math.floor(Math.random() * 1 + 1);
        initialStartupRequestCount = 3;
        isInitialised = false;
    }

    this.aiNameRequestCount = nameRequestCount;
    this.aiStatementRequestCount = statementRequestCount;
    this.aiStartupRequestCount = startupRequestCount;
    this.aiInitialStartupRequestCount = initialStartupRequestCount;
    this.isInitialised = isInitialised;
  }
}
