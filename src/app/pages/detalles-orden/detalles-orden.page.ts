import { Component, OnInit } from '@angular/core';
import { SumagroAppService } from '../../servicios/sumagro-app.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';
import { Orden } from 'src/app/interfaces/reporte';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentViewer,DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import {  
  FileTransfer 
} from '@ionic-native/file-transfer/ngx';  
import {  
  File  
} from '@ionic-native/file/ngx';

import { LoadingController } from '@ionic/angular';


import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Ingenio, subOrders } from '../../interfaces/reporte';

@Component({
  selector: 'app-detalles-orden',
  templateUrl: './detalles-orden.page.html',
  styleUrls: ['./detalles-orden.page.scss'],
  providers: [AuthService, AngularFireAuth, SumagroAppService, AndroidPermissions]
})
export class DetallesOrdenPage implements OnInit {
  orden: Orden[];
  Objorden: Orden;
  idOrden: string;
  idOingenio: string;
  suborden: subOrders[];
  bandera = false;
  private fileTransfer: any;
  loading: any;

  constructor(private sumagroAppService: SumagroAppService, public authService: AuthService, public alertController: AlertController, public router: Router,
    public fileOpener: FileOpener,private transfer: FileTransfer, private file: File, private androidPermissions: AndroidPermissions, public route: ActivatedRoute,public loadingController: LoadingController) { }

  async ngOnInit() {
    this.idOrden = this.route.snapshot.paramMap.get('idor');
    console.log("idor: "+ this.idOrden);
    await this.solicitarDetalles(this.idOrden );
    this.cargando('Cargando');
  }


    async solicitarDetalles(idor) {
  
      let token = await this.authService.getToken();
   
      this.sumagroAppService.detallesOrden(token, idor ).subscribe( (resp: Orden ) => {
        this.bandera = true;
       this.Objorden = resp;
       this.suborden = resp.subOrders; 
       this.loadingController.dismiss();
       console.log(this.Objorden);
       console.log(this.suborden);
      
      });
      }

      cancel(){
        this.router.navigate(['/gen-pdf']);
      }

      async mandarEmail(ingenioID,orderId) {
        this.cargando('Enviando Email');
        this.SolicitarEmali(ingenioID,orderId);

        }

        async SolicitarEmali(ingenioID,orderId){
         
        let token = await this.authService.getToken();
        this.sumagroAppService.mandarEmail(token, ingenioID,orderId).subscribe( resp=> {
          this.loadingController.dismiss();
         
          console.log(resp);
         
        });
        }

        async generPDF(id) {
          this.cargando('Generando PDF')
          let url = `https://us-central1-sumagro-backend.cloudfunctions.net/app/sumagro-app/generate-pdf/${id}`;
          this.fileTransfer = this.transfer.create();
          
          this.fileTransfer.download(url,this.file.externalRootDirectory+`${id}.pdf`,true).then((entry)=>{
            this.loadingController.dismiss();
            console.log('download completed: ' + entry.toURL());  
            this.fileOpener.open(entry.toURL(),'application/pdf');
          }, (error) => {  
                
              console.log('download failed: ' + JSON.stringify(error));  
          });  
          }

          
          async cerraOrden(ingenioID,OrdenID) {
            
            await this.cargando('Cerrando pedido');
            let status = 'TRANSIT';
            let token = await this.authService.getToken();
            this.sumagroAppService.statusUpdate(token,ingenioID,OrdenID,status).subscribe( async(resp) => {
              
              console.log(resp);
              this.loadingController.dismiss();
              let alertCloseOrder = await this.alertController.create({
                header: 'Alert',
                subHeader: "Orden Actualizada",
                message: "Orden cerrada.",
                buttons: ['OK']
              });
              await alertCloseOrder.present();
              await alertCloseOrder.onDidDismiss();
              this.cancel();
              
            });
            }


          async cargando(message) {
            await this.loadingController.create({
              message
            }).then((res)=>{
              res.present();
              res.onDidDismiss().then((dis)=>{
                console.log("Dialogo cerrado")
              });
             
            });
            try{
                this.closeLoader();
            }catch{

            }
          }
          closeLoader(){
              
          };
        

}
