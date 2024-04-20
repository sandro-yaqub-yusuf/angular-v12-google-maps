import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild(GoogleMap, { static: false }) mapa: (GoogleMap | undefined);
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: (MapInfoWindow | undefined);

  public error = false;
  public idSelecionado = -1;
  public infoContent = '';
  public lat = 0;
  public lng = 0;
  public loading = false;
  public noItens = true;
  public zoom = 10;

  public center: google.maps.LatLngLiteral = { lat: this.lat, lng: this.lng };
  public options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true
  };
  public markers: { [id: number]: MapMarker } = {};

  public detalhe: any[] = [];
  public listaDados1: any[] = [];
  public listaDados2: any[] = [];

  constructor() { }

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

  ngAfterViewInit(): void {
    console.log('oi');
    this.adicionarLinhasConexao();    
  }

  public centerChange(item: any): void {
    if (item.position.lat && item.position.lng) {
      this.lat = item.position.lat;
      this.lng = item.position.lng;
    }
  }

  public hoverListItem(item: any): void {
    item.selecionado = !item.selecionado;

    const marker = this.markers[item.id];
    
    if (marker) {
      if (item.selecionado) { this.markerMouseOver(marker); } 
      else { this.markerMouseOut(marker); }
    }    
  }

  public markerMouseOver(marker: MapMarker): void {
    marker.marker?.setAnimation(google.maps.Animation.BOUNCE);
  }

  public markerMouseOut(marker: MapMarker): void {
    marker.marker?.setAnimation(null);
  }

  public openInfo(marker: MapMarker, content: string) {
    this.infoContent = content;

    if (this.infoWindow) { this.infoWindow.open(marker); }
  }

  public onMarkerInit(marker: MapMarker, item: any): any {
    if (!this.markers[item.id]) { this.markers[item.id] = marker; }
    
    return item;
  }

  public selecionarItem(id: number): void {
    if (this.idSelecionado !== id) {
      this.idSelecionado = id;

      this.carregarMapa();
    }
  }

  private adicionarLinhasConexao(): void {
    for (let i = 0; i < this.listaDados2.length - 1; i++) {
      const pontoA = this.listaDados2[i].position;
      const pontoB = this.listaDados2[i + 1].position;

      new google.maps.Polyline({
        map: this.mapa?.googleMap,
        path: [pontoA, pontoB],
        strokeColor: '#0000FF',
        strokeOpacity: 0.7,
        strokeWeight: 3,
        geodesic: true
      });
    }
  }

  private carregarListaDados1(): void {
    this.loading = true;
    this.idSelecionado = -1;

    this.listaDados1.push({
      id: 1,
      selecionado: false,
      position: { lat: -23.5001, lng: -46.4001 },
      icon: { url: '../assets/car_pin.png', scaledSize: { 'height': 40, 'width': 40 } },
      info: `<div class="row m-0">
               <div class="col-12 p-0 text-left detalhe-mapa">
                 <div class="text-center"><b>ID 1</b><br></div>
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
      icon: { url: '../assets/car_pin.png', scaledSize: { 'height': 40, 'width': 40 } }
    });

    this.listaDados1.push({
      id: 2,
      selecionado: false,
      position: { lat: -23.6001, lng: -46.9001 },
      icon: { url: '../assets/car_pin.png', scaledSize: { 'height': 40, 'width': 40 } },
      info: `<div class="row m-0">
               <div class="col-12 p-0 text-left detalhe-mapa">
                 <div class="text-center"><b>ID 2</b><br></div>
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
      icon: { url: '../assets/car_pin.png', scaledSize: { 'height': 40, 'width': 40 } }
    });

    this.loading = false;
  }

  private carregarListaDados2(): void {
    this.loading = true;
    this.idSelecionado = -1;

    this.listaDados2.push({
      id: 3,
      selecionado: false,
      position: { lat: -23.5505, lng: -46.6333 },
      icon: {
        url: '../assets/cluster_circle.png',
        scaledSize: { 'height': 59, 'width': 59 },
        labelOrigin: { 'x': 30, 'y': 30 },
        origin: { 'x': 0, 'y': 0 },
        anchor: { 'x': 11, 'y': 40 }
      },
      label: { color: 'black', fontFamily: 'Arial', fontSize: '12px', fontWeight: 'bold', text: '1' },
      info: `<div class="row m-0">
               <div class="col-12 p-0 text-left detalhe-mapa">
                 <div class="text-center"><b>ID 3</b><br></div>
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
      icon: { url: '../assets/car_pin.png', scaledSize: { 'height': 40, 'width': 40 } }
    });

    this.listaDados2.push({
      id: 4,
      selecionado: false,
      position: { lat: -23.4246, lng: -46.8573 },
      icon: {
        url: '../assets/cluster_circle.png',
        scaledSize: { 'height': 59, 'width': 59 },
        labelOrigin: { 'x': 30, 'y': 30 },
        origin: { 'x': 0, 'y': 0 },
        anchor: { 'x': 11, 'y': 40 }
      },
      label: { color: 'black', fontFamily: 'Arial', fontSize: '12px', fontWeight: 'bold', text: '2' },
      info: `<div class="row m-0">
               <div class="col-12 p-0 text-left detalhe-mapa">
                 <div class="text-center"><b>ID 4</b><br></div>
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
      icon: { url: '../assets/car_pin.png', scaledSize: { 'height': 40, 'width': 40 } }
    });

    this.listaDados2.push({
      id: 5,
      selecionado: false,
      position: { lat: -23.6437, lng: -46.2343 },
      icon: {
        url: '../assets/cluster_circle.png',
        scaledSize: { 'height': 59, 'width': 59 },
        labelOrigin: { 'x': 30, 'y': 30 },
        origin: { 'x': 0, 'y': 0 },
        anchor: { 'x': 11, 'y': 40 }
      },
      label: { color: 'black', fontFamily: 'Arial', fontSize: '12px', fontWeight: 'bold', text: '3' },
      info: `<div class="row m-0">
               <div class="col-12 p-0 text-left detalhe-mapa">
                 <div class="text-center"><b>ID 5</b><br></div>
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
      icon: { url: '../assets/car_pin.png', scaledSize: { 'height': 40, 'width': 40 } }
    });

    this.listaDados2.push({
      id: 6,
      selecionado: false,
      position: { lat: -23.7343, lng: -46.5342 },
      icon: {
        url: '../assets/cluster_circle.png',
        scaledSize: { 'height': 59, 'width': 59 },
        labelOrigin: { 'x': 30, 'y': 30 },
        origin: { 'x': 0, 'y': 0 },
        anchor: { 'x': 11, 'y': 40 }
      },
      label: { color: 'black', fontFamily: 'Arial', fontSize: '12px', fontWeight: 'bold', text: '4' },
      info: `<div class="row m-0">
               <div class="col-12 p-0 text-left detalhe-mapa">
                 <div class="text-center"><b>ID 6</b><br></div>
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
      icon: { url: '../assets/car_pin.png', scaledSize: { 'height': 40, 'width': 40 } }
    });

    this.loading = false;
  }

  private carregarMapa(): void {
    this.loading = true;

    // Ordena a Array
    const sortedArrayDetalhe: any[] = this.detalhe.sort((obj1, obj2) => {
      if (obj1.hora > obj2.hora) { return 1; }
      if (obj1.hora < obj2.hora) { return -1; }

      return 0;
    });

    this.detalhe = sortedArrayDetalhe;

    if (this.listaDados1.length > 0 || this.listaDados2.length > 0) { this.noItens = false; }
    else { this.noItens = true; }

    this.loading = false;
  }

  private limparDados(): void {
    this.loading = false;
    this.idSelecionado = -1;
    this.detalhe = [];
    this.listaDados1 = [];
    this.listaDados2 = [];
  }
}
