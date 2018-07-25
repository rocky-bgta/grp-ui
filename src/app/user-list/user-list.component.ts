import {Component, OnInit, ViewChild} from '@angular/core';
import {Department} from "./models/Department";
import {Designation} from "./models/Designation";
import {Search} from "./models/Search";
import {MatPaginator, MatTableDataSource} from "@angular/material";
import {UserInfos, UserService} from "./service/user-service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

    departments: Department[] = [];
    designations: Designation[] = [];
    searchParams: Search[] = [];
    selectedDesignation;
    selectedDepartment;
    loginName: string = "";
    userName: string = "";
    dataSource: MatTableDataSource<UserInfos>;
    displayedColumns = [
        "imagePath",
        "loginName",
        "userName",
        "designation",
        "status",
        "action"
    ];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    constructor(private userService: UserService, private router: Router) {
        const userInfos: UserInfos[] = [];
        this.dataSource = new MatTableDataSource(userInfos);
        this.dataSource.paginator = this.paginator;
        this.userService.getDesignations().subscribe(data => {
            for (let jj = 0; jj < data.length; jj++) {
                this.designations.push(data[0]);
            }
        });
        this.userService.getDepartments().subscribe(data => {
            for (let jj = 0; jj < data.length; jj++) {
                this.departments.push(data[0]);
            }
        });
    }

  ngOnInit() {
  }
    search() {
        this.searchParams["loginName"] = this.loginName;
        this.searchParams["userName"] = this.userName;
        this.searchParams["selectedDepartment"] = this.selectedDepartment;
        this.searchParams["selectedDesignation"] = this.selectedDesignation;
        console.log(this.searchParams);
        this.userService.search(this.searchParams).subscribe(data => {
            console.log("final result final " + data["userInfos"][0]);
            const userInfos: UserInfos[] = [];
            let userInfosRes = data["userInfos"];
            for (let jj = 0; jj < userInfosRes.length; jj++) {
                userInfos.push(userInfosRes[jj]);
                console.log(userInfos[jj]);
            }
            this.dataSource = new MatTableDataSource(userInfos);
            this.dataSource.paginator = this.paginator;
        });
    }
    toNumber() {
        console.log(this.selectedDesignation);
    }
    onEdit(username) {
        console.log("dashboard" + username);
        this.userService.setUsername(username);
        this.router.navigate(["/user/all/remove-user"]);
    }

}
