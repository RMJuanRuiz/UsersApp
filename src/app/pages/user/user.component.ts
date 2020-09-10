import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  user: UserModel = new UserModel();
  form: FormGroup;
  paramId: string;
  showFirebaseID: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.paramId = this.route.snapshot.paramMap.get('id');
    if (this.paramId !== 'new') {
      this.usersService.getHeroe(this.paramId).subscribe((resp: UserModel) => {
        this.user = resp;
        this.user.id = this.paramId;

        this.form.reset(resp);
      });
    } else {
      this.showFirebaseID = false;
    }
  }

  private createForm() {
    this.form = this.formBuilder.group({
      id: [{ value: this.user.id, disabled: true }],
      name: [this.user.name, [Validators.required, Validators.minLength(2)]],
      username: [this.user.username, [Validators.required]],
      status: [this.user.status],
    });
  }

  saveForm() {
    if (this.form.invalid) {
      return Swal.fire({
        title: 'Error',
        text: 'Invalid data!',
        icon: 'error',
      });
    }

    Swal.fire({
      title: 'Wait',
      text: 'Saving information',
      icon: 'info',

      allowOutsideClick: false,
    });
    Swal.showLoading();

    if (this.paramId !== 'new' && this.user.id) {
      this.usersService.updateUser(this.user).subscribe((resp) => {
        Swal.fire({
          title: this.user.name,
          text: 'User updated!',
          icon: 'success',
        });
      });
    } else {
      this.usersService.createUser(this.user).subscribe((resp) => {
        Swal.fire({
          title: this.user.name,
          text: 'User created!',
          icon: 'success',
        });

        this.form.reset();
      });
    }
  }

  updateStatus() {
    this.user.status = !this.user.status;
    this.form.controls['status'].setValue(this.user.status);
  }
}
