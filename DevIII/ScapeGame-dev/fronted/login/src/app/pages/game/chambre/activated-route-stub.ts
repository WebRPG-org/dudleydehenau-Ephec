import { BehaviorSubject } from 'rxjs';
import { Params, ActivatedRouteSnapshot, Data, UrlSegment } from '@angular/router';

export class ActivatedRouteStub {
  private subject = new BehaviorSubject(this.testParams);
  params = this.subject.asObservable();

  private _testParams: Params = {};
  get testParams() {
    return this._testParams;
  }
  set testParams(params: Params) {
    this._testParams = params;
    this.subject.next(params);
  }

  get snapshot() {
    return {
      params: this.testParams,
      url: [] as UrlSegment[],
      queryParams: {},
      fragment: '',
      data: {} as Data,
      outlet: '',
      component: null,
      routeConfig: null,
      root: null as unknown as ActivatedRouteSnapshot,
      parent: null,
      firstChild: null,
      children: [],
      pathFromRoot: [],
      paramMap: null as unknown as any,
      queryParamMap: null as unknown as any,
    };
  }
}

