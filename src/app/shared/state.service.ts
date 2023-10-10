import { Injectable } from '@angular/core';

@Injectable()
export class StateService {
    public properties = new Map<string, string>();
}
