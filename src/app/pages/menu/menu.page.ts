import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

  irPedido() {
    this.router.navigate(['/pedido']);
  }

}
