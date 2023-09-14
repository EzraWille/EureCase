import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss'],
})
export class AddDocumentComponent implements OnInit {
  fileGroup!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddDocumentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private http: HttpClient
  ) {}
  onNoClick() {
    this.dialogRef.close();
  }
  onUpload() {}

  ngOnInit() {
    this.fileGroup = this.fb.group({
      file: [''],
      expiryDate: [''],
      fileUploaded: [false],
      uploadedFileName: [''],
    });
  }

  handleFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileGroup.get('fileUploaded')?.setValue(true);
      this.fileGroup.get('uploadedFileName')?.setValue('Certificate-1');

      // Perform any additional logic you want to do with the uploaded file.
    } else {
      this.fileGroup.get('fileUploaded')?.setValue(false);
      this.fileGroup.get('uploadedFileName')?.setValue('');
    }
  }

  submit() {
    console.log('fileGroup', this.fileGroup.value);
    this.dialogRef.close();
    const formData = new FormData();
    const fileInput = this.fileGroup.get('file');
    const expiryDateInput = this.fileGroup.get('expiryDate');

    formData.append('file', fileInput?.value);
    formData.append('ExpireDate', expiryDateInput?.value);

    this.http
      .post<any>('your-server-endpoint', formData, {
        reportProgress: true,
        observe: 'events',
      })
      .subscribe(
        (response) => {
          console.log('Response:', response);
          this.dialogRef.close();
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }
}
