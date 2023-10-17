import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SourcecodeComponent } from './sourcecode.component';

describe('SourcecodeComponent', () => {
  let component: SourcecodeComponent;
  let fixture: ComponentFixture<SourcecodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SourcecodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourcecodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
