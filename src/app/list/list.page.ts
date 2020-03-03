import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  private selectedItem: any;
  private icons = [
    'flask',
    'wifi',
    'beer',
    'football',
    'basketball',
    'paper-plane',
    'american-football',
    'boat',
    'bluetooth',
    'build'
  ];
  public menu_gif_hidden: boolean;
  public items: Array<{ title: string; note: string; icon: string }> = [];
  constructor(public navController: NavController) {
    this.menu_gif_hidden = false;
  }

  ngOnInit() {
    setTimeout(() => {
      this.menu_gif_hidden = true;
    }, 5000);
  }

}