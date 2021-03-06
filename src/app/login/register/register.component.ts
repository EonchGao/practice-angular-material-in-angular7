import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { isValidAddr, getAddrByCode, extractInfo } from 'src/app/util/identity.util';
import { isValidDate } from 'src/app/util/date.until';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  items: string[];
  form: FormGroup;
  sub: Subscription;
  private readonly avatarName = 'avatars';
  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    const img = `${this.avatarName}:svg-${Math.floor(Math.random() * 16).toFixed(0)}`;
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    this.items = nums.map(d => `avatars:svg-${d}`);
    this.form = this.fb.group({
      email: ['EnochGao@qq.com', Validators.compose([Validators.required, Validators.email])],
      name: [],
      password: ['', Validators.required],
      repeat: [],
      avatar: [img],
      dateOfBirth: ['1995-02-03'],
      address: [],
      identity: []
    });

    const id$ = this.form.get('identity').valueChanges.pipe(debounceTime(300), filter(_ => this.form.get('identity').valid));
    this.sub = id$.subscribe(id => {
      const info = extractInfo(id.identityNo);

      if (isValidAddr(info.addrCode)) {

        const addr = getAddrByCode(info.addrCode);
        this.form.get('address').patchValue(addr);
      }

      if (isValidDate(info.dateOfBirth)) {
        this.form.get('dateOfBirth').patchValue(info.dateOfBirth);
      }

    });

  }
  onSubmit({ value, valid }, ev: Event) {
    ev.preventDefault();
    if (!valid) { return; }
    console.log(value);
  }
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }

  }
}
