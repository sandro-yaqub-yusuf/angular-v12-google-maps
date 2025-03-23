import { Component, OnInit, ViewChild } from "@angular/core";
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelpModalComponent } from './components/help-modal/help-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) mapa: (GoogleMap | undefined);
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: (MapInfoWindow | undefined);

  public dados1 = true;
  public dados2 = true;
  public exibeDetalhes = null;
  public idSelecionado = -1;
  public infoContent = '';
  public lat = 0;
  public lng = 0;

  public center: google.maps.LatLngLiteral = { lat: this.lat, lng: this.lng };
  public options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true
  };
  public markers: { [id: number]: MapMarker } = {};
  public polyline: google.maps.Polyline[] = [];
  public tamanhoPin = 43;
  public zoom = 10;

  public detalhe: any[] = [];
  public listaDados1: any[] = [];
  public listaDados2: any[] = [];
  public listaClusterDados1: any[] = [];
  public listaClusterDados2: any[] = [];

  constructor(
    private modalService: NgbModal,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.center = { lat: this.lat, lng: this.lng };
    });

    this.limparDados();
    this.carregarListaDados1();
    this.carregarListaDados2();
    this.carregarMapa();
  }

  centerChange(item: any): void {
    if (item.position.lat && item.position.lng) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.center = { lat: this.lat, lng: this.lng };
      });

      this.mapa?.panTo(item.position);
    }
  }

  getSafeHtml(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  markerMouseOver(marker: any): void {
    marker.marker?.setAnimation(google.maps.Animation.BOUNCE);
  }

  markerMouseOut(marker: any): void {
    marker.marker?.setAnimation(null);
  }

  mouseEnterListItem(item: any): void {
    item.selecionado = true;

    if (item.id > 0) {
      const marker = this.markers[item.id];
    
      if (marker) { this.markerMouseOver(marker); } 
    }
  }

  mouseLeaveListItem(item: any): void {
    item.selecionado = false;

    if (item.id > 0) {
      const marker = this.markers[item.id];
    
      if (marker) { this.markerMouseOut(marker); } 
    }
  }

  mouseOverSelectItem(id: number): void {
    if (this.idSelecionado !== id) {
      this.idSelecionado = id;

      this.carregarMapa();
    }
  }

  onMarkerInitDados1(marker: MapMarker, item: any): any {
    if (item.id > 0) { this.markers[item.id] = marker; } 
    
    return item;
  }

  onMarkerInitDados2(marker: MapMarker, item: any): any {
    if (item.id > 0) { this.markers[item.id] = marker; } 
    
    return item;
  }

  openMarkerInfo(marker: MapMarker, content: string) {
    this.infoContent = content;

    this.infoWindow?.open(marker);
  }

  public showHelp(): void {
    this.modalService.open(HelpModalComponent, { size: 'lg' });
  }

  public carregarDados1(): void {
    this.exibeDetalhes = null;
    this.idSelecionado = -1;
    this.dados1 = !this.dados1;

    this.carregarMapa();
  }

  public carregarDados2(): void {
    this.exibeDetalhes = null;
    this.idSelecionado = -1;
    this.dados2 = !this.dados2;

    this.carregarMapa();
  }

  private adicionarLinhasConexao(): void {
    const caminho = this.listaClusterDados2.map(item => ({
      lat: item.position.lat,
      lng: item.position.lng
    }));
  
    if (this.polyline) { this.polyline.forEach(polyline => polyline.setMap(null)); }
  
    this.polyline = [];
  
    for (let i = 0; i < caminho.length - 1; i++) {
      const coordinates = [caminho[i], caminho[i + 1]];
  
      const polyline = new google.maps.Polyline({
        path: coordinates,
        strokeColor: '#0a4aca',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        geodesic: true,
        icons: [{
          icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW, 
            fillColor: '#0a4aca', 
            fillOpacity: 1.0,
            strokeColor: '#0a4aca', 
            strokeWeight: 2, 
            strokeOpacity: 1.0, 
            scale: 3
          }, 
          offset: '0%'
        }]
      });
  
      polyline.setMap(this.mapa?.googleMap ?? null);

      this.polyline.push(polyline);
    }
  }

  private carregarListaDados1(): void {
    const tamanhoImagem = this.tamanhoPin;

    this.listaDados1.push({
      id: 1,
      selecionado: false,
      position: { lat: -23.5001, lng: -46.4001 },
      icon: { url: '../assets/car_pin.png', scaledSize: { height: tamanhoImagem, width: tamanhoImagem } },
      info: `<div class="row m-0">
               <div class="col-12 p-0 text-left mapa-detalhe">
                 <div class="titulo-detalhe"><b>ID 1</b><br></div>
                 <div class="mt-2"><b>Campo: </b>conteúdo do ID 1 - 1</span><br></div>
                 <div><b>Campo: </b>conteúdo do ID 1 - 2</span><br></div>
                 <div><b>Campo: </b>conteúdo do ID 1 - 3</span></div>
               </div>
             </div>`,
      horaTitulo: '10:11:01',
      hora: '10:11'
    });

    this.detalhe.push({
      id: 1,
      selecionado: false,
      titulo: 'Título do ID 1',
      detalhe1: '<span>Campo: conteúdo do ID 1 - 1</span>',
      detalhe2: '<span>Campo: conteúdo do ID 1 - 2</span>',
      detalhe3: '<span>Campo: conteúdo do ID 1 - 3</span>',
      horaTitulo: '10:11:01',
      hora: '10:11',
      position: { lat: -23.5001, lng: -46.4001 },
      icon: { url: '../assets/car_pin.png', scaledSize: { height: tamanhoImagem, width: tamanhoImagem } }
    });

    this.listaDados1.push({
      id: 2,
      selecionado: false,
      position: { lat: -23.6001, lng: -46.9001 },
      icon: { url: '../assets/car_pin.png', scaledSize: { height: tamanhoImagem, width: tamanhoImagem } },
      info: `<div class="row m-0">
               <div class="col-12 p-0 text-left mapa-detalhe">
                 <div class="titulo-detalhe"><b>ID 2</b><br></div>
                 <div class="mt-2"><b>Campo: </b>conteúdo do ID 2 - 1</span><br></div>
                 <div><b>Campo: </b>conteúdo do ID 2 - 2</span><br></div>
                 <div><b>Campo: </b>conteúdo do ID 2 - 3</span></div>
               </div>
             </div>`,
      horaTitulo: '10:21:02',
      hora: '10:21'
    });

    this.detalhe.push({
      id: 2,
      selecionado: false,
      titulo: 'Título do ID 2',
      detalhe1: '<span>Campo: conteúdo do ID 2 - 1</span>',
      detalhe2: '<span>Campo: conteúdo do ID 2 - 2</span>',
      detalhe3: '<span>Campo: conteúdo do ID 2 - 3</span>',
      horaTitulo: '10:21:02',
      hora: '10:21',
      position: { lat: -23.6001, lng: -46.9001 },
      icon: { url: '../assets/car_pin.png', scaledSize: { height: tamanhoImagem, width: tamanhoImagem } }
    });
  }

  private carregarListaDados2(): void {
    const tamanhoImagem = this.tamanhoPin;

    this.listaDados2.push({
      id: 3,
      selecionado: false,
      position: { lat: -23.5505, lng: -46.6333 },
      icon: { url: '../assets/car_pin.png', scaledSize: { height: tamanhoImagem, width: tamanhoImagem }, labelOrigin: { x: 0, y: 0 }, origin: { x: 0, y: 0 }, anchor: { x: 5, y: 10 } },
      info: `<div class="row m-0">
               <div class="col-12 p-0 text-left mapa-detalhe">
                 <div class="titulo-detalhe"><b>ID 3</b><br></div>
                 <div class="mt-2"><b>Campo: </b>conteúdo do ID 3 - 1</span><br></div>
                 <div><b>Campo: </b>conteúdo do ID 3 - 2</span><br></div>
                 <div><b>Campo: </b>conteúdo do ID 3 - 3</span></div>
               </div>
             </div>`,
      horaTitulo: '11:31:03',
      hora: '11:31',
    });

    this.detalhe.push({
      id: 3,
      selecionado: false,
      titulo: 'Título do ID 3',
      detalhe1: '<span>Campo: conteúdo do ID 3 - 1</span>',
      detalhe2: '<span>Campo: conteúdo do ID 3 - 2</span>',
      detalhe3: '<span>Campo: conteúdo do ID 3 - 3</span>',
      horaTitulo: '11:31:03',
      hora: '11:31',
      position: { lat: -23.5505, lng: -46.6333 },
      icon: { url: '../assets/car_pin.png', scaledSize: { height: tamanhoImagem, width: tamanhoImagem } }
    });

    this.listaDados2.push({
      id: 4,
      selecionado: false,
      position: { lat: -23.4246, lng: -46.8573 },
      icon: { url: '', scaledSize: { height: tamanhoImagem, width: tamanhoImagem }, labelOrigin: { x: 0, y: 0 }, origin: { x: 0, y: 0 }, anchor: { x: 5, y: 10 } },
      info: `<div class="row m-0">
               <div class="col-12 p-0 text-left mapa-detalhe">
                 <div class="titulo-detalhe"><b>ID 4</b><br></div>
                 <div class="mt-2"><b>Campo: </b>conteúdo do ID 4 - 1</span><br></div>
                 <div><b>Campo: </b>conteúdo do ID 4 - 2</span><br></div>
                 <div><b>Campo: </b>conteúdo do ID 4 - 3</span></div>
               </div>
             </div>`,
      horaTitulo: '11:41:04',
      hora: '11:41'
    });

    this.detalhe.push({
      id: 4,
      selecionado: false,
      titulo: 'Título do ID 4',
      detalhe1: '<span>Campo: conteúdo do ID 4 - 1</span>',
      detalhe2: '<span>Campo: conteúdo do ID 4 - 2</span>',
      detalhe3: '<span>Campo: conteúdo do ID 4 - 3</span>',
      horaTitulo: '11:41:04',
      hora: '11:41',
      position: { lat: -23.4246, lng: -46.8573 },
      icon: { url: '../assets/car_pin.png', scaledSize: { height: tamanhoImagem, width: tamanhoImagem } }
    });

    this.listaDados2.push({
      id: 5,
      selecionado: false,
      position: { lat: -23.6437, lng: -46.2343 },
      icon: { url: '', scaledSize: { height: tamanhoImagem, width: tamanhoImagem }, labelOrigin: { x: 0, y: 0 }, origin: { x: 0, y: 0 }, anchor: { x: 5, y: 10 } },
      info: `<div class="row m-0">
               <div class="col-12 p-0 text-left mapa-detalhe">
                 <div class="titulo-detalhe"><b>ID 5</b><br></div>
                 <div class="mt-2"><b>Campo: </b>conteúdo do ID 5 - 1</span><br></div>
                 <div><b>Campo: </b>conteúdo do ID 5 - 2</span><br></div>
                 <div><b>Campo: </b>conteúdo do ID 5 - 3</span></div>
               </div>
             </div>`,
      horaTitulo: '11:51:05',
      hora: '11:51'
    });

    this.detalhe.push({
      id: 5,
      selecionado: false,
      titulo: 'Título do ID 5',
      detalhe1: '<span>Campo: conteúdo do ID 5 - 1</span>',
      detalhe2: '<span>Campo: conteúdo do ID 5 - 2</span>',
      detalhe3: '<span>Campo: conteúdo do ID 5 - 3</span>',
      horaTitulo: '11:51:05',
      hora: '11:51',
      position: { lat: -23.6437, lng: -46.2343 },
      icon: { url: '../assets/car_pin.png', scaledSize: { height: tamanhoImagem, width: tamanhoImagem } }
    });

    this.listaDados2.push({
      id: 6,
      selecionado: false,
      position: { lat: -23.7343, lng: -46.5342 },
      icon: { url: '../assets/car_pin.png', scaledSize: { height: tamanhoImagem, width: tamanhoImagem }, labelOrigin: { x: 0, y: 0 }, origin: { x: 0, y: 0 }, anchor: { x: 5, y: 10 } },
      info: `<div class="row m-0">
               <div class="col-12 p-0 text-left mapa-detalhe">
                 <div class="titulo-detalhe"><b>ID 6</b><br></div>
                 <div class="mt-2"><b>Campo: </b>conteúdo do ID 6 - 1</span><br></div>
                 <div><b>Campo: </b>conteúdo do ID 6 - 2</span><br></div>
                 <div><b>Campo: </b>conteúdo do ID 6 - 3</span></div>
               </div>
             </div>`,
      horaTitulo: '12:01:06',
      hora: '12:01'
    });

    this.detalhe.push({
      id: 6,
      selecionado: false,
      titulo: 'Título do ID 6',
      detalhe1: '<span>Campo: conteúdo do ID 6 - 1</span>',
      detalhe2: '<span>Campo: conteúdo do ID 6 - 2</span>',
      detalhe3: '<span>Campo: conteúdo do ID 6 - 3</span>',
      horaTitulo: '12:01:06',
      hora: '12:01',
      position: { lat: -23.7343, lng: -46.5342 },
      icon: { url: '../assets/car_pin.png', scaledSize: { height: tamanhoImagem, width: tamanhoImagem } }
    });
  }

  private carregarMapa(): void {
    const detalheTemp: any[] = [];

    let listClusterTemp: any[] = [];

    this.listaClusterDados1 = [];
    this.listaClusterDados2 = [];

    if (this.dados1) {
      this.listaDados1.forEach((element) => { listClusterTemp.push(element); });

      const sortedArrayListaDados1: any[] = listClusterTemp.sort((obj1, obj2) => {
        if (obj1.hora < obj2.hora) { return 1; }
        if (obj1.hora > obj2.hora) { return -1; }
  
        return 0;
      });
  
      this.listaClusterDados1 = sortedArrayListaDados1;

      listClusterTemp = [];
    }

    if (this.dados2) {
      this.listaDados2.forEach((element) => { listClusterTemp.push(element); });

      const sortedArrayListaDados2: any[] = listClusterTemp.sort((obj1, obj2) => {
        if (obj1.hora < obj2.hora) { return 1; }
        if (obj1.hora > obj2.hora) { return -1; }
  
        return 0;
      });
  
      this.listaClusterDados2 = sortedArrayListaDados2;

      listClusterTemp = [];
    }

    this.detalhe.forEach(function(element) { detalheTemp.push(element); });

    const sortedArrayDetalhe: any[] = detalheTemp.sort((obj1, obj2) => {
      if (obj1.titulo > obj2.titulo) { return 1; }
      if (obj1.titulo < obj2.titulo) { return -1; }

      return 0;
    });

    this.detalhe = sortedArrayDetalhe;

    this.adicionarLinhasConexao();
  }

  private limparDados(): void {
    this.idSelecionado = -1;

    this.detalhe = [];
    this.listaDados1 = [];
    this.listaDados2 = [];
  }
}
