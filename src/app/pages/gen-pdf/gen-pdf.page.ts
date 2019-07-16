import { Component, OnInit } from '@angular/core';
import { SumagroAppService } from '../../servicios/sumagro-app.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';
import { Orden } from 'src/app/interfaces/reporte';
import { Router } from '@angular/router';
import { DocumentViewer,DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import {  
  FileTransfer 
} from '@ionic-native/file-transfer/ngx';  
import {  
  File  
} from '@ionic-native/file/ngx';

import { FileOpener } from '@ionic-native/file-opener/ngx';
@Component({
  selector: 'app-gen-pdf',
  templateUrl: './gen-pdf.page.html',
  styleUrls: ['./gen-pdf.page.scss'],
  providers: [AuthService, AngularFireAuth, SumagroAppService, AndroidPermissions]
})
export class GenPdfPage implements OnInit {
  orden: Orden[];
 


private fileTransfer: any;
  // tslint:disable-next-line:max-line-length
  constructor(private sumagroAppService: SumagroAppService, public authService: AuthService, public alertController: AlertController, public router: Router,
    public fileOpener: FileOpener,private transfer: FileTransfer, private file: File, private androidPermissions: AndroidPermissions) { }

  async ngOnInit() {
   this.solicitar();
   this.permisos();
  }

  async presentAlert(texto) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      buttons: ['OK']
    });

}

  async solicitar() {
// tslint:disable-next-line:prefer-const
let token = await this.authService.getToken();
this.sumagroAppService.obtenerOrdenesAlmacen(token).subscribe( (resp: Orden[] ) => {
  this.presentAlert(resp);
  this.orden = resp;
 // console.log(`ordenes`, resp[2].enterpriseName);
});
}

cancel() {
  this.router.navigate(['/menu']);
}

async generPDF(id) {

 



let url = `https://us-central1-sumagro-backend.cloudfunctions.net/app/sumagro-app/generate-pdf/${id}`;
this.fileTransfer = this.transfer.create();

this.fileTransfer.download(url,this.file.externalRootDirectory+`${id}.pdf`,true).then((entry)=>{
  console.log('download completed: ' + entry.toURL());  
  this.fileOpener.open(entry.toURL(),'application/pdf');
}, (error) => {  
    //here logging our error its easier to find out what type of error occured.  
    console.log('download failed: ' + JSON.stringify(error));  
});  
}

async deleteOrder(index, id) {
  if (index > -1) {
    this.orden.splice(index, 1); }

 // tslint:disable-next-line:prefer-const
// tslint:disable-next-line:align
// tslint:disable-next-line:prefer-const
// tslint:disable-next-line:align
  // tslint:disable-next-line:prefer-const
  let token = await this.authService.getToken();
  await this.sumagroAppService.deleteOrder(token, id);

}



async cerraOrden(ingenioID,OrdenID) {
  // tslint:disable-next-line:prefer-const
  let status = 'TRANSIT';
  let token = await this.authService.getToken();
  this.sumagroAppService.statusUpdate(token,ingenioID,OrdenID,status).subscribe( resp => {
    //this.presentAlert(resp);
    console.log(resp);
    //this.orden = resp;
   // console.log(`ordenes`, resp[2].enterpriseName);
  });
  }

permisos(){
  this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
    result => console.log('Has permission?',result.hasPermission),
    err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
  );
  
  this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);
};

async mandarEmail(ingenioID,orderId) {
  // tslint:disable-next-line:prefer-const
  let token = await this.authService.getToken();
  this.sumagroAppService.mandarEmail(token, ingenioID,orderId).subscribe( resp=> {
    //this.presentAlert(resp);
    console.log(resp);
    //this.orden = resp;
   // console.log(`ordenes`, resp[2].enterpriseName);
  });
  }

  detalles(idor: string, idin: string) {
    // this.router.navigate(['/detalles-orden/' + idor +'/' + idin]);
    this.router.navigate(['/detalles-orden/' + idor ]);
  }

}
