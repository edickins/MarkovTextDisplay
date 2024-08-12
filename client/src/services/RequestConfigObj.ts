export type RequestConfig = {
  aiStartupRequestCount: number;
  aiNameRequestCount: number;
  aiStatementRequestCount: number;
};

export default class RequestConfigObj {
  aiNameRequestCount: number;

  aiStatementRequestCount: number;

  aiStartupRequestCount: number;

  aiInitialStartupTextCount: number;

  isInitialised: boolean;

  constructor() {
    this.aiNameRequestCount = Math.floor(Math.random() * 2);
    this.aiStatementRequestCount = Math.floor(Math.random() * 3 + 1);
    this.aiStartupRequestCount = Math.floor(Math.random() * 5 + 3);
    this.aiInitialStartupTextCount = 3;
    this.isInitialised = false;
  }
}
