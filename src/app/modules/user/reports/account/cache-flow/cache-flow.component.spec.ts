import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacheFlowComponent } from './cache-flow.component';

describe('CacheFlowComponent', () => {
  let component: CacheFlowComponent;
  let fixture: ComponentFixture<CacheFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CacheFlowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CacheFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
