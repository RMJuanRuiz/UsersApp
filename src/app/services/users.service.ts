import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/user.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private urlFirebase = 'https://usersapp-25e87.firebaseio.com';

  constructor(private http: HttpClient) {}

  createUser(user: UserModel) {
    return this.http.post(`${this.urlFirebase}/users.json`, user).pipe(
      map((resp: any) => {
        user.id = resp.name;
        return user;
      })
    );
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.urlFirebase}/users/${id}.json`);
  }

  updateUser(user: UserModel) {
    const userTemp = {
      ...user,
    };

    delete userTemp.id;
    return this.http.put(`${this.urlFirebase}/users/${user.id}.json`, userTemp);
  }

  getHeroe(id: string) {
    return this.http.get(`${this.urlFirebase}/users/${id}.json`);
  }

  getUsers() {
    return this.http
      .get(`${this.urlFirebase}/users.json`)
      .pipe(map(this.createArray));
    // .pipe(map((resp) => this.createArray(resp))); valid too
  }

  private createArray(usersObj: object) {
    let users: UserModel[] = [];

    if (usersObj === null) {
      return [];
    }

    Object.keys(usersObj).forEach((key) => {
      const user: UserModel = usersObj[key];
      user.id = key;
      users.push(user);
    });

    return users;
  }
}
