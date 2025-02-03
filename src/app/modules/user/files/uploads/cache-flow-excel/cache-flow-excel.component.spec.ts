import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacheFlowExcelComponent } from './cache-flow-excel.component';

describe('CacheFlowExcelComponent', () => {
  let component: CacheFlowExcelComponent;
  let fixture: ComponentFixture<CacheFlowExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CacheFlowExcelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CacheFlowExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
