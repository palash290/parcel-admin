import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { CommonService } from '../../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-add-ranch',
  imports: [CommonModule],
  templateUrl: './add-ranch.component.html',
  styleUrl: './add-ranch.component.css'
})
export class AddRanchComponent {


  demoFile: any = 'assets/img/file_img.png';
  albumName: string | null = null;
  imagePreviews: string[] = [];
  selectedAlbumFiles: any;
  selectedFilePreview: string | null = null;
  pdfPreviews: { name: string; url: SafeResourceUrl }[] = [];
  selectedPdfFiles: File[] = [];
  albumNamePdf: string = '';

  constructor(private commonService: CommonService, private sanitizer: DomSanitizer, private toastr: NzMessageService) { }

  submitPdfAlbum(): void {

    if (this.selectedPdfFiles.length === 0) {
      this.toastr.warning('Please add at least one PDF.');
      return;
    }

    // Check if there are files selected
    if (this.selectedAlbumFiles.length === 0) {
      this.toastr.warning('Please select at least one file to upload.');
      return;
    }

    const formURlData = new FormData();

    this.selectedPdfFiles.forEach((file, index) => {
      formURlData.append(`file_${index}`, file);
    });

    this.selectedAlbumFiles.forEach((file: string | Blob, index: any) => {
      formURlData.append(`pdf_file_${index}`, file);
    });


    this.commonService.post('dfs/fsfs', formURlData).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.toastr.success('Album created successfully!');
          // this.resetForm();
        } else {
          this.toastr.warning(resp.message);
        }
      },
      error: error => {
        const errorMessage = error.error?.message || 'Something went wrong!';
        this.toastr.error(errorMessage);
      }
    });


  }

  ////// Add IMG ///////
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      const files = Array.from(fileInput.files);
      // Check if the total number of files exceeds the limit
      if (files.length > 20) {
        //this.toastr.warning('You can only select up to 20 files.');
        fileInput.value = ''; // Reset the file input to prevent further processing
        return;
      }

      this.selectedAlbumFiles = files;

      this.imagePreviews = [];

      // Process files
      files.forEach(file => {
        const reader = new FileReader();

        if (file.type.startsWith('image/')) {
          reader.onload = () => {
            this.imagePreviews.push(reader.result as string);
          };
          reader.readAsDataURL(file);
        } else if (file.type.startsWith('video/')) {
          this.imagePreviews.push(URL.createObjectURL(file));
        }
      });
    }
  }

  deletePreview(preview: string): void {
    // Remove the preview from the imagePreviews array
    this.imagePreviews = this.imagePreviews.filter(item => item !== preview);

    // Optional: You can also remove the corresponding file from selectedAlbumFiles if needed
    this.selectedAlbumFiles = this.selectedAlbumFiles.filter((file: Blob, index: any) => {
      const reader = new FileReader();
      let filePreview = '';
      reader.onloadend = () => {
        filePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
      return filePreview !== preview;
    });
    // If all files are removed, reset the previews
    if (this.imagePreviews.length === 0) {
      this.resetPreviews();
    }
  }

  resetPreviews(): void {
    this.imagePreviews = [];
    this.selectedAlbumFiles = [];
  }
  ////// Add IMG ///////



  ////// Add PDF //////

  onPdfSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      const files = Array.from(fileInput.files); // Convert FileList to an array
      const newFiles = files.filter(file => file.type === 'application/pdf');

      if (this.pdfPreviews.length + newFiles.length > 5) {
        // this.toastr.warning('You can only upload up to 5 PDFs.');
        return;
      }

      newFiles.forEach(file => {
        const url = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
        this.selectedPdfFiles.push(file);
        this.pdfPreviews.push({ name: file.name, url });
      });
    }
  }

  deletePdfPreview(pdfName: string): void {
    const index = this.pdfPreviews.findIndex(preview => preview.name === pdfName);
    if (index > -1) {
      this.pdfPreviews.splice(index, 1);
      this.selectedPdfFiles.splice(index, 1);
    }
  }
  ////// Add PDF ///////

}
