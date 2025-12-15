import { Component } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-live-ama',
  imports: [CommonModule, FormsModule],
  templateUrl: './live-ama.component.html',
  styleUrl: './live-ama.component.css'
})
export class LiveAmaComponent {

  data: any;
  p: any = 1;
  isLoading: boolean = false;
  searchText: string = '';
  filteredData: any[] = [];

  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.getDetails();
  }

  getDetails() {
    this.isLoading = true;
    this.commonService.get('admin/get-all-property-category').subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        this.data = resp.data.reverse();
        this.filterTable();
      },
      error: (error) => {
        this.isLoading = false;
        console.log(error || 'Something went wrong!');
      }
    });
  }

  filterTable() {
    this.p = 1;
    let filtered = this.data;
    if (this.searchText.trim()) {
      const keyword = this.searchText.trim().toLowerCase();
      filtered = filtered.filter((item: any) =>
        (item.title?.toLowerCase().includes(keyword))
      );
    }
    this.filteredData = filtered;
  }


}
