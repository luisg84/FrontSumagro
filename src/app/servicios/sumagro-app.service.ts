import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Producto } from '../model/producto';
import { Pedido } from '../interfaces/pedido';


@Injectable({
  providedIn: 'root'
})
export class SumagroAppService {
  endPoint = 'https://us-central1-sumagro-backend.cloudfunctions.net/app';
 public  options = {
    headers: {}
  };
  // https://us-central1-sumagro-backend.cloudfunctions.net/app

  // http://192.168.0.9:5001/sumagro-backend/us-central1/app
  constructor(private httpClient: HttpClient) { }
  private extractData(res: Response) {
    const body = res;
    console.log(body);
    return body || { };
  }
  obtenerOrdenesAlmacen(token){
    this.options.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      // tslint:disable-next-line:object-literal-shorthand
      // tslint:disable-next-line:object-literal-key-quotes
      'Authorization': token
    });
    // tslint:disable-next-line:max-line-length

    return this.httpClient.get(`${this.endPoint}/sumagro-app/warehouse/oders`, this.options).pipe(map(this.extractData));
  
  }
  getRemissionNumber(token){
    this.options.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      // tslint:disable-next-line:object-literal-shorthand
      // tslint:disable-next-line:object-literal-key-quotes
      'Authorization': token
    });
    // tslint:disable-next-line:max-line-length
return new Promise((resolve,reject)=>{
     this.httpClient.get(`${this.endPoint}/sumagro-app/remission/number`, this.options).pipe(map(this.extractData)).subscribe(data=> resolve(data));
  })
  }
  userUpdate(token, userUpdate): Observable<any> {
    this.options.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      // tslint:disable-next-line:object-literal-shorthand
      // tslint:disable-next-line:object-literal-key-quotes
      'Authorization': token
    });
    // tslint:disable-next-line:max-line-length
    return this.httpClient.post(`${this.endPoint}/sumagro-app/register`, JSON.stringify(userUpdate), this.options).pipe(map(this.extractData));
  }

  agregarOrden(token, objetoGeneral: Pedido ): Observable<any> {
    this.options.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      // tslint:disable-next-line:object-literal-shorthand
      // tslint:disable-next-line:object-literal-key-quotes
      'Authorization': token
    });
    console.log(this.options.headers);
    console.log("prueba Token: "+token);
    // tslint:disable-next-line:max-line-length
    return this.httpClient.post(`${this.endPoint}/sumagro-app/order`, JSON.stringify(objetoGeneral), this.options).pipe(map(this.extractData));
  }


  obtenerOrdenes(token): Observable<any> {
    this.options.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      // tslint:disable-next-line:object-literal-shorthand
      // tslint:disable-next-line:object-literal-key-quotes
      'Authorization': token

    });
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(`${this.endPoint}/sumagro-app/order`, this.options);

  }

  //order?status=PENDING

  obtenerPDF(token, id: string ): Observable<any> {
    // tslint:disable-next-line:prefer-const
    let tempHeaders: any = {
      headers : new HttpHeaders({
        'Content-Type':  'application/json',
        // tslint:disable-next-line:object-literal-shorthand
        // tslint:disable-next-line:object-literal-key-quotes
        'Authorization': token
      }),
      responseType: 'blob',
    };
   // console.log(this.options.headers);
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(`${this.endPoint}/sumagro-app/generate-pdf/${id}`, tempHeaders);
  }

  deleteOrder(token, id: string) {
    this.options.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      // tslint:disable-next-line:object-literal-shorthand
      // tslint:disable-next-line:object-literal-key-quotes
      'Authorization': token

    });
    // tslint:disable-next-line:max-line-length
    return new Promise((resolve,reject)=>{
     this.httpClient.patch(`${this.endPoint}/sumagro-app/warehouse/oders/view/${id}`,{}, this.options).subscribe(data=> resolve(data));
  })
  }

  obtenerInegenios(token): Observable<any> {
    this.options.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      // tslint:disable-next-line:object-literal-shorthand
      // tslint:disable-next-line:object-literal-key-quotes
      'Authorization': token

    });
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(`${this.endPoint}/sumagro-app/ingenios`, this.options);

  }

  obtenerOrdenesStatus(token): Observable<any> {
    this.options.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      // tslint:disable-next-line:object-literal-shorthand
      // tslint:disable-next-line:object-literal-key-quotes
      'Authorization': token

    });
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(`${this.endPoint}/sumagro-app/order`, this.options);

  }

  statusOrder(token, id: string): Observable<any> {
    this.options.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      // tslint:disable-next-line:object-literal-shorthand
      // tslint:disable-next-line:object-literal-key-quotes
      'Authorization': token

    });
    console.log('id enviado', id);
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(`${this.endPoint}/sumagro-app/order/status/${id}`, this.options);

  }

  mandarToken(token, token2 ): Observable<any> {
    this.options.headers = new HttpHeaders({
      'Content-Type': 'application/json', 
      // tslint:disable-next-line:object-literal-shorthand
      // tslint:disable-next-line:object-literal-key-quotes
      'Authorization': token
    });

    return this.httpClient.post(`${this.endPoint}/sumagro-app/token`, JSON.stringify({token: token2}), this.options);
  }

  mandarEmail(token, ingenioId,orderId ): Observable<any> {
    this.options.headers = new HttpHeaders({
      'Content-Type': 'application/json', 
      // tslint:disable-next-line:object-literal-shorthand
      // tslint:disable-next-line:object-literal-key-quotes
      'Authorization': token
    });

    return this.httpClient.post(`${this.endPoint}/sumagro-app/send-pdf/${orderId}`, JSON.stringify({ ingenioId}), this.options);
  }

  getInfo(token:string,userId:string){
    return new Promise((resolve,reject)=>{
      this.options.headers = new HttpHeaders({
        'Content-Type':  'application/json',
        // tslint:disable-next-line:object-literal-shorthand
        // tslint:disable-next-line:object-literal-key-quotes
        'Authorization': token
  
      });
      // tslint:disable-next-line:max-line-length
      return this.httpClient.get(`${this.endPoint}/sumagro-app/user/${userId}`, this.options).subscribe(data => resolve(data));
    })
  }

  detallesOrden(token, idOrden: string): Observable<any> {
    this.options.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      // tslint:disable-next-line:object-literal-shorthand
      // tslint:disable-next-line:object-literal-key-quotes
      'Authorization': token

    });
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(`${this.endPoint}/sumagro-app/order/${idOrden}`, this.options);
    ///sumagro-app/order/:orderId
    //return this.httpClient.get(`${this.endPoint}sumagro-app/ingenio/${idIngenio}/order/${idOrden}`, this.options);
  }
  
  statusUpdate(token, ingenioID,OrdenID,status:string): Observable<any> {
    this.options.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      // tslint:disable-next-line:object-literal-shorthand
      // tslint:disable-next-line:object-literal-key-quotes
      'Authorization': token
    });
    // tslint:disable-next-line:max-line-length
    return this.httpClient.patch(`${this.endPoint}/sumagro-app/ingenio/${ingenioID}/order/${OrdenID}`, JSON.stringify({status}), this.options)
  }


}

