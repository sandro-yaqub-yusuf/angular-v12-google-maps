import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelpService } from '../../../services/help.service';

@Component({
  selector: 'app-help-modal',
  templateUrl: 'help-modal.component.html',
  styleUrls: ['help-modal.component.css']
})

export class HelpModalComponent implements OnInit {
  helpContent: string = '';

  constructor(
    private modalService: NgbModal, 
    private helpService: HelpService
  ) {}

  ngOnInit(): void {
    this.loadHelpContent();
  }

  loadHelpContent(): void {
    this.helpService.getHelpContent().subscribe(
      (data) => this.helpContent = data,
      (error) => console.error('Erro ao carregar o arquivo de ajuda', error)
    );
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }
}
