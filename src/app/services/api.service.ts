import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Idle } from '@ng-idle/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' })
  };

  constructor(private http: HttpClient, private idle: Idle) { }

  postProduct(data: any) {

    return this.http.post<any>("http://localhost:3000/productList/", data);
  }

  postIdle(data: any) {
    // debugger
    return this.http.post<any>("http://localhost:3000/ildeList/", data, this.httpOptions);
  }

  getProduct() {
    return this.http.get<any>("http://localhost:3000/productList/");
  }

  putProduct(data: any, id: number) {
    return this.http.put<any>("http://localhost:3000/productList/" + id, data);
  }

  deleteProduct(id: number) {
    return this.http.delete<any>("http://localhost:3000/productList/" + id);
  }
}
