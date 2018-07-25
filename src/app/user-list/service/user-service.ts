import { HttpParams } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, identity } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import * as jwt_decode from "jwt-decode";
import { BehaviorSubject } from "rxjs";
import {EmployeesSearchInterface} from "../models/employeesSearch-interface";
import {EmployeeSearchParamsInterface} from "../models/EmployeeSearchParamsInterface";
import {Department} from "../models/Department";
import {Designation} from "../models/Designation";

@Injectable({
    providedIn: "root"
})
export class UserService {
    private nodes;
    private roles: string[] = [];
    private searchParams: Search[] = [];
    private accessToken;
    private userListResponse;
    private searchUserList;
    private designationsUrl =
        "http://172.16.201.123:5052/api/organogram/allDesignations";
    private departmentsUrl =
        "http://172.16.201.123:5052/api/organogram/allDepartments";
    private employeeProfileUrl = "http://172.16.201.123:5052/api/pds/";
    private saveUserUrl = "http://172.16.201.123:7051/api/user/save";
    private deleteUserUrl = "http://172.16.201.123:7051/api/user/delete";
    private userSearchUrl = "http://172.16.201.123:6051/api/users?search=";
    private employeeSearchUrl =
        "http://172.16.201.123:6061/api/employees?search=";
    private pdsEmployeeSearchUrl =
        "http://172.16.201.123:6061/api/employees?search=";
    private changePasswordUrl =
        "http://172.16.201.123:7051/api/user/changePassword";
    private getRolesUrl = "http://172.16.201.123:7051/api/user/roles";
    private menuFileUrl = "./assets/test.json";
    private fileUrl = "./assets/user.json";
    private roleUrl = "./assets/role.json";
    private menuUrl = "http://172.16.201.123:5551/menu/all";
    private userListUrl = "http://172.16.201.123:7051/api/user/all";
    private testUrl = "http://localhost:8888/api";
    private picasaUrl =
        "http://picasaweb.google.com/data/entry/api/user/shaikhsbd@gmail.com?alt=json";

    private userInfo = new BehaviorSubject("");
    username = this.userInfo.asObservable();

    constructor(private http: HttpClient, private cookieService: CookieService) {
        this.accessToken = this.cookieService.get("access_token");
    }

    private httpOptions = {
        headers: new HttpHeaders({
            Authorization: "Bearer " + this.getAccessToken(),
            "Content-Type": "application/json"
        })
    };

    setUsername(username) {
        console.log("service" + username);
        this.userInfo.next(username);
    }

    getDecodedAccessToken(token: string): any {
        try {
            return jwt_decode(token);
        } catch (Error) {
            return null;
        }
    }

    getAccessToken(): any {
        //    console.log("get access token: " + this.cookieService.get('access_token'));
        return this.cookieService.get("access_token");
    }

    public readJSONFile(): Observable<any> {
        return this.http.get<any>(this.fileUrl);
    }

    public getRoles(): Observable<Roles[]> {
        console.log("get roles method is called" + res);
        var res = this.http.get<Roles[]>(this.getRolesUrl, this.httpOptions);
        console.log("get roles method is called" + res);
        return res;
    }

    public getMenus(): Observable<any> {
        this.nodes = this.http.get<any>(this.fileUrl);
        return this.nodes;
    }

    getDepartments(): Observable<Department[]> {
        return this.http.get<Department[]>(this.departmentsUrl, this.httpOptions);
    }

    getDesignations(): Observable<Designation[]> {
        return this.http.get<Designation[]>(this.designationsUrl, this.httpOptions);
    }

    getEmployeeProfile(): Observable<Designation[]> {
        return this.http.get<Designation[]>(this.designationsUrl, this.httpOptions);
    }

    saveUser(addUserData) {
        console.log("save user method in service is called");
        const body = new HttpParams()
            .set("userName", addUserData.loginName)
            .set("password", addUserData.password);
        const data = { userName: "shaikh" };
        this.roles.push(addUserData.roles);
        let user = new User(
            addUserData.loginName,
            this.getDecodedAccessToken(this.accessToken).user_name,
            addUserData.password,
            addUserData.retypepassword,
            addUserData.profileId,
            addUserData.activeFrom,
            addUserData.activeTo,
            addUserData.status,
            this.roles
        );
        console.log(user);
        this.http
            .post<any>(this.saveUserUrl, JSON.stringify(user), this.httpOptions)
            .subscribe(data => {
                console.log(data);
            });
    }

    saveUserEdit(editUserData) {
        console.log("edit user method in service is called");
        const body = new HttpParams()
            .set("userName", editUserData.loginName)
            .set("password", editUserData.password);
        const data = { userName: "shaikh" };
        this.roles.push(editUserData.roles);
        let user = new User(
            editUserData.loginName,
            this.getDecodedAccessToken(this.accessToken).user_name,
            editUserData.password,
            editUserData.retypepassword,
            editUserData.profileId,
            editUserData.activeFrom,
            editUserData.activeTo,
            editUserData.status,
            this.roles
        );
        console.log(user);
    }

    deleteUser(userName) {
        const loginUser = this.getDecodedAccessToken(this.accessToken).user_name;
        const body = { userName: userName, loginUser: loginUser };
        console.log("delete user: " + userName + " " + loginUser);
        this.http
            .post<any>(this.deleteUserUrl, JSON.stringify(body), this.httpOptions)
            .subscribe(data => {
                console.log(data);
            });
    }
    search(searchParams: Search[]): Observable<UserSearch[]> {
        console.log(searchParams);
        const data = "loginName:" + searchParams["loginName"];
        return this.http.get<UserSearch[]>(
            this.userSearchUrl + data,
            this.httpOptions
        );
    }

    searchEmployees(
        employeeSearchParamsInterface: EmployeeSearchParamsInterface
    ): Observable<EmployeesSearchInterface[]> {
        console.log(employeeSearchParamsInterface);
        console.log("search employees");
        const data = "designationCode:" + employeeSearchParamsInterface.designation;
        console.log(data);
        return this.http.get<EmployeesSearchInterface[]>(
            this.pdsEmployeeSearchUrl + data,
            this.httpOptions
        );
    }

    changePassword(changePasswordData) {
        console.log("change password data is called");
        console.log(changePasswordData);
        const body = {
            userName: "shakib",
            currentPassword: changePasswordData.oldpassword,
            changePassword: changePasswordData.password
        };
        console.log(body);
        this.http
            .post<any>(this.changePasswordUrl, JSON.stringify(body), this.httpOptions)
            .subscribe(data => {
                console.log(data);
            });
    }

    public getUserList(): Observable<Element[]> {
        this.userListResponse = this.http.get<Element[]>(
            this.userListUrl,
            this.httpOptions
        );
        return this.userListResponse;
    }

    //    getAccessDetails (login: Login): Observable<LoginDetails>  {
    //    console.log("get accessdetails is called");
    //    console.log(login);
    //    const body = new HttpParams()
    //    .set('grant_type', login.password)
    //    .set('username', login.username)
    //    .set('password', login.password);
    ////    let body = new URLSearchParams();
    ////    body.set("grant_type", encodeURIComponent(login.password));
    ////    body.set("username", encodeURIComponent(login.username));
    ////    body.set("password", encodeURIComponent(login.password));
    //    console.log(body.toString());
    //    var res = this.http.post<LoginDetails>(this.tokenUrl, body.toString(), httpOptions);
    //    console.log(res);
    //    return res;
    //  }
}

export interface searchResult {
    loginName: string;
    designationName: string;
    employeeFullName: string;
    departmentName: string;
}

export interface Search {
    loginName: string;
    userName: string;
    department: string;
    designation: string;
}

export interface Roles {
    roleId: string;
    name: string;
    description: string;
    createdOn: string;
    updatedOn: string;
    createdBy: string;
    updatedBy: string;
}
export class User {
    constructor(
        public userName: string,
        public createdBy: string,
        public password: string,
        public retypepassword: string,
        public profileId: string,
        public activeFrom: string,
        public activeTo: string,
        public status: string,
        public roles: string[]
    ) {}
}



export interface UserInfos {
    loginName: "";
    active: false;
    employeeFullName: "";
    employeeFullNameBengali: null;
    departmentName: "";
    departmentNameBengali: null;
    designationName: "";
    designationNameBengali: null;
}

export interface UserSearch {
    requestTime: string;
    responseTime: string;
    userInfos: UserInfos[];
}

export interface Element {
    id: string;
    username: string;
    active: string;
}
