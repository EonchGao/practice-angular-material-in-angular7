import { Component, Input, forwardRef, OnDestroy, OnInit } from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormControl,
  FormBuilder,
  FormGroup
} from '@angular/forms';
import { Address } from 'src/app/domain';
import { Subject, combineLatest, Subscription, Observable, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { getProvinces, getCitiesByProvince, getAreaByCity } from 'src/app/util/area.util';

@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrls: ['./area-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AreaListComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AreaListComponent),
      multi: true
    }
  ]
})
export class AreaListComponent implements ControlValueAccessor, OnDestroy, OnInit {

  _address: Address = {
    province: '',
    city: '',
    district: '',
    street: ''
  };
  _province = new Subject<string>();
  _city = new Subject<string>();
  _district = new Subject<string>();
  _street = new Subject<string>();

  provinces$: Observable<string[]>;
  cities$: Observable<string[]>;
  districts$: Observable<string>;

  private propagateChange = (_: any) => { };

  private sub: Subscription;

  constructor() { }

  ngOnInit() {
    const province$ = this._province.asObservable().pipe(startWith(''));
    const city$ = this._city.asObservable().pipe(startWith(''));
    const district$ = this._district.asObservable().pipe(startWith(''));
    const street$ = this._street.asObservable().pipe(startWith(''));

    const val$ = combineLatest(province$, city$, district$, street$).pipe(map(
      (value) => {
        return {
          province: value[0],
          city: value[1],
          district: value[2],
          street: value[3]
        };
      }
    ));

    this.sub = val$.subscribe(v => {
      this.propagateChange(v);
    });


    this.provinces$ = of(getProvinces());
    this.cities$ = province$.pipe(map(p => getCitiesByProvince(p)));
    this.districts$ = combineLatest(province$, city$).pipe(map((val) => getAreaByCity(val[0], val[1])));

  }

  writeValue(obj: any) {
    if (obj) {
      this._address = obj;
      if (this._address.province) {
        this._province.next(this._address.province);
      }
      if (this._address.city) {
        this._city.next(this._address.city);
      }
      if (this._address.district) {
        this._district.next(this._address.district);
      }
      if (this._address.street) {
        this._street.next(this._address.street);
      }
    }
  }


  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any) { }

  validate(c: FormControl): { [key: string]: any } {
    const val = c.value;
    if (!val) {
      return null;
    }
    if (val.province && val.city && val.district && val.street) {
      return null;
    }

    return {
      addressInvalid: true
    };
  }

  onProvinceChange() {
    this._province.next(this._address.province);
  }

  onCityChange() {
    this._city.next(this._address.city);
  }

  onDistrictChange() {
    this._district.next(this._address.district);
  }

  onStreetChange() {
    this._street.next(this._address.street);
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
