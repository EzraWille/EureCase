import { Component, OnInit } from '@angular/core';
import { AddDocumentComponent } from './add-document/add-document.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-profile-documents',
  templateUrl: './user-profile-documents.component.html',
  styleUrls: ['./user-profile-documents.component.scss'],
})
export class UserProfileDocumentsComponent implements OnInit {
  certificates: any[] = [];
  displayedCertificates: any[] = [];
  showAllCertificates = false;
  awards: any[] = [];
  displayedAwards: any[] = [];
  showAllAwards = false;
  accreditations: any[] = [];
  displayedAccreditation: any[] = [];
  showAllAccreditation = false;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.certificates = ['1', '2', '3', '4', '5', '6', '7', '8'];
    this.displayedCertificates = this.certificates.slice(0, 4);
    this.awards = ['1', '2', '3', '4', '5', '6', '7', '8'];
    this.displayedAwards = this.certificates.slice(0, 4);
    this.accreditations = ['1', '2', '3', '4', '5', '6', '7', '8'];
    this.displayedAccreditation = this.certificates.slice(0, 4);
  }

  showAll() {
    this.displayedCertificates = this.certificates;
    this.showAllCertificates = true;
  }
  hideCertificates() {
    this.displayedCertificates = this.certificates.slice(0, 4);
    this.showAllCertificates = false;
  }
  showAllAwardsFiles() {
    this.displayedAwards = this.awards;
    this.showAllAwards = true;
  }
  hideAwards() {
    this.displayedAwards = this.awards.slice(0, 4);
    this.showAllAwards = false;
  }
  showAllAccreditationFiles() {
    this.displayedAccreditation = this.accreditations;
    this.showAllAccreditation = true;
  }
  hideAccreditationFiles() {
    this.displayedAccreditation = this.accreditations.slice(0, 4);
    this.showAllAccreditation = false;
  }

  addCertificate(): void {
    const dialogRef = this.dialog.open(AddDocumentComponent, {
      data: 'certificate',
      width: '500px',
    });
  }
}
