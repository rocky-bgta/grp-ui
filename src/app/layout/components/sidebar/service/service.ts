

import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import * as jwt_decode from "jwt-decode";
import {Observable} from "rxjs/index";
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root',
})

export class Service{

    private nodes = null;
    private tokenInfo = null;
   /* private fileUrl = './assets/test.json';*/
    private menuByUserIdUrl = 'http://172.16.26.130:8888/service/auth/api/menu/';
   /* private allMenuUrl = 'http://172.16.201.123:7051/api/menu/all';
    private testUrl = 'http://localhost:8888/api';
    private picasaUrl = 'http://picasaweb.google.com/data/entry/api/user/shaikhsbd@gmail.com?alt=json';*/

   private accessToken = null;

    constructor(private http: HttpClient,
                private cookieService: CookieService) {
        this.accessToken = this.cookieService.get('access_token');
        this.tokenInfo = this.getDecodedAccessToken(this.accessToken);
        this.menuByUserIdUrl = this.menuByUserIdUrl + 'all';
    }

    private httpOptions = {
        headers: new HttpHeaders({
            'Authorization': 'Bearer ' + this.getAccessToken()
        })
    };

    getDecodedAccessToken(token: string): any {
        try {
            return jwt_decode(token);
        }
        catch (Error) {
            return null;
        }
    }

    getAccessToken(): any {
        return this.cookieService.get('access_token');
    }



    public getMenus(): Observable<any> {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.accessToken);
        this.nodes = this.http.get<any>(this.menuByUserIdUrl, this.httpOptions);
        return this.nodes;
    }


}
