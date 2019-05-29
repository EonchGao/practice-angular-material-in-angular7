import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { QuoteService } from 'src/app/services/quote.service';
import { Quote } from 'src/app/domain/quote.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  quote: Quote = {
    cn: '满足感在于不断地努力，而不是现有的成就。全心努力定会胜利满满。',
    en: 'Satisfaction lies in the effort, not in the attainment. Full effort is full victory.',
    pic: '/assets/img/quote_fallback.jpg'
  };
  constructor(
    private fb: FormBuilder,
    private quoteService$: QuoteService
  ) {
    this.quoteService$.getQuote().subscribe(q => this.quote = q);
  }

  ngOnInit() {
    // this.form = new FormGroup({
    //   email: new FormControl('EnochGao@qq.com', Validators.compose([Validators.required, Validators.email])),
    //   password: new FormControl('', Validators.required)
    // });
    this.form = this.fb.group({
      email: ['EnochGao@qq.com', Validators.compose([Validators.required, Validators.email, this.validate])],
      password: ['', Validators.required]

    })
  }

  onSubmit({ value, valid }, ev: Event) {
    ev.preventDefault();
    console.log(JSON.stringify(value));
  }
  validate(c: FormControl): { [key: string]: any } {
    if (!c.value) {
      return null;
    }
    const pattern = /^enoch+/;
    if (pattern.test(c.value)) {
      return null;
    }
    return {
      emailNotValid: 'email must start with enoch'
    }
  }
}
