
import {  HttpInterceptorFn } from '@angular/common/http';



export const ProviderInterceptor: HttpInterceptorFn = (req, next) => {
    // LocalStorage'dan provider değerini al
    const provider = localStorage.getItem('Provider') || '1'; // Varsayılan Juniper
  
    // Mevcut query parametrelerini al ve provider'ı ekle
    const modifiedParams = req.params.set('Provider', provider);
  
    // Yeni bir request oluştur ve parametreleri ekle
    const modifiedReq = req.clone({ params: modifiedParams });
  
    // İşleme devam et
    return next(modifiedReq);
  };