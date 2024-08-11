export type RequestConfig = {
  aiNameRequestCount: number;
  aiStatementRequestCount: number;
};

export default class RequestConfigObj {
  aiNameRequestCount: number;

  aiStatementRequestCount: number;

  constructor() {
    this.aiNameRequestCount = Math.floor(Math.random() * 2);
    this.aiStatementRequestCount = Math.floor(Math.random() * 3);
  }
}
