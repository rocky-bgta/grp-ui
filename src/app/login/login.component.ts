import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import {Login} from "./models/login";
import {LoginService} from "./service/login.service";
import {CookieService} from "ngx-cookie-service";
import {LoginDetail} from "./models/login-detail";


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()],
    providers:[LoginService, CookieService]
})
export class LoginComponent implements OnInit {

    constructor(private router: Router,
                private loginService: LoginService,
                private cookieService: CookieService) {}

    public login: Login = new Login();
    private loginDetail: LoginDetail = new LoginDetail();


    ngOnInit() {}

    onLoggedin() {
        localStorage.setItem('isLoggedin', 'true');


        //console.log("on submit is called");
        //this.login = new Login(this.name, this.password);
        //console.log("Login info: "+ JSON.stringify(this.login));
        this.loginService.getAccessDetails(this.login)
            .subscribe(data => {
                this.loginDetail = data;
                this.cookieService.set('access_token', data.access_token, 0.01138889);
                this.cookieService.set('expires_in', data.expires_in);
                this.cookieService.set('jti', data.jti);
                this.cookieService.set('refresh_token', data.refresh_token);
                this.cookieService.set('scope', data.scope);
                this.cookieService.set('token_type', data.token_type);
                if (this.loginService.isLogin()) {
                    //this.submitted = true;
                    //console.log("login work"+JSON.stringify(data,null,2));
                    this.loginService.getUserDetails(data.access_token);
                    this.router.navigate(['/dashboard']);
                }
            });


    }
}
