import { Component, OnInit } from '@angular/core';
// import { productos } from '../../servicio';
import { Producto } from '../../model/producto';
import { Pedido } from '../../interfaces/pedido';
import { AuthService } from 'src/app/servicios/auth.service';
import { SumagroAppService } from '../../servicios/sumagro-app.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Ingenio } from '../../interfaces/reporte';



@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
  providers: [AuthService, AngularFireAuth, SumagroAppService]
})
export class PedidoPage implements OnInit {
 nomEmpresae = '';
 RFC: string;
 Direccion: string;
 Cliente: string;
 domiDeCliente: string;
 fechaSalida: any;
 numprod = 0;
 stateForm = false;
 id: string;
 valor = '';


 Cantidad: number;
 Unidad: string;
 DescFormula: string;

 ingenio: Ingenio[];
 objetoGeneral: Pedido;
 descprod: Producto[] = new Array;
remissionNumber: any;
  constructor(public router: Router, public authService: AuthService, public sumagroAppService: SumagroAppService, public loadingController: LoadingController,
    public alertController: AlertController ) { 

      this.Cantidad=0;
    }

  customPopoverOptions: any = {
    header: 'Tipo',
    subHeader: 'Unidades disponibles',
    message: 'Selecciona el tipo de unidad'
  };
  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Obteniendo metadatos de ingenios',
       duration: 6000
    });
    await loading.present();
    await this.solicitarIngenios();
    let token = await this.authService.getToken();
     this.remissionNumber = await  this.sumagroAppService.getRemissionNumber(token);
     console.log("RemissionNumber:",this.remissionNumber);
    await loading.dismiss();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Agregando pedido',
       duration: 6000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    this.router.navigate(['/menu']);
    console.log('Loading dismissed!');
  }


  enviar() {
    console.log('hola');
  }

  numeroPedidos() {
   this.numprod = + 1;
  }

  async guradarProd() {
    if(this.Unidad=='' || this.DescFormula=='' || this.Cantidad==0){
      const alert = await this.alertController.create({
        header: 'Alert',
        subHeader: 'Información incompleta',
        message: 'Asegurese de llenar todos los campos correctamente.',
        buttons: ['OK']
      });
      alert.present();
    }else{
    const prodcutoSolicitado: Producto = {
        description: this.DescFormula,
        quantity: this.Cantidad,

        unit: this.Unidad,
        
    };

    this.Cantidad = 0;
    this.Unidad = '';
    this.DescFormula = '';
    this.descprod.push(prodcutoSolicitado);
    console.log(this.Cantidad);
  }
  }


 async  enviarInfo() {

    this.presentLoading();
    this.objetoGeneral.subOrders = this.descprod;  
    let token = await this.authService.getToken();
    console.log(this.objetoGeneral);
    this.sumagroAppService.agregarOrden(token, this.objetoGeneral).subscribe(data => {
      console.log(data);
    });
  }

  guradarInfoGen() {
    console.log("Fecha de salida",this.fechaSalida);
     this.objetoGeneral  = {
    
      client: this.Cliente,
      clientAddress: this.Direccion,
      ingenioId: this.id,
      remissionNumber: this.remissionNumber.currentRemissionNumber,
      shippingDate: this.fechaSalida,
      subOrders: [],
  
    };
        this.stateForm = true;
  }

  seleccion(event){
    console.log("Fecha salida",event.target.value);
    this.fechaSalida=event.target.value;
  }

  cancel() {
    this.router.navigate(['/menu']);
  }

  async solicitarIngenios() {
  
    let token = await this.authService.getToken();
    this.sumagroAppService.obtenerInegenios(token).subscribe( (resp: Ingenio[] ) => {
     
      this.ingenio = resp;
      console.log(this.ingenio);
     
    });
    }

    print() {

    console.log(this.valor);
    
    for ( let i = 0; i < this.ingenio.length; i++ ) {
         
          if ( this.ingenio[i].id == this.valor) {
            console.log(this.ingenio[i].name);
            this.Cliente = this.ingenio[i].name;
            this.Direccion = this.ingenio[i].address;
            this.id = this.ingenio[i].id;
          }
    }
    }



}

