/**
 * Created by mohma on 7/5/2017.
 */
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import * as jwt_decode from "jwt-decode";
import {Login} from "../models/login";
import {Observable} from "rxjs/index";
import {LoginDetail} from "../models/login-detail";


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa('bccweb-app:secret')
  })
};


@Injectable()
export class LoginService {
    private HOST_IP = "172.16.26.130";
    private PORT = "8888";
    private security_service = "/service/auth/";
    private pds_service = "/service/pds/";
    private pds_search_service = "/service/pds-search/";
    private organogram_service = "/service/org/";
    private user_search_service = "/service/user-search/";

  private tokenUrl = 'http://'+this.HOST_IP+':'+this.PORT+this.security_service+'/oauth/token';
  private userDetailsUrl = 'http://'+this.HOST_IP+':'+this.PORT+this.security_service +'/api/user/';

  private accessToken = null;
  private isPasswordChange: boolean;


  constructor(private http: HttpClient,
              private cookieService: CookieService,
              private router: Router) { }


/*  getAccessToken(): any{
//    console.log("get access token: " + this.cookieService.get('access_token'));
    return this.cookieService.get('access_token');
  }*/

  isLogin(): boolean {
    this.accessToken = this.cookieService.get('access_token');
    if (this.accessToken != null || this.accessToken != '') {
      return true;
    }
    return false;
  }

  getAccessDetails (login: Login): Observable<LoginDetail>  {
    console.log("get access details is called");
    console.log(login);
    const body = new HttpParams()
      .set('grant_type', "password")
      .set('username', login.username)
      .set('password', login.password);
    console.log(body.toString());
    let res = this.http.post<LoginDetail>(this.tokenUrl, body.toString(), httpOptions);
    console.log(res);
    return res;
  }

  getDecodedAccessToken(token: string): any {
    try{
      return jwt_decode(token);
    }
    catch(Error){
      return null;
    }
  }

  getUserDetails(access_token): any{
    var res: boolean;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + access_token,
        'Content-Type': 'application/json'
      })
    };
    const username = this.getDecodedAccessToken(access_token).user_name;
    this.userDetailsUrl = this.userDetailsUrl + username;
    this.http.get<any>(this.userDetailsUrl, httpOptions)
      .subscribe(data => {
        this.isPasswordChange =  data.userInfo.defaultPassword;
        console.log("inside subscribe");
        console.log(this.isPasswordChange);
        if(this.isPasswordChange){
          this.router.navigate(['/user/all/change-password']);
        }
        return this.isPasswordChange;
      });
  }
/*
  checkDefaltPassword(): boolean{
    if(this.isPasswordChange){
      return true;
    }
    else{
      return false;
    }
  }*/

  isAccessTokenExists(): boolean{
    this.accessToken = this.cookieService.get('access_token');
    if(this.accessToken != null && this.accessToken !== ''){
      return true;
    }
    return false;
  }

 /* test (login: Login): Observable<LoginDetail>  {
    return this.http.get<LoginDetail>(this.testUrl);
  }*/

}
