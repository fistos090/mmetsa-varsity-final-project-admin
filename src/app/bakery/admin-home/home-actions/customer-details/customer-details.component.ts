import { UtilService } from 'src/app/bakery/common/services/utility-service';
import { Customer } from './../../../common/data-models/customer.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {

  @Input() customer: Customer = {
    id: 1,
    lastname: 'testing',
    firstname: 'testing',
    gender: 'testing',
    dateOfBirth: '10-10-2018',
    email: 'testing',
    cellphonNumber: 'testing',
    securityQuestuion: 'testing',
    answer: 'testing',
    password: 'testing'
  }

  constructor(private util: UtilService) { }

  ngOnInit() {
    // this.util.formatDate1(this.customer.dateOfBirth.replace('-','/'));
    // this.customer.dateOfBirth = this.util.formatDate(new Date(this.customer.dateOfBirth.replace('-','/')));
  }

}
